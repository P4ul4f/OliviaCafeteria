"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'olivia_admin',
    password: process.env.DB_PASSWORD || 'cafeolivia',
    database: process.env.DB_DATABASE || 'OliviaCafeteria',
    entities: [
        'dist/**/*.entity.js'
    ],
    migrations: [
        'dist/database/migrations/*.js'
    ],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
});
//# sourceMappingURL=data-source.js.map