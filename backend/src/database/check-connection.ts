import { AppDataSource } from './data-source';

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔍 Checking database connection...');
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Verificar que podemos hacer una consulta simple
    await AppDataSource.query('SELECT 1');
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  checkDatabaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Error checking database connection:', error);
      process.exit(1);
    });
} 