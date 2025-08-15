"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialData = seedInitialData;
const site_config_entity_1 = require("../../site-config/site-config.entity");
const precios_config_entity_1 = require("../../precios-config/precios-config.entity");
const administrador_entity_1 = require("../../administrador/administrador.entity");
const fechas_config_entity_1 = require("../../fechas-config/fechas-config.entity");
const menu_pdf_entity_1 = require("../../menu-pdf/menu-pdf.entity");
async function seedInitialData(dataSource) {
    console.log('🌱 Iniciando seed de datos iniciales...');
    const siteConfigRepo = dataSource.getRepository(site_config_entity_1.SiteConfig);
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
    }
    else {
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
    const preciosConfigRepo = dataSource.getRepository(precios_config_entity_1.PreciosConfig);
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
    }
    else {
        if (!existingPreciosConfig.cuposMeriendasLibres) {
            existingPreciosConfig.cuposMeriendasLibres = 40;
        }
        if (!existingPreciosConfig.cuposTardesDeTe) {
            existingPreciosConfig.cuposTardesDeTe = 65;
        }
        await preciosConfigRepo.save(existingPreciosConfig);
        console.log('✅ Configuración de precios actualizada');
    }
    const administradorRepo = dataSource.getRepository(administrador_entity_1.Administrador);
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
    const fechasConfigRepo = dataSource.getRepository(fechas_config_entity_1.FechasConfig);
    const fechasExistentes = await fechasConfigRepo.count();
    if (fechasExistentes === 0) {
        const fechasMeriendas = [
            { fecha: '2025-08-08', activo: true },
            { fecha: '2025-08-09', activo: true },
            { fecha: '2025-08-15', activo: true },
            { fecha: '2025-08-16', activo: true },
            { fecha: '2025-08-29', activo: true },
            { fecha: '2025-08-30', activo: true },
        ];
        for (const fechaData of fechasMeriendas) {
            const fechaConfig = fechasConfigRepo.create({
                fecha: fechaData.fecha,
                tipoReserva: 'merienda_libre',
                turnos: ['16:30-18:30', '19:00-21:00'],
                activo: fechaData.activo
            });
            await fechasConfigRepo.save(fechaConfig);
        }
        console.log('✅ Fechas de meriendas libres creadas');
    }
    const fechasTodas = await fechasConfigRepo.find();
    for (const fecha of fechasTodas) {
        if (Array.isArray(fecha.turnos) && fecha.turnos.length && typeof fecha.turnos[0].horario === 'string')
            continue;
        let turnos = [];
        if (Array.isArray(fecha.turnosDisponibles)) {
            if (Array.isArray(fecha.cuposPorTurno)) {
                turnos = fecha.turnosDisponibles.map((h, i) => ({ horario: h, cupos: fecha.cuposPorTurno[i] || 0 }));
            }
            else {
                turnos = fecha.turnosDisponibles.map((h) => ({ horario: h, cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30 }));
            }
        }
        else if (fecha.turnosDisponibles && typeof fecha.turnosDisponibles === 'object') {
            for (const key of Object.keys(fecha.turnosDisponibles)) {
                const turno = fecha.turnosDisponibles[key];
                if (turno && typeof turno.horario === 'string' && turno.horario.trim() !== '') {
                    const partes = turno.horario.split(/y|Y/).map(s => s.trim()).filter(Boolean);
                    for (const parte of partes) {
                        turnos.push({ horario: parte, cupos: typeof turno.cupos === 'number' ? turno.cupos : 30 });
                    }
                }
            }
        }
        else if (typeof fecha.turnosDisponibles === 'string') {
            const partes = fecha.turnosDisponibles.split(/y|Y/).map(s => s.trim()).filter(Boolean);
            turnos = partes.map((h) => ({ horario: h, cupos: typeof fecha.cupos === 'number' ? fecha.cupos : 30 }));
        }
        if (turnos.length) {
            fecha.turnos = turnos;
            await fechasConfigRepo.save(fecha);
        }
    }
    const menuPdfRepo = dataSource.getRepository(menu_pdf_entity_1.MenuPdf);
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
//# sourceMappingURL=initial-data.seed.js.map