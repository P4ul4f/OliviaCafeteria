"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const init_database_1 = require("./database/init-database");
async function bootstrap() {
    try {
        console.log('🚀 Starting Olivia Backend...');
        console.log('📊 Environment:', process.env.NODE_ENV || 'development');
        console.log('🔧 Port from env:', process.env.PORT);
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('✅ NestJS app created successfully');
        console.log('🔍 Initializing database with DatabaseInitializer...');
        try {
            const dataSource = app.get('DataSource');
            const dbInitializer = new init_database_1.DatabaseInitializer(dataSource);
            const timeout = setTimeout(() => {
                console.log('⚠️ Database initialization timeout, continuing...');
            }, 30000);
            await dbInitializer.initialize();
            clearTimeout(timeout);
            console.log('✅ Database initialized successfully with DatabaseInitializer');
        }
        catch (error) {
            console.log('⚠️ Database initialization failed, but continuing...');
            console.log('⚠️ Error:', error.message);
        }
        app.enableCors({
            origin: [
                'https://olivia-cafeteria.vercel.app',
                'https://olivia-cafeteria-git-main-paulaferreyra.vercel.app',
                'https://olivia-cafeteria-git-main-p4ul4fs-projects.vercel.app',
                'https://olivia-cafeteria-nxsxfbmd9-p4ul4fs-projects.vercel.app',
                'http://localhost:3000',
                'http://localhost:3001',
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        });
        console.log('✅ CORS configured for Vercel domains');
        const port = process.env.PORT || 3001;
        console.log('🎯 Attempting to listen on port:', port);
        await app.listen(port, '0.0.0.0');
        console.log(`✅ Backend running on port ${port}`);
        console.log(`🔗 Healthcheck URL: http://0.0.0.0:${port}/health`);
        console.log('🎉 Application started successfully!');
    }
    catch (error) {
        console.error('❌ Failed to start application:', error);
        console.error('❌ Error stack:', error.stack);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map