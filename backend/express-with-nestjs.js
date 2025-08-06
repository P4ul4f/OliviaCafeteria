const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simular estructura de NestJS con Express
const controllers = {
  // App Controller
  app: {
    getHello: (req, res) => {
      res.json({
        message: 'Hello World!',
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001
      });
    },
    getHealth: (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    },
    getTest: (req, res) => {
      res.json({ message: 'Test endpoint is working' });
    }
  },
  
  // Reserva Controller (simulado)
  reserva: {
    getReservas: (req, res) => {
      res.json({ message: 'Reservas endpoint - Coming soon' });
    },
    createReserva: (req, res) => {
      res.json({ message: 'Create reserva - Coming soon' });
    }
  },
  
  // Precios Controller (simulado)
  precios: {
    getPrecios: (req, res) => {
      res.json({ message: 'Precios endpoint - Coming soon' });
    }
  }
};

// Rutas básicas
app.get('/', controllers.app.getHello);
app.get('/health', controllers.app.getHealth);
app.get('/test', controllers.app.getTest);

// Rutas de API (simulando NestJS)
app.get('/api/reservas', controllers.reserva.getReservas);
app.post('/api/reservas', controllers.reserva.createReserva);
app.get('/api/precios', controllers.precios.getPrecios);

// Start server
const port = process.env.PORT || 3001;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Express + NestJS-like server running on port ${port}`);
  console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
  console.log('🎉 Server started successfully!');
  console.log('📋 Available endpoints:');
  console.log('  - GET / (Hello World)');
  console.log('  - GET /health (Health check)');
  console.log('  - GET /test (Test endpoint)');
  console.log('  - GET /api/reservas (Reservas)');
  console.log('  - POST /api/reservas (Create reserva)');
  console.log('  - GET /api/precios (Precios)');
});

app.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
}); 