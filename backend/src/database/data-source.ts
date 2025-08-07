import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [
    'src/**/*.entity.ts'  // Usar .ts para desarrollo
  ],
  migrations: [
    'src/database/migrations/*.ts'  // Usar .ts para desarrollo
  ],
  synchronize: false, // Solo usar migraciones en producción
  logging: process.env.NODE_ENV === 'development',
}); 