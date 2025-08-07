import { DataSource } from 'typeorm';
import { GiftCard } from '../../giftcard/giftcard.entity';

export async function seedGiftCard(dataSource: DataSource) {
  console.log('🎁 Iniciando seed de GiftCard...');

  try {
    // Verificar si la tabla gift_card existe
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    
    // Verificar si la tabla existe
    const tableExists = await queryRunner.hasTable('gift_card');
    
    if (!tableExists) {
      console.log('📋 Creando tabla gift_card...');
      // Crear la tabla usando la entidad
      await queryRunner.createTable(
        await dataSource.getMetadata(GiftCard).table,
        true
      );
      console.log('✅ Tabla gift_card creada');
    } else {
      console.log('✅ Tabla gift_card ya existe');
      
      // Verificar si las columnas necesarias existen
      const columns = await queryRunner.getColumns('gift_card');
      const columnNames = columns.map(col => col.name);
      
      console.log('📋 Columnas existentes en gift_card:', columnNames);
      
      // Verificar si faltan columnas
      const requiredColumns = [
        'nombreDestinatario',
        'telefonoDestinatario'
      ];
      
      const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
      
      if (missingColumns.length > 0) {
        console.log('⚠️ Faltan columnas:', missingColumns);
        console.log('🔧 Agregando columnas faltantes...');
        
        for (const columnName of missingColumns) {
          if (columnName === 'nombreDestinatario') {
            await queryRunner.query(`ALTER TABLE gift_card ADD COLUMN "nombreDestinatario" character varying NOT NULL DEFAULT ''`);
          } else if (columnName === 'telefonoDestinatario') {
            await queryRunner.query(`ALTER TABLE gift_card ADD COLUMN "telefonoDestinatario" character varying NOT NULL DEFAULT ''`);
          }
        }
        console.log('✅ Columnas agregadas');
      } else {
        console.log('✅ Todas las columnas necesarias existen');
      }
    }
    
    await queryRunner.release();
    console.log('🎉 Seed de GiftCard completado');
  } catch (error) {
    console.error('❌ Error en seed de GiftCard:', error);
    throw error;
  }
}
