import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorService } from './administrador.service';
import { AdministradorController } from './administrador.controller';
import { Administrador } from './administrador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Administrador])],
  controllers: [AdministradorController],
  providers: [AdministradorService],
  exports: [AdministradorService],
})
export class AdministradorModule {} 