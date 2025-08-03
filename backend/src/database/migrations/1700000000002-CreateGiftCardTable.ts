import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGiftCardTable1700000000002 implements MigrationInterface {
    name = 'CreateGiftCardTable1700000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."estado_gift_card_enum" AS ENUM('PAGADA', 'ENVIADA', 'CANCELADA')
        `);
        
        await queryRunner.query(`
            CREATE TABLE "gift_card" (
                "id" SERIAL NOT NULL,
                "nombreComprador" character varying NOT NULL,
                "telefonoComprador" character varying NOT NULL,
                "emailComprador" character varying NOT NULL,
                "nombreDestinatario" character varying NOT NULL,
                "telefonoDestinatario" character varying NOT NULL,
                "monto" decimal(10,2) NOT NULL,
                "mensaje" text,
                "estado" "public"."estado_gift_card_enum" NOT NULL DEFAULT 'PAGADA',
                "idPagoExterno" character varying,
                "metodoPago" character varying,
                "fechaCreacion" TIMESTAMP NOT NULL DEFAULT now(),
                "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_gift_card" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "gift_card"`);
        await queryRunner.query(`DROP TYPE "public"."estado_gift_card_enum"`);
    }
} 