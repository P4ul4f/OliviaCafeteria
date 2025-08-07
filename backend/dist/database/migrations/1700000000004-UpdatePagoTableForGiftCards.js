"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePagoTableForGiftCards1700000000004 = void 0;
class UpdatePagoTableForGiftCards1700000000004 {
    name = 'UpdatePagoTableForGiftCards1700000000004';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "pago" ALTER COLUMN "reservaId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pago" ADD "giftCardId" integer`);
        await queryRunner.query(`ALTER TABLE "pago" ADD CONSTRAINT "FK_pago_giftcard" FOREIGN KEY ("giftCardId") REFERENCES "gift_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "pago" DROP CONSTRAINT "FK_pago_giftcard"`);
        await queryRunner.query(`ALTER TABLE "pago" DROP COLUMN "giftCardId"`);
        await queryRunner.query(`ALTER TABLE "pago" ALTER COLUMN "reservaId" SET NOT NULL`);
    }
}
exports.UpdatePagoTableForGiftCards1700000000004 = UpdatePagoTableForGiftCards1700000000004;
//# sourceMappingURL=1700000000004-UpdatePagoTableForGiftCards.js.map