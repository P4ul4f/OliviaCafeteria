"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("typeorm");
const reserva_module_1 = require("./reserva/reserva.module");
const pago_module_1 = require("./pago/pago.module");
const administrador_module_1 = require("./administrador/administrador.module");
const auth_module_1 = require("./auth/auth.module");
const site_config_module_1 = require("./site-config/site-config.module");
const reserva_entity_1 = require("./reserva/reserva.entity");
const pago_entity_1 = require("./pago/pago.entity");
const administrador_entity_1 = require("./administrador/administrador.entity");
const site_config_entity_1 = require("./site-config/site-config.entity");
const precios_config_entity_1 = require("./precios-config/precios-config.entity");
const fechas_config_entity_1 = require("./fechas-config/fechas-config.entity");
const menu_pdf_entity_1 = require("./menu-pdf/menu-pdf.entity");
const menu_pdf_module_1 = require("./menu-pdf/menu-pdf.module");
const fechas_config_module_1 = require("./fechas-config/fechas-config.module");
const precios_config_module_1 = require("./precios-config/precios-config.module");
const giftcard_entity_1 = require("./giftcard/giftcard.entity");
const giftcard_module_1 = require("./giftcard/giftcard.module");
const contenido_config_entity_1 = require("./contenido-config/contenido-config.entity");
const contenido_config_module_1 = require("./contenido-config/contenido-config.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
                validationOptions: {
                    allowUnknown: false,
                    abortEarly: true,
                },
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const hasDatabaseConfig = config.get('DB_HOST') && config.get('DB_USER') && config.get('DB_PASSWORD');
                    if (!hasDatabaseConfig) {
                        console.log('⚠️ Database environment variables not configured, using in-memory database');
                        return {
                            type: 'sqlite',
                            database: ':memory:',
                            entities: [
                                reserva_entity_1.Reserva,
                                pago_entity_1.Pago,
                                administrador_entity_1.Administrador,
                                site_config_entity_1.SiteConfig,
                                precios_config_entity_1.PreciosConfig,
                                fechas_config_entity_1.FechasConfig,
                                menu_pdf_entity_1.MenuPdf,
                                giftcard_entity_1.GiftCard,
                                contenido_config_entity_1.ContenidoConfig
                            ],
                            synchronize: true,
                            logging: config.get('NODE_ENV') === 'development',
                        };
                    }
                    const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
                    for (const envVar of requiredEnvVars) {
                        if (!config.get(envVar)) {
                            throw new Error(`Missing required environment variable: ${envVar}`);
                        }
                    }
                    return {
                        type: 'postgres',
                        host: config.get('DB_HOST'),
                        port: parseInt(config.get('DB_PORT') ?? '5432', 10),
                        username: config.get('DB_USER'),
                        password: config.get('DB_PASSWORD'),
                        database: config.get('DB_DATABASE'),
                        entities: [
                            reserva_entity_1.Reserva,
                            pago_entity_1.Pago,
                            administrador_entity_1.Administrador,
                            site_config_entity_1.SiteConfig,
                            precios_config_entity_1.PreciosConfig,
                            fechas_config_entity_1.FechasConfig,
                            menu_pdf_entity_1.MenuPdf,
                            giftcard_entity_1.GiftCard,
                            contenido_config_entity_1.ContenidoConfig
                        ],
                        synchronize: false,
                        logging: config.get('NODE_ENV') === 'development',
                        ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
                        retryAttempts: 3,
                        retryDelay: 3000,
                    };
                },
            }),
            reserva_module_1.ReservaModule,
            pago_module_1.PagoModule,
            administrador_module_1.AdministradorModule,
            auth_module_1.AuthModule,
            site_config_module_1.SiteConfigModule,
            menu_pdf_module_1.MenuPdfModule,
            fechas_config_module_1.FechasConfigModule,
            precios_config_module_1.PreciosConfigModule,
            giftcard_module_1.GiftCardModule,
            contenido_config_module_1.ContenidoConfigModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'DataSource',
                useFactory: (dataSource) => dataSource,
                inject: [typeorm_2.DataSource],
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map