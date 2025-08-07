import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'olivia_admin',
  password: process.env.DB_PASSWORD || 'cafeolivia',
  database: process.env.DB_DATABASE || 'OliviaCafeteria',
  entities: [
    'dist/**/*.entity.js'  // Cambiar a .js para producción
  ],
  migrations: [
    'dist/database/migrations/*.js'  // Cambiar a .js para producción
  ],
  synchronize: false, // Solo usar migraciones en producción
  logging: process.env.NODE_ENV === 'development',
}); 