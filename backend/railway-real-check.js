const { Client } = require('pg');

async function checkRailwayRealDatabase() {
  console.log('🔍 Verificando base de datos REAL de Railway...');
  
  // Mostrar variables de entorno (sin mostrar valores sensibles)
  console.log('\n📋 Variables de entorno en Railway:');
  console.log(`DB_HOST: ${process.env.DB_HOST ? 'SET' : 'NOT SET'}`);
  console.log(`DB_USER: ${process.env.DB_USER ? 'SET' : 'NOT SET'}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? 'SET' : 'NOT SET'}`);
  console.log(`DB_PORT: ${process.env.DB_PORT ? 'SET' : 'NOT SET'}`);
  console.log(`DB_DATABASE: ${process.env.DB_DATABASE ? 'SET' : 'NOT SET'}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);

  // Usar DATABASE_URL si está disponible (Railway)
  const connectionConfig = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      };

  const client = new Client(connectionConfig);

  try {
    await client.connect();
    console.log('\n✅ Conectado a Railway Database');
    console.log(`📊 Base de datos: ${process.env.DB_DATABASE || 'DATABASE_URL'}`);

    // Verificar migraciones
    const migrations = await client.query(`
      SELECT * FROM migrations 
      ORDER BY timestamp;
    `);
    
    console.log('\n🔄 Migraciones en Railway:');
    if (migrations.rows.length === 0) {
      console.log('❌ No hay migraciones registradas');
    } else {
      migrations.rows.forEach(row => {
        console.log(`  - ${row.name} (${row.timestamp})`);
      });
    }

    // Verificar tablas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tablas en Railway:');
    if (tables.rows.length === 0) {
      console.log('❌ No hay tablas');
    } else {
      tables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkRailwayRealDatabase();
