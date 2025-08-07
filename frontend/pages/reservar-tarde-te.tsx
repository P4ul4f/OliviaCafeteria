import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from '../styles/reservar.module.css';
import { ReservaData, apiService } from '../services/api';

interface HorarioConCupos {
  horario: string;
  disponible: boolean;
  cuposDisponibles: number;
}

export default function ReservarTardeTe() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    cantidadPersonas: '',
    fecha: null as Date | null,
    turno: '',
    tipoReserva: 'tarde-te' as const
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [horariosConCupos, setHorariosConCupos] = useState<HorarioConCupos[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loadingCupos, setLoadingCupos] = useState(false);
  const [cuposDisponibles, setCuposDisponibles] = useState(0);
  const [maxPersonas, setMaxPersonas] = useState(0);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Cerrar dropdown de cantidad si se hace clic fuera de su wrapper
      const cantidadWrapper = target.closest('#cantidadWrapper');
      const cantidadDropdown = document.getElementById('cantidadDropdown');
      if (!cantidadWrapper && cantidadDropdown) {
        cantidadDropdown.classList.remove(styles.show);
      }
      
      // Cerrar dropdown de horario si se hace clic fuera de su wrapper
      const horarioWrapper = target.closest('#horarioWrapper');
      const horarioDropdown = document.getElementById('horarioDropdown');
      if (!horarioWrapper && horarioDropdown) {
        horarioDropdown.classList.remove(styles.show);
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

  // Función para cargar cupos disponibles
  const loadCuposDisponibles = async (fecha: Date, horario: string) => {
    if (!fecha || !horario) return;
    
    try {
      setLoadingCupos(true);
      const cuposData = await apiService.getCuposDisponibles(fecha, horario, 'tarde-te');
      setCuposDisponibles(cuposData.cuposDisponibles);
      // Para tardes de té: máximo 10 personas por reserva
      setMaxPersonas(Math.min(cuposData.cuposDisponibles, 10));
    } catch (error) {
      console.error('Error cargando cupos disponibles:', error);
      setCuposDisponibles(0);
      setMaxPersonas(0);
    } finally {
      setLoadingCupos(false);
    }
  };

  const loadHorariosDisponibles = async () => {
    if (!formData.fecha) {
      setHorariosConCupos([]);
      return;
    }

    try {
      setLoadingHorarios(true);
      // Usar el nuevo endpoint que incluye información de cupos por turno
      const horariosData = await apiService.getHorariosDisponiblesConCupos(formData.fecha, 'tarde-te');
      setHorariosConCupos(horariosData);
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
      turno: '' // Limpiar turno cuando cambie la fecha
    }));
    
    if (errors.fecha) {
      setErrors(prev => ({
        ...prev,
        fecha: ''
      }));
    }
  };

  const handleHorarioChange = (horario: string) => {
    setFormData(prev => ({
      ...prev,
      turno: horario
    }));
    
    if (errors.turno) {
      setErrors(prev => ({
        ...prev,
        turno: ''
      }));
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
    } else if (parseInt(formData.cantidadPersonas) < 10) {
      newErrors.cantidadPersonas = 'Para Tardes de Té se requiere un mínimo de 10 personas';
    } else if (parseInt(formData.cantidadPersonas) > 40) {
      newErrors.cantidadPersonas = 'La cantidad máxima es 40 personas';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.fecha);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fecha = 'La fecha no puede ser anterior a hoy';
      }
      
      // Verificar que sea al menos 48 horas de anticipación
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 2);
      
      if (selectedDate < minDate) {
        newErrors.fecha = 'Se requiere al menos 48 horas de anticipación';
      }
      
      // Verificar que no sea domingo
      const dayOfWeek = selectedDate.getDay();
      if (dayOfWeek === 0) { // 0 = domingo
        newErrors.fecha = 'No se realizan reservas los domingos';
      }
    }

    if (!formData.turno) {
      newErrors.turno = 'El turno es requerido';
    } else {
      // Verificar que el turno seleccionado tenga cupos disponibles
      const horarioSeleccionado = horariosConCupos.find(h => h.horario === formData.turno);
      if (!horarioSeleccionado) {
        newErrors.turno = 'El horario seleccionado no está disponible';
      } else if (!horarioSeleccionado.disponible) {
        newErrors.turno = 'Este horario ya no tiene cupos disponibles';
      } else if (horarioSeleccionado.cuposDisponibles < 1) {
        newErrors.turno = `Este horario ya no tiene reservas disponibles`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        cantidadPersonas: formData.cantidadPersonas,
        fecha: formData.fecha ? formData.fecha.toLocaleDateString('es-ES') : '',
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

  return (
    <div className={styles.bgBeige}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.headerDecor}></div>
        
        <section className={styles.hero}>
          <h1 className={styles.tituloPrincipal}>Reservar Tarde de Té</h1>
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
              <label htmlFor="cantidadPersonas" className={styles.label}>
                Cantidad de personas (mínimo 10) *
                {formData.turno && (
                  <span className={styles.cuposInfo}>
                    {loadingCupos ? 'Cargando cupos...' : `${cuposDisponibles} cupos disponibles`}
                  </span>
                )}
              </label>
              <div className={styles.customSelectWrapper} id="cantidadWrapper">
                <div 
                  className={`${styles.customSelect} ${formData.cantidadPersonas ? styles.customSelectSelected : ''}`}
                  onClick={() => {
                    const dropdown = document.getElementById('cantidadDropdown');
                    dropdown?.classList.toggle(styles.show);
                  }}
                >
                  <div className={styles.customSelectValue}>
                    <img 
                      src="/grupo.png" 
                      alt="personas" 
                      className={styles.selectIconLeft}
                    />
                    <span>
                      {formData.cantidadPersonas 
                        ? `${formData.cantidadPersonas} personas`
                        : 'Selecciona la cantidad de personas'
                      }
                    </span>
                  </div>
                  <div className={styles.customSelectArrow}>▼</div>
                </div>
                <div id="cantidadDropdown" className={styles.customSelectDropdown}>
                  {Array.from({ length: Math.min(maxPersonas - 9, 31) }, (_, i) => i + 10).map(num => (
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
                        src="/grupo.png" 
                        alt="personas" 
                        className={styles.selectIconLeft}
                      />
                      <span>
                        {`${num} personas`}
                        {num > maxPersonas && ` (No disponible)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {errors.cantidadPersonas && <div className={styles.error}>{errors.cantidadPersonas}</div>}
              {formData.turno && cuposDisponibles === 0 && (
                <div className={styles.error}>No hay cupos disponibles para este horario</div>
              )}
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
                  minDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona una fecha"
                />
              </div>
              <div className={styles.infoRestricciones}>
                <p>⚠️ Las reservas para Tarde de Té requieren al menos 48 horas de anticipación. Solo se muestran fechas válidas.</p>
              </div>
              {errors.fecha && <div className={styles.error}>{errors.fecha}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Horario *
              </label>
              <div className={styles.customSelectWrapper} id="horarioWrapper">
                <div 
                  className={`${styles.customSelect} ${formData.turno ? styles.customSelectSelected : ''}`}
                  onClick={() => {
                    const dropdown = document.getElementById('horarioDropdown');
                    dropdown?.classList.toggle(styles.show);
                  }}
                >
                  <div className={styles.customSelectValue}>
                    <img 
                      src="/reloj.png" 
                      alt="horario" 
                      className={styles.selectIconLeft}
                    />
                    <span>
                      {formData.turno || 'Selecciona un horario'}
                    </span>
                  </div>
                  <div className={styles.customSelectArrow}>▼</div>
                </div>
                <div id="horarioDropdown" className={styles.customSelectDropdown}>
                  {loadingHorarios ? (
                    <div className={styles.customSelectOption}>
                      <img 
                        src="/reloj.png" 
                        alt="horario" 
                        className={styles.selectIconLeft}
                      />
                      <span>⏳ Cargando horarios disponibles...</span>
                    </div>
                  ) : horariosConCupos.length > 0 ? (
                    horariosConCupos.map(horario => (
                      <div
                        key={horario.horario}
                        className={`${styles.customSelectOption} ${!horario.disponible ? styles.optionDisabled : ''}`}
                        onClick={() => {
                          if (horario.disponible) {
                            setFormData(prev => ({ ...prev, turno: horario.horario }));
                            if (errors.turno) {
                              setErrors(prev => ({ ...prev, turno: '' }));
                            }
                            // Cargar cupos disponibles cuando se selecciona un horario
                            loadCuposDisponibles(formData.fecha!, horario.horario);
                          }
                          const dropdown = document.getElementById('horarioDropdown');
                          dropdown?.classList.remove(styles.show);
                        }}
                      >
                        <img 
                          src="/reloj.png" 
                          alt="horario" 
                          className={styles.selectIconLeft}
                        />
                        <span>
                          {horario.horario}
                          {!horario.disponible && (
                            <span className={styles.cuposAgotados}>
                              {' '}(No disponible)
                            </span>
                          )}
                        </span>
                      </div>
                    ))
                  ) : formData.fecha ? (
                    <div className={styles.customSelectOption}>
                      <img 
                        src="/reloj.png" 
                        alt="horario" 
                        className={styles.selectIconLeft}
                      />
                      <span>No hay horarios disponibles para esta fecha</span>
                    </div>
                  ) : (
                    <div className={styles.customSelectOption}>
                      <img 
                        src="/reloj.png" 
                        alt="horario" 
                        className={styles.selectIconLeft}
                      />
                      <span>Primero selecciona una fecha válida</span>
                    </div>
                  )}
                </div>
              </div>
              {errors.turno && <div className={styles.error}>{errors.turno}</div>}
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Continuar al Pago'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 