import { PreciosConfigService } from './precios-config.service';
export declare class PreciosConfigController {
    private readonly preciosConfigService;
    constructor(preciosConfigService: PreciosConfigService);
    getAllConfig(): Promise<import("./precios-config.entity").PreciosConfig>;
    getMeriendaLibrePrice(): Promise<number>;
    getCuposMeriendasLibres(): Promise<number>;
    updateMeriendaLibrePrice(precio: number): Promise<import("./precios-config.entity").PreciosConfig>;
    updateCuposMeriendasLibres(cupos: number): Promise<any>;
    getPrecioPromoOlivia(): Promise<number>;
    updatePrecioPromoOlivia(precio: number): Promise<any>;
    getPrecioPromoBasica(): Promise<number>;
    updatePrecioPromoBasica(precio: number): Promise<any>;
    getCuposTardesDeTe(): Promise<number>;
    updateCuposTardesDeTe(cupos: number): Promise<any>;
    getPrecioALaCarta(): Promise<number>;
    updatePrecioALaCarta(precio: number): Promise<any>;
    getPrecioTardeDeTe(): Promise<number>;
    updatePrecioTardeDeTe(precio: number): Promise<any>;
}
