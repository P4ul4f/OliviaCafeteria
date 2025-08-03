import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FechasConfig } from './fechas-config.entity';
import { FechasConfigService } from './fechas-config.service';
import { FechasConfigController } from './fechas-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FechasConfig])],
  providers: [FechasConfigService],
  controllers: [FechasConfigController],
  exports: [FechasConfigService],
})
export class FechasConfigModule {} 