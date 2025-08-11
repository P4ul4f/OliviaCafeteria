"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseInitializer = void 0;
const common_1 = require("@nestjs/common");
class DatabaseInitializer {
    dataSource;
    logger = new common_1.Logger(DatabaseInitializer.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async initialize() {
        try {
            this.logger.log('🔍 Verificando estado de la base de datos...');
            const tables = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
            this.logger.log(`📋 Tablas existentes: ${tables.length}`);
            tables.forEach(table => {
                this.logger.log(`  - ${table.table_name}`);
            });
            this.logger.log('🏗️  Creando estructura inicial de tablas...');
            await this.createInitialTables();
            const newTables = await this.dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
            this.logger.log(`✅ Tablas disponibles: ${newTables.length}`);
            newTables.forEach(table => {
                this.logger.log(`  - ${table.table_name}`);
            });
            let migrations = [];
            try {
                migrations = await this.dataSource.query(`
          SELECT * FROM migrations 
          ORDER BY timestamp;
        `);
                this.logger.log(`🔄 Migraciones registradas: ${migrations.length}`);
            }
            catch (error) {
                this.logger.log('⚠️ Error consultando migraciones:', error.message);
            }
            await this.markMissingMigrationsAsExecuted(newTables, migrations);
            await this.insertInitialData();
            this.logger.log('✅ Base de datos inicializada correctamente');
        }
        catch (error) {
            this.logger.error('❌ Error inicializando base de datos:', error.message);
        }
    }
    async markMissingMigrationsAsExecuted(tables, migrations) {
        const expectedMigrations = [
            { timestamp: 1699999999999, name: 'CreateInitialTables1699999999999' },
            { timestamp: 1700000000000, name: 'UpdateFechasConfigStructure1700000000000' },
            { timestamp: 1700000000001, name: 'AddALaCartaPrice1700000000001' },
            { timestamp: 1700000000002, name: 'CreateGiftCardTable1700000000002' },
            { timestamp: 1700000000003, name: 'CreateContenidoConfigTable1700000000003' },
            { timestamp: 1700000000004, name: 'UpdatePagoTableForGiftCards1700000000004' },
            { timestamp: 1700000000005, name: 'AddTardeDeTePrice1700000000005' }
        ];
        for (const expected of expectedMigrations) {
            const exists = migrations.find(m => m.timestamp == expected.timestamp);
            if (!exists) {
                let shouldMark = false;
                if (expected.timestamp === 1699999999999) {
                    const basicTables = ['administrador', 'reserva', 'pago'];
                    shouldMark = basicTables.every(tableName => tables.find(t => t.table_name === tableName));
                }
                else if (expected.timestamp === 1700000000003) {
                    shouldMark = tables.find(t => t.table_name === 'contenido_config');
                }
                else if (expected.timestamp === 1700000000004) {
                    shouldMark = tables.find(t => t.table_name === 'gift_card');
                }
                else {
                    shouldMark = true;
                }
                if (shouldMark) {
                    try {
                        await this.dataSource.query(`
              INSERT INTO migrations (timestamp, name) 
              VALUES ($1, $2)
              ON CONFLICT (timestamp) DO NOTHING;
            `, [expected.timestamp, expected.name]);
                        this.logger.log(`✅ Migración ${expected.name} marcada como ejecutada`);
                    }
                    catch (error) {
                        this.logger.warn(`⚠️ No se pudo marcar la migración ${expected.name}: ${error.message}`);
                    }
                }
            }
        }
    }
    async createInitialTables() {
        this.logger.log('🏗️  Creando tablas iniciales...');
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_migrations" PRIMARY KEY ("id")
      );
    `);
        try {
            const constraintExists = await this.dataSource.query(`
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'migrations' 
        AND constraint_name = 'UQ_migrations_timestamp'
        AND constraint_type = 'UNIQUE';
      `);
            if (constraintExists.length === 0) {
                this.logger.log('🔧 Agregando restricción UNIQUE a tabla migrations...');
                await this.dataSource.query(`
          ALTER TABLE "migrations" 
          ADD CONSTRAINT "UQ_migrations_timestamp" UNIQUE ("timestamp");
        `);
                this.logger.log('✅ Restricción UNIQUE agregada a tabla migrations');
            }
            else {
                this.logger.log('ℹ️  Restricción UNIQUE ya existe en tabla migrations');
            }
        }
        catch (error) {
            this.logger.warn(`⚠️ Error verificando/agregando restricción UNIQUE: ${error.message}`);
        }
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "administrador" (
        "id" SERIAL NOT NULL,
        "usuario" character varying NOT NULL,
        "contrasena" character varying NOT NULL,
        CONSTRAINT "PK_administrador" PRIMARY KEY ("id")
      );
    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "reserva" (
        "id" SERIAL NOT NULL,
        "fechaHora" timestamp NOT NULL,
        "nombreCliente" character varying NOT NULL,
        "telefono" character varying NOT NULL,
        "montoSenia" numeric NOT NULL,
        "cantidadPersonas" integer NOT NULL,
        "estado" character varying NOT NULL,
        "fechaCreacion" timestamp NOT NULL DEFAULT now(),
        "turno" character varying NOT NULL,
        "tipoReserva" character varying NOT NULL,
        "montoTotal" numeric NOT NULL,
        "estadoPago" character varying NOT NULL,
        "idPagoExterno" character varying,
        "metodoPago" character varying,
        CONSTRAINT "PK_reserva" PRIMARY KEY ("id")
      );
    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "pago" (
        "id" SERIAL NOT NULL,
        "reservaId" integer,
        "monto" numeric NOT NULL,
        "fechaPago" timestamp NOT NULL,
        "metodo" character varying NOT NULL,
        "estado" character varying NOT NULL,
        "idPagoExterno" character varying,
        "datosPago" text,
        "giftCardId" integer,
        CONSTRAINT "PK_pago" PRIMARY KEY ("id")
      );
    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "contenido_config" (
        "id" SERIAL NOT NULL,
        "clave" character varying NOT NULL,
        "contenido" jsonb NOT NULL,
        "descripcion" character varying,
        "fechaCreacion" timestamp NOT NULL DEFAULT now(),
        "fechaActualizacion" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contenido_config" PRIMARY KEY ("id")
      );
    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "fechas_config" (
        "id" SERIAL NOT NULL,
        "fecha" date NOT NULL,
        "tipoReserva" character varying NOT NULL,
        "turnos" jsonb,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fechas_config" PRIMARY KEY ("id")
      );
    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "precios_config" (
        "id" SERIAL NOT NULL,
        "clave" character varying NOT NULL,
        "promoOlivia" integer,
        "promoBasica" integer,
        "meriendaLibre" integer,
        "aLaCarta" numeric(10,2) NOT NULL DEFAULT 5000,
        "tardeDeTe" numeric(10,2) NOT NULL DEFAULT 3000,
        "descripcionPromoOlivia" text,
        "descripcionPromoBasica" text,
        "cuposMeriendasLibres" integer,
        "cuposTardesDeTe" integer,
        "capacidadMaximaCompartida" integer DEFAULT 65,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_precios_config" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_precios_config_clave" UNIQUE ("clave")
      );
    `);
        try {
            const preciosConfigColumns = await this.dataSource.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'precios_config' AND table_schema = 'public'
      `);
            const hasCapacidadMaximaCompartida = preciosConfigColumns.some((col) => col.column_name === 'capacidadMaximaCompartida');
            if (!hasCapacidadMaximaCompartida) {
                this.logger.log('⚠️  Tabla precios_config no tiene capacidadMaximaCompartida, agregando columna...');
                await this.dataSource.query(`ALTER TABLE "precios_config" ADD COLUMN "capacidadMaximaCompartida" integer DEFAULT 65`);
                this.logger.log('✅ Columna capacidadMaximaCompartida agregada a precios_config');
            }
        }
        catch (error) {
            this.logger.error('Error verificando/agregando capacidadMaximaCompartida:', error);
        }
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "site_config" (
        "id" SERIAL NOT NULL,
        "clave" character varying NOT NULL,
        "telefono" character varying,
        "direccion" text,
        "email" character varying,
        "horarios" jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_site_config" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_site_config_clave" UNIQUE ("clave")
      );
    `);
        try {
            const tableExists = await this.dataSource.query(`
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'gift_card';
      `);
            if (tableExists.length > 0) {
                const hasCorrectColumns = await this.dataSource.query(`
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'gift_card' 
          AND column_name IN ('nombreDestinatario', 'telefonoDestinatario')
          HAVING COUNT(*) = 2;
        `);
                if (hasCorrectColumns.length === 0) {
                    this.logger.log('🔄 Tabla gift_card existe pero no tiene las columnas correctas. Recreando...');
                    await this.dataSource.query(`DROP TABLE IF EXISTS "gift_card" CASCADE`);
                }
                else {
                    this.logger.log('ℹ️  Tabla gift_card ya existe con estructura correcta');
                }
            }
        }
        catch (error) {
            this.logger.warn(`⚠️ Error verificando estructura de gift_card: ${error.message}`);
        }
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "gift_card" (
        "id" SERIAL NOT NULL,
        "nombreComprador" character varying NOT NULL,
        "telefonoComprador" character varying NOT NULL,
        "emailComprador" character varying NOT NULL,
        "nombreDestinatario" character varying NOT NULL,
        "telefonoDestinatario" character varying NOT NULL,
        "mensaje" text,
        "monto" numeric NOT NULL,
        "estado" character varying NOT NULL DEFAULT 'PAGADA',
        "idPagoExterno" character varying,
        "metodoPago" character varying,
        "fechaCreacion" timestamp NOT NULL DEFAULT now(),
        "fechaActualizacion" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_gift_card" PRIMARY KEY ("id")
      );
    `);
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "menu_pdf" (
        "id" SERIAL NOT NULL,
        "clave" character varying NOT NULL,
        "nombreArchivo" character varying NOT NULL,
        "rutaArchivo" character varying NOT NULL,
        "tamanoArchivo" integer,
        "descripcion" text,
        "activo" boolean NOT NULL DEFAULT true,
        "contenidoArchivo" bytea,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_menu_pdf" PRIMARY KEY ("id")
      );
    `);
        try {
            const menuPdfColumns = await this.dataSource.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'menu_pdf' AND table_schema = 'public'
      `);
            const hasCorrectColumns = menuPdfColumns.some((col) => col.column_name === 'clave') &&
                menuPdfColumns.some((col) => col.column_name === 'nombreArchivo') &&
                menuPdfColumns.some((col) => col.column_name === 'rutaArchivo');
            const hasContenidoArchivo = menuPdfColumns.some((col) => col.column_name === 'contenidoArchivo');
            if (!hasCorrectColumns) {
                this.logger.log('⚠️  Tabla menu_pdf tiene estructura incorrecta, recreando...');
                await this.dataSource.query(`DROP TABLE IF EXISTS "menu_pdf" CASCADE`);
                await this.dataSource.query(`
          CREATE TABLE "menu_pdf" (
            "id" SERIAL NOT NULL,
            "clave" character varying NOT NULL,
            "nombreArchivo" character varying NOT NULL,
            "rutaArchivo" character varying NOT NULL,
            "tamanoArchivo" integer,
            "descripcion" text,
            "activo" boolean NOT NULL DEFAULT true,
            "contenidoArchivo" bytea,
            "createdAt" timestamp NOT NULL DEFAULT now(),
            "updatedAt" timestamp NOT NULL DEFAULT now(),
            CONSTRAINT "PK_menu_pdf" PRIMARY KEY ("id")
          );
        `);
                this.logger.log('✅ Tabla menu_pdf recreada con estructura correcta');
            }
            else if (!hasContenidoArchivo) {
                this.logger.log('⚠️  Tabla menu_pdf no tiene columna contenidoArchivo, agregando...');
                await this.dataSource.query(`ALTER TABLE "menu_pdf" ADD COLUMN "contenidoArchivo" bytea`);
                this.logger.log('✅ Columna contenidoArchivo agregada a menu_pdf');
            }
        }
        catch (error) {
            this.logger.error('Error verificando estructura de menu_pdf:', error);
        }
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "admin_auth" (
        "id" SERIAL NOT NULL,
        "usuario" character varying NOT NULL,
        "contrasena" character varying NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_admin_auth" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_admin_auth_usuario" UNIQUE ("usuario")
      );
    `);
        this.logger.log('✅ Todas las tablas iniciales creadas');
    }
    async insertInitialData() {
        this.logger.log('📝 Insertando datos iniciales...');
        try {
            this.logger.log('🗑️  Limpiando contenido_config...');
            await this.dataSource.query(`DELETE FROM contenido_config`);
            this.logger.log('📝 Insertando datos específicos en contenido_config...');
            const meriendasLibresContenido = {
                dulces: [
                    "Cheesecake de frutos rojos",
                    "Cheesecake de maracuyá",
                    "Matilda",
                    "Torta de mandarina",
                    "Torta de almendras",
                    "3 variedad de cookies",
                    "Alfajorcitos de pistachos",
                    "Alfajorcitos de maicena",
                    "Brownie con dulce de leche y crema",
                    "Medialunas de nutella y frutilla"
                ],
                bebidas: [
                    "Jugo de naranjas, limonada clásica y de frutos rojos",
                    "Cafés clásicos y saborizados de vainilla o caramelo",
                    "Submarino, capuchino, moka",
                    "Té clásico o saborizado"
                ],
                salados: [
                    "Sanguchitos completos en pan de campo",
                    "Sanguchitos de roquefort y jamón cocido en pan de campo",
                    "Sanguchitos jamón y queso en pan ciabatta",
                    "Sanguchitos jamón crudo y rúcula en pan ciabatta",
                    "Sanguches de mortadela en Focaccia",
                    "Sanguches de Jamón crudo en Focaccia",
                    "Sanguches de Salame en Focaccia",
                    "Medialunas de jamón y queso",
                    "Medialunas de palta",
                    "Tostadas con palta y huevo revuelto"
                ]
            };
            const tardesTePromoOliviaContenido = {
                dulces: [
                    "Shot de cheesecake de Frutos Rojos",
                    "Brownie con dulce de leche y crema",
                    "Alfajor de pistacho",
                    "Mini torta de almendras"
                ],
                bebidas: [
                    "Infusión grande + refill",
                    "Limonada",
                    "Café, Café con leche, Cortado, Manchado",
                    "Submarino, Cappuccino, Té clásico y saborizado"
                ],
                salados: [
                    "Sandwich de roquefort",
                    "Sandwich de jamón crudo y rúcula",
                    "Sandwich de palta y jamón cocido"
                ]
            };
            const tardesTePromoBasicaContenido = {
                dulces: [
                    "1 brownie con dulce de leche y crema",
                    "1 porción de budín de naranja",
                    "1 alfajor de maicena"
                ],
                bebidas: [
                    "Infusión mediana + refill",
                    "Jugo de naranjas"
                ],
                salados: [
                    "Sandwich de jamón crudo y rúcula",
                    "Sandwich de palta y jamón cocido",
                    "Medialuna JyQ"
                ]
            };
            await this.dataSource.query(`
        INSERT INTO contenido_config (clave, contenido, descripcion) VALUES
        ('meriendas_libres_contenido', $1, 'Contenido configurable de Meriendas Libres'),
        ('tardes_te_promo_olivia_contenido', $2, 'Contenido configurable de Tardes de Té - Promo Olivia'),
        ('tardes_te_promo_basica_contenido', $3, 'Contenido configurable de Tardes de Té - Promo Básica')
      `, [
                JSON.stringify(meriendasLibresContenido),
                JSON.stringify(tardesTePromoOliviaContenido),
                JSON.stringify(tardesTePromoBasicaContenido)
            ]);
            this.logger.log('✅ Datos específicos insertados en contenido_config');
        }
        catch (error) {
            this.logger.warn(`⚠️ Error insertando datos en contenido_config: ${error.message}`);
        }
        try {
            this.logger.log('🗑️  Limpiando site_config...');
            await this.dataSource.query(`DELETE FROM site_config`);
            this.logger.log('📝 Insertando datos específicos en site_config...');
            const horariosCompletos = {
                lunes: {
                    noche: "17:00 - 20:30",
                    manana: "9:00 - 13:00",
                    abierto: true
                },
                jueves: {
                    noche: "17:00 - 20:30",
                    manana: "9:00 - 13:00",
                    abierto: true
                },
                martes: {
                    noche: "17:00 - 20:30",
                    manana: "9:00 - 13:00",
                    abierto: true
                },
                sabado: {
                    noche: "17:00 - 20:30",
                    manana: "9:00 - 13:00",
                    abierto: true
                },
                domingo: {
                    noche: "",
                    manana: "",
                    abierto: false
                },
                viernes: {
                    noche: "17:00 - 20:30",
                    manana: "9:00 - 13:00",
                    abierto: true
                },
                miercoles: {
                    noche: "17:00 - 20:30",
                    manana: "9:00 - 13:00",
                    abierto: true
                }
            };
            await this.dataSource.query(`
        INSERT INTO site_config (clave, telefono, direccion, email, horarios) VALUES
        ('info_general', '2617148842', 'Avenida Godoy Cruz 506, Mendoza', 'info@oliviacafe.com', $1)
      `, [JSON.stringify(horariosCompletos)]);
            this.logger.log('✅ Datos específicos insertados en site_config');
        }
        catch (error) {
            this.logger.warn(`⚠️ Error insertando datos en site_config: ${error.message}`);
        }
        try {
            this.logger.log('🗑️  Limpiando precios_config...');
            await this.dataSource.query(`DELETE FROM precios_config`);
            this.logger.log('📝 Insertando datos específicos en precios_config...');
            await this.dataSource.query(`
        INSERT INTO "precios_config" (
          "clave", "promoOlivia", "promoBasica", "meriendaLibre", "aLaCarta", "tardeDeTe", 
          "descripcionPromoOlivia", "descripcionPromoBasica", "cuposMeriendasLibres", "cuposTardesDeTe",
          "capacidadMaximaCompartida"
        ) VALUES (
          'precios_principales', 
          8500, 
          6500, 
          4500, 
          3500, 
          5500, 
          'Experiencia completa con todos los dulces, bebidas y salados', 
          'Experiencia básica con selección de dulces, bebidas y salados', 
          40, 
          5,
          65
        ) ON CONFLICT ("clave") DO UPDATE SET
          "promoOlivia" = EXCLUDED."promoOlivia",
          "promoBasica" = EXCLUDED."promoBasica", 
          "meriendaLibre" = EXCLUDED."meriendaLibre",
          "aLaCarta" = EXCLUDED."aLaCarta",
          "tardeDeTe" = EXCLUDED."tardeDeTe",
          "descripcionPromoOlivia" = EXCLUDED."descripcionPromoOlivia",
          "descripcionPromoBasica" = EXCLUDED."descripcionPromoBasica",
          "cuposMeriendasLibres" = EXCLUDED."cuposMeriendasLibres",
          "cuposTardesDeTe" = EXCLUDED."cuposTardesDeTe",
          "capacidadMaximaCompartida" = EXCLUDED."capacidadMaximaCompartida";
      `);
            this.logger.log('✅ Datos específicos insertados en precios_config');
        }
        catch (error) {
            this.logger.warn(`⚠️ Error insertando datos en precios_config: ${error.message}`);
        }
        try {
            this.logger.log('🗑️  Limpiando fechas_config...');
            await this.dataSource.query(`DELETE FROM fechas_config`);
            this.logger.log('📝 Insertando datos específicos en fechas_config...');
            await this.dataSource.query(`
        INSERT INTO fechas_config (fecha, "tipoReserva", activo, turnos) VALUES
        ('2025-08-08', 'merienda_libre', true, '["16:30-18:30", "19:00-21:00"]'),
        ('2025-08-09', 'merienda_libre', true, '["16:30-18:30", "19:00-21:00"]'),
        ('2025-08-10', 'merienda_libre', true, '["16:30-18:30", "19:00-21:00"]'),
        ('2025-08-11', 'merienda_libre', true, '["16:30-18:30", "19:00-21:00"]'),
        ('2025-08-12', 'merienda_libre', true, '["16:30-18:30", "19:00-21:00"]'),
        ('2025-08-13', 'merienda_libre', true, '["16:30-18:30", "19:00-21:00"]')
      `);
            this.logger.log('✅ Datos específicos insertados en fechas_config');
        }
        catch (error) {
            this.logger.warn(`⚠️ Error insertando datos en fechas_config: ${error.message}`);
        }
        try {
            this.logger.log('🗑️  Limpiando administrador...');
            await this.dataSource.query(`DELETE FROM administrador`);
            this.logger.log('📝 Insertando datos específicos en administrador...');
            await this.dataSource.query(`
        INSERT INTO administrador (usuario, contrasena) VALUES
        ('admin', '$2b$12$ARQ61NzGqWBFlZockkwW9e12MXcHPxJUQk3kQum5f.kyIBPvf3VFi')
      `);
            this.logger.log('✅ Admin creado (usuario: admin, contraseña: admin123)');
        }
        catch (error) {
            this.logger.warn(`⚠️ Error creando admin: ${error.message}`);
        }
        this.logger.log('✅ Datos iniciales insertados correctamente');
    }
}
exports.DatabaseInitializer = DatabaseInitializer;
//# sourceMappingURL=init-database.js.map