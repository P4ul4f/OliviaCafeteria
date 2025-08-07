"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = checkDatabaseConnection;
const data_source_1 = require("./data-source");
async function checkDatabaseConnection() {
    try {
        console.log('🔍 Checking database connection...');
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        await data_source_1.AppDataSource.query('SELECT 1');
        console.log('✅ Database connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
    finally {
        if (data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.destroy();
        }
    }
}
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
//# sourceMappingURL=check-connection.js.map