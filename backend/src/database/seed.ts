import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { seedInitialData } from './seeds/initial-data.seed';
import { seedContenidoConfig } from './seeds/contenido-config.seed';

// Cargar variables de entorno
config();
import { SiteConfig } from '../site-config/site-config.entity';
import { PreciosConfig } from '../precios-config/precios-config.entity';
import { FechasConfig } from '../fechas-config/fechas-config.entity';
import { MenuPdf } from '../menu-pdf/menu-pdf.entity';
import { Reserva } from '../reserva/reserva.entity';
import { Pago } from '../pago/pago.entity';
import { Administrador } from '../administrador/administrador.entity';
import { ContenidoConfig } from '../contenido-config/contenido-config.entity';

async function runSeed() {
  // Debug: mostrar variables de entorno
  console.log('🔍 Variables de entorno:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_USERNAME:', process.env.DB_USERNAME);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
  console.log('DB_DATABASE:', process.env.DB_DATABASE);
  
  // Configuración de la base de datos (usando variables de entorno)
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      Reserva, 
      Pago, 
      Administrador, 
      SiteConfig, 
      PreciosConfig, 
      FechasConfig, 
      MenuPdf,
      ContenidoConfig
    ],
    synchronize: false, // No crear/modificar tablas automáticamente
    logging: true,
  });

  try {
    console.log('🔌 Conectando a la base de datos...');
    await dataSource.initialize();
    console.log('✅ Conexión establecida');

    await seedInitialData(dataSource);
    await seedContenidoConfig(dataSource);

    await dataSource.destroy();
    console.log('🔌 Conexión cerrada');
    console.log('🎉 Proceso de seed completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeed(); 