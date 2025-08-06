import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting minimal NestJS app...');
    
    const app = await NestFactory.create(AppModule);
    console.log('✅ NestJS app created');
    
    const port = process.env.PORT || 3001;
    console.log('🎯 Listening on port:', port);
    
    await app.listen(port, '0.0.0.0');
    console.log('✅ App listening successfully');
    
  } catch (error) {
    console.error('❌ Error starting app:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

bootstrap(); 