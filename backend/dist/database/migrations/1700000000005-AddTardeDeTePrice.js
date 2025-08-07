"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTardeDeTePrice1700000000005 = void 0;
class AddTardeDeTePrice1700000000005 {
    name = 'AddTardeDeTePrice1700000000005';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "precios_config" ADD "tardeDeTe" decimal(10,2) NOT NULL DEFAULT 0`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "precios_config" DROP COLUMN "tardeDeTe"`);
    }
}
exports.AddTardeDeTePrice1700000000005 = AddTardeDeTePrice1700000000005;
//# sourceMappingURL=1700000000005-AddTardeDeTePrice.js.map