import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

export class DatabaseInitializer {
  private readonly logger = new Logger(DatabaseInitializer.name);

  constructor(private dataSource: DataSource) {}

  async initialize() {
    try {
      this.logger.log('🔍 Verificando estado de la base de datos...');

      // Verificar si las tablas existen
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

      // Siempre crear las tablas iniciales (esto asegura que migrations tenga la restricción UNIQUE)
      this.logger.log('🏗️  Creando estructura inicial de tablas...');
      await this.createInitialTables();
      
      // Recargar lista de tablas
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

      // Verificar migraciones después de crear las tablas
      let migrations = [];
      try {
        migrations = await this.dataSource.query(`
          SELECT * FROM migrations 
          ORDER BY timestamp;
        `);
        this.logger.log(`🔄 Migraciones registradas: ${migrations.length}`);
      } catch (error) {
        this.logger.log('⚠️ Error consultando migraciones:', error.message);
      }

      // Marcar migraciones faltantes como ejecutadas
      await this.markMissingMigrationsAsExecuted(newTables, migrations);

      // Insertar datos iniciales si las tablas están vacías
      await this.insertInitialData();

      this.logger.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
      this.logger.error('❌ Error inicializando base de datos:', error.message);
      // No lanzar error para que el servidor continúe
    }
  }

  private async markMissingMigrationsAsExecuted(tables: any[], migrations: any[]) {
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
        // Verificar si la tabla correspondiente existe
        let shouldMark = false;
        
        if (expected.timestamp === 1699999999999) {
          // Migración inicial - marcar si hay tablas básicas
          const basicTables = ['administrador', 'reserva', 'pago'];
          shouldMark = basicTables.every(tableName => 
            tables.find(t => t.table_name === tableName)
          );
        } else if (expected.timestamp === 1700000000003) {
          // Migración de contenido_config
          shouldMark = tables.find(t => t.table_name === 'contenido_config');
        } else if (expected.timestamp === 1700000000004) {
          // Migración de gift_card
          shouldMark = tables.find(t => t.table_name === 'gift_card');
        } else {
          // Otras migraciones - marcar si las tablas relacionadas existen
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
          } catch (error) {
            this.logger.warn(`⚠️ No se pudo marcar la migración ${expected.name}: ${error.message}`);
          }
        }
      }
    }
  }

  private async createInitialTables() {
    this.logger.log('🏗️  Creando tablas iniciales...');

    // Crear tabla migrations
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_migrations" PRIMARY KEY ("id")
      );
    `);
    
    // Verificar si existe la restricción UNIQUE y agregarla si no existe
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
      } else {
        this.logger.log('ℹ️  Restricción UNIQUE ya existe en tabla migrations');
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error verificando/agregando restricción UNIQUE: ${error.message}`);
    }

    // Crear tabla administrador
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "administrador" (
        "id" SERIAL NOT NULL,
        "usuario" character varying NOT NULL,
        "contrasena" character varying NOT NULL,
        CONSTRAINT "PK_administrador" PRIMARY KEY ("id")
      );
    `);

    // Crear tabla reserva
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

    // Crear tabla pago
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

    // Crear tabla contenido_config
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

    // Crear tabla fechas_config
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

    // Crear tabla precios_config
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
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_precios_config" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_precios_config_clave" UNIQUE ("clave")
      );
    `);

    // Crear tabla site_config
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

    // Crear tabla gift_card
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "gift_card" (
        "id" SERIAL NOT NULL,
        "nombreComprador" character varying NOT NULL,
        "telefonoComprador" character varying NOT NULL,
        "emailComprador" character varying NOT NULL,
        "emailDestinatario" character varying,
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

    // Crear tabla menu_pdf
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "menu_pdf" (
        "id" SERIAL NOT NULL,
        "nombre" character varying NOT NULL,
        "url" character varying NOT NULL,
        "activo" boolean NOT NULL DEFAULT true,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_menu_pdf" PRIMARY KEY ("id")
      );
    `);

    // Crear tabla admin_auth
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

  private async insertInitialData() {
    this.logger.log('📝 Insertando datos iniciales...');

    // Insertar datos en contenido_config (incluyendo datos del seed)
    try {
      const contenidoConfigCount = await this.dataSource.query(`
        SELECT COUNT(*) as count FROM contenido_config;
      `);
      
      if (contenidoConfigCount[0].count == 0) {
        // Datos básicos
        await this.dataSource.query(`
          INSERT INTO contenido_config (clave, contenido, descripcion) VALUES
          ('hero', '{"titulo": "Olivia Café", "subtitulo": "Experiencia única en cada taza", "descripcion": "Descubre el sabor auténtico de nuestro café artesanal"}', 'Configuración del hero principal'),
          ('about', '{"titulo": "Sobre Nosotros", "descripcion": "Olivia Café nació de la pasión por el café de calidad y la experiencia gastronómica única."}', 'Configuración de la sección sobre nosotros'),
          ('contact', '{"telefono": "+54 9 11 1234-5678", "email": "info@oliviacafe.com", "direccion": "Av. Corrientes 1234, Buenos Aires"}', 'Información de contacto');
        `);
        
        // Datos específicos del seed de contenido-config
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
          ],
          bebidas: [
            "Jugo de naranjas, limonada clásica y de frutos rojos",
            "Cafés clásicos y saborizados de vainilla o caramelo",
            "Submarino, capuchino, moka",
            "Té clásico o saborizado"
          ]
        };

        const tardesTePromoOliviaContenido = {
          dulces: [
            "Shot de cheesecake de Frutos Rojos",
            "Brownie con dulce de leche y crema",
            "Alfajor de pistacho",
            "Mini torta de almendras"
          ],
          salados: [
            "Sandwich de roquefort",
            "Sandwich de jamón crudo y rúcula",
            "Sandwich de palta y jamón cocido"
          ],
          bebidas: [
            "Infusión grande + refill",
            "Limonada",
            "Café, Café con leche, Cortado, Manchado",
            "Submarino, Cappuccino, Té clásico y saborizado"
          ]
        };

        const tardesTePromoBasicaContenido = {
          dulces: [
            "1 brownie con dulce de leche y crema",
            "1 porción de budín de naranja",
            "1 alfajor de maicena"
          ],
          salados: [
            "Sandwich de jamón crudo y rúcula",
            "Sandwich de palta y jamón cocido",
            "Medialuna JyQ"
          ],
          bebidas: [
            "Infusión mediana + refill",
            "Jugo de naranjas"
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
        
        this.logger.log('✅ Datos iniciales y específicos insertados en contenido_config');
      } else {
        this.logger.log('ℹ️  contenido_config ya tiene datos');
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error insertando datos en contenido_config: ${error.message}`);
    }

    // Insertar datos en precios_config
    try {
      const preciosConfigCount = await this.dataSource.query(`
        SELECT COUNT(*) as count FROM precios_config;
      `);
      
      if (preciosConfigCount[0].count == 0) {
        await this.dataSource.query(`
          INSERT INTO precios_config (clave, promoOlivia, promoBasica, meriendaLibre, aLaCarta, tardeDeTe, descripcionPromoOlivia, descripcionPromoBasica, cuposMeriendasLibres, cuposTardesDeTe) VALUES
          ('precios', 2500, 2000, 1500, 5000, 3000, 'Promoción especial Olivia', 'Promoción básica', 20, 15);
        `);
        this.logger.log('✅ Datos iniciales insertados en precios_config');
      } else {
        this.logger.log('ℹ️  precios_config ya tiene datos');
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error insertando datos en precios_config: ${error.message}`);
    }

    // Insertar datos en site_config
    try {
      const siteConfigCount = await this.dataSource.query(`
        SELECT COUNT(*) as count FROM site_config;
      `);
      
      if (siteConfigCount[0].count == 0) {
        await this.dataSource.query(`
          INSERT INTO site_config (clave, telefono, direccion, email, horarios) VALUES
          ('site', '+54 9 11 1234-5678', 'Av. Corrientes 1234, Buenos Aires', 'info@oliviacafe.com', '{"lunes": "8:00-20:00", "martes": "8:00-20:00", "miercoles": "8:00-20:00", "jueves": "8:00-20:00", "viernes": "8:00-22:00", "sabado": "9:00-22:00", "domingo": "9:00-20:00"}');
        `);
        this.logger.log('✅ Datos iniciales insertados en site_config');
      } else {
        this.logger.log('ℹ️  site_config ya tiene datos');
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error insertando datos en site_config: ${error.message}`);
    }

    // Insertar admin por defecto
    try {
      const adminCount = await this.dataSource.query(`
        SELECT COUNT(*) as count FROM administrador;
      `);
      
      if (adminCount[0].count == 0) {
        await this.dataSource.query(`
          INSERT INTO administrador (usuario, contrasena) VALUES
          ('admin', 'admin123');
        `);
        this.logger.log('✅ Admin por defecto creado (usuario: admin, contraseña: admin123)');
      } else {
        this.logger.log('ℹ️  Administrador ya existe');
      }
    } catch (error) {
      this.logger.warn(`⚠️ Error creando admin: ${error.message}`);
    }

    this.logger.log('✅ Datos iniciales insertados correctamente');
  }
}
