import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
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

  await app.listen(3001);
  console.log('Backend running on http://localhost:3001');
}
bootstrap();
