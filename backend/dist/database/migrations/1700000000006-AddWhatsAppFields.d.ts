import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddWhatsAppFields1700000000006 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
