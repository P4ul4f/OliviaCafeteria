import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseInitializer } from './database/init-database';

async function bootstrap() {
  try {
    console.log('🚀 Starting Olivia Backend...');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔧 Port from env:', process.env.PORT);
    
    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS app created successfully');
    
    // Inicializar base de datos usando DatabaseInitializer
    console.log('🔍 Initializing database with DatabaseInitializer...');
    try {
      const dataSource = app.get('DataSource');
      const dbInitializer = new DatabaseInitializer(dataSource);
      
      // Agregar timeout de 30 segundos para Railway
      const timeout = setTimeout(() => {
        console.log('⚠️ Database initialization timeout, continuing...');
      }, 30000);
      
      await dbInitializer.initialize();
      clearTimeout(timeout);
      console.log('✅ Database initialized successfully with DatabaseInitializer');
    } catch (error) {
      console.log('⚠️ Database initialization failed, but continuing...');
      console.log('⚠️ Error:', error.message);
    }
    
    // Configuración específica de CORS para permitir Vercel
    app.enableCors({
      origin: [
        'https://olivia-cafeteria.vercel.app',
        'https://olivia-cafeteria-git-main-paulaferreyra.vercel.app',
        'http://localhost:3000', // Para desarrollo local
        'http://localhost:3001', // Para desarrollo local
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    console.log('✅ CORS configured for Vercel domains');

    const port = process.env.PORT || 3001;
    console.log('🎯 Attempting to listen on port:', port);
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Backend running on port ${port}`);
    console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
    console.log('🎉 Application started successfully!');
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    console.error('❌ Error stack:', error.stack);
    process.exit(1);
  }
}

bootstrap();
