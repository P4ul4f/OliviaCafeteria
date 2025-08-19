import styles from '../../styles/admin.module.css';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

type Reserva = {
  id: number;
  nombre: string;
  telefono?: string;
  cantidadPersonas: number;
  fecha: Date;
  turno: string;
  tipoReserva: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  createdAt?: Date;
  metodoPago?: string;
  idPagoExterno?: string;
};

export default function ReservasPanel() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError('');
      const reservasData = await apiService.getReservas();
      
      // Convertir fechas de string a Date y ordenar por fecha de creación (más recientes primero)
      const reservasConFechas = reservasData.map((reserva: any) => ({
        ...reserva,
        fecha: new Date(reserva.fecha),
        createdAt: reserva.createdAt ? new Date(reserva.createdAt) : new Date()
      })).sort((a: Reserva, b: Reserva) => {
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      });
      
      setReservas(reservasConFechas);
      console.log(`📋 Cargadas ${reservasConFechas.length} reservas en el panel admin`);
    } catch (error) {
      console.error('❌ Error cargando reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = (id: number, nuevo: Reserva['estado']) => {
    setReservas(reservas.map(r => r.id === id ? { ...r, estado: nuevo } : r));
  };

  const formatearFecha = (fecha: Date) => {
    try {
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className={styles.adminPanel}>
        <h3>Reservas</h3>
        <p>Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.adminPanel}>
        <h3>Reservas</h3>
        <div className={styles.error}>
          <p>{error}</p>
          <button className={styles.button} onClick={cargarReservas}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPanel}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Reservas ({reservas.length})</h3>
        <button className={styles.buttonSecondary} onClick={cargarReservas}>
          🔄 Actualizar
        </button>
      </div>
      
      {reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <div className={styles.reservasList}>
          {reservas.map(r => (
            <div key={r.id} className={styles.reservaItem}>
              <div className={styles.reservaInfo}>
                <div className={styles.reservaHeader}>
                  <strong>{r.nombre}</strong>
                  <span className={`${styles.badge} ${styles[`badge${r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}`]}`}>
                    {r.estado}
                  </span>
                </div>
                <div className={styles.reservaDetails}>
                  <span>📅 {formatearFecha(r.fecha)} a las {r.turno}</span>
                  <span>👥 {r.cantidadPersonas} persona{r.cantidadPersonas !== 1 ? 's' : ''}</span>
                  <span>🎯 {r.tipoReserva?.replace('_', ' ').toLowerCase()}</span>
                  {r.telefono && <span>📞 {r.telefono}</span>}
                  {r.metodoPago && <span>💳 {r.metodoPago}</span>}
                </div>
              </div>
              <div className={styles.reservaActions}>
                <button 
                  className={styles.button} 
                  onClick={() => cambiarEstado(r.id, 'confirmada')}
                  disabled={r.estado === 'confirmada'}
                >
                  ✅ Confirmar
                </button>
                <button 
                  className={styles.buttonDanger} 
                  onClick={() => cambiarEstado(r.id, 'cancelada')}
                  disabled={r.estado === 'cancelada'}
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 