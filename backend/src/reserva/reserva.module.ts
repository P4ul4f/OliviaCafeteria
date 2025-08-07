import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './reserva.entity';
import { FechasConfig } from '../fechas-config/fechas-config.entity';
import { PreciosConfigModule } from '../precios-config/precios-config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, FechasConfig]), PreciosConfigModule],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService], // Exportar para uso en otros módulos
})
export class ReservaModule {} 