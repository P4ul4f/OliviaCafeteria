import { MigrationInterface, QueryRunner } from "typeorm";

export class AddALaCartaPrice1700000000001 implements MigrationInterface {
    name = 'AddALaCartaPrice1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "precios_config" ADD "aLaCarta" decimal(10,2) NOT NULL DEFAULT 5000`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "precios_config" DROP COLUMN "aLaCarta"`);
    }
} 