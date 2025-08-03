const { Client } = require('pg');
require('dotenv').config();

async function cleanAndSeed() {
  console.log('🚀 Iniciando script de limpieza y seed...');
  
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'olivia_admin',
    password: process.env.DB_PASSWORD || 'cafeolivia',
    database: process.env.DB_DATABASE || 'OliviaCafeteria',
  });

  try {
    console.log('🔌 Intentando conectar a la base de datos...');
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Limpiar datos existentes
    console.log('🗑️ Limpiando datos existentes...');
    const deleteResult = await client.query('DELETE FROM fechas_config');
    console.log(`✅ Datos eliminados: ${deleteResult.rowCount} filas`);

    // Crear nuevas fechas con la estructura correcta
    console.log('🌱 Creando nuevas fechas...');
    const fechasMeriendas = [
      { fecha: new Date(2025, 7, 8), activa: true },
      { fecha: new Date(2025, 7, 9), activa: true },
      { fecha: new Date(2025, 7, 15), activa: true },
      { fecha: new Date(2025, 7, 16), activa: true },
      { fecha: new Date(2025, 7, 29), activa: true },
      { fecha: new Date(2025, 7, 30), activa: true },
    ];

    for (let i = 0; i < fechasMeriendas.length; i++) {
      const fechaData = fechasMeriendas[i];
      const turnos = ['16:30-18:30', '19:00-21:00'];
      
      console.log(`📅 Creando fecha ${i + 1}: ${fechaData.fecha.toISOString()}`);
      const result = await client.query(
        'INSERT INTO fechas_config (fecha, turnos, activa, observaciones) VALUES ($1, $2, $3, $4) RETURNING id',
        [fechaData.fecha, JSON.stringify(turnos), fechaData.activa, 'Fecha de merienda libre programada']
      );
      console.log(`✅ Fecha creada con ID: ${result.rows[0].id}`);
    }
    console.log('✅ Todas las fechas creadas con la nueva estructura');

    // Verificar que se crearon
    console.log('🔍 Verificando datos creados...');
    const checkResult = await client.query('SELECT COUNT(*) as count FROM fechas_config');
    console.log(`📊 Total de fechas en la base: ${checkResult.rows[0].count}`);

    console.log('🎉 Proceso completado exitosamente');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

cleanAndSeed(); 