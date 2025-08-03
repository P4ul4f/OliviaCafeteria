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
    'src/**/*.entity.ts'
  ],
  migrations: [
    'src/database/migrations/*.ts'
  ],
  synchronize: false, // Solo usar migraciones en producción
  logging: true,
}); 