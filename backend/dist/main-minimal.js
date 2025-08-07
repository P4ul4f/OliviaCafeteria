"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        console.log('🚀 Starting minimal NestJS app...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('✅ NestJS app created');
        const port = process.env.PORT || 3001;
        console.log('🎯 Listening on port:', port);
        await app.listen(port, '0.0.0.0');
        console.log('✅ App listening successfully');
    }
    catch (error) {
        console.error('❌ Error starting app:', error.message);
        console.error('❌ Stack:', error.stack);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main-minimal.js.map