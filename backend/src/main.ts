import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  try {
    console.log('🚀 Starting Olivia Backend...');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔧 Port from env:', process.env.PORT);
    
    const app = await NestFactory.create(AppModule);
    
    // Configurar CORS
    app.enableCors({
      origin: [
        'http://localhost:3000', 
        'http://localhost:3001',
        'https://olivia-frontend.vercel.app', // Frontend en Vercel
        process.env.FRONTEND_URL // URL dinámica del frontend
      ].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Configurar validación global
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true, // Transformar automáticamente los tipos
        whitelist: true, // Filtrar propiedades no definidas en DTOs
        forbidNonWhitelisted: false, // Ignorar propiedades no permitidas en vez de lanzar error
        disableErrorMessages: false, // Mostrar mensajes de error detallados
      }),
    );

    // Configurar filtro global de excepciones
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Configurar interceptor de logging
    app.useGlobalInterceptors(new LoggingInterceptor());

    const port = process.env.PORT || 3001;
    console.log('🎯 Attempting to listen on port:', port);
    
    await app.listen(port, '0.0.0.0'); // Escuchar en todas las interfaces
    
    console.log(`✅ Backend running on port ${port}`);
    console.log(`🌐 CORS origins: ${app.getHttpAdapter().getInstance()._origins}`);
    console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
