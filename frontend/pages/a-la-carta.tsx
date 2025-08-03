import React from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import styles from '../styles/aLaCarta.module.css';

// Iconos SVG personalizados
function IconoMesa() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="32" width="32" height="4" rx="2" fill="#c2d29b"/>
      <rect x="12" y="28" width="24" height="4" rx="2" fill="#c2d29b"/>
      <rect x="16" y="24" width="16" height="4" rx="2" fill="#c2d29b"/>
      <circle cx="12" cy="36" r="2" fill="#c2d29b"/>
      <circle cx="36" cy="36" r="2" fill="#c2d29b"/>
      <circle cx="12" cy="32" r="2" fill="#c2d29b"/>
      <circle cx="36" cy="32" r="2" fill="#c2d29b"/>
    </svg>
  );
}

function IconoPersonas() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" fill="#c2d29b"/>
      <path d="M20 21C20 16.6 16.4 13 12 13S4 16.6 4 21" stroke="#c2d29b" strokeWidth="2"/>
      <circle cx="4" cy="8" r="3" fill="#c2d29b"/>
      <path d="M7 21C7 17.1 5.9 14 4 14" stroke="#c2d29b" strokeWidth="2"/>
      <circle cx="20" cy="8" r="3" fill="#c2d29b"/>
      <path d="M17 21C17 17.1 18.1 14 20 14" stroke="#c2d29b" strokeWidth="2"/>
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

// Componente separador decorativo (no utilizado actualmente)
// function SeparadorDecorativo() {
//   return (
//     <div className={styles.separadorDecorativo}>
//       <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M10 10H110" stroke="#c2d29b" strokeWidth="2" strokeLinecap="round"/>
//         <circle cx="60" cy="10" r="4" fill="#c2d29b"/>
//         <circle cx="40" cy="10" r="2" fill="#c2d29b" fillOpacity="0.6"/>
//         <circle cx="80" cy="10" r="2" fill="#c2d29b" fillOpacity="0.6"/>
//       </svg>
//     </div>
//   );
// }

const comoReservarItems = [
  "Nombre completo",
  "Fecha y turno preferido", 
  "Cantidad de personas (hasta 10)",
  "Se pide a la carta una vez que estás en el lugar 😊"
];

export default function ALaCarta() {
  return (
    <div className={styles.bgBeige}>
      <Navbar />
      
      {/* Hero Section con imagen de fondo */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>A la Carta</h1>
            <div className={styles.heroSubtitle}>¡Reserva tu mesa y disfruta de nuestra carta completa!</div>
            <div className={styles.heroDescription}>
              Reservas hasta 10 personas
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Descripción del Servicio */}
        <section className={styles.descripcionSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <IconoMesa />
              Reserva Individual
            </h2>
            
            <div className={styles.descripcionContent}>
              <div className={styles.caracteristicasGrid}>
                <div className={styles.caracteristicaItem}>
                  <IconoPersonas />
                  <span>Hasta 10 personas</span>
                </div>
                <div className={styles.caracteristicaItem}>
                  <IconoCheck />
                  <span>Carta completa disponible</span>
                </div>
                <div className={styles.caracteristicaItem}>
                  <IconoInfo />
                  <span>Pedido en el lugar</span>
                </div>
              </div>
            </div>


            <div className={styles.reservarBtnWrapper}>
              <Link href="/reservar-a-la-carta" className={styles.reservarBtn}>
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
          </div>
        </section>

        {/* Información Importante */}
        <section className={styles.infoImportanteSection}>
          <div className={styles.sectionCard + ' ' + styles.infoCard}>
            <h2 className={styles.sectionTitle}>Información Importante</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>Se pide a la carta una vez que estás en el lugar. Nuestro personal te ayudará con las opciones disponibles.</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>El tiempo de tolerancia es de 15 minutos, pasado ese tiempo ocuparemos el lugar reservado en caso de ser necesario.</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>Puedes ver nuestra carta completa haciendo clic en &quot;Carta&quot; en el menú principal.</span>
              </div>
              <div className={styles.infoItem}>
                <IconoInfo />
                <span>El monto de la reserva será descontado del total de la cuenta.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 