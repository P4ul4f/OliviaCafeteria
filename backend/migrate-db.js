const { Client } = require('pg');
require('dotenv').config();

async function migrateDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'olivia_admin',
    password: process.env.DB_PASSWORD || 'cafeolivia',
    database: process.env.DB_DATABASE || 'OliviaCafeteria',
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // 1. Agregar columnas de cupos a precios_config
    console.log('📝 Agregando columnas de cupos a precios_config...');
    await client.query('ALTER TABLE precios_config ADD COLUMN IF NOT EXISTS "cuposMeriendasLibres" integer DEFAULT 40');
    await client.query('ALTER TABLE precios_config ADD COLUMN IF NOT EXISTS "cuposTardesDeTe" integer DEFAULT 65');
    console.log('✅ Columnas de cupos agregadas a precios_config');

    // 2. Agregar la nueva columna turnos a fechas_config
    console.log('📝 Agregando columna turnos a fechas_config...');
    await client.query('ALTER TABLE fechas_config ADD COLUMN IF NOT EXISTS turnos jsonb');
    console.log('✅ Columna turnos agregada');

    // 3. Migrar datos existentes de fechas_config
    console.log('🔄 Migrando datos existentes de fechas_config...');
    
    // Verificar si las columnas antiguas existen
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'fechas_config' 
      AND column_name IN ('turnosDisponibles', 'cupos')
    `);
    
    const existingColumns = columnCheck.rows.map(row => row.column_name);
    
    if (existingColumns.length > 0) {
      const fechas = await client.query(`SELECT id, ${existingColumns.includes('turnosDisponibles') ? '"turnosDisponibles"' : 'NULL as "turnosDisponibles"'} FROM fechas_config`);
      
      for (const fecha of fechas.rows) {
        let turnos = [];
        
        if (fecha.turnosDisponibles) {
          if (Array.isArray(fecha.turnosDisponibles)) {
            // Si ya es un array de strings
            turnos = fecha.turnosDisponibles;
          } else if (typeof fecha.turnosDisponibles === 'object') {
            // Si es un objeto con mañana/tarde
            for (const key of Object.keys(fecha.turnosDisponibles)) {
              const turno = fecha.turnosDisponibles[key];
              if (turno && turno.horario && typeof turno.horario === 'string') {
                const partes = turno.horario.split(/y|Y/).map(s => s.trim()).filter(Boolean);
                turnos.push(...partes);
              }
            }
          } else if (typeof fecha.turnosDisponibles === 'string') {
            // Si es un string
            turnos = fecha.turnosDisponibles.split(/y|Y/).map(s => s.trim()).filter(Boolean);
          }
        }
        
        // Actualizar el registro con los nuevos turnos
        await client.query(
          'UPDATE fechas_config SET turnos = $1 WHERE id = $2',
          [JSON.stringify(turnos), fecha.id]
        );
      }
      console.log('✅ Datos migrados');
      
      // 4. Eliminar las columnas antiguas de fechas_config
      console.log('🗑️ Eliminando columnas antiguas de fechas_config...');
      if (existingColumns.includes('turnosDisponibles')) {
        await client.query('ALTER TABLE fechas_config DROP COLUMN IF EXISTS "turnosDisponibles"');
      }
      if (existingColumns.includes('cupos')) {
        await client.query('ALTER TABLE fechas_config DROP COLUMN IF EXISTS "cupos"');
      }
      console.log('✅ Columnas antiguas eliminadas');
    } else {
      console.log('✅ No hay columnas antiguas para migrar');
    }

    console.log('🎉 Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

migrateDatabase(); 