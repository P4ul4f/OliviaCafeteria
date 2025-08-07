import { DataSource } from 'typeorm';
export declare class DatabaseInitializer {
    private dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    initialize(): Promise<void>;
    private markMissingMigrationsAsExecuted;
    private createInitialTables;
    private insertInitialData;
}
