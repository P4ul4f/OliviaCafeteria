"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddALaCartaPrice1700000000001 = void 0;
class AddALaCartaPrice1700000000001 {
    name = 'AddALaCartaPrice1700000000001';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "precios_config" ADD "aLaCarta" decimal(10,2) NOT NULL DEFAULT 5000`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "precios_config" DROP COLUMN "aLaCarta"`);
    }
}
exports.AddALaCartaPrice1700000000001 = AddALaCartaPrice1700000000001;
//# sourceMappingURL=1700000000001-AddALaCartaPrice.js.map