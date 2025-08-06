const { Pool } = require('pg');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Debug: Mostrar configuración (sin password)
console.log('🔧 Database configuration:');
console.log('  Host:', dbConfig.host);
console.log('  Port:', dbConfig.port);
console.log('  User:', dbConfig.user);
console.log('  Database:', dbConfig.database);
console.log('  SSL:', dbConfig.ssl ? 'enabled' : 'disabled');
console.log('  Password set:', dbConfig.password ? 'YES' : 'NO');

// Crear pool de conexiones
const pool = new Pool(dbConfig);

// Función para verificar conexión
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('❌ Error details:', error);
    return false;
  }
}

// Función para ejecutar migraciones básicas
async function runMigrations() {
  try {
    console.log('🔄 Running migrations...');
    const client = await pool.connect();
    
    // Crear tabla de reservas
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        personas INTEGER NOT NULL,
        tipo_reserva VARCHAR(50) NOT NULL,
        estado VARCHAR(20) DEFAULT 'PENDIENTE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de precios
    await client.query(`
      CREATE TABLE IF NOT EXISTS precios_config (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) UNIQUE NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de administradores
    await client.query(`
      CREATE TABLE IF NOT EXISTS administradores (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    client.release();
    console.log('✅ Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

// Función para insertar datos iniciales
async function seedData() {
  try {
    console.log('🌱 Seeding initial data...');
    const client = await pool.connect();
    
    // Insertar precios por defecto
    await client.query(`
      INSERT INTO precios_config (tipo, precio) VALUES 
      ('a_la_carta', 2500),
      ('merienda_libre', 1800),
      ('tarde_de_te', 2200)
      ON CONFLICT (tipo) DO NOTHING
    `);
    
    // Insertar administrador por defecto
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO administradores (username, password_hash, email) VALUES 
      ('admin', $1, 'admin@olivia.com')
      ON CONFLICT (username) DO NOTHING
    `, [hashedPassword]);
    
    client.release();
    console.log('✅ Initial data seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  runMigrations,
  seedData
}; 