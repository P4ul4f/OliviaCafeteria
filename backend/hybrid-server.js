const express = require('express');
const cors = require('cors');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Inicializar NestJS de forma asíncrona
async function initializeNestJS() {
  try {
    console.log('🚀 Initializing NestJS...');
    const nestApp = await NestFactory.create(AppModule);
    
    // Configurar CORS
    nestApp.enableCors();
    
    // Obtener el adaptador de Express
    const expressInstance = nestApp.getHttpAdapter().getInstance();
    
    // Montar las rutas de NestJS en Express
    app.use('/api', expressInstance);
    
    console.log('✅ NestJS initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize NestJS:', error.message);
    console.log('⚠️ Continuing with Express-only mode');
  }
}

// Rutas básicas de Express
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});

// Inicializar y arrancar servidor
async function startServer() {
  try {
    // Inicializar NestJS
    await initializeNestJS();
    
    // Arrancar servidor
    const port = process.env.PORT || 3001;
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Hybrid server running on port ${port}`);
      console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
      console.log('🎉 Server started successfully!');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 