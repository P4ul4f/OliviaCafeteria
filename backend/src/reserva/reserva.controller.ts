import { Controller, Get, Post, Body, Param, Patch, Delete, Query, BadRequestException } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { TipoReserva } from './reserva.entity';
import { CreateReservaConPagoDto } from './dto/create-reserva.dto';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Get('test-db')
  testDatabase() {
    return { 
      message: 'Conexión a la base de datos exitosa!',
      timestamp: new Date().toISOString(),
      status: 'OK'
    };
  }

  @Get('test-horarios')
  testHorarios() {
    return {
      message: 'Endpoint de horarios funcionando',
      horarios: ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
      timestamp: new Date().toISOString()
    };
  }

  @Get('horarios-simple')
  getHorariosSimple() {
    try {
      // Generar horarios sin usar el servicio para aislar el problema
      const horarios: string[] = [];
      
      // Horarios de mañana: 9:00 - 12:00
      for (let hora = 9; hora <= 12; hora++) {
        for (let minuto = 0; minuto < 60; minuto += 30) {
          if (hora === 12 && minuto === 30) break;
          const horaStr = hora.toString().padStart(2, '0');
          const minutoStr = minuto.toString().padStart(2, '0');
          horarios.push(`${horaStr}:${minutoStr}`);
        }
      }
      
      return {
        success: true,
        horarios,
        message: 'Horarios generados directamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error en endpoint simple'
      };
    }
  }

  // @Post()
  // create(@Body() dto: CreateReservaDto) {
  //   return this.reservaService.create(dto);
  // }

  @Post('crear-con-pago')
  createConPago(@Body() dto: CreateReservaConPagoDto) {
    return this.reservaService.createConPago(dto);
  }

  @Post('check-availability')
  checkAvailability(@Body() dto: CheckAvailabilityDto) {
    return this.reservaService.checkAvailability(dto);
  }

  @Get('fechas-disponibles/:tipoReserva')
  getFechasDisponibles(@Param('tipoReserva') tipoReserva: TipoReserva) {
    return this.reservaService.getFechasDisponibles(tipoReserva);
  }

  @Get('fechas-disponibles-con-cupos/:tipoReserva')
  getFechasDisponiblesConCupos(@Param('tipoReserva') tipoReserva: TipoReserva) {
    return this.reservaService.getFechasDisponiblesConCupos(tipoReserva);
  }

  @Get('horarios-disponibles')
  getHorariosDisponibles(
    @Query('fecha') fecha: string,
    @Query('tipoReserva') tipoReservaString: string
  ) {
    try {
      console.log('📅 Fecha recibida:', fecha);
      console.log('🎯 Tipo de reserva recibido:', tipoReservaString);
      
      // Validar y convertir el tipo de reserva
      const tipoReserva = tipoReservaString as TipoReserva;
      if (!Object.values(TipoReserva).includes(tipoReserva)) {
        throw new Error(`Tipo de reserva inválido: ${tipoReservaString}`);
      }
      
      console.log('✅ Tipo de reserva validado:', tipoReserva);
      
      // Parsear la fecha de manera más robusta
      let fechaObj: Date;
      
      if (fecha.includes('GMT')) {
        // Si la fecha viene con zona horaria, usar el constructor Date
        fechaObj = new Date(fecha);
      } else {
        // Si es solo una fecha ISO, parsearla directamente
        fechaObj = new Date(fecha);
      }
      
      // Verificar que la fecha sea válida
      if (isNaN(fechaObj.getTime())) {
        throw new Error('Fecha inválida');
      }
      
      console.log('✅ Fecha parseada:', fechaObj.toISOString());
      
      return this.reservaService.getHorariosDisponibles(fechaObj, tipoReserva);
    } catch (error) {
      console.error('❌ Error al procesar horarios disponibles:', error);
      throw new BadRequestException(`Error al procesar la solicitud: ${error.message}`);
    }
  }

  @Get('horarios-disponibles-con-cupos')
  getHorariosDisponiblesConCupos(
    @Query('fecha') fecha: string,
    @Query('tipoReserva') tipoReservaString: string
  ) {
    try {
      console.log('📅 Fecha recibida (con cupos):', fecha);
      console.log('🎯 Tipo de reserva recibido (con cupos):', tipoReservaString);
      
      // Validar y convertir el tipo de reserva
      const tipoReserva = tipoReservaString as TipoReserva;
      if (!Object.values(TipoReserva).includes(tipoReserva)) {
        throw new Error(`Tipo de reserva inválido: ${tipoReservaString}`);
      }
      
      console.log('✅ Tipo de reserva validado (con cupos):', tipoReserva);
      
      // Parsear la fecha de manera más robusta
      let fechaObj: Date;
      
      if (fecha.includes('GMT')) {
        // Si la fecha viene con zona horaria, usar el constructor Date
        fechaObj = new Date(fecha);
      } else {
        // Si es solo una fecha ISO, parsearla directamente
        fechaObj = new Date(fecha);
      }
      
      // Verificar que la fecha sea válida
      if (isNaN(fechaObj.getTime())) {
        throw new Error('Fecha inválida');
      }
      
      console.log('✅ Fecha parseada (con cupos):', fechaObj.toISOString());
      
      return this.reservaService.getHorariosDisponiblesConCupos(fechaObj, tipoReserva);
    } catch (error) {
      console.error('❌ Error al procesar horarios disponibles con cupos:', error);
      throw new BadRequestException(`Error al procesar la solicitud: ${error.message}`);
    }
  }

  @Get('cupos-disponibles')
  getCuposDisponibles(
    @Query('fecha') fecha: string,
    @Query('turno') turno: string,
    @Query('tipoReserva') tipoReservaString: string
  ) {
    try {
      console.log('🔍 === INICIO getCuposDisponibles ===');
      console.log('📅 Fecha recibida (cupos):', fecha);
      console.log('🕒 Turno recibido (cupos):', turno);
      console.log('🎯 Tipo de reserva recibido (cupos):', tipoReservaString);
      
      // Validar y convertir el tipo de reserva
      const tipoReserva = tipoReservaString as TipoReserva;
      if (!Object.values(TipoReserva).includes(tipoReserva)) {
        throw new Error(`Tipo de reserva inválido: ${tipoReservaString}`);
      }
      
      // Parsear la fecha
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        throw new Error('Fecha inválida');
      }
      
      console.log('✅ Fecha parseada (cupos):', {
        fechaISO: fechaObj.toISOString(),
        fechaLocal: fechaObj.toLocaleDateString('es-ES'),
        timestamp: fechaObj.getTime()
      });
      
      console.log('✅ Tipo de reserva validado (cupos):', tipoReserva);
      
      const resultado = this.reservaService.getCuposDisponibles(fechaObj, turno, tipoReserva);
      
      console.log('🔍 === FIN getCuposDisponibles ===');
      return resultado;
    } catch (error) {
      console.error('❌ Error al obtener cupos disponibles:', error);
      throw new BadRequestException(`Error al procesar la solicitud: ${error.message}`);
    }
  }

  @Get('test-cupos')
  testCupos(
    @Query('fecha') fecha: string,
    @Query('turno') turno: string,
    @Query('tipoReserva') tipoReservaString: string
  ) {
    try {
      console.log('🧪 === TEST ENDPOINT CUPOS ===');
      console.log('📅 Fecha recibida:', fecha);
      console.log('🕒 Turno recibido:', turno);
      console.log('🎯 Tipo de reserva recibido:', tipoReservaString);
      
      // Validar y convertir el tipo de reserva
      const tipoReserva = tipoReservaString as TipoReserva;
      if (!Object.values(TipoReserva).includes(tipoReserva)) {
        throw new Error(`Tipo de reserva inválido: ${tipoReservaString}`);
      }
      
      // Parsear la fecha
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        throw new Error('Fecha inválida');
      }
      
      console.log('✅ Fecha parseada:', {
        fechaISO: fechaObj.toISOString(),
        fechaLocal: fechaObj.toLocaleDateString('es-ES'),
        timestamp: fechaObj.getTime()
      });
      
      console.log('✅ Tipo de reserva validado:', tipoReserva);
      
      // Test directo del servicio
      const resultado = this.reservaService.getCuposDisponibles(fechaObj, turno, tipoReserva);
      
      console.log('🧪 === FIN TEST ENDPOINT CUPOS ===');
      return resultado;
    } catch (error) {
      console.error('❌ Error en test endpoint:', error);
      throw new BadRequestException(`Error en test: ${error.message}`);
    }
  }

  @Post(':id/confirmar-pago')
  confirmarPago(
    @Param('id') id: string,
    @Body() body: { idPagoExterno: string; metodoPago: string }
  ) {
    return this.reservaService.confirmarPago(Number(id), body.idPagoExterno, body.metodoPago);
  }

  // Generic routes MUST come after specific routes to avoid conflicts
  @Get()
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReservaDto) {
    return this.reservaService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservaService.remove(Number(id));
  }

  @Get()
  async findAll() {
    try {
      const reservas = await this.reservaService.findAll();
      console.log(`📋 Obtenidas ${reservas.length} reservas para el dashboard admin`);
      return reservas;
    } catch (error) {
      console.error('❌ Error obteniendo reservas para admin:', error);
      throw new BadRequestException(`Error al obtener las reservas: ${error.message}`);
    }
  }
} 