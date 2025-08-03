import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  // === RUTAS PÚBLICAS ===

  @Get('site-config')
  async getPublicConfig() {
    const config = await this.siteConfigService.getMainConfig();
    return {
      telefono: config.telefono,
      direccion: config.direccion,
      email: config.email,
      horarios: config.horarios
    };
  }

  @Get('horarios')
  async getHorarios() {
    return this.siteConfigService.getHorarios();
  }

  @Get('contacto')
  async getContacto() {
    return this.siteConfigService.getContactInfo();
  }

  // === RUTAS DE ADMINISTRACIÓN ===

  @UseGuards(JwtAuthGuard)
  @Get('admin/site-config')
  async getAdminConfig() {
    return this.siteConfigService.getMainConfig();
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/site-config')
  async updateConfig(@Body() updateDto: UpdateSiteConfigDto) {
    const updatedConfig = await this.siteConfigService.updateMainConfig(updateDto);
    return {
      message: 'Configuración actualizada exitosamente',
      data: updatedConfig
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/horarios')
  async updateHorarios(@Body() horarios: any) {
    const updateDto: UpdateSiteConfigDto = { horarios };
    const updatedConfig = await this.siteConfigService.updateMainConfig(updateDto);
    return {
      message: 'Horarios actualizados exitosamente',
      data: updatedConfig.horarios
    };
  }
} 