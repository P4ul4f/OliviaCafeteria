const { Pool } = require('pg');
require('dotenv').config();

async function migrateDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    
    // Agregar columnas de cupos a precios_config si no existen
    const cuposColumnsExist = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'precios_config' 
      AND column_name IN ('cuposMeriendasLibres', 'cuposTardesDeTe')
    `);

    if (cuposColumnsExist.rows.length < 2) {
      await client.query(`
        ALTER TABLE precios_config 
        ADD COLUMN IF NOT EXISTS "cuposMeriendasLibres" integer DEFAULT 20,
        ADD COLUMN IF NOT EXISTS "cuposTardesDeTe" integer DEFAULT 10
      `);
    }

    // Agregar columna turnos a fechas_config si no existe
    const turnosColumnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'fechas_config' 
      AND column_name = 'turnos'
    `);

    if (turnosColumnExists.rows.length === 0) {
      await client.query(`
        ALTER TABLE fechas_config 
        ADD COLUMN "turnos" jsonb DEFAULT '[]'::jsonb
      `);
    }

    // Migrar datos existentes de fechas_config si es necesario
    const hasOldStructure = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'fechas_config' 
      AND column_name IN ('manana', 'tarde', 'noche')
    `);

    if (hasOldStructure.rows.length > 0) {
      // Migrar datos existentes
      const oldData = await client.query('SELECT * FROM fechas_config');
      
      for (const row of oldData.rows) {
        const turnos = [];
        
        if (row.manana) turnos.push({ tipo: 'mañana', horario: row.manana, cupos: 20 });
        if (row.tarde) turnos.push({ tipo: 'tarde', horario: row.tarde, cupos: 20 });
        if (row.noche) turnos.push({ tipo: 'noche', horario: row.noche, cupos: 20 });
        
        await client.query(`
          UPDATE fechas_config 
          SET turnos = $1 
          WHERE id = $2
        `, [JSON.stringify(turnos), row.id]);
      }
      
      // Eliminar columnas antiguas
      await client.query(`
        ALTER TABLE fechas_config 
        DROP COLUMN IF EXISTS manana,
        DROP COLUMN IF EXISTS tarde,
        DROP COLUMN IF EXISTS noche
      `);
    }

    client.release();
  } catch (error) {
    console.error('Error durante la migración:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateDatabase().catch(console.error); 