"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureWhatsAppColumn = ensureWhatsAppColumn;
async function ensureWhatsAppColumn(dataSource) {
    const queryRunner = dataSource.createQueryRunner();
    try {
        await queryRunner.connect();
        const result = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reserva' 
      AND column_name = 'recordatorio48hEnviado'
    `);
        if (result.length === 0) {
            console.log('🔧 Creando columna recordatorio48hEnviado...');
            await queryRunner.query(`
        ALTER TABLE "reserva" 
        ADD COLUMN "recordatorio48hEnviado" boolean DEFAULT false
      `);
            console.log('✅ Columna recordatorio48hEnviado creada exitosamente');
        }
        else {
            console.log('✅ Columna recordatorio48hEnviado ya existe');
        }
    }
    catch (error) {
        console.error('❌ Error verificando/creando columna WhatsApp:', error);
    }
    finally {
        await queryRunner.release();
    }
}
//# sourceMappingURL=ensure-whatsapp-column.js.map