"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContenidoConfigTable1700000000003 = void 0;
class CreateContenidoConfigTable1700000000003 {
    name = 'CreateContenidoConfigTable1700000000003';
    async up(queryRunner) {
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
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_contenido_config_clave" ON "contenido_config" ("clave")
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_contenido_config_clave"`);
        await queryRunner.query(`DROP TABLE "contenido_config"`);
    }
}
exports.CreateContenidoConfigTable1700000000003 = CreateContenidoConfigTable1700000000003;
//# sourceMappingURL=1700000000003-CreateContenidoConfigTable.js.map