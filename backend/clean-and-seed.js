const { Pool } = require('pg');
require('dotenv').config();

async function cleanAndSeed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    
    // Limpiar datos existentes
    const deleteResult = await client.query('DELETE FROM fechas_config');
    
    // Crear nuevas fechas con la nueva estructura
    const fechas = [];
    const hoy = new Date();
    
    // Crear fechas para los próximos 30 días
    for (let i = 0; i < 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      
      const fechaData = {
        fecha: fecha,
        turnos: [
          { tipo: 'mañana', horario: '9:00 - 13:00', cupos: 20 },
          { tipo: 'tarde', horario: '17:00 - 20:30', cupos: 20 }
        ],
        activo: true,
        tipoReserva: 'merienda-libre'
      };
      
      const result = await client.query(`
        INSERT INTO fechas_config (fecha, turnos, activo, "tipoReserva") 
        VALUES ($1, $2, $3, $4) 
        RETURNING id
      `, [fechaData.fecha, JSON.stringify(fechaData.turnos), fechaData.activo, fechaData.tipoReserva]);
      
      fechas.push(result.rows[0].id);
    }
    
    // Verificar datos creados
    const checkResult = await client.query('SELECT COUNT(*) as count FROM fechas_config');
    
    client.release();
  } catch (error) {
    console.error('Error durante la limpieza y seed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

cleanAndSeed().catch(console.error); 