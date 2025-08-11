import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from '../styles/reservar.module.css';
import { apiService } from '../services/api';

export default function ReservarALaCarta() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    cantidadPersonas: '',
    fecha: null as Date | null,
    turno: '',
    tipoReserva: 'a-la-carta' as const
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Generar horarios disponibles como en tardes de té
  const generarHorarios = () => {
    const horarios = [];
    
    // Horarios de mañana: 9:00 - 13:00 (cada 30 minutos)
    for (let hora = 9; hora <= 12; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 12 && minuto === 30) break; // No incluir 12:30
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        horarios.push(`${horaStr}:${minutoStr}`);
      }
    }
    
    // Horarios de tarde: 17:00 - 20:30 (cada 30 minutos)
    for (let hora = 17; hora <= 20; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        if (hora === 20 && minuto === 30) break; // No incluir 20:30
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        horarios.push(`${horaStr}:${minutoStr}`);
      }
    }
    
    return horarios;
  };

  const horariosDisponibles = generarHorarios();

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
      fecha: date
    }));
    
    // Limpiar cupos y cantidad de personas cuando cambia la fecha
    setCuposDisponibles(0);
    setMaxPersonas(0);
    setFormData(prev => ({ ...prev, cantidadPersonas: '' }));
    
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
    
    // Limpiar cantidad de personas cuando cambia el horario
    setFormData(prev => ({ ...prev, cantidadPersonas: '' }));
    
    if (errors.turno) {
      setErrors(prev => ({
        ...prev,
        turno: ''
      }));
    }
    
    // Cargar cupos disponibles cuando se selecciona un horario
    if (formData.fecha) {
      loadCuposDisponibles(formData.fecha, horario);
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
    } else if (parseInt(formData.cantidadPersonas) > 10) {
      newErrors.cantidadPersonas = 'La cantidad máxima es 10 personas para reservas a la carta';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      // Verificar que la fecha no sea anterior a hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.fecha);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fecha = 'La fecha no puede ser anterior a hoy';
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
        cantidadPersonas: formData.cantidadPersonas,
        fecha: formData.fecha ? formData.fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : '',
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

  // Función para filtrar fechas en el DatePicker (solo fechas futuras)
  const filterDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return dateToCheck >= today;
  };

  // Función para cargar cupos disponibles
  const loadCuposDisponibles = async (fecha: Date, horario: string) => {
    if (!fecha || !horario) return;
    
    try {
      setLoadingCupos(true);
      console.log('🔍 Cargando cupos para:', { fecha: fecha.toISOString(), horario, tipoReserva: 'a-la-carta' });
      
      const cuposData = await apiService.getCuposDisponibles(fecha, horario, 'a-la-carta');
      console.log('📊 Datos de cupos recibidos:', cuposData);
      
      setCuposDisponibles(cuposData.cuposDisponibles);
      // Para a la carta: máximo 10 personas por reserva
      setMaxPersonas(Math.min(cuposData.cuposDisponibles, 10));
      
      console.log('✅ Cupos configurados:', { cuposDisponibles: cuposData.cuposDisponibles, maxPersonas: Math.min(cuposData.cuposDisponibles, 10) });
    } catch (error) {
      console.error('❌ Error cargando cupos disponibles:', error);
      setCuposDisponibles(0);
      setMaxPersonas(0);
    } finally {
      setLoadingCupos(false);
    }
  };

  return (
    <div className={styles.bgBeige}>
      <Navbar />
      <div className={styles.container}>
      <div className={styles.headerDecor}></div>
        <section className={styles.hero}>
          <h1 className={styles.tituloPrincipal}>Reservar A la Carta</h1>
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
                  placeholderText="Selecciona una fecha"
                  minDate={new Date()}
                />
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
                  {horariosDisponibles.map(horario => (
                    <div
                      key={horario}
                      className={styles.customSelectOption}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, turno: horario }));
                        if (errors.turno) {
                          setErrors(prev => ({ ...prev, turno: '' }));
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
                      <span>{horario}</span>
                    </div>
                  ))}
                </div>
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
                  {Array.from({ length: Math.min(maxPersonas, 10) }, (_, i) => i + 1).map(num => (
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
                <div className={styles.error}>No hay cupos disponibles para este horario</div>
              )}
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