"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddWhatsAppFields1700000000006 = void 0;
class AddWhatsAppFields1700000000006 {
    name = 'AddWhatsAppFields1700000000006';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "reserva" 
      ADD COLUMN "recordatorio48hEnviado" boolean NOT NULL DEFAULT false
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "reserva" 
      DROP COLUMN "recordatorio48hEnviado"
    `);
    }
}
exports.AddWhatsAppFields1700000000006 = AddWhatsAppFields1700000000006;
//# sourceMappingURL=1700000000006-AddWhatsAppFields.js.map