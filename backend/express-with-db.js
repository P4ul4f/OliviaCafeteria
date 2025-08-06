const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar módulo de BD con manejo de errores
let dbModule = null;
try {
  dbModule = require('./database-connection');
} catch (error) {
  console.log('⚠️ Database module not available, running without DB');
}

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
        let dbStatus = 'not_available';
        if (dbModule) {
          const dbConnected = await dbModule.testConnection();
          dbStatus = dbConnected ? 'connected' : 'disconnected';
        }
        
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
          database: dbStatus
        });
      } catch (error) {
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
          database: 'error'
        });
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
        if (!dbModule) {
          return res.json({ message: 'Database not available', data: [] });
        }
        const result = await dbModule.pool.query('SELECT * FROM reservas ORDER BY created_at DESC');
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reservas', details: error.message });
      }
    },
    createReserva: async (req, res) => {
      try {
        if (!dbModule) {
          return res.status(503).json({ error: 'Database not available' });
        }
        const { nombre, email, telefono, fecha, hora, personas, tipo_reserva } = req.body;
        const result = await dbModule.pool.query(
          'INSERT INTO reservas (nombre, email, telefono, fecha, hora, personas, tipo_reserva) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [nombre, email, telefono, fecha, hora, personas, tipo_reserva]
        );
        res.json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create reserva', details: error.message });
      }
    }
  },
  
  // Precios Controller
  precios: {
    getPrecios: async (req, res) => {
      try {
        if (!dbModule) {
          return res.json({ message: 'Database not available', data: [] });
        }
        const result = await dbModule.pool.query('SELECT * FROM precios_config WHERE activo = true');
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch precios', details: error.message });
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
    console.log('🚀 Starting server...');
    
    // Intentar inicializar BD de forma segura
    if (dbModule) {
      console.log('📊 Database module loaded, attempting connection...');
      
      try {
        // Probar conexión a la BD con timeout
        const dbConnected = await Promise.race([
          dbModule.testConnection(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DB connection timeout')), 10000)
          )
        ]);
        
        if (dbConnected) {
          console.log('✅ Database connected, running migrations...');
          await dbModule.runMigrations();
          await dbModule.seedData();
        } else {
          console.log('⚠️ Database not connected, starting without DB');
        }
      } catch (dbError) {
        console.log('⚠️ Database error, starting without DB:', dbError.message);
      }
    } else {
      console.log('⚠️ No database module, starting without DB');
    }
    
    // Arrancar servidor
    const port = process.env.PORT || 3001;
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Express server running on port ${port}`);
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

// Manejar señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

startServer(); 