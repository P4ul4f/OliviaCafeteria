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
    console.log('📁 Current directory:', process.cwd());
    console.log('📦 Node version:', process.version);
    
    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS app created successfully');
    
    // Configurar CORS
    app.enableCors({
      origin: [
        'http://localhost:3000', 
        'http://localhost:3001',
        'https://olivia-frontend.vercel.app',
        process.env.FRONTEND_URL
      ].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    console.log('✅ CORS configured');

    // Configurar validación global
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        disableErrorMessages: false,
      }),
    );
    console.log('✅ Validation pipes configured');

    // Configurar filtro global de excepciones
    app.useGlobalFilters(new GlobalExceptionFilter());
    console.log('✅ Exception filters configured');

    // Configurar interceptor de logging
    app.useGlobalInterceptors(new LoggingInterceptor());
    console.log('✅ Logging interceptors configured');

    const port = process.env.PORT || 3001;
    console.log('🎯 Attempting to listen on port:', port);
    console.log('🌐 Host: 0.0.0.0');
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Backend running on port ${port}`);
    console.log(`🌐 CORS origins: ${app.getHttpAdapter().getInstance()._origins}`);
    console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
    console.log('🎉 Application started successfully!');
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    console.error('❌ Error stack:', error.stack);
    process.exit(1);
  }
}

// Manejar señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

bootstrap();
