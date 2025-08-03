import { DataSource } from 'typeorm';
import { SiteConfig } from '../../site-config/site-config.entity';
import { PreciosConfig } from '../../precios-config/precios-config.entity';
import { Administrador } from '../../administrador/administrador.entity';
import { FechasConfig } from '../../fechas-config/fechas-config.entity';
import { MenuPdf } from '../../menu-pdf/menu-pdf.entity';

export async function seedInitialData(dataSource: DataSource) {
  console.log('🌱 Iniciando seed de datos iniciales...');

  // 1. Configuración del sitio
  const siteConfigRepo = dataSource.getRepository(SiteConfig);
  const existingSiteConfig = await siteConfigRepo.findOne({ where: { clave: 'info_general' } });
  
  if (!existingSiteConfig) {
    const siteConfig = siteConfigRepo.create({
      clave: 'info_general',
      telefono: '2617148842',
      direccion: 'Avenida Godoy Cruz 506, Mendoza',
      email: 'info@oliviacafe.com',
      horarios: {
        lunes: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
        martes: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
        miercoles: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
        jueves: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
        viernes: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
        sabado: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
        domingo: { abierto: false, manana: '', noche: '' }
      }
    });
    await siteConfigRepo.save(siteConfig);
    console.log('✅ Configuración del sitio creada');
  } else {
    // Si ya existe, actualizar los datos
    existingSiteConfig.direccion = 'Avenida Godoy Cruz 506, Mendoza';
    existingSiteConfig.horarios = {
      lunes: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
      martes: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
      miercoles: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
      jueves: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
      viernes: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
      sabado: { abierto: true, manana: '9:00 - 13:00', noche: '17:00 - 20:30' },
      domingo: { abierto: false, manana: '', noche: '' }
    };
    await siteConfigRepo.save(existingSiteConfig);
    console.log('✅ Configuración del sitio actualizada');
  }

  // 2. Configuración de precios
  const preciosConfigRepo = dataSource.getRepository(PreciosConfig);
  const existingPreciosConfig = await preciosConfigRepo.findOne({ where: { clave: 'precios_principales' } });
  
  if (!existingPreciosConfig) {
    const preciosConfig = preciosConfigRepo.create({
      clave: 'precios_principales',
      promoOlivia: 18500,
      promoBasica: 15600,
      meriendaLibre: 17500,
      descripcionPromoOlivia: 'Promo completa con selección premium',
      descripcionPromoBasica: 'Promo esencial con lo mejor de nuestra carta',
      cuposMeriendasLibres: 40,
      cuposTardesDeTe: 65
    });
    await preciosConfigRepo.save(preciosConfig);
    console.log('✅ Configuración de precios creada');
  } else {
    // Actualizar cupos si no existen
    if (!existingPreciosConfig.cuposMeriendasLibres) {
      existingPreciosConfig.cuposMeriendasLibres = 40;
    }
    if (!existingPreciosConfig.cuposTardesDeTe) {
      existingPreciosConfig.cuposTardesDeTe = 65;
    }
    await preciosConfigRepo.save(existingPreciosConfig);
    console.log('✅ Configuración de precios actualizada');
  }

  // 3. Administrador por defecto
  const administradorRepo = dataSource.getRepository(Administrador);
  
  const existingAdmin = await administradorRepo.findOne({ where: { usuario: 'admin' } });
  
  if (!existingAdmin) {
    const bcrypt = require('bcrypt');
    const defaultPassword = 'admin123';
    const contrasenaHash = await bcrypt.hash(defaultPassword, 12);
    
    const administrador = administradorRepo.create({
      usuario: 'admin',
      contrasena: contrasenaHash
    });
    await administradorRepo.save(administrador);
    console.log('✅ Administrador por defecto creado');
    console.log(`👤 Usuario: admin`);
    console.log(`🔒 Contraseña: ${defaultPassword}`);
    console.log(`⚠️ IMPORTANTE: Cambia la contraseña después del primer login`);
  }

  // 4. Fechas de meriendas libres (datos actuales del frontend)
  const fechasConfigRepo = dataSource.getRepository(FechasConfig);
  const fechasExistentes = await fechasConfigRepo.count();
  
  if (fechasExistentes === 0) {
    const fechasMeriendas = [
      { fecha: new Date(2025, 7, 8), activa: true },  // 8 de Agosto
      { fecha: new Date(2025, 7, 9), activa: true },  // 9 de Agosto
      { fecha: new Date(2025, 7, 15), activa: true }, // 15 de Agosto
      { fecha: new Date(2025, 7, 16), activa: true }, // 16 de Agosto
      { fecha: new Date(2025, 7, 29), activa: true }, // 29 de Agosto
      { fecha: new Date(2025, 7, 30), activa: true }, // 30 de Agosto
    ];

    for (const fechaData of fechasMeriendas) {
      const fechaConfig = fechasConfigRepo.create({
        fecha: fechaData.fecha,
        turnos: ['16:30-18:30', '19:00-21:00'],
        activa: fechaData.activa,
        observaciones: 'Fecha de merienda libre programada'
      });
      await fechasConfigRepo.save(fechaConfig);
    }
    console.log('✅ Fechas de meriendas libres creadas');
  }

  // MIGRACIÓN: convertir turnosDisponibles/cupos a turnos: {horario, cupos}[] si es necesario
  const fechasTodas = await fechasConfigRepo.find();
  for (const fecha of fechasTodas as any[]) {
    // Si ya tiene turnos en el nuevo formato, saltar
    if (Array.isArray(fecha.turnos) && fecha.turnos.length && typeof fecha.turnos[0].horario === 'string') continue;
    let turnos: { horario: string; cupos: number }[] = [];
    // Caso legacy: turnosDisponibles + cupos
    if (Array.isArray(fecha.turnosDisponibles)) {
      if (Array.isArray(fecha.cuposPorTurno)) {
        // Si hay cupos por turno
        turnos = fecha.turnosDisponibles.map((h: string, i: number) => ({ horario: h, cupos: fecha.cuposPorTurno[i] || 0 }));
      } else {
        // Un solo cupo para todos
        turnos = fecha.turnosDisponibles.map((h: string) => ({ horario: h, cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30 }));
      }
    } else if (fecha.turnosDisponibles && typeof fecha.turnosDisponibles === 'object') {
      // Objeto con mañana/tarde
      for (const key of Object.keys(fecha.turnosDisponibles)) {
        const turno = fecha.turnosDisponibles[key];
        if (turno && typeof turno.horario === 'string' && turno.horario.trim() !== '') {
          const partes = turno.horario.split(/y|Y/).map(s => s.trim()).filter(Boolean);
          for (const parte of partes) {
            turnos.push({ horario: parte, cupos: typeof turno.cupos === 'number' ? turno.cupos : 30 });
          }
        }
      }
    } else if (typeof fecha.turnosDisponibles === 'string') {
      const partes = fecha.turnosDisponibles.split(/y|Y/).map(s => s.trim()).filter(Boolean);
      turnos = partes.map((h: string) => ({ horario: h, cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30 }));
    }
    if (turnos.length) {
      (fecha as any).turnos = turnos;
      await fechasConfigRepo.save(fecha);
    }
  }

  // 5. Configuración inicial del PDF de carta
  const menuPdfRepo = dataSource.getRepository(MenuPdf);
  const existingMenu = await menuPdfRepo.findOne({ where: { clave: 'carta_principal' } });
  
  if (!existingMenu) {
    const menuPdf = menuPdfRepo.create({
      clave: 'carta_principal',
      nombreArchivo: 'carta-olivia-cafe.pdf',
      rutaArchivo: '/uploads/carta-olivia-cafe.pdf',
      tamanoArchivo: 0,
      descripcion: 'Carta principal del café (placeholder inicial)',
      activo: true
    });
    await menuPdfRepo.save(menuPdf);
    console.log('✅ Configuración de PDF de carta creada');
  }

  console.log('🎉 Seed de datos iniciales completado');
} 