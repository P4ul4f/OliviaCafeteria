import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWhatsAppFields1700000000006 implements MigrationInterface {
  name = 'AddWhatsAppFields1700000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "reserva" 
      ADD COLUMN "recordatorio48hEnviado" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "reserva" 
      DROP COLUMN "recordatorio48hEnviado"
    `);
  }
}
