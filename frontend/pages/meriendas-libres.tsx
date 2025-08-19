import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import styles from '../styles/meriendasLibres.module.css';
import { apiService } from '../services/api';

const gruposFechas = [
  ["Viernes 8 de Agosto", "Sábado 9 de Agosto"],
  ["Viernes 15 de Agosto", "Sábado 16 de Agosto"],
  ["Viernes 29 de Agosto", "Sábado 30 de Agosto"],
];

// Iconos SVG personalizados
function IconoTorta() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="42" rx="16" ry="4" fill="#c2d29b" opacity="0.6"/>
      <path d="M12 36 L24 16 L36 36 Z" fill="#c2d29b"/>
      <path d="M15 32 L24 20 L33 32 Z" fill="#c2d29b" opacity="0.8"/>
      <path d="M17 32 L24 23 L31 32" stroke="#ffffff" strokeWidth="2"/>
      <circle cx="22" cy="24" r="1.6" fill="#ffffff"/>
      <circle cx="26" cy="26" r="1.2" fill="#ffffff"/>
      <circle cx="20" cy="29" r="1" fill="#ffffff"/>
      <circle cx="24" cy="17" r="2" fill="#ffffff"/>
      <path d="M24 15 Q23 13 22 12" stroke="#c2d29b" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#c2d29b" strokeWidth="2"/>
      <path d="M12 6V12L16 14" stroke="#c2d29b" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconoDulce() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" fill="#c2d29b"/>
    </svg>
  );
}

function IconoSalado() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="14" height="8" rx="2" fill="#c2d29b"/>
      <path d="M5 6V4C5 3.4 5.4 3 6 3H14C14.6 3 15 3.4 15 4V6" stroke="#c2d29b" strokeWidth="1.5"/>
      <circle cx="8" cy="10" r="0.5" fill="#ffffff"/>
      <circle cx="12" cy="10" r="0.5" fill="#ffffff"/>
      <circle cx="10" cy="12" r="0.5" fill="#ffffff"/>
    </svg>
  );
}

function IconoBebida() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18C5.4 18 5 17.6 5 17V7C5 6.4 5.4 6 6 6H14C14.6 6 15 6.4 15 7V17C15 17.6 14.6 18 14 18H6Z" fill="#c2d29b"/>
      <path d="M15 7H17C17.6 7 18 7.4 18 8C18 8.6 17.6 9 17 9H15" stroke="#c2d29b" strokeWidth="1.5"/>
      <path d="M8 3C8 3 8 4 9 4C10 4 10 3 10 3M11 3C11 3 11 4 12 4C13 4 13 3 13 3" stroke="#c2d29b" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="#c2d29b" fillOpacity="0.1" stroke="#c2d29b" strokeWidth="1.5"/>
      <path d="M6 10L8.5 12.5L14 7" stroke="#c2d29b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconoInfo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="#ccbb94" fillOpacity="0.1" stroke="#ccbb94" strokeWidth="1.5"/>
      <path d="M10 7V13M10 5V5.5" stroke="#ccbb94" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SeparadorDecorativo() {
  return (
    <div className={styles.separadorDecorativo}>
      <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10H110" stroke="#c2d29b" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="60" cy="10" r="4" fill="#c2d29b"/>
        <circle cx="40" cy="10" r="2" fill="#c2d29b" fillOpacity="0.6"/>
        <circle cx="80" cy="10" r="2" fill="#c2d29b" fillOpacity="0.6"/>
      </svg>
    </div>
  );
}

// Datos de productos categorizados (se cargarán desde la API)
const productosDataDefault = {
  dulces: [
    "Cheesecake de frutos rojos",
    "Cheesecake de maracuyá", 
    "Matilda",
    "Torta de mandarina",
    "Torta de almendras",
    "3 variedad de cookies",
    "Alfajorcitos de pistachos",
    "Alfajorcitos de maicena",
    "Brownie con dulce de leche y crema",
    "Medialunas de nutella y frutilla"
  ],
  salados: [
    "Sanguchitos completos en pan de campo",
    "Sanguchitos de roquefort y jamón cocido en pan de campo", 
    "Sanguchitos jamón y queso en pan ciabatta",
    "Sanguchitos jamón crudo y rúcula en pan ciabatta",
    "Sanguches de mortadela en Focaccia",
    "Sanguches de Jamón crudo en Focaccia",
    "Sanguches de Salame en Focaccia",
    "Medialunas de jamón y queso",
    "Medialunas de palta",
    "Tostadas con palta y huevo revuelto"
  ],
  bebidas: [
    "Jugo de naranjas, limonada clásica y de frutos rojos",
    "Cafés clásicos y saborizados de vainilla o caramelo",
    "Submarino, capuchino, moka",
    "Té clásico o saborizado"
  ]
};

const comoReservarItems = [
  "Nombre completo",
  "Fecha y turno preferido", 
  "Cantidad de personas",
  "Se abona el TOTAL de todas las personas que asisten, con el fin de aprovechar al 100% el tiempo de consumición 😊"
];

// Helper para mostrar fechas al usuario en su horario local
function formatDateForDisplay(date: Date): string {
  try {
    // Mostrar la fecha tal como está (ya ajustada por safeParseDate)
    return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch (error) {
    console.error('Error formateando fecha para display:', error);
    return 'Fecha inválida';
  }
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
        // Crear fecha local a mediodía (SIN ajuste, el backend ya guardó correctamente)
        const d = new Date(year, month - 1, day, 12, 0, 0, 0);
        console.log(`🌍 Meriendas parseando fecha: ${fecha} -> ${d.toLocaleDateString('es-ES')}`);
        return d;
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

function agruparFechasPorSemana(fechas) {
  // Agrupa fechas por semana (lunes a domingo)
  if (!fechas || !fechas.length) return [];
  // Ordenar por fecha usando safeParseDate
  const ordenadas = [...fechas].sort((a, b) => {
    try {
      const fechaA = safeParseDate(a.fecha);
      const fechaB = safeParseDate(b.fecha);
      return fechaA.getTime() - fechaB.getTime();
    } catch (error) {
      console.error('❌ Error ordenando fechas:', error);
      return 0;
    }
  });
  const grupos = [];
  let grupo = [];
  let semanaActual = null;
  for (const f of ordenadas) {
    try {
      const fechaObj = safeParseDate(f.fecha);
      // getDay: 0=domingo, 1=lunes, ..., 6=sabado
      const diaSemana = fechaObj.getDay();
      if (semanaActual === null) {
        semanaActual = getStartOfWeek(fechaObj);
      }
      if (fechaObj < semanaActual || fechaObj >= addDays(semanaActual, 7)) {
        if (grupo.length) grupos.push(grupo);
        grupo = [];
        semanaActual = getStartOfWeek(fechaObj);
      }
      grupo.push(f);
    } catch (error) {
      console.error('❌ Error procesando fecha:', f.fecha, error);
      // Continuar con la siguiente fecha
    }
  }
  if (grupo.length) grupos.push(grupo);
  return grupos;
}
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // lunes como inicio
  return new Date(d.setDate(diff));
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function MeriendasLibres() {
  const [precio, setPrecio] = useState<number | null>(null);
  const [productosData, setProductosData] = useState(productosDataDefault);
  const [fechas, setFechas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiService.getPrecioMeriendaLibre(),
      apiService.getFechasConfig(),
      apiService.getMeriendasLibresContenido()
    ]).then(([precio, fechas, contenidoData]) => {
      setPrecio(precio);
      setFechas(fechas.filter(f => f.activo !== false));
      if (contenidoData) {
        setProductosData(contenidoData);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Agrupar fechas por semana
  const grupos = agruparFechasPorSemana(fechas);
  const grupoActual = grupos[semanaSeleccionada] || [];

  // Obtener todos los turnos únicos de la semana seleccionada
  const turnosSemana = [];
  grupoActual.forEach(f => {
    if (Array.isArray(f.turnos)) {
      f.turnos.forEach(t => {
        if (!turnosSemana.includes(t)) turnosSemana.push(t);
      });
    }
  });

  return (
    <div className={styles.bgBeige}>
      <Navbar />
      
      {/* Hero Section con imagen de fondo */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Merienda Libre</h1>
            <div className={styles.heroSubtitle}>¡Disfrutá de una tarde única con todo incluido!</div>
            <div className={styles.heroPrice}>
              {precio !== null ? `$${precio.toLocaleString('es-AR')}` : '...'} <span>por persona</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Fechas y Turnos */}
        <section className={styles.fechasSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <IconoReloj />
              Próximas Fechas & Turnos
            </h2>
            
            <div className={styles.fechasGrid}>
              {grupos.map((grupo, idx) => (
                <div key={idx} className={styles.fechaGrupo} style={{ borderColor: idx === semanaSeleccionada ? '#c2d29b' : undefined }} onClick={() => setSemanaSeleccionada(idx)}>
                  {grupo.map((f, i) => (
                    <div className={styles.fechaItem} key={i}>
                      {(() => {
                        try {
                          const fechaObj = safeParseDate(f.fecha);
                          return formatDateForDisplay(fechaObj).replace(/^\w/, c => c.toUpperCase());
                        } catch (error) {
                          console.error('❌ Error renderizando fecha:', f.fecha, error);
                          return 'Fecha inválida';
                        }
                      })()}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <SeparadorDecorativo />

            <div className={styles.turnosGrid}>
              {turnosSemana.length === 0 && <div>No hay turnos disponibles</div>}
              {turnosSemana.map((turno, idx) => (
                <div className={styles.turnoCard} key={idx}>
                  <div className={styles.turnoHora}>{turno}</div>
                  <div className={styles.turnoLabel}>{turno.toLowerCase().includes('tarde') ? 'Tarde' : turno.toLowerCase().includes('noche') ? 'Noche' : 'Turno'}</div>
                </div>
              ))}
            </div>

            <div className={styles.reservarBtnWrapper}>
              <Link href="/reservar-merienda-libre" className={styles.reservarBtn}>
                <IconoCheck />
                Reservar Ahora
              </Link>
            </div>
          </div>
        </section>

        {/* Cómo Reservar */}
        <section className={styles.comoReservarSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>¿Cómo reservar?</h2>
            <div className={styles.pasosList}>
              {comoReservarItems.map((item, idx) => (
                <div key={idx} className={styles.pasoItem}>
                  <div className={styles.pasoNumero}>{idx + 1}</div>
                  <div className={styles.pasoTexto}>{item}</div>
                </div>
              ))}
            </div>
            <div className={styles.ninosInfo}>
              <IconoInfo />
              Niños menores a 5 años entran sin cargo
            </div>
          </div>
        </section>

        {/* Qué Incluye - Rediseñado */}
        <section className={styles.queIncluyeSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>¿Qué incluye la Merienda Libre?</h2>
            
            <div className={styles.categoriasGrid}>
              <div className={styles.categoriaCard}>
                <div className={styles.categoriaHeader}>
                  <IconoDulce />
                  <h3>Dulces</h3>
                </div>
                <ul className={styles.categoriaList}>
                  {productosData.dulces.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.categoriaCard}>
                <div className={styles.categoriaHeader}>
                  <IconoSalado />
                  <h3>Salados</h3>
                </div>
                <ul className={styles.categoriaList}>
                  {productosData.salados.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.categoriaCard}>
                <div className={styles.categoriaHeader}>
                  <IconoBebida />
                  <h3>Bebidas</h3>
                </div>
                <ul className={styles.categoriaList}>
                  {productosData.bebidas.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Información Importante */}
        <section className={styles.infoImportanteSection}>
          <div className={styles.sectionCard + ' ' + styles.infoCard}>
            <h2 className={styles.sectionTitle}>Información Importante</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>Se repondrá productos durante la primera hora de cada turno, el resto del tiempo podés hacer sobremesa 😊</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>El tiempo de tolerancia es de 15 minutos, pasado ese tiempo ocuparemos el lugar reservado en caso de ser necesario.</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>No está permitido llevarse productos de la merienda libre. Es para consumir dentro del local 😊</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>Este valor no incluye propina.</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>El pago no es reembolsable.</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>Al reservar, acepta los términos y condiciones mencionados en este documento.</span>
              </div>
            </div>
            <div className={styles.restriccionesInfo}>
              <IconoInfo />
              No incluye ningún tipo de restricciones alimentarias
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 