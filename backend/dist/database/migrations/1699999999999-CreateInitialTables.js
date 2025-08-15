"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialTables1699999999999 = void 0;
class CreateInitialTables1699999999999 {
    name = 'CreateInitialTables1699999999999';
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "fechas_config" (
                "id" SERIAL NOT NULL,
                "fecha" timestamp without time zone NOT NULL,
                "activa" boolean NOT NULL DEFAULT true,
                "observaciones" character varying,
                "turnos" jsonb,
                "fechaCreacion" TIMESTAMP NOT NULL DEFAULT now(),
                "fechaActualizacion" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_fechas_config" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "administradores" (
                "id" SERIAL NOT NULL,
                "usuario" character varying NOT NULL,
                "contrasena" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_administradores" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_administradores_usuario" UNIQUE ("usuario")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "reservas" (
                "id" SERIAL NOT NULL,
                "nombre" character varying NOT NULL,
                "email" character varying NOT NULL,
                "telefono" character varying NOT NULL,
                "fecha" date NOT NULL,
                "horario" character varying NOT NULL,
                "cantidadPersonas" integer NOT NULL,
                "tipoReserva" character varying NOT NULL,
                "estado" character varying NOT NULL DEFAULT 'pendiente',
                "observaciones" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reservas" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "precios_config" (
                "id" SERIAL NOT NULL,
                "clave" character varying NOT NULL,
                "promoOlivia" integer,
                "promoBasica" integer,
                "meriendaLibre" integer,
                "descripcionPromoOlivia" text,
                "descripcionPromoBasica" text,
                "cuposMeriendasLibres" integer,
                "cuposTardesDeTe" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_precios_config" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_precios_config_clave" UNIQUE ("clave")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "site_config" (
                "id" SERIAL NOT NULL,
                "clave" character varying NOT NULL,
                "telefono" character varying,
                "direccion" text,
                "email" character varying,
                "horarios" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_site_config" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_site_config_clave" UNIQUE ("clave")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "pagos" (
                "id" SERIAL NOT NULL,
                "mercadopagoId" character varying,
                "estado" character varying NOT NULL,
                "monto" integer NOT NULL,
                "reservaId" integer,
                "giftCardId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_pagos" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "gift_cards" (
                "id" SERIAL NOT NULL,
                "codigo" character varying NOT NULL,
                "monto" integer NOT NULL,
                "emailDestinatario" character varying,
                "mensaje" text,
                "estado" character varying NOT NULL DEFAULT 'pendiente',
                "fechaEnvio" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_gift_cards" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_gift_cards_codigo" UNIQUE ("codigo")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "contenido_config" (
                "id" SERIAL NOT NULL,
                "seccion" character varying NOT NULL,
                "tipo" character varying NOT NULL,
                "titulo" character varying,
                "descripcion" text,
                "contenido" text,
                "activo" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_contenido_config" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "menu_pdf" (
                "id" SERIAL NOT NULL,
                "clave" character varying NOT NULL,
                "nombreArchivo" character varying NOT NULL,
                "rutaArchivo" character varying NOT NULL,
                "tamanoArchivo" integer,
                "descripcion" text,
                "activo" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_menu_pdf" PRIMARY KEY ("id")
            )
        `);
        console.log('✅ All initial tables created successfully');
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "menu_pdf"`);
        await queryRunner.query(`DROP TABLE "contenido_config"`);
        await queryRunner.query(`DROP TABLE "gift_cards"`);
        await queryRunner.query(`DROP TABLE "pagos"`);
        await queryRunner.query(`DROP TABLE "site_config"`);
        await queryRunner.query(`DROP TABLE "precios_config"`);
        await queryRunner.query(`DROP TABLE "reservas"`);
        await queryRunner.query(`DROP TABLE "administradores"`);
        await queryRunner.query(`DROP TABLE "fechas_config"`);
    }
}
exports.CreateInitialTables1699999999999 = CreateInitialTables1699999999999;
//# sourceMappingURL=1699999999999-CreateInitialTables.js.map