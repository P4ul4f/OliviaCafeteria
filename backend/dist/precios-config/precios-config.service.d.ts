import { Repository } from 'typeorm';
import { PreciosConfig } from './precios-config.entity';
export declare class PreciosConfigService {
    private readonly preciosConfigRepo;
    constructor(preciosConfigRepo: Repository<PreciosConfig>);
    getMeriendaLibrePrice(): Promise<number>;
    getAllConfig(): Promise<PreciosConfig>;
    getCuposMeriendasLibres(): Promise<number>;
    updateCuposMeriendasLibres(cupos: number): Promise<any>;
    updateMeriendaLibrePrice(newPrice: number): Promise<PreciosConfig>;
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
