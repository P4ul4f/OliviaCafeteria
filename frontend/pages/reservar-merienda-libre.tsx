import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from '../styles/reservar.module.css';
import { ReservaData, apiService } from '../services/api';

interface FechaConCupos {
  fecha: Date;
  disponible: boolean;
  cuposDisponibles: number;
}

// FUNCIÓN DE SEGURIDAD: Parsear cualquier fecha de forma segura
function safeParseDate(fecha: any): Date {
  try {
    if (fecha instanceof Date) {
      return fecha;
    }
    
    if (typeof fecha === 'string') {
      // Si es un string ISO válido
      if (fecha.includes('T') || fecha.includes('Z')) {
        const parsed = new Date(fecha);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }
      
      // Si es un string YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        const [year, month, day] = fecha.split('-').map(Number);
        return new Date(year, month - 1, day, 12, 0, 0, 0);
      }
    }
    
    // Si es un timestamp numérico
    if (typeof fecha === 'number') {
      const parsed = new Date(fecha);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    // Fallback: fecha actual
    console.warn('⚠️ No se pudo parsear la fecha:', fecha, 'usando fecha actual');
    return new Date();
    
  } catch (error) {
    console.error('❌ Error parseando fecha:', fecha, error);
    return new Date();
  }
}

export default function ReservarMeriendaLibre() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    cantidadPersonas: '',
    fecha: null as Date | null,
    turno: '',
    tipoReserva: 'merienda-libre' as const
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fechasConCupos, setFechasConCupos] = useState<FechaConCupos[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Nuevos estados para cupos disponibles
  const [cuposDisponibles, setCuposDisponibles] = useState<number>(0);
  const [maxPersonas, setMaxPersonas] = useState<number>(0);
  const [loadingCupos, setLoadingCupos] = useState(false);
  
  // Estados para horarios con cupos
  const [horariosConCupos, setHorariosConCupos] = useState<{ horario: string; disponible: boolean; cuposDisponibles: number }[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('cantidadDropdown');
      const wrapper = event.target as Element;
      if (dropdown && !wrapper.closest('.customSelectWrapper')) {
        dropdown.classList.remove('show');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Cargar horarios disponibles cuando cambie la fecha
  useEffect(() => {
    if (formData.fecha) {
      loadHorariosDisponibles();
    } else {
      setHorariosConCupos([]);
    }
  }, [formData.fecha]);

  // Cargar fechas disponibles al montar el componente
  useEffect(() => {
    loadFechasDisponibles();
  }, []);

  const loadFechasDisponibles = async () => {
    try {
      setLoading(true);
      // Usar el nuevo endpoint que incluye información de cupos
      const fechasData = await apiService.getFechasDisponiblesConCupos('merienda-libre');
      
      // Filtrar solo fechas futuras y ordenar
      const fechasFuturas = fechasData
        .filter(fecha => fecha.fecha >= new Date())
        .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
      
      setFechasConCupos(fechasFuturas);
    } catch (error) {
      console.error('Error cargando fechas disponibles:', error);
      setFechasConCupos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar cupos disponibles
  const loadCuposDisponibles = async (fecha: Date, turno: string) => {
    if (!fecha || !turno) return;
    
    try {
      setLoadingCupos(true);
      console.log('🔍 Frontend - Cargando cupos para:', {
        fecha: fecha.toISOString(),
        fechaLocal: fecha.toLocaleDateString('es-ES'),
        turno,
        tipoReserva: 'merienda-libre'
      });
      
      const cuposData = await apiService.getCuposDisponibles(fecha, turno, 'merienda-libre');
      console.log('📊 Frontend - Datos de cupos recibidos:', cuposData);
      
      setCuposDisponibles(cuposData.cuposDisponibles);
      // Para meriendas libres: máximo es la disponibilidad real del día, pero no más de 40 personas
      const maxPersonasCalculado = Math.min(cuposData.cuposDisponibles, 40);
      setMaxPersonas(maxPersonasCalculado);
      
      console.log('✅ Frontend - Estados actualizados:', {
        cuposDisponibles: cuposData.cuposDisponibles,
        maxPersonas: maxPersonasCalculado
      });
    } catch (error) {
      console.error('❌ Frontend - Error cargando cupos disponibles:', error);
      setCuposDisponibles(0);
      setMaxPersonas(0);
    } finally {
      setLoadingCupos(false);
    }
  };

  // Función para cargar horarios disponibles con información de cupos
  const loadHorariosDisponibles = async () => {
    if (!formData.fecha) {
      setHorariosConCupos([]);
      return;
    }

    try {
      setLoadingHorarios(true);
      // Usar el endpoint que incluye información de cupos por turno
      console.log('🔍 Frontend - Cargando horarios para fecha:', {
        fecha: formData.fecha.toISOString(),
        fechaLocal: formData.fecha.toLocaleDateString('es-ES')
      });
      
      const horariosData = await apiService.getHorariosDisponiblesConCupos(formData.fecha, 'merienda-libre');
      setHorariosConCupos(horariosData);
      console.log('🕐 Frontend - Horarios con cupos cargados:', horariosData);
    } catch (error) {
      console.error('Error cargando horarios disponibles:', error);
      setHorariosConCupos([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      fecha: date,
      turno: '', // Limpiar turno cuando cambie la fecha
      cantidadPersonas: '' // Limpiar cantidad de personas cuando cambie la fecha
    }));
    
    if (errors.fecha) {
      setErrors(prev => ({
        ...prev,
        fecha: ''
      }));
    }
    
    // Limpiar cupos y máximo de personas - serán cargados cuando se seleccione turno
    setCuposDisponibles(0);
    setMaxPersonas(0);
  };

  const handleTurnoChange = (turnoId: string) => {
    setFormData(prev => ({
      ...prev,
      turno: turnoId,
      cantidadPersonas: '' // Limpiar cantidad de personas cuando cambie el turno
    }));
    
    if (errors.turno) {
      setErrors(prev => ({
        ...prev,
        turno: ''
      }));
    }
    
    // Cargar cupos disponibles cuando se seleccione un turno
    if (formData.fecha) {
      loadCuposDisponibles(formData.fecha, turnoId);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.cantidadPersonas) {
      newErrors.cantidadPersonas = 'La cantidad de personas es requerida';
    } else if (parseInt(formData.cantidadPersonas) < 1) {
      newErrors.cantidadPersonas = 'La cantidad debe ser al menos 1';
    } else if (parseInt(formData.cantidadPersonas) > maxPersonas) {
      newErrors.cantidadPersonas = `La cantidad máxima es ${maxPersonas} personas (según disponibilidad)`;
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      // Verificar que la fecha seleccionada esté disponible y tenga cupos
      const selectedDate = safeParseDate(formData.fecha);
      selectedDate.setHours(0, 0, 0, 0);
      
      const fechaSeleccionada = fechasConCupos.find(fecha => {
        const availableDate = safeParseDate(fecha.fecha);
        availableDate.setHours(0, 0, 0, 0);
        return selectedDate.getTime() === availableDate.getTime();
      });
      
      if (!fechaSeleccionada) {
        newErrors.fecha = 'La fecha seleccionada no está disponible para meriendas libres';
      } else if (!fechaSeleccionada.disponible) {
        newErrors.fecha = 'Esta fecha ya no tiene cupos disponibles';
      } else if (fechaSeleccionada.cuposDisponibles < parseInt(formData.cantidadPersonas)) {
        newErrors.fecha = `Solo quedan ${fechaSeleccionada.cuposDisponibles} cupos disponibles para esta fecha`;
      }
    }

    if (!formData.turno) {
      newErrors.turno = 'El turno es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Guardar los datos en localStorage y redirigir a pago
      const reservaDataForPayment = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        cantidadPersonas: formData.cantidadPersonas,
        fecha: formData.fecha ? (() => {
          // HACK RAILWAY: Agregar 1 día para compensar timezone UTC vs Argentina
          const fechaAjustada = new Date(formData.fecha);
          fechaAjustada.setDate(fechaAjustada.getDate() + 1);
          return fechaAjustada.toISOString().split('T')[0];
        })() : '',
        turno: formData.turno,
        tipoReserva: formData.tipoReserva,
      };
      localStorage.setItem('reservaData', JSON.stringify(reservaDataForPayment));
      window.location.href = '/pago';
      
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      setErrors({ submit: 'Error al procesar la reserva. Por favor, inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    
    // Capitalizar la primera letra del día
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  // Función para filtrar fechas en el DatePicker
  const filterDate = (date: Date) => {
    const dateToCheck = safeParseDate(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Excluir domingos (local cerrado)
    const dayOfWeek = dateToCheck.getDay();
    if (dayOfWeek === 0) { // 0 = domingo
      return false;
    }
    
    return fechasConCupos.some(fecha => {
      const availableDate = safeParseDate(fecha.fecha);
      availableDate.setHours(0, 0, 0, 0);
      return dateToCheck.getTime() === availableDate.getTime() && fecha.disponible;
    });
  };

  return (
    <div className={styles.bgBeige}>
      <Navbar />
      <div className={styles.container}>
      <div className={styles.headerDecor}></div>
        <section className={styles.hero}>
          <h1 className={styles.tituloPrincipal}>Reservar Merienda Libre</h1>
          <div className={styles.promoOliviaWrapper}>
            <span className={styles.promoLinea}></span>
            <span className={styles.promoCorazon}>♥</span>
            <span className={styles.promoLinea}></span>
          </div>
          <p className={styles.subtitle}>Completa el formulario para realizar tu reserva</p>
          
        </section>

        <div className={styles.formularioContainer}>
          <h2 className={styles.formularioTitulo}>Formulario de Reserva</h2>
          
          {submitSuccess && (
            <div className={styles.success}>
              ¡Reserva enviada exitosamente! Te contactaremos pronto para confirmar los detalles.
            </div>
          )}

          {errors.submit && (
            <div className={styles.error}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre" className={styles.label}>
                Nombre completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Ingresa tu nombre completo"
              />
              {errors.nombre && <div className={styles.error}>{errors.nombre}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono" className={styles.label}>
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Ingresa tu teléfono"
              />
              {errors.telefono && <div className={styles.error}>{errors.telefono}</div>}
            </div>



            <div className={styles.formGroup}>
              <label htmlFor="fecha" className={styles.label}>
                Fecha *
              </label>
              <div className={styles.datePickerContainer}>
                <DatePicker
                  selected={formData.fecha}
                  onChange={handleDateChange}
                  className={styles.datePicker}
                  filterDate={filterDate}
                  dateFormat="yyyy-MM-dd"
                  placeholderText={loading ? "Cargando fechas..." : "Selecciona una fecha"}
                  disabled={loading}
                />
              </div>
              {errors.fecha && <div className={styles.error}>{errors.fecha}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Turno *
              </label>
              <div className={styles.turnosContainer}>
                {loadingHorarios ? (
                  <p>Cargando turnos disponibles...</p>
                ) : horariosConCupos.length === 0 && formData.fecha ? (
                  <p>No hay turnos disponibles para esta fecha</p>
                ) : (
                  horariosConCupos.map(horario => (
                    <button
                      key={horario.horario}
                      type="button"
                      className={`${styles.turnoButton} ${formData.turno === horario.horario ? styles.turnoButtonActive : ''} ${!horario.disponible ? styles.turnoButtonDisabled : ''}`}
                      onClick={() => horario.disponible && handleTurnoChange(horario.horario)}
                      disabled={!horario.disponible}
                      title={horario.disponible ? `${horario.cuposDisponibles} lugares disponibles` : 'Sin cupos disponibles'}
                    >
                      {horario.horario} 
                      {horario.disponible && (
                        <span className={styles.cuposInfo}>
                          ({horario.cuposDisponibles} lugares)
                        </span>
                      )}
                      {!horario.disponible && (
                        <span className={styles.sinCupos}>Sin cupos</span>
                      )}
                    </button>
                  ))
                )}
              </div>
              {errors.turno && <div className={styles.error}>{errors.turno}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cantidadPersonas" className={styles.label}>
                Cantidad de personas *
                {formData.turno && (
                  <span className={styles.cuposInfo}>
                    {loadingCupos ? 'Cargando cupos...' : `${cuposDisponibles} cupos disponibles`}
                  </span>
                )}
              </label>
              <div className={styles.customSelectWrapper}>
                <div 
                  className={`${styles.customSelect} ${formData.cantidadPersonas ? styles.customSelectSelected : ''}`}
                  onClick={() => {
                    const dropdown = document.getElementById('cantidadDropdown');
                    dropdown?.classList.toggle(styles.show);
                  }}
                >
                  <div className={styles.customSelectValue}>
                    <img 
                      src={formData.cantidadPersonas === '1' ? "/persona.png" : "/grupo.png"} 
                      alt={formData.cantidadPersonas === '1' ? "persona" : "personas"} 
                      className={styles.selectIconLeft}
                    />
                    <span>
                      {formData.cantidadPersonas 
                        ? (formData.cantidadPersonas === '1' 
                          ? `${formData.cantidadPersonas} persona` 
                          : `${formData.cantidadPersonas} personas`)
                        : 'Selecciona la cantidad de personas'
                      }
                    </span>
                  </div>
                  <div className={styles.customSelectArrow}>▼</div>
                </div>
                <div id="cantidadDropdown" className={styles.customSelectDropdown}>
                  {Array.from({ length: Math.max(0, maxPersonas) }, (_, i) => i + 1).map(num => (
                    <div
                      key={num}
                      className={`${styles.customSelectOption} ${num > maxPersonas ? styles.disabled : ''}`}
                      onClick={() => {
                        if (num <= maxPersonas) {
                          setFormData(prev => ({ ...prev, cantidadPersonas: num.toString() }));
                          if (errors.cantidadPersonas) {
                            setErrors(prev => ({ ...prev, cantidadPersonas: '' }));
                          }
                          const dropdown = document.getElementById('cantidadDropdown');
                          dropdown?.classList.remove(styles.show);
                        }
                      }}
                    >
                      <img 
                        src={num === 1 ? "/persona.png" : "/grupo.png"} 
                        alt={num === 1 ? "persona" : "personas"} 
                        className={styles.selectIconLeft}
                      />
                      <span>
                        {num === 1 ? `${num} persona` : `${num} personas`}
                        {num > maxPersonas && ` (No disponible)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {errors.cantidadPersonas && <div className={styles.error}>{errors.cantidadPersonas}</div>}
              {formData.turno && cuposDisponibles === 0 && (
                <div className={styles.error}>No hay cupos disponibles para este turno</div>
              )}
            </div>

            <div className={styles.fechasDisponibles}>
              <h3>Próximas Fechas</h3>
              <div className={styles.fechasList}>
                {loading ? (
                  <div>Cargando fechas disponibles...</div>
                ) : fechasConCupos.length === 0 ? (
                  <div>No hay fechas disponibles en este momento</div>
                ) : (
                  Array.from({ length: Math.ceil(fechasConCupos.length / 2) }, (_, groupIndex) => {
                    const startIndex = groupIndex * 2;
                    const groupDates = fechasConCupos.slice(startIndex, startIndex + 2);
                    
                    return (
                      <div key={groupIndex}>
                        <div className={styles.fechasGroup}>
                          {groupDates.map((fecha, index) => (
                            <div key={startIndex + index} className={styles.fechaItemContainer}>
                              <span className={`${styles.fechaItem} ${!fecha.disponible ? styles.fechaNoDisponible : ''}`}>
                                {formatDate(fecha.fecha)}
                              </span>
                              {!fecha.disponible && (
                                <span className={styles.cuposAgotados}>
                                  No disponible
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        {groupIndex < Math.ceil(fechasConCupos.length / 2) - 1 && (
                          <div className={styles.fechasDecorador}></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Procesando...' : 'Continuar al Pago'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 