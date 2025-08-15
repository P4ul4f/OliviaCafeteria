// Script de prueba para verificar el manejo de fechas
// Ejecutar con: node test-fecha.js

console.log('🧪 Probando manejo de fechas...\n');

// Simular la función formatDateForBackend del frontend (CORREGIDA)
function formatDateForBackend(date) {
  // Usar toISOString() y extraer solo la parte de la fecha para evitar problemas de timezone
  const fechaISO = date.toISOString();
  const fechaPart = fechaISO.split('T')[0]; // Obtener solo YYYY-MM-DD
  
  console.log('🔍 formatDateForBackend debug:', {
    fechaEntrada: date,
    fechaEntradaISO: date.toISOString(),
    fechaEntradaLocal: date.toLocaleDateString('es-ES'),
    fechaPart,
    resultado: fechaPart
  });
  
  return fechaPart;
}

// Simular la función parseDateFromBackend del frontend
function parseDateFromBackend(dateString) {
  if (!dateString) return new Date();
  
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

// Simular el backend
function processDateInBackend(dateString) {
  let fechaNormalizada;
  
  if (typeof dateString === 'string') {
    const [year, month, day] = dateString.split('-').map(Number);
    fechaNormalizada = new Date(year, month - 1, day, 12, 0, 0, 0);
  } else {
    fechaNormalizada = new Date(dateString);
    fechaNormalizada.setHours(12, 0, 0, 0);
  }
  
  return fechaNormalizada;
}

// Casos de prueba
const testCases = [
  new Date('2024-01-15'), // Fecha específica
  new Date('2024-12-31'), // Fin de año
  new Date('2024-02-29'), // Año bisiesto
  new Date() // Hoy
];

console.log('📅 Casos de prueba:');
testCases.forEach((testDate, index) => {
  console.log(`\n--- Caso ${index + 1} ---`);
  console.log(`Fecha original: ${testDate.toDateString()}`);
  console.log(`Fecha ISO: ${testDate.toISOString()}`);
  
  // Frontend: formatear para backend
  const formattedDate = formatDateForBackend(testDate);
  console.log(`Frontend → Backend: ${formattedDate}`);
  
  // Backend: procesar fecha
  const processedDate = processDateInBackend(formattedDate);
  console.log(`Backend procesado: ${processedDate.toDateString()}`);
  
  // Frontend: parsear desde backend
  const parsedDate = parseDateFromBackend(formattedDate);
  console.log(`Frontend ← Backend: ${parsedDate.toDateString()}`);
  
  // Verificar que la fecha no cambió
  const originalDateOnly = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate());
  const processedDateOnly = new Date(processedDate.getFullYear(), processedDate.getMonth(), processedDate.getDate());
  
  console.log(`¿Fechas iguales? ${originalDateOnly.getTime() === processedDateOnly.getTime() ? '✅ SÍ' : '❌ NO'}`);
});

console.log('\n🎯 Prueba completada!');
