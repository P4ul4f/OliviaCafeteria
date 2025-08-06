const express = require('express');
const cors = require('cors');
const { pool, testConnection, runMigrations, seedData } = require('./database-connection');

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
    getHealth: async (req, res) => {
      try {
        const dbConnected = await testConnection();
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
          database: dbConnected ? 'connected' : 'disconnected'
        });
      } catch (error) {
        res.status(500).json({ error: 'Health check failed' });
      }
    },
    getTest: (req, res) => {
      res.json({ message: 'Test endpoint is working' });
    }
  },
  
  // Reserva Controller
  reserva: {
    getReservas: async (req, res) => {
      try {
        const result = await pool.query('SELECT * FROM reservas ORDER BY created_at DESC');
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservas' });
      }
    },
    createReserva: async (req, res) => {
      try {
        const { nombre, email, telefono, fecha, hora, personas, tipo_reserva } = req.body;
        const result = await pool.query(
          'INSERT INTO reservas (nombre, email, telefono, fecha, hora, personas, tipo_reserva) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [nombre, email, telefono, fecha, hora, personas, tipo_reserva]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create reserva' });
      }
    }
  },
  
  // Precios Controller
  precios: {
    getPrecios: async (req, res) => {
      try {
        const result = await pool.query('SELECT * FROM precios_config WHERE activo = true');
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch precios' });
      }
    }
  }
};

// Rutas básicas
app.get('/', controllers.app.getHello);
app.get('/health', controllers.app.getHealth);
app.get('/test', controllers.app.getTest);

// Rutas de API
app.get('/api/reservas', controllers.reserva.getReservas);
app.post('/api/reservas', controllers.reserva.createReserva);
app.get('/api/precios', controllers.precios.getPrecios);

// Inicializar base de datos y arrancar servidor
async function startServer() {
  try {
    console.log('🚀 Starting server with database...');
    
    // Probar conexión a la BD
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('⚠️ Database not connected, starting without DB');
    } else {
      // Ejecutar migraciones
      await runMigrations();
      
      // Insertar datos iniciales
      await seedData();
    }
    
    // Arrancar servidor
    const port = process.env.PORT || 3001;
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Express + DB server running on port ${port}`);
      console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
      console.log('🎉 Server started successfully!');
      console.log('📋 Available endpoints:');
      console.log('  - GET / (Hello World)');
      console.log('  - GET /health (Health check with DB status)');
      console.log('  - GET /test (Test endpoint)');
      console.log('  - GET /api/reservas (Get all reservas)');
      console.log('  - POST /api/reservas (Create new reserva)');
      console.log('  - GET /api/precios (Get all precios)');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 