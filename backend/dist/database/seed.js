"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const initial_data_seed_1 = require("./seeds/initial-data.seed");
const contenido_config_seed_1 = require("./seeds/contenido-config.seed");
(0, dotenv_1.config)();
const site_config_entity_1 = require("../site-config/site-config.entity");
const precios_config_entity_1 = require("../precios-config/precios-config.entity");
const fechas_config_entity_1 = require("../fechas-config/fechas-config.entity");
const menu_pdf_entity_1 = require("../menu-pdf/menu-pdf.entity");
const reserva_entity_1 = require("../reserva/reserva.entity");
const pago_entity_1 = require("../pago/pago.entity");
const administrador_entity_1 = require("../administrador/administrador.entity");
const contenido_config_entity_1 = require("../contenido-config/contenido-config.entity");
async function runSeed() {
    console.log('🔍 Variables de entorno:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USERNAME:', process.env.DB_USERNAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
    console.log('DB_DATABASE:', process.env.DB_DATABASE);
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [
            reserva_entity_1.Reserva,
            pago_entity_1.Pago,
            administrador_entity_1.Administrador,
            site_config_entity_1.SiteConfig,
            precios_config_entity_1.PreciosConfig,
            fechas_config_entity_1.FechasConfig,
            menu_pdf_entity_1.MenuPdf,
            contenido_config_entity_1.ContenidoConfig
        ],
        synchronize: false,
        logging: true,
    });
    try {
        console.log('🔌 Conectando a la base de datos...');
        await dataSource.initialize();
        console.log('✅ Conexión establecida');
        await (0, initial_data_seed_1.seedInitialData)(dataSource);
        await (0, contenido_config_seed_1.seedContenidoConfig)(dataSource);
        await dataSource.destroy();
        console.log('🔌 Conexión cerrada');
        console.log('🎉 Proceso de seed completado exitosamente');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error durante el seed:', error);
        await dataSource.destroy();
        process.exit(1);
    }
}
runSeed();
//# sourceMappingURL=seed.js.map