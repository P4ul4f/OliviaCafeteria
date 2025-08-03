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

  const turnos = [
    { id: '16:30-18:30', label: '16:30 a 18:30' },
    { id: '19:00-21:00', label: '19:00 a 21:00' }
  ];

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
    
    if (errors.fecha) {
      setErrors(prev => ({
        ...prev,
        fecha: ''
      }));
    }
  };

  const handleTurnoChange = (turnoId: string) => {
    setFormData(prev => ({
      ...prev,
      turno: turnoId
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
    } else if (parseInt(formData.cantidadPersonas) < 1) {
      newErrors.cantidadPersonas = 'La cantidad debe ser al menos 1';
    } else if (parseInt(formData.cantidadPersonas) > 30) {
      newErrors.cantidadPersonas = 'La cantidad máxima es 30 personas';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    } else {
      // Verificar que la fecha seleccionada esté disponible y tenga cupos
      const selectedDate = new Date(formData.fecha);
      selectedDate.setHours(0, 0, 0, 0);
      
      const fechaSeleccionada = fechasConCupos.find(fecha => {
        const availableDate = new Date(fecha.fecha);
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
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return fechasConCupos.some(fecha => {
      const availableDate = new Date(fecha.fecha);
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
              <label htmlFor="cantidadPersonas" className={styles.label}>
                Cantidad de personas *
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
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                    <div
                      key={num}
                      className={styles.customSelectOption}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, cantidadPersonas: num.toString() }));
                        if (errors.cantidadPersonas) {
                          setErrors(prev => ({ ...prev, cantidadPersonas: '' }));
                        }
                        const dropdown = document.getElementById('cantidadDropdown');
                        dropdown?.classList.remove(styles.show);
                      }}
                    >
                      <img 
                        src={num === 1 ? "/persona.png" : "/grupo.png"} 
                        alt={num === 1 ? "persona" : "personas"} 
                        className={styles.selectIconLeft}
                      />
                      <span>{num === 1 ? `${num} persona` : `${num} personas`}</span>
                    </div>
                  ))}
                </div>
              </div>
              {errors.cantidadPersonas && <div className={styles.error}>{errors.cantidadPersonas}</div>}
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
                {turnos.map(turno => (
                  <button
                    key={turno.id}
                    type="button"
                    className={`${styles.turnoButton} ${formData.turno === turno.id ? styles.turnoButtonActive : ''}`}
                    onClick={() => handleTurnoChange(turno.id)}
                  >
                    {turno.label}
                  </button>
                ))}
              </div>
              {errors.turno && <div className={styles.error}>{errors.turno}</div>}
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