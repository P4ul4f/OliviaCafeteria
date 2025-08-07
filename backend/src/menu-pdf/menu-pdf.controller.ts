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
    // Crear directorio uploads-files si no existe
    const uploadsDir = path.join(process.cwd(), 'uploads-files');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadsDir = path.join(process.cwd(), 'uploads-files');
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

    console.log('📤 Iniciando upload de PDF:', file.originalname);
    console.log('📁 Archivo recibido:', file);

    try {
      // Verificar si la columna contenidoArchivo existe
      try {
        await this.menuPdfRepo.query('SELECT "contenidoArchivo" FROM "menu_pdf" LIMIT 1');
      } catch (columnError) {
        console.log('⚠️ Columna contenidoArchivo no existe, agregando...');
        await this.menuPdfRepo.query('ALTER TABLE "menu_pdf" ADD COLUMN "contenidoArchivo" bytea');
        console.log('✅ Columna contenidoArchivo agregada');
      }

      // Leer el contenido del archivo como Buffer
      const fileContent = fs.readFileSync(file.path);
      console.log('📄 Contenido del archivo leído:', fileContent.length, 'bytes');

      // Buscar si ya existe una entrada para carta_principal
      let pdf = await this.menuPdfRepo.findOne({ 
        where: { clave: 'carta_principal' } 
      });

      if (pdf) {
        // Actualizar la entrada existente
        console.log('🔄 Actualizando PDF existente en la base de datos');
        pdf.nombreArchivo = file.filename;
        pdf.rutaArchivo = `/uploads-files/${file.filename}`;
        pdf.tamanoArchivo = file.size;
        pdf.descripcion = 'Carta principal del café';
        pdf.activo = true;
        pdf.contenidoArchivo = fileContent; // Guardar el contenido en la BD
        await this.menuPdfRepo.save(pdf);
        console.log('✅ PDF actualizado en la base de datos con contenido');
      } else {
        // Crear nueva entrada si no existe
        console.log('🆕 Creando nueva entrada de PDF en la base de datos');
        pdf = this.menuPdfRepo.create({
          clave: 'carta_principal',
          nombreArchivo: file.filename,
          rutaArchivo: `/uploads-files/${file.filename}`,
          tamanoArchivo: file.size,
          descripcion: 'Carta principal del café',
          activo: true,
          contenidoArchivo: fileContent, // Guardar el contenido en la BD
        });
        await this.menuPdfRepo.save(pdf);
        console.log('✅ PDF guardado en la base de datos con contenido');
      }

      // Limpiar el archivo temporal
      fs.unlinkSync(file.path);
      console.log('🗑️ Archivo temporal eliminado');
      
      return { success: true, message: 'PDF subido correctamente', pdf };
    } catch (error) {
      console.error('❌ Error en uploadPdf:', error);
      // Limpiar archivo temporal si existe
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log('🗑️ Archivo temporal eliminado debido al error');
      }
      throw error;
    }
  }

  @Get()
  async getPdfInfo() {
    const pdf = await this.menuPdfRepo.findOne({ where: { clave: 'carta_principal', activo: true } });
    return pdf || {};
  }

  @Get('download')
  async downloadPdf(@Res() res: Response) {
    try {
      // Verificar si la columna contenidoArchivo existe
      try {
        await this.menuPdfRepo.query('SELECT "contenidoArchivo" FROM "menu_pdf" LIMIT 1');
      } catch (columnError) {
        console.log('⚠️ Columna contenidoArchivo no existe, agregando...');
        await this.menuPdfRepo.query('ALTER TABLE "menu_pdf" ADD COLUMN "contenidoArchivo" bytea');
        console.log('✅ Columna contenidoArchivo agregada');
      }

      // Limpiar entradas duplicadas (mantener solo la más reciente)
      const allPdfs = await this.menuPdfRepo.find({ 
        where: { clave: 'carta_principal' },
        order: { fechaCreacion: 'DESC' }
      });
      
      if (allPdfs.length > 1) {
        console.log(`🧹 Limpiando ${allPdfs.length - 1} entradas duplicadas`);
        // Desactivar todas las entradas excepto la más reciente
        for (let i = 1; i < allPdfs.length; i++) {
          await this.menuPdfRepo.update({ id: allPdfs[i].id }, { activo: false });
        }
      }

      const pdf = await this.menuPdfRepo.findOne({ where: { clave: 'carta_principal', activo: true } });
      if (!pdf) {
        console.log('❌ No hay PDF activo en la base de datos');
        return res.status(404).json({ message: 'No hay carta PDF disponible' });
      }
      
      console.log('📄 PDF encontrado en BD:', pdf);
      
      // Verificar si el PDF tiene contenido almacenado en la BD
      if (!pdf.contenidoArchivo) {
        console.log('❌ PDF no tiene contenido almacenado en la BD');
        return res.status(404).json({ message: 'PDF sin contenido disponible' });
      }
      
      console.log('✅ PDF con contenido encontrado, enviando desde BD...');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${pdf.nombreArchivo}"`);
      res.setHeader('Content-Length', pdf.contenidoArchivo.length.toString());
      
      // Enviar el contenido directamente desde la base de datos
      res.send(pdf.contenidoArchivo);
    } catch (error) {
      console.error('❌ Error en downloadPdf:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
} 