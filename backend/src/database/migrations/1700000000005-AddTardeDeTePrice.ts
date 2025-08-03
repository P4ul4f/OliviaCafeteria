import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTardeDeTePrice1700000000005 implements MigrationInterface {
    name = 'AddTardeDeTePrice1700000000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "precios_config" ADD "tardeDeTe" decimal(10,2) NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "precios_config" DROP COLUMN "tardeDeTe"`);
    }
} 