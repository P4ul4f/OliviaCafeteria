import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../styles/admin.module.css';
import reservarStyles from '../../styles/reservar.module.css';
import { apiService } from '../../services/api';

function ConfirmModal({ open, onClose, onConfirm, mensaje }: any) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Confirmar acción</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>×</button>
        </div>
        <p>{mensaje}</p>
        <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px'}}>
          <button className={styles.buttonSecondary} onClick={onClose}>Cancelar</button>
          <button className={styles.button} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ open, onClose, mensaje }: any) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <p style={{color: '#c2d29b', fontSize: '16px', textAlign: 'center', margin: '20px 0'}}>{mensaje}</p>
      </div>
    </div>
  );
}

export default function MeriendasLibresPanel() {
  // Helper function para formatear fechas sin problemas de timezone
  const formatDateForBackend = (date: Date): string => {
    // Crear una nueva fecha con la fecha seleccionada pero a mediodía para evitar timezone
    const fechaMediodia = new Date(date);
    fechaMediodia.setHours(12, 0, 0, 0);
    
    // Convertir a formato YYYY-MM-DD
    const year = fechaMediodia.getFullYear();
    const month = String(fechaMediodia.getMonth() + 1).padStart(2, '0');
    const day = String(fechaMediodia.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const [fechas, setFechas] = useState<any[]>([]);
  const [fechasEdit, setFechasEdit] = useState<any[]>([]); // Para edición en lote
  const [precio, setPrecio] = useState<number>(0);
  const [precioEdit, setPrecioEdit] = useState<number>(0);
  const [cupos, setCupos] = useState<number>(40);
  const [cuposEdit, setCuposEdit] = useState<number>(40);
  const [precioError, setPrecioError] = useState<string>('');
  const [cuposError, setCuposError] = useState<string>('');
  const [fechasError, setFechasError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fechaAEliminar, setFechaAEliminar] = useState<number | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState<any|null>(null);

  // Estados para contenido configurable
  const [contenido, setContenido] = useState<any>(null);
  const [contenidoLoading, setContenidoLoading] = useState(true);

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  useEffect(() => {
    cargarDatos();
    cargarContenido();
  }, []);



  // Al cargar los datos, normalizar turnos a array de strings:
  const cargarDatos = async () => {
    setLoading(true);
    setFechasError('');
    try {
      const fechasData = await apiService.getFechasConfig();
      // Normalizar turnos
      const normalizadas = fechasData.map((f: any) => {
        let turnos: string[] = [];
        
        if (Array.isArray(f.turnos) && f.turnos.length && typeof f.turnos[0] === 'string') {
          // Ya está en el formato correcto
          turnos = f.turnos;
        } else if (Array.isArray(f.turnosDisponibles)) {
          // Caso legacy: turnosDisponibles
          turnos = f.turnosDisponibles;
        } else if (f.turnosDisponibles && typeof f.turnosDisponibles === 'object') {
          // Objeto con mañana/tarde
          for (const key of Object.keys(f.turnosDisponibles)) {
            const turno = f.turnosDisponibles[key];
            if (turno && typeof turno.horario === 'string' && turno.horario.trim() !== '') {
              const partes = turno.horario.split(/y|Y/).map((s: string) => s.trim()).filter(Boolean);
              turnos.push(...partes);
            }
          }
        } else if (typeof f.turnosDisponibles === 'string') {
          const partes = f.turnosDisponibles.split(/y|Y/).map((s: string) => s.trim()).filter(Boolean);
          turnos = partes;
        }
        
        return {
          ...f,
          turnos: turnos
        };
      });
      setFechas(normalizadas.filter((f: any) => f.activo || new Date(f.fecha) >= new Date()));
      setFechasEdit(normalizadas.filter((f: any) => f.activo || new Date(f.fecha) >= new Date()));
      const precioData = await apiService.getPrecioMeriendaLibre();
      setPrecio(precioData);
      setPrecioEdit(precioData);
      const cuposData = await apiService.getCuposMeriendasLibres();
      setCupos(cuposData);
      setCuposEdit(cuposData);
    } catch (err) {
      setFechasError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar contenido configurable
  const cargarContenido = async () => {
    try {
      setContenidoLoading(true);
      const contenidoActual = await apiService.getMeriendasLibresContenido();
      
      if (contenidoActual) {
        setContenido(contenidoActual);
      } else {
        console.error('No se pudo cargar contenido desde la BD');
      }
    } catch (error) {
      console.error('Error cargando contenido:', error);
    } finally {
      setContenidoLoading(false);
    }
  };

  // Funciones para manejar contenido configurable
  const handleContenidoChange = (categoria: string, index: number, value: string) => {
    if (!contenido) return;
    
    const nuevoContenido = { ...contenido };
    if (categoria === 'dulces') {
      nuevoContenido.dulces = [...contenido.dulces];
      nuevoContenido.dulces[index] = value;
    } else if (categoria === 'salados') {
      nuevoContenido.salados = [...contenido.salados];
      nuevoContenido.salados[index] = value;
    } else if (categoria === 'bebidas') {
      nuevoContenido.bebidas = [...contenido.bebidas];
      nuevoContenido.bebidas[index] = value;
    }
    setContenido(nuevoContenido);
  };

  const agregarItem = (categoria: string) => {
    if (!contenido) return;
    
    const nuevoContenido = { ...contenido };
    if (categoria === 'dulces') {
      nuevoContenido.dulces = [...contenido.dulces, ''];
    } else if (categoria === 'salados') {
      nuevoContenido.salados = [...contenido.salados, ''];
    } else if (categoria === 'bebidas') {
      nuevoContenido.bebidas = [...contenido.bebidas, ''];
    }
    setContenido(nuevoContenido);
  };

  const eliminarItem = (categoria: string, index: number) => {
    if (!contenido) return;
    
    const nuevoContenido = { ...contenido };
    if (categoria === 'dulces') {
      nuevoContenido.dulces = contenido.dulces.filter((_: any, i: number) => i !== index);
    } else if (categoria === 'salados') {
      nuevoContenido.salados = contenido.salados.filter((_: any, i: number) => i !== index);
    } else if (categoria === 'bebidas') {
      nuevoContenido.bebidas = contenido.bebidas.filter((_: any, i: number) => i !== index);
    }
    setContenido(nuevoContenido);
  };

  const guardarContenido = async () => {
    if (!contenido) return;

    try {
      // Validar que el contenido tenga la estructura correcta
      if (!contenido.dulces || !contenido.salados || !contenido.bebidas) {
        console.error('Contenido inválido:', contenido);
        return;
      }

      // Filtrar elementos vacíos antes de guardar
      const contenidoLimpio = {
        dulces: contenido.dulces.filter((item: string) => item.trim() !== ''),
        salados: contenido.salados.filter((item: string) => item.trim() !== ''),
        bebidas: contenido.bebidas.filter((item: string) => item.trim() !== '')
      };
      
      await apiService.updateMeriendasLibresContenido(contenidoLimpio, adminToken || '');
      
      // Recargar contenido desde la base de datos para asegurar sincronización
      await cargarContenido();
      
      setSuccessMessage('Contenido de Meriendas Libres actualizado exitosamente');
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch (error) {
      console.error('Error al guardar contenido:', error);
    }
  };

  // --- Precio ---
  const handlePrecioChange = (e: any) => {
    setPrecioEdit(Number(e.target.value));
  };

  const handleCuposChange = (e: any) => {
    setCuposEdit(Number(e.target.value));
  };

  const handlePrecioSave = async () => {
    try {
      setPrecioError('');
      await apiService.updatePrecioMeriendaLibre(precioEdit, adminToken || '');
      setPrecio(precioEdit);
      setSuccessMessage('Precio actualizado correctamente.');
      setSuccessModalOpen(true);
    } catch (err) {
      setPrecioError('Error al actualizar precio');
    }
  };

  const handleCuposSave = async () => {
    try {
      setCuposError('');
      await apiService.updateCuposMeriendasLibres(cuposEdit, adminToken || '');
      setCupos(cuposEdit);
      setSuccessMessage('Cupos actualizados correctamente.');
      setSuccessModalOpen(true);
    } catch (err) {
      setCuposError('Error al actualizar cupos');
    }
  };

  // --- Fechas y turnos (edición en lote) ---
  const handleFechaEdit = (id: number, nuevaFecha: Date) => {
    setFechasEdit(fechasEdit.map(f => f.id === id ? { ...f, fecha: nuevaFecha } : f));
  };
  const handleTurnoEdit = (id: number, turno: 'mañana'|'tarde', campo: string, valor: any) => {
    setFechasEdit(fechasEdit.map(f => {
      if (f.id !== id) return f;
      return {
        ...f,
        turnosDisponibles: {
          ...f.turnosDisponibles,
          [turno]: {
            ...f.turnosDisponibles[turno],
            [campo]: campo === 'cupos' ? Number(valor) : valor
          }
        }
      };
    }));
  };
  const handleObsEdit = (id: number, valor: string) => {
    setFechasEdit(fechasEdit.map(f => f.id === id ? { ...f, observaciones: valor } : f));
  };
  const handleGuardarFechas = async () => {
    setFechasError('');
    try {
      const fechasToUpdate = fechasEdit.filter(f => f.id).map(f => ({
        ...f,
        fecha: f.fecha ? formatDateForBackend(new Date(f.fecha)) : null // Usar helper function
      }));
      
      for (const fecha of fechasToUpdate) {
        await apiService.updateFechaConfig(fecha.id, fecha, adminToken || '');
      }
      // Recargar datos del servidor para asegurar sincronización
      await cargarDatos();
      setSuccessMessage('Fechas y turnos actualizados correctamente.');
      setSuccessModalOpen(true);
    } catch (e: any) {
      setFechasError(e.message || 'Error al guardar fechas');
    }
  };

  // --- Eliminar y agregar fecha igual que antes ---
  const handleEliminar = (id: number) => {
    setFechaAEliminar(id);
    setModalOpen(true);
  };
  const confirmarEliminar = async () => {
    if (!fechaAEliminar) return;
    setFechasError('');
    try {
      await apiService.deleteFechaConfig(fechaAEliminar, adminToken || '');
      // Recargar datos del servidor para asegurar sincronización
      await cargarDatos();
      setSuccessMessage('Fecha eliminada correctamente.');
      setSuccessModalOpen(true);
    } catch (e: any) {
      setFechasError(e.message || 'Error al eliminar fecha');
    } finally {
      setModalOpen(false);
      setFechaAEliminar(null);
    }
  };

  const handleAgregarNueva = () => {
    // Crear fecha actual sin problemas de timezone
    const hoy = new Date();
    hoy.setHours(12, 0, 0, 0); // Establecer a mediodía para evitar problemas de timezone
    
    setNuevaFecha({
      fecha: hoy,
      turnos: [''],
      activo: true,
      observaciones: ''
    });
  };

  const handleNuevaFechaChange = (campo: string, valor: any) => {
    setNuevaFecha(nuevaFecha ? { ...nuevaFecha, [campo]: valor } : null);
  };

  const handleNuevaTurnoChange = (idx: number, valor: string) => {
    if (!nuevaFecha) return;
    const newTurnos = [...nuevaFecha.turnos];
    newTurnos[idx] = valor;
    setNuevaFecha({ ...nuevaFecha, turnos: newTurnos });
  };

  const handleNuevaTurnoAdd = () => {
    if (!nuevaFecha) return;
    setNuevaFecha({ ...nuevaFecha, turnos: [...nuevaFecha.turnos, ''] });
  };

  const handleNuevaTurnoDelete = (idx: number) => {
    if (!nuevaFecha) return;
    const newTurnos = nuevaFecha.turnos.filter((_: any, i: number) => i !== idx);
    setNuevaFecha({ ...nuevaFecha, turnos: newTurnos });
  };

  const guardarNuevaFecha = async () => {
    // Validar que haya al menos un turno no vacío
    const turnosValidos = nuevaFecha.turnos.filter((turno: string) => 
      turno.trim() !== '' && /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/.test(turno.trim())
    );

    let errorMessage = '';

    if (!nuevaFecha.fecha) {
      errorMessage = 'Debe seleccionar una fecha';
    } else if (turnosValidos.length === 0) {
      const turnosVacios = nuevaFecha.turnos.filter((t: string) => t.trim() === '').length;
      const turnosInvalidos = nuevaFecha.turnos.filter((t: string) => 
        t.trim() !== '' && !/^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/.test(t.trim())
      ).length;
      
      if (turnosVacios === nuevaFecha.turnos.length) {
        errorMessage = 'Debe agregar al menos un turno';
      } else if (turnosInvalidos > 0) {
        errorMessage = `Hay ${turnosInvalidos} turno(s) con formato inválido. Use el formato: HH:mm - HH:mm`;
      } else {
        errorMessage = 'Debe agregar al menos un turno válido (formato: HH:mm - HH:mm)';
      }
    }

    if (errorMessage) {
      setFechasError(errorMessage);
      return;
    }

    setFechasError('');
    setLoading(true);
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setFechasError('❌ No tienes permisos para realizar esta acción');
        return;
      }

      // Crear objeto con solo los turnos válidos
      const fechaData = {
        fecha: nuevaFecha.fecha ? formatDateForBackend(nuevaFecha.fecha) : null, // Usar helper function
        tipoReserva: 'merienda-libre',
        turnos: turnosValidos,
        activo: true
      };

      await apiService.createFechaConfig(fechaData, adminToken);
      
      // Recargar datos
      await cargarDatos();
      
      // Cerrar sección de nueva fecha
      setNuevaFecha(null);
      
      // Mostrar mensaje de éxito
      setSuccessMessage('✅ Fecha agregada correctamente');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error al guardar nueva fecha:', error);
      setFechasError('❌ Error al guardar la fecha');
    } finally {
      setLoading(false);
    }
  };
  const cancelarNuevaFecha = () => setNuevaFecha(null);

  // Cambiar la tabla: columna Turnos muestra un array de inputs, columna Cupos un input numérico, columna Eliminar igual.
  const handleTurnoArrayEdit = (id: number, idx: number, valor: string) => {
    setFechasEdit(fechasEdit.map(f => {
      if (f.id !== id) return f;
      const newTurnos = [...f.turnos];
      newTurnos[idx] = valor;
      return { ...f, turnos: newTurnos };
    }));
  };

  const handleTurnoArrayAdd = (id: number) => {
    setFechasEdit(fechasEdit.map(f => {
      if (f.id !== id) return f;
      return { ...f, turnos: [...f.turnos, ''] };
    }));
  };

  const handleTurnoArrayDelete = (id: number, idx: number) => {
    setFechasEdit(fechasEdit.map(f => {
      if (f.id !== id) return f;
      const newTurnos = f.turnos.filter((_: any, i: number) => i !== idx);
      return { ...f, turnos: newTurnos };
    }));
  };

  const handleCuposEdit = (id: number, idx: number, valor: string) => {
    setFechasEdit(fechasEdit.map(f => {
      if (f.id !== id) return f;
      const newTurnos = [...f.turnos];
      newTurnos[idx] = { ...newTurnos[idx], cupos: Number(valor) || 0 };
      return { ...f, turnos: newTurnos };
    }));
  };

  return (
    <div className={styles.adminPanel}>
      <h3 className={styles.meriendasLibresTitle}>Meriendas Libres</h3>
      <div className={styles.section}>
        <div className={styles.precioCuposContainer}>
          <div className={styles.precioCuposField}>
            <label className={styles.precioCuposLabel}>Precio:</label>
            <div className={styles.precioCuposInputGroup}>
              <input
                type="number"
                value={precioEdit}
                onChange={handlePrecioChange}
                className={styles.precioCuposInput}
                placeholder="Precio"
              />
              <button 
                onClick={handlePrecioSave}
                className={styles.precioCuposBtn}
                disabled={loading}
              >
                Guardar Precio
              </button>
            </div>
            {precioError && <div className={styles.precioCuposError}>{precioError}</div>}
          </div>
          <div className={styles.precioCuposField}>
            <label className={styles.precioCuposLabel}>Cupos:</label>
            <div className={styles.precioCuposInputGroup}>
              <input
                type="number"
                value={cuposEdit}
                onChange={handleCuposChange}
                className={styles.precioCuposInput}
                placeholder="Cupos"
              />
              <button 
                onClick={handleCuposSave}
                className={styles.precioCuposBtn}
                disabled={loading}
              >
                Guardar Cupos
              </button>
            </div>
            {cuposError && <div className={styles.precioCuposError}>{cuposError}</div>}
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Fechas y turnos</h2>
        <div className={styles.meriendasTableWrapper}>
          {/* Ajustar la tabla para que todas las columnas principales tengan el mismo ancho y el espacio entre columnas sea igual y pequeño. */}
          <table className={`${styles.meriendasTable} ${styles.fechasTable}`}>
          <thead>
            <tr>
              <th className={styles.meriendasTh} style={{width: '25%'}}>Fecha</th>
              <th className={styles.meriendasTh} style={{width: '60%'}}>Turnos</th>
              <th className={styles.meriendasTh} style={{width: '15%'}}>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {fechasEdit.map((f: any) => (
              <tr key={f.id} className={styles.meriendasTr}>
                <td className={styles.meriendasTd} data-label="Fecha">
                  <div className={reservarStyles.datePickerContainer}>
                    <DatePicker
                      selected={f.fecha ? new Date(f.fecha) : null}
                      onChange={(date: Date | null) => handleFechaEdit(f.id, date || new Date())}
                      className={reservarStyles.datePicker}
                      placeholderText="Seleccionar fecha"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                    />
                  </div>
                </td>
                <td className={styles.meriendasTd} data-label="Turnos">
                  <div className={`${styles.turnosArrayWrap} ${styles.turnosContainer}`}>
                    {(Array.isArray(f.turnos) ? f.turnos : []).map((turno: string, idx: number) => {
                      const regex = /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/;
                      const isValid = regex.test(turno.trim());
                      return (
                        <div key={idx} className={`${styles.turnoInputRow} ${styles.turnoItem}`}>
                          <input
                            type="text"
                            value={turno}
                            onChange={e => handleTurnoArrayEdit(f.id, idx, e.target.value)}
                            className={styles.turnoInputHorario + ' ' + (isValid ? '' : styles.turnoInputError)}
                            placeholder="HH:mm - HH:mm"
                          />
                          <button type="button" className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} onClick={() => handleTurnoArrayDelete(f.id, idx)} title="Eliminar turno">-</button>
                        </div>
                      );
                    })}
                    <button type="button" className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} onClick={() => handleTurnoArrayAdd(f.id)} title="Agregar turno">+</button>
                  </div>
                  {f.turnos && f.turnos.some((t: string) => !/^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/.test(t.trim())) && (
                    <div style={{marginTop: '8px'}}>
                      <span className={styles.turnoInputErrorMsg}>Algunos turnos tienen formato inválido</span>
                    </div>
                  )}
                </td>
                <td className={styles.meriendasTd + ' ' + styles.meriendasTdEliminar} data-label="Eliminar">
                  <button className={`${styles.buttonSecondary} ${styles.meriendasBtnEliminar} ${styles.eliminarBtn}`} onClick={() => handleEliminar(f.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      {/* Nueva fecha: debajo de la tabla, antes de los botones */}
      {nuevaFecha && (
        <div className={styles.nuevaFechaSection}>
          <h4>Agregar Nueva Fecha</h4>
          {fechasError && (
            <div style={{marginBottom: '12px', padding: '8px 12px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '6px', color: '#c53030', fontSize: '14px'}}>
              {fechasError}
            </div>
          )}
          <table className={`${styles.meriendasTable} ${styles.fechasTable}`}>
            <thead>
              <tr>
                <th className={styles.meriendasTh} style={{width: '25%'}}>Fecha</th>
                <th className={styles.meriendasTh} style={{width: '60%'}}>Turnos</th>
                <th className={styles.meriendasTh} style={{width: '15%'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.meriendasTd} data-label="Fecha">
                  <div className={reservarStyles.datePickerContainer}>
                    <DatePicker
                      selected={nuevaFecha.fecha ? new Date(nuevaFecha.fecha) : null}
                      onChange={(date: Date | null) => handleNuevaFechaChange('fecha', date || new Date())}
                      className={reservarStyles.datePicker}
                      placeholderText="Seleccionar fecha"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                    />
                  </div>
                </td>
                <td className={styles.meriendasTd} data-label="Turnos">
                  <div className={`${styles.turnosArrayWrap} ${styles.turnosContainer}`}>
                    {nuevaFecha.turnos.map((turno: string, idx: number) => {
                      const regex = /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/;
                      const isValid = turno.trim() === '' || regex.test(turno.trim());
                      return (
                        <div key={idx} className={`${styles.turnoInputRow} ${styles.turnoItem}`}>
                          <input
                            type="text"
                            value={turno}
                            onChange={e => handleNuevaTurnoChange(idx, e.target.value)}
                            className={styles.turnoInputHorario + ' ' + (isValid ? '' : styles.turnoInputError)}
                            placeholder="HH:mm - HH:mm"
                          />
                          <button type="button" className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} onClick={() => handleNuevaTurnoDelete(idx)} title="Eliminar turno">-</button>
                        </div>
                      );
                    })}
                    <button type="button" className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} onClick={handleNuevaTurnoAdd} title="Agregar turno">+</button>
                  </div>
                  {nuevaFecha.turnos.some((t: string) => t.trim() !== '' && !/^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/.test(t.trim())) && (
                    <div style={{marginTop: '8px'}}>
                      <span className={styles.turnoInputErrorMsg}>Algunos turnos tienen formato inválido</span>
                    </div>
                  )}
                </td>
                <td className={styles.meriendasTd + ' ' + styles.meriendasTdBtn} data-label="Acciones">
                  <div className={styles.buttonGroupTable}>
                    <button 
                      className={styles.saveBtnTable} 
                      onClick={guardarNuevaFecha}
                      disabled={loading || nuevaFecha.turnos.filter((t: string) => 
                        t.trim() !== '' && /^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/.test(t.trim())
                      ).length === 0}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button className={styles.buttonSecondary} onClick={() => setNuevaFecha(null)}>
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div style={{marginTop:24, marginBottom:8}}>
        <button className={styles.saveBtn} onClick={handleAgregarNueva}>+ Agregar fecha</button>
      </div>
      <button className={styles.saveBtn} style={{marginTop:8}} onClick={handleGuardarFechas}>Guardar cambios de fechas y turnos</button>
      {fechasError && <div className={styles.message} style={{color:'#b07a7a'}}>{fechasError}</div>}

      {/* Sección de Contenido Configurable */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Contenido Configurable</h2>
        <p>Edita el contenido que se muestra en la página de Meriendas Libres</p>
        <div style={{marginBottom: '10px', display: 'flex', gap: '10px'}}>
          <button 
            onClick={cargarContenido}
            style={{
              padding: '8px 16px',
              backgroundColor: '#c2d29b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Recargar Contenido
          </button>
          <button 
            onClick={async () => {
              try {
                // Guardar en la base de datos
                await apiService.updateContenidoConfig('meriendas-libres', contenido);
                
                setSuccessMessage('Contenido actualizado exitosamente');
                setSuccessModalOpen(true);
              } catch (error) {
                console.error('Error al actualizar contenido:', error);
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#8b816a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ver Estado Actual
          </button>
        </div>

        {contenidoLoading && (
          <div style={{textAlign: 'center', padding: '20px'}}>
            Cargando contenido...
          </div>
        )}
        {!contenidoLoading && !contenido && (
          <div style={{textAlign: 'center', padding: '20px', color: '#c53030'}}>
            Error al cargar el contenido. Intenta refrescar la página.
          </div>
        )}
        {!contenidoLoading && contenido && (
          <div className={styles.contenidoConfigContainer}>
            {/* Dulces */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Dulces</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenido.dulces.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('dulces', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar dulce..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('dulces', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('dulces')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            {/* Salados */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Salados</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenido.salados.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('salados', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar salado..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('salados', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('salados')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            {/* Bebidas */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Bebidas</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenido.bebidas.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('bebidas', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar bebida..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('bebidas', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('bebidas')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.buttonGroupTable}>
              <button className={styles.saveBtnTable} onClick={guardarContenido}>
                Guardar Contenido
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarEliminar}
        mensaje="¿Estás seguro de que quieres eliminar esta fecha? Esta acción no se puede deshacer."
      />
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        mensaje={successMessage}
      />
    </div>
  );
} 