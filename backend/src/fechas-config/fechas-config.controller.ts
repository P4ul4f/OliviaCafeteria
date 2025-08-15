import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FechasConfigService } from './fechas-config.service';
import { FechasConfig } from './fechas-config.entity';
import { CreateFechasConfigDto } from './dto/create-fechas-config.dto';

@Controller('fechas-config')
export class FechasConfigController {
  constructor(private readonly fechasConfigService: FechasConfigService) {}

  @Get()
  findAll(): Promise<FechasConfig[]> {
    return this.fechasConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FechasConfig> {
    return this.fechasConfigService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateFechasConfigDto): Promise<FechasConfig> {
    return this.fechasConfigService.create(data);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreateFechasConfigDto>): Promise<FechasConfig> {
    return this.fechasConfigService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.fechasConfigService.remove(id);
  }
} 