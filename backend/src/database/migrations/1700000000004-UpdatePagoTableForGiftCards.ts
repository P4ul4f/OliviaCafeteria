import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePagoTableForGiftCards1700000000004 implements MigrationInterface {
    name = 'UpdatePagoTableForGiftCards1700000000004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Hacer reservaId nullable y agregar giftCardId
        await queryRunner.query(`ALTER TABLE "pago" ALTER COLUMN "reservaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pago" ADD "giftCardId" integer`);
        await queryRunner.query(`ALTER TABLE "pago" ADD CONSTRAINT "FK_pago_giftcard" FOREIGN KEY ("giftCardId") REFERENCES "gift_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios
        await queryRunner.query(`ALTER TABLE "pago" DROP CONSTRAINT "FK_pago_giftcard"`);
        await queryRunner.query(`ALTER TABLE "pago" DROP COLUMN "giftCardId"`);
        await queryRunner.query(`ALTER TABLE "pago" ALTER COLUMN "reservaId" SET NOT NULL`);
    }
} 