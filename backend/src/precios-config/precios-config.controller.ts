import { Controller, Get, Patch, Body } from '@nestjs/common';
import { PreciosConfigService } from './precios-config.service';

@Controller('precios-config')
export class PreciosConfigController {
  constructor(private readonly preciosConfigService: PreciosConfigService) {}

  @Get()
  getAllConfig() {
    return this.preciosConfigService.getAllConfig();
  }

  @Get('merienda-libre')
  getMeriendaLibrePrice(): Promise<number> {
    return this.preciosConfigService.getMeriendaLibrePrice();
  }

  @Get('merienda-libre/cupos')
  async getCuposMeriendasLibres(): Promise<number> {
    return this.preciosConfigService.getCuposMeriendasLibres();
  }

  @Patch('merienda-libre')
  updateMeriendaLibrePrice(@Body('precio') precio: number) {
    return this.preciosConfigService.updateMeriendaLibrePrice(precio);
  }

  @Patch('merienda-libre/cupos')
  async updateCuposMeriendasLibres(@Body('cupos') cupos: number): Promise<any> {
    return this.preciosConfigService.updateCuposMeriendasLibres(cupos);
  }

  @Get('tarde-te/precio-promo-olivia')
  async getPrecioPromoOlivia(): Promise<number> {
    return this.preciosConfigService.getPrecioPromoOlivia();
  }

  @Patch('tarde-te/precio-promo-olivia')
  async updatePrecioPromoOlivia(@Body('precio') precio: number): Promise<any> {
    return this.preciosConfigService.updatePrecioPromoOlivia(precio);
  }

  @Get('tarde-te/precio-promo-basica')
  async getPrecioPromoBasica(): Promise<number> {
    return this.preciosConfigService.getPrecioPromoBasica();
  }

  @Patch('tarde-te/precio-promo-basica')
  async updatePrecioPromoBasica(@Body('precio') precio: number): Promise<any> {
    return this.preciosConfigService.updatePrecioPromoBasica(precio);
  }

  @Get('tarde-te/cupos')
  async getCuposTardesDeTe(): Promise<number> {
    return this.preciosConfigService.getCuposTardesDeTe();
  }

  @Patch('tarde-te/cupos')
  async updateCuposTardesDeTe(@Body('cupos') cupos: number): Promise<any> {
    return this.preciosConfigService.updateCuposTardesDeTe(cupos);
  }

  @Get('a-la-carta/precio')
  async getPrecioALaCarta(): Promise<number> {
    return this.preciosConfigService.getPrecioALaCarta();
  }

  @Patch('a-la-carta/precio')
  async updatePrecioALaCarta(@Body('precio') precio: number): Promise<any> {
    return this.preciosConfigService.updatePrecioALaCarta(precio);
  }

  @Get('tarde-te/precio')
  async getPrecioTardeDeTe(): Promise<number> {
    return this.preciosConfigService.getPrecioTardeDeTe();
  }

  @Patch('tarde-te/precio')
  async updatePrecioTardeDeTe(@Body('precio') precio: number): Promise<any> {
    return this.preciosConfigService.updatePrecioTardeDeTe(precio);
  }
} 