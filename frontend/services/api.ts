const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://oliviacafeteria-production.up.railway.app';

export interface ReservaData {
  nombre: string;
  telefono: string;
  cantidadPersonas: string | number;
  fecha: string;
  turno: string;
  tipoReserva: string;
  observaciones?: string;
  montoTotal?: number;
}

export interface GiftCardData {
  nombreComprador: string;
  telefonoComprador: string;
  emailComprador: string;
  nombreDestinatario: string;
  telefonoDestinatario: string;
  monto: number;
  mensaje?: string;
}

export interface SiteConfig {
  telefono: string;
  direccion: string;
  email: string;
  horarios: {
    lunes: { abierto: boolean; manana: string; noche: string };
    martes: { abierto: boolean; manana: string; noche: string };
    miercoles: { abierto: boolean; manana: string; noche: string };
    jueves: { abierto: boolean; manana: string; noche: string };
    viernes: { abierto: boolean; manana: string; noche: string };
    sabado: { abierto: boolean; manana: string; noche: string };
    domingo: { abierto: boolean; manana: string; noche: string };
  };
}

export interface ContactInfo {
  telefono: string;
  direccion: string;
  email: string;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  external_reference: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Manejo de respuesta vacía o 204 No Content
      if (response.status === 204) {
        return null;
      }
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Verificar disponibilidad
  async checkAvailability(data: {
    fecha: string;
    turno: string;
    tipoReserva: string;
    cantidadPersonas: number;
  }): Promise<{ disponible: boolean; message?: string }> {
    return this.request('/reserva/check-availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Crear preferencia de pago (Mercado Pago) con datos completos de la reserva
  async crearPreferenciaPago(
    reservaData: ReservaData, 
    monto: number, 
    descripcion: string
  ): Promise<MercadoPagoPreference> {
    return this.request<MercadoPagoPreference>('/pago/crear-preferencia', {
      method: 'POST',
      body: JSON.stringify({
        reservaData,
        monto,
        descripcion,
      }),
    });
  }

  // Procesar pago con tarjeta
  async pagarConTarjeta(
    reservaData: ReservaData,
    total: number,
    descripcion: string,
    datosLarjeta: any,
  ): Promise<any> {
    return this.request('/pago/pagar-con-tarjeta', {
      method: 'POST',
      body: JSON.stringify({
        reservaData,
        total,
        descripcion,
        datosLarjeta,
      }),
    });
  }

  // Crear preferencia de pago para GiftCard
  async crearPreferenciaGiftCard(
    giftCardData: GiftCardData, 
    monto: number, 
    descripcion: string
  ): Promise<MercadoPagoPreference> {
    return this.request<MercadoPagoPreference>('/pago/crear-preferencia-giftcard', {
      method: 'POST',
      body: JSON.stringify({
        giftCardData,
        monto,
        descripcion,
      }),
    });
  }

  // Procesar pago con tarjeta para GiftCard
  async pagarGiftCardConTarjeta(
    giftCardData: GiftCardData,
    total: number,
    descripcion: string,
    datosLarjeta: any,
  ): Promise<any> {
    return this.request('/pago/pagar-giftcard-con-tarjeta', {
      method: 'POST',
      body: JSON.stringify({
        giftCardData,
        total,
        descripcion,
        datosLarjeta,
      }),
    });
  }

  // Crear reserva solo si está pagada (nuevo flujo)
  async createReservaConPago(data: ReservaData & { idPagoExterno: string; metodoPago: string }): Promise<any> {
    return this.request('/reserva/crear-con-pago', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Obtener todas las reservas
  async getReservas(): Promise<any[]> {
    return this.request('/reserva');
  }

  // Obtener todas las gift cards
  async getGiftCards(): Promise<any[]> {
    return this.request('/giftcard');
  }

  // Cancelar una reserva (soft delete)
  async cancelarReserva(id: number): Promise<any> {
    return this.request(`/reserva/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'CANCELADA' })
    });
  }

  // Obtener reserva por ID
  async getReserva(id: number): Promise<any> {
    return this.request(`/reserva/${id}`);
  }

  // Obtener todos los pagos
  async getPagos(): Promise<any[]> {
    return this.request('/pago');
  }

  // Obtener pago por ID
  async getPago(id: number): Promise<any> {
    return this.request(`/pago/${id}`);
  }

  // Test de conexión a la base de datos
  async testDatabase(): Promise<any> {
    return this.request('/reserva/test-db');
  }

  // Verificar estado del servicio de pagos
  async checkPaymentHealth(): Promise<any> {
    return this.request('/pago/health');
  }

  // Obtener fechas disponibles por tipo de reserva
  async getFechasDisponibles(tipoReserva: string): Promise<Date[]> {
    const fechas = await this.request<string[]>(`/reserva/fechas-disponibles/${tipoReserva}`);
    // Convertir strings de fecha a objetos Date
    return fechas.map(fecha => new Date(fecha));
  }

  // Obtener fechas disponibles con información de cupos
  async getFechasDisponiblesConCupos(tipoReserva: string): Promise<{ fecha: Date; disponible: boolean; cuposDisponibles: number }[]> {
    const fechasConCupos = await this.request<{ fecha: string; disponible: boolean; cuposDisponibles: number }[]>(`/reserva/fechas-disponibles-con-cupos/${tipoReserva}`);
    // Convertir strings de fecha a objetos Date
    return fechasConCupos.map(item => ({
      ...item,
      fecha: new Date(item.fecha)
    }));
  }

  // Obtener horarios disponibles para una fecha y tipo específicos
  async getHorariosDisponibles(fecha: Date | string, tipoReserva: string): Promise<string[]> {
    // Convertir Date a string ISO si es necesario
    const fechaStr = fecha instanceof Date ? fecha.toISOString() : fecha;
    return this.request(`/reserva/horarios-disponibles?fecha=${encodeURIComponent(fechaStr)}&tipoReserva=${encodeURIComponent(tipoReserva)}`);
  }

  // Obtener horarios disponibles con información de cupos
  async getHorariosDisponiblesConCupos(fecha: Date | string, tipoReserva: string): Promise<{ horario: string; disponible: boolean; cuposDisponibles: number }[]> {
    // Convertir Date a string ISO si es necesario
    const fechaStr = fecha instanceof Date ? fecha.toISOString() : fecha;
    return this.request(`/reserva/horarios-disponibles-con-cupos?fecha=${encodeURIComponent(fechaStr)}&tipoReserva=${encodeURIComponent(tipoReserva)}`);
  }

  // Obtener cupos disponibles para una fecha y turno específicos
  async getCuposDisponibles(fecha: Date | string, turno: string, tipoReserva: string): Promise<{
    cuposDisponibles: number;
    capacidadMaxima: number;
    capacidadOcupada: number;
    reservasExistentes: number;
  }> {
    // Convertir Date a string ISO si es necesario
    const fechaStr = fecha instanceof Date ? fecha.toISOString() : fecha;
    return this.request(`/reserva/cupos-disponibles?fecha=${encodeURIComponent(fechaStr)}&turno=${encodeURIComponent(turno)}&tipoReserva=${encodeURIComponent(tipoReserva)}`);
  }

  // === SITE CONFIG APIs ===

  // Obtener configuración completa del sitio
  async getSiteConfig(): Promise<SiteConfig> {
    return this.request('/site-config');
  }

  // Obtener solo horarios de apertura
  async getHorarios(): Promise<any> {
    return this.request('/horarios');
  }

  // Obtener información de contacto
  async getContactInfo(): Promise<ContactInfo> {
    return this.request('/contacto');
  }

  // === ADMIN APIs (requieren autenticación) ===

  // Actualizar configuración del sitio
  async updateSiteConfig(config: Partial<SiteConfig>, token: string): Promise<any> {
    return this.request('/admin/site-config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(config)
    });
  }

  // Actualizar solo horarios
  async updateHorarios(horarios: any, token: string): Promise<any> {
    return this.request('/admin/horarios', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(horarios)
    });
  }

  // === FECHAS CONFIG (Meriendas Libres) ===
  async getFechasConfig(): Promise<any[]> {
    return this.request('/fechas-config');
  }

  async createFechaConfig(data: any, token: string): Promise<any> {
    return this.request('/fechas-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
  }

  async updateFechaConfig(id: number, data: any, token: string): Promise<any> {
    return this.request(`/fechas-config/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
  }

  async deleteFechaConfig(id: number, token: string): Promise<any> {
    return this.request(`/fechas-config/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  }

  // === PRECIOS CONFIG (Meriendas Libres) ===
  async getPrecioMeriendaLibre(): Promise<number> {
    return this.request('/precios-config/merienda-libre');
  }

  async getCuposMeriendasLibres(): Promise<number> {
    return this.request('/precios-config/merienda-libre/cupos');
  }

  async updatePrecioMeriendaLibre(precio: number, token: string): Promise<any> {
    return this.request('/precios-config/merienda-libre', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ precio })
    });
  }

  async updateCuposMeriendasLibres(cupos: number, token: string): Promise<any> {
    return this.request('/precios-config/merienda-libre/cupos', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ cupos })
    });
  }

  async getPrecioPromoOlivia(): Promise<number> {
    return this.request('/precios-config/tarde-te/precio-promo-olivia');
  }

  async updatePrecioPromoOlivia(precio: number, token: string): Promise<any> {
    return this.request('/precios-config/tarde-te/precio-promo-olivia', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ precio })
    });
  }

  async getPrecioPromoBasica(): Promise<number> {
    return this.request('/precios-config/tarde-te/precio-promo-basica');
  }

  async updatePrecioPromoBasica(precio: number, token: string): Promise<any> {
    return this.request('/precios-config/tarde-te/precio-promo-basica', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ precio })
    });
  }

  async getCuposTardesDeTe(): Promise<number> {
    return this.request('/precios-config/tarde-te/cupos');
  }

  async updateCuposTardesDeTe(cupos: number, token: string): Promise<any> {
    return this.request('/precios-config/tarde-te/cupos', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ cupos })
    });
  }

  // === A LA CARTA CONFIG ===
  async getPrecioALaCarta(): Promise<number> {
    return this.request('/precios-config/a-la-carta/precio');
  }

  async getPrecioTardeDeTe(): Promise<number> {
    return this.request('/precios-config/tarde-te/precio');
  }

  async updatePrecioALaCarta(precio: number, token: string): Promise<any> {
    return this.request('/precios-config/a-la-carta/precio', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ precio })
    });
  }

  // === CONTENIDO CONFIGURABLE ===
  async getMeriendasLibresContenido(): Promise<any> {
    return this.request('/contenido-config/meriendas-libres/contenido');
  }

  async updateMeriendasLibresContenido(contenido: any, token: string): Promise<any> {
    return this.request('/contenido-config/meriendas-libres/contenido', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(contenido)
    });
  }

  async getTardesTePromoOliviaContenido(): Promise<any> {
    return this.request('/contenido-config/tardes-te/promo-olivia/contenido');
  }

  async updateTardesTePromoOliviaContenido(contenido: any, token: string): Promise<any> {
    return this.request('/contenido-config/tardes-te/promo-olivia/contenido', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(contenido)
    });
  }

  async getTardesTePromoBasicaContenido(): Promise<any> {
    return this.request('/contenido-config/tardes-te/promo-basica/contenido');
  }

  async updateTardesTePromoBasicaContenido(contenido: any, token: string): Promise<any> {
    return this.request('/contenido-config/tardes-te/promo-basica/contenido', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(contenido)
    });
  }

  // === MENU PDF ===
  async getPdfInfo(): Promise<any> {
    return this.request('/menu-pdf');
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();
export default apiService; 