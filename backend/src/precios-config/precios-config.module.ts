import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreciosConfig } from './precios-config.entity';
import { PreciosConfigService } from './precios-config.service';
import { PreciosConfigController } from './precios-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PreciosConfig])],
  providers: [PreciosConfigService],
  controllers: [PreciosConfigController],
  exports: [PreciosConfigService],
})
export class PreciosConfigModule {} 