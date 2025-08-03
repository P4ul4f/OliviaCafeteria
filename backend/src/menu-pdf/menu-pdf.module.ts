import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuPdf } from './menu-pdf.entity';
import { MenuPdfController } from './menu-pdf.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuPdf])],
  controllers: [MenuPdfController],
})
export class MenuPdfModule {} 