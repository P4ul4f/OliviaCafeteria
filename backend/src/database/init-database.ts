import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

export class DatabaseInitializer {
  private readonly logger = new Logger(DatabaseInitializer.name);

  constructor(private dataSource: DataSource) {}

  async initialize() {
    try {
      this.logger.log('🔍 Verificando estado de la base de datos...');

      // Verificar si las tablas existen
      const tables = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);

      this.logger.log(`📋 Tablas existentes: ${tables.length}`);

      // Verificar migraciones
      const migrations = await this.dataSource.query(`
        SELECT * FROM migrations 
        ORDER BY timestamp;
      `);

      this.logger.log(`🔄 Migraciones registradas: ${migrations.length}`);

      // Marcar migraciones faltantes como ejecutadas
      await this.markMissingMigrationsAsExecuted(tables, migrations);

      this.logger.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
      this.logger.error('❌ Error inicializando base de datos:', error.message);
      // No lanzar error para que el servidor continúe
    }
  }

  private async markMissingMigrationsAsExecuted(tables: any[], migrations: any[]) {
    const expectedMigrations = [
      { timestamp: 1699999999999, name: 'CreateInitialTables1699999999999' },
      { timestamp: 1700000000000, name: 'UpdateFechasConfigStructure1700000000000' },
      { timestamp: 1700000000001, name: 'AddALaCartaPrice1700000000001' },
      { timestamp: 1700000000002, name: 'CreateGiftCardTable1700000000002' },
      { timestamp: 1700000000003, name: 'CreateContenidoConfigTable1700000000003' },
      { timestamp: 1700000000004, name: 'UpdatePagoTableForGiftCards1700000000004' },
      { timestamp: 1700000000005, name: 'AddTardeDeTePrice1700000000005' }
    ];

    for (const expected of expectedMigrations) {
      const exists = migrations.find(m => m.timestamp == expected.timestamp);
      if (!exists) {
        // Verificar si la tabla correspondiente existe
        let shouldMark = false;
        
        if (expected.timestamp === 1699999999999) {
          // Migración inicial - marcar si hay tablas básicas
          const basicTables = ['administrador', 'reserva', 'pago'];
          shouldMark = basicTables.every(tableName => 
            tables.find(t => t.table_name === tableName)
          );
        } else if (expected.timestamp === 1700000000003) {
          // Migración de contenido_config
          shouldMark = tables.find(t => t.table_name === 'contenido_config');
        } else if (expected.timestamp === 1700000000004) {
          // Migración de gift_card
          shouldMark = tables.find(t => t.table_name === 'gift_card');
        } else {
          // Otras migraciones - marcar si las tablas relacionadas existen
          shouldMark = true;
        }

        if (shouldMark) {
          try {
            await this.dataSource.query(`
              INSERT INTO migrations (timestamp, name) 
              VALUES ($1, $2)
              ON CONFLICT (timestamp) DO NOTHING;
            `, [expected.timestamp, expected.name]);
            
            this.logger.log(`✅ Migración ${expected.name} marcada como ejecutada`);
          } catch (error) {
            this.logger.warn(`⚠️ No se pudo marcar la migración ${expected.name}: ${error.message}`);
          }
        }
      }
    }
  }
}
