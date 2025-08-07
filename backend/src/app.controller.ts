import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): string {
    return 'OK';
  }

  @Get('db-status')
  async getDatabaseStatus() {
    try {
      // Verificar conexión
      const isConnected = this.dataSource.isInitialized;
      
      if (!isConnected) {
        return {
          status: 'error',
          message: 'Database not connected',
          isConnected: false
        };
      }

      // Verificar tablas
      const tables = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);

      // Verificar migraciones
      const migrations = await this.dataSource.query(`
        SELECT * FROM migrations 
        ORDER BY timestamp;
      `);

      return {
        status: 'success',
        isConnected: true,
        database: process.env.DB_DATABASE,
        tables: tables.map(t => t.table_name),
        migrations: migrations.map(m => ({
          name: m.name,
          timestamp: m.timestamp
        })),
        tableCount: tables.length,
        migrationCount: migrations.length
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        isConnected: false
      };
    }
  }
}
