import { Controller, Post, UseInterceptors, UploadedFile, Get, Res, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuPdf } from './menu-pdf.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('menu-pdf')
export class MenuPdfController {
  constructor(
    @InjectRepository(MenuPdf)
    private menuPdfRepo: Repository<MenuPdf>,
  ) {
    // Crear directorio uploads si no existe
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        cb(null, `carta-olivia${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Solo se permiten archivos PDF'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async uploadPdf(@UploadedFile() file: any) {
    if (!file) {
      return { success: false, message: 'No se subió ningún archivo' };
    }
    // Desactivar el PDF anterior
    await this.menuPdfRepo.update({ activo: true }, { activo: false });
    // Guardar el nuevo PDF
    const pdf = this.menuPdfRepo.create({
      clave: 'carta_principal',
      nombreArchivo: file.filename,
      rutaArchivo: `/uploads/${file.filename}`,
      tamanoArchivo: file.size,
      descripcion: 'Carta principal del café',
      activo: true,
    });
    await this.menuPdfRepo.save(pdf);
    return { success: true, message: 'PDF subido correctamente', pdf };
  }

  @Get()
  async getPdfInfo() {
    const pdf = await this.menuPdfRepo.findOne({ where: { clave: 'carta_principal', activo: true } });
    return pdf || {};
  }

  @Get('download')
  async downloadPdf(@Res() res: Response) {
    const pdf = await this.menuPdfRepo.findOne({ where: { clave: 'carta_principal', activo: true } });
    if (!pdf) {
      return res.status(404).json({ message: 'No hay carta PDF disponible' });
    }
    const filePath = path.join(process.cwd(), pdf.rutaArchivo);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdf.nombreArchivo}"`);
    fs.createReadStream(filePath).pipe(res);
  }
} 