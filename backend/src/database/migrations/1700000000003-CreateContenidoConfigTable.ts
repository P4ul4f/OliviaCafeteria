import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContenidoConfigTable1700000000003 implements MigrationInterface {
    name = 'CreateContenidoConfigTable1700000000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "contenido_config" (
                "id" SERIAL NOT NULL,
                "clave" character varying NOT NULL,
                "contenido" jsonb NOT NULL,
                "descripcion" character varying,
                "fechaCreacion" TIMESTAMP NOT NULL DEFAULT now(),
                "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_contenido_config" PRIMARY KEY ("id")
            )
        `);
        
        // Crear índice único en la clave
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_contenido_config_clave" ON "contenido_config" ("clave")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_contenido_config_clave"`);
        await queryRunner.query(`DROP TABLE "contenido_config"`);
    }
} 