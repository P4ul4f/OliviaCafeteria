"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_simple_1 = require("./app.module-simple");
async function bootstrap() {
    try {
        console.log('🚀 Starting simple NestJS app...');
        console.log('📊 Environment:', process.env.NODE_ENV || 'development');
        console.log('🔧 Port from env:', process.env.PORT);
        const app = await core_1.NestFactory.create(app_module_simple_1.AppModuleSimple);
        console.log('✅ NestJS app created successfully');
        app.enableCors();
        console.log('✅ CORS configured');
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
//# sourceMappingURL=main-simple.js.map