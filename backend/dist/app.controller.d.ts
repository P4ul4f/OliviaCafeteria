import { AppService } from './app.service';
import { DataSource } from 'typeorm';
export declare class AppController {
    private readonly appService;
    private dataSource;
    constructor(appService: AppService, dataSource: DataSource);
    getHello(): string;
    getHealth(): string;
    getDatabaseStatus(): Promise<{
        status: string;
        isConnected: boolean;
        database: string | undefined;
        tables: any;
        migrations: any;
        tableCount: any;
        migrationCount: any;
        message?: undefined;
    } | {
        status: string;
        message: any;
        isConnected: boolean;
        database?: undefined;
        tables?: undefined;
        migrations?: undefined;
        tableCount?: undefined;
        migrationCount?: undefined;
    }>;
}
