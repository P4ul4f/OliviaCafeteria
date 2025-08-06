import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting Olivia Backend...');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔧 Port from env:', process.env.PORT);
    
    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS app created successfully');
    
    // Configuración básica de CORS
    app.enableCors();
    console.log('✅ CORS configured');

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
