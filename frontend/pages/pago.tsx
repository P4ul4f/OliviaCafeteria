import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { apiService, ReservaData } from '../services/api';
import styles from '../styles/pago.module.css';

// Declarar el objeto global de Mercado Pago
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface FormData {
  metodoPago: 'mercadopago' | 'tarjeta';
  numeroTarjeta?: string;
  vencimiento?: string;
  codigoSeguridad?: string;
  nombreTitular?: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

export default function Pago() {
  const router = useRouter();
  const [reservaData, setReservaData] = useState<ReservaData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    metodoPago: 'mercadopago',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mp, setMp] = useState<any>(null);
  const [cardForm, setCardForm] = useState<any>(null);
  const [isMetodoDropdownOpen, setIsMetodoDropdownOpen] = useState(false);
  const metodoDropdownRef = useRef<HTMLDivElement>(null);
  const [precios, setPrecios] = useState<{ [key: string]: number }>({});
  const [loadingPrecios, setLoadingPrecios] = useState(true);

  useEffect(() => {
    // Cargar datos de la reserva desde localStorage
    const storedReservaData = localStorage.getItem('reservaData');
    if (storedReservaData) {
      try {
        const parsedData = JSON.parse(storedReservaData);
        setReservaData(parsedData);
      } catch (error) {

        router.push('/');
      }
    } else {
      // Si no hay datos de reserva, redirigir al inicio
      router.push('/');
    }
  }, [router]);

  // Cargar precios desde la base de datos
  useEffect(() => {
    const cargarPrecios = async () => {
      try {
        setLoadingPrecios(true);
        const [precioMeriendaLibre, precioTardeTe, precioALaCarta] = await Promise.all([
          apiService.getPrecioMeriendaLibre(),
          apiService.getPrecioTardeDeTe(),
          apiService.getPrecioALaCarta()
        ]);
        
        setPrecios({
          'merienda-libre': precioMeriendaLibre,
          'tarde-te': precioTardeTe,
          'a-la-carta': precioALaCarta
        });
      } catch (error) {
        console.error('Error al cargar precios:', error);
        // Usar precios por defecto en caso de error
        setPrecios({
          'merienda-libre': 17500,
          'tarde-te': 18500,
          'a-la-carta': 5000
        });
      } finally {
        setLoadingPrecios(false);
      }
    };

    cargarPrecios();
  }, []);

  // Click outside para cerrar dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (metodoDropdownRef.current && !metodoDropdownRef.current.contains(event.target as Node)) {
        setIsMetodoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Inicializar Mercado Pago SDK
  useEffect(() => {
    const initializeMercadoPago = async () => {
      if (typeof window !== 'undefined' && window.MercadoPago) {
        try {
          // Usar la clave pública de prueba (debería venir del .env en producción)
          const mp = new window.MercadoPago('TEST-99c88f72-9c62-4b54-82a8-732959fffbd8', {
            locale: 'es-AR'
          });
          setMp(mp);
          console.log('✅ Mercado Pago SDK inicializado');
        } catch (error) {
          console.error('❌ Error al inicializar Mercado Pago SDK:', error);
        }
      }
    };

    // Esperar a que el script se cargue
    setTimeout(initializeMercadoPago, 1000);
  }, []);

  const calcularTotal = (): number => {
    if (!reservaData || loadingPrecios) return 0;
    
    const precioPorPersona = precios[reservaData.tipoReserva as keyof typeof precios] || 0;
    const cantidadPersonas = typeof reservaData.cantidadPersonas === 'string' 
      ? parseInt(reservaData.cantidadPersonas) 
      : reservaData.cantidadPersonas;
    
    return precioPorPersona * cantidadPersonas;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar campos de tarjeta si se seleccionó ese método
    if (formData.metodoPago === 'tarjeta') {
      if (!formData.numeroTarjeta) {
        newErrors.numeroTarjeta = 'El número de tarjeta es obligatorio';
      } else if (formData.numeroTarjeta.replace(/\s/g, '').length < 13) {
        newErrors.numeroTarjeta = 'El número de tarjeta debe tener al menos 13 dígitos';
      }

      if (!formData.vencimiento) {
        newErrors.vencimiento = 'El vencimiento es obligatorio';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.vencimiento)) {
        newErrors.vencimiento = 'El formato debe ser MM/YY';
      }

      if (!formData.codigoSeguridad) {
        newErrors.codigoSeguridad = 'El código de seguridad es obligatorio';
      } else if (formData.codigoSeguridad.length < 3) {
        newErrors.codigoSeguridad = 'El código debe tener al menos 3 dígitos';
      }

      if (!formData.nombreTitular) {
        newErrors.nombreTitular = 'El nombre del titular es obligatorio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !reservaData) {
      console.log('Form validation failed or no reservaData:', { 
        validateForm: validateForm(), 
        reservaData 
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const total = calcularTotal();

      if (formData.metodoPago === 'mercadopago') {
        // Procesar pago con Mercado Pago
        const descripcion = `Reserva ${
          reservaData.tipoReserva === 'tarde-te' ? 'Tarde de Té' : 'Merienda Libre'
        } - ${reservaData.nombre}`;
        
        const preferencia = await apiService.crearPreferenciaPago(
          reservaData,
          total,
          descripcion
        );

        if (preferencia.init_point) {
          // Guardar datos adicionales en localStorage por si acaso
          localStorage.setItem('mercadopago_preference_id', preferencia.id);
          localStorage.setItem('mercadopago_external_reference', preferencia.external_reference);
          
          // Redirigir a Mercado Pago
          window.location.href = preferencia.init_point;
        } else {
          throw new Error('No se pudo obtener el enlace de pago de Mercado Pago');
        }
      } else if (formData.metodoPago === 'tarjeta') {
        // Procesar pago con tarjeta
        try {
          const descripcion = `Reserva ${
            reservaData.tipoReserva === 'tarde-te' ? 'Tarde de Té' : 'Merienda Libre'
          } - ${reservaData.nombre}`;

          const datosLarjeta = {
            cardNumber: formData.numeroTarjeta?.replace(/\s/g, '') || '',
            cardholderName: formData.nombreTitular || '',
            expirationMonth: formData.vencimiento?.split('/')[0] || '',
            expirationYear: '20' + (formData.vencimiento?.split('/')[1] || ''),
            securityCode: formData.codigoSeguridad || '',
            identificationType: 'DNI',
            identificationNumber: '12345678',
          };

          // Enviar al backend para procesar el pago
          const resultado = await apiService.pagarConTarjeta(
            reservaData,
            total,
            descripcion,
            datosLarjeta
          );

          if (resultado.status === 'approved') {
            // Pago aprobado
            localStorage.removeItem('reservaData');
            router.push(`/pago/success?payment_id=${resultado.id}&status=approved&external_reference=${resultado.external_reference}`);
          } else if (resultado.status === 'pending') {
            // Pago pendiente
            router.push(`/pago/pending?payment_id=${resultado.id}&status=pending&external_reference=${resultado.external_reference}`);
          } else {
            // Pago rechazado
            router.push(`/pago/failure?payment_id=${resultado.id}&status=${resultado.status}&external_reference=${resultado.external_reference}`);
          }
        } catch (cardError) {
          console.error('❌ Error al procesar tarjeta:', cardError);
          
          // Limpiar localStorage cuando hay error con la tarjeta
          localStorage.removeItem('reservaData');
          localStorage.removeItem('mercadopago_preference_id');
          localStorage.removeItem('mercadopago_external_reference');
          
          // Si hay error con la tarjeta, mostrar mensaje específico
          if (cardError.message && cardError.message.includes('Invalid card number')) {
            setErrors({ numeroTarjeta: 'Número de tarjeta inválido' });
          } else if (cardError.message && cardError.message.includes('Invalid expiry date')) {
            setErrors({ vencimiento: 'Fecha de vencimiento inválida' });
          } else if (cardError.message && cardError.message.includes('Invalid security code')) {
            setErrors({ codigoSeguridad: 'Código de seguridad inválido' });
          } else {
            setErrors({ submit: `Error al procesar la tarjeta: ${cardError.message}` });
          }
        }
      }
    } catch (error: any) {
      console.error('❌ Error al procesar pago:', error);
      
      // Limpiar localStorage cuando hay error general en el pago
      localStorage.removeItem('reservaData');
      localStorage.removeItem('mercadopago_preference_id');
      localStorage.removeItem('mercadopago_external_reference');
      
      let errorMessage = 'Error al procesar el pago. Inténtalo de nuevo.';
      
      // Manejar errores específicos de Mercado Pago
      if (error.message && error.message.includes('credenciales')) {
        errorMessage = 'Mercado Pago requiere credenciales válidas. Por favor, usa el método de pago con tarjeta mientras configuramos la integración.';
      } else if (error.message && error.message.includes('invalid access token')) {
        errorMessage = 'Hay un problema con la configuración de Mercado Pago. Por favor, usa el método de pago con tarjeta.';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const metodoPagoOptions: DropdownOption[] = [
    { value: 'mercadopago', label: 'Mercado Pago' },
    { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' }
  ];

  const handleMetodoSelect = (value: string) => {
    setFormData(prev => ({ ...prev, metodoPago: value as 'mercadopago' | 'tarjeta' }));
    setIsMetodoDropdownOpen(false);
    if (errors.metodoPago) {
      setErrors(prev => ({ ...prev, metodoPago: '' }));
    }
  };

  if (!reservaData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          Cargando datos de la reserva...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pagoCard}>
        <h1 className={styles.title}>Completar Pago</h1>
        
        {/* Resumen de la reserva */}
        <div className={styles.resumenReserva}>
          <h2>Resumen de tu reserva</h2>
          <div className={styles.resumenItem}>
            <span>Tipo:</span>
            <span>{reservaData.tipoReserva === 'tarde-te' ? 'Tarde de Té' : 'Merienda Libre'}</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Nombre:</span>
            <span>{reservaData.nombre}</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Fecha:</span>
            <span>{reservaData.fecha}</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Turno:</span>
            <span>{reservaData.turno}</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Personas:</span>
            <span>{reservaData.cantidadPersonas}</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Total:</span>
            <span className={styles.total}>
              {loadingPrecios ? 'Cargando...' : `$${calcularTotal().toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Formulario de pago */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Método de pago */}
          <div className={styles.inputGroup}>
            <label htmlFor="metodoPago">Método de pago *</label>
            <div className={styles.customDropdown} ref={metodoDropdownRef}>
              <div 
                className={`${styles.dropdownSelected} ${isMetodoDropdownOpen ? styles.open : ''}`}
                onClick={() => setIsMetodoDropdownOpen(!isMetodoDropdownOpen)}
              >
                <span>{metodoPagoOptions.find(option => option.value === formData.metodoPago)?.label}</span>
                <span className={`${styles.dropdownArrow} ${isMetodoDropdownOpen ? styles.rotated : ''}`}>▼</span>
              </div>
              {isMetodoDropdownOpen && (
                <div className={styles.dropdownOptions}>
                  {metodoPagoOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${styles.dropdownOption} ${formData.metodoPago === option.value ? styles.selected : ''}`}
                      onClick={() => handleMetodoSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Campos de tarjeta si se seleccionó ese método */}
          {formData.metodoPago === 'tarjeta' && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="numeroTarjeta">Número de tarjeta *</label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta || ''}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setFormData(prev => ({ ...prev, numeroTarjeta: formatted }));
                  }}
                  className={errors.numeroTarjeta ? styles.inputError : ''}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.numeroTarjeta && <span className={styles.error}>{errors.numeroTarjeta}</span>}
              </div>

              <div className={styles.cardRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="vencimiento">Vencimiento *</label>
                  <input
                    type="text"
                    id="vencimiento"
                    name="vencimiento"
                    value={formData.vencimiento || ''}
                    onChange={(e) => {
                      const formatted = formatExpiry(e.target.value);
                      setFormData(prev => ({ ...prev, vencimiento: formatted }));
                    }}
                    className={errors.vencimiento ? styles.inputError : ''}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.vencimiento && <span className={styles.error}>{errors.vencimiento}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="codigoSeguridad">CVV *</label>
                  <input
                    type="text"
                    id="codigoSeguridad"
                    name="codigoSeguridad"
                    value={formData.codigoSeguridad || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData(prev => ({ ...prev, codigoSeguridad: value }));
                    }}
                    className={errors.codigoSeguridad ? styles.inputError : ''}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.codigoSeguridad && <span className={styles.error}>{errors.codigoSeguridad}</span>}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="nombreTitular">Nombre del titular *</label>
                <input
                  type="text"
                  id="nombreTitular"
                  name="nombreTitular"
                  value={formData.nombreTitular || ''}
                  onChange={handleInputChange}
                  className={errors.nombreTitular ? styles.inputError : ''}
                  placeholder="Nombre como aparece en la tarjeta"
                />
                {errors.nombreTitular && <span className={styles.error}>{errors.nombreTitular}</span>}
              </div>
            </>
          )}

          {/* Error general */}
          {errors.submit && (
            <div className={styles.submitError}>
              {errors.submit}
            </div>
          )}

          {/* Botón de pago */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || loadingPrecios}
          >
            {isSubmitting 
              ? (formData.metodoPago === 'mercadopago' ? 'Redirigiendo a Mercado Pago...' : 'Procesando pago...')
              : loadingPrecios 
                ? 'Cargando precios...'
                : `Pagar $${calcularTotal().toLocaleString()}`
            }
          </button>
        </form>

        <div className={styles.securityInfo}>
          🔒 Tu información está protegida con encriptación SSL
        </div>
      </div>
    </div>
  );
} 