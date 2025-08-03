import styles from '../../styles/admin.module.css';

type Props = {
  panel: 'meriendas' | 'tardes' | 'reservas';
  setPanel: (p: 'meriendas' | 'tardes' | 'reservas') => void;
};

export default function AdminNavbar({ panel, setPanel }: Props) {
  return (
    <nav className={styles.adminNavbar}>
      <button
        className={panel === 'meriendas' ? styles.active : ''}
        onClick={() => setPanel('meriendas')}
      >
        Meriendas Libres
      </button>
      <button
        className={panel === 'tardes' ? styles.active : ''}
        onClick={() => setPanel('tardes')}
      >
        Tardes de Té
      </button>
      <button
        className={panel === 'reservas' ? styles.active : ''}
        onClick={() => setPanel('reservas')}
      >
        Reservas
      </button>
    </nav>
  );
} 