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
      // Obtener el PDF anterior activo
      const pdfAnterior = await this.menuPdfRepo.findOne({ 
        where: { clave: 'carta_principal', activo: true } 
      });

      console.log('📄 PDF anterior encontrado:', pdfAnterior);

      // Eliminar el archivo anterior si existe
      if (pdfAnterior) {
        const filePathAnterior = path.join(process.cwd(), pdfAnterior.rutaArchivo);
        console.log('🗑️ Intentando eliminar archivo anterior:', filePathAnterior);
        if (fs.existsSync(filePathAnterior)) {
          fs.unlinkSync(filePathAnterior);
          console.log('✅ Archivo anterior eliminado');
        } else {
          console.log('⚠️ Archivo anterior no encontrado para eliminar');
        }
        // Desactivar el registro anterior
        await this.menuPdfRepo.update({ activo: true }, { activo: false });
        console.log('✅ Registro anterior desactivado');
      }

      // Verificar que el archivo se guardó correctamente
      const uploadsDir = path.join(process.cwd(), 'uploads-files');
      const filePath = path.join(uploadsDir, file.filename);
      console.log('📂 Verificando archivo guardado:', filePath);
      
      if (fs.existsSync(filePath)) {
        console.log('✅ Archivo guardado correctamente en el sistema de archivos');
        const stats = fs.statSync(filePath);
        console.log('📊 Tamaño del archivo:', stats.size, 'bytes');
      } else {
        console.log('❌ ERROR: Archivo no encontrado después de guardar');
      }

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
        await this.menuPdfRepo.save(pdf);
        console.log('✅ PDF actualizado en la base de datos:', pdf);
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
        });
        await this.menuPdfRepo.save(pdf);
        console.log('✅ PDF guardado en la base de datos:', pdf);
      }
      
      return { success: true, message: 'PDF subido correctamente', pdf };
    } catch (error) {
      console.error('❌ Error en uploadPdf:', error);
      // Si hay error, intentar eliminar el archivo subido
      const filePath = path.join(process.cwd(), 'uploads-files', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Archivo eliminado debido al error');
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
      const filePath = path.join(process.cwd(), pdf.rutaArchivo);
      console.log('📁 Ruta del archivo:', filePath);
      
      if (!fs.existsSync(filePath)) {
        console.log('❌ Archivo no existe en el sistema de archivos');
        console.log('📂 Contenido del directorio uploads-files:');
        const uploadsDir = path.join(process.cwd(), 'uploads-files');
        if (fs.existsSync(uploadsDir)) {
          const files = fs.readdirSync(uploadsDir);
          console.log('📋 Archivos encontrados:', files);
        } else {
          console.log('❌ Directorio uploads-files no existe');
        }
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }
      
      console.log('✅ Archivo encontrado, enviando...');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${pdf.nombreArchivo}"`);
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error('❌ Error en downloadPdf:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
} 