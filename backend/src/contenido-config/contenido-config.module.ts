import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContenidoConfigService } from './contenido-config.service';
import { ContenidoConfigController } from './contenido-config.controller';
import { ContenidoConfig } from './contenido-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContenidoConfig])],
  controllers: [ContenidoConfigController],
  providers: [ContenidoConfigService],
  exports: [ContenidoConfigService],
})
export class ContenidoConfigModule {} 