export declare const mercadopagoConfig: {
    accessToken: string | undefined;
    publicKey: string | undefined;
    successUrl: string;
    failureUrl: string;
    pendingUrl: string;
    webhookUrl: string;
    isProduction: boolean;
    isConfigured(): boolean;
    getSdkConfig(): {
        accessToken: any;
        options: {
            timeout: number;
            idempotencyKey: string;
        };
    };
};
