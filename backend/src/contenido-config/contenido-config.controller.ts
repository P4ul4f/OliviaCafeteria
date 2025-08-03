import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ContenidoConfigService } from './contenido-config.service';
import { CreateContenidoConfigDto, UpdateContenidoConfigDto } from './dto/create-contenido-config.dto';

@Controller('contenido-config')
export class ContenidoConfigController {
  constructor(private readonly contenidoConfigService: ContenidoConfigService) {
    console.log('ContenidoConfigController initialized');
  }

  @Post()
  async create(@Body() dto: CreateContenidoConfigDto) {
    return this.contenidoConfigService.create(dto);
  }

  @Get()
  async findAll() {
    console.log('GET /contenido-config called');
    return { message: 'ContenidoConfig controller is working' };
  }

  // Endpoints específicos para cada tipo de contenido (DEBEN IR ANTES DE LAS RUTAS GENÉRICAS)
  @Get('meriendas-libres/contenido')
  async getMeriendasLibresContenido() {
    return this.contenidoConfigService.getMeriendasLibresContenido();
  }

  @Patch('meriendas-libres/contenido')
  async updateMeriendasLibresContenido(@Body() contenido: any) {
    return this.contenidoConfigService.updateMeriendasLibresContenido(contenido);
  }

  @Get('tardes-te/promo-olivia/contenido')
  async getTardesTePromoOliviaContenido() {
    return this.contenidoConfigService.getTardesTePromoOliviaContenido();
  }

  @Patch('tardes-te/promo-olivia/contenido')
  async updateTardesTePromoOliviaContenido(@Body() contenido: any) {
    return this.contenidoConfigService.updateTardesTePromoOliviaContenido(contenido);
  }

  @Get('tardes-te/promo-basica/contenido')
  async getTardesTePromoBasicaContenido() {
    return this.contenidoConfigService.getTardesTePromoBasicaContenido();
  }

  @Patch('tardes-te/promo-basica/contenido')
  async updateTardesTePromoBasicaContenido(@Body() contenido: any) {
    return this.contenidoConfigService.updateTardesTePromoBasicaContenido(contenido);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contenidoConfigService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateContenidoConfigDto) {
    return this.contenidoConfigService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contenidoConfigService.remove(+id);
  }
} 