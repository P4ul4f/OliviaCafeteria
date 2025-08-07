import { Repository } from 'typeorm';
import { MenuPdf } from './menu-pdf.entity';
import { Response } from 'express';
export declare class MenuPdfController {
    private menuPdfRepo;
    constructor(menuPdfRepo: Repository<MenuPdf>);
    uploadPdf(file: any): Promise<{
        success: boolean;
        message: string;
        pdf?: undefined;
    } | {
        success: boolean;
        message: string;
        pdf: MenuPdf;
    }>;
    getPdfInfo(): Promise<{}>;
    downloadPdf(res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
