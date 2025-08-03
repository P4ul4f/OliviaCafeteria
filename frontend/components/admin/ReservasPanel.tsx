import styles from '../../styles/admin.module.css';
import { useState } from 'react';

type Reserva = {
  id: number;
  nombre: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
};

const reservasDummy: Reserva[] = [
  { id: 1, nombre: 'Juan Pérez', estado: 'pendiente' },
  { id: 2, nombre: 'Ana Gómez', estado: 'confirmada' },
  { id: 3, nombre: 'Carlos Ruiz', estado: 'pendiente' },
];

export default function ReservasPanel() {
  const [reservas, setReservas] = useState(reservasDummy);

  const cambiarEstado = (id: number, nuevo: Reserva['estado']) => {
    setReservas(reservas.map(r => r.id === id ? { ...r, estado: nuevo } : r));
  };

  return (
    <div className={styles.adminPanel}>
      <h3>Reservas</h3>
      <ul className={styles.reservasList}>
        {reservas.map(r => (
          <li key={r.id} className={styles.reservaItem}>
            <span>{r.nombre} - <b>{r.estado}</b></span>
            <button className={styles.button} onClick={() => cambiarEstado(r.id, 'confirmada')}>Confirmar</button>
            <button className={styles.button} onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 