import { DataSource } from 'typeorm';

export async function ensureWhatsAppColumn(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    
    // Verificar si la columna existe
    const result = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reserva' 
      AND column_name = 'recordatorio48hEnviado'
    `);
    
    if (result.length === 0) {
      console.log('🔧 Creando columna recordatorio48hEnviado...');
      
      // Crear la columna si no existe
      await queryRunner.query(`
        ALTER TABLE "reserva" 
        ADD COLUMN "recordatorio48hEnviado" boolean DEFAULT false
      `);
      
      console.log('✅ Columna recordatorio48hEnviado creada exitosamente');
    } else {
      console.log('✅ Columna recordatorio48hEnviado ya existe');
    }
    
  } catch (error) {
    console.error('❌ Error verificando/creando columna WhatsApp:', error);
  } finally {
    await queryRunner.release();
  }
}
