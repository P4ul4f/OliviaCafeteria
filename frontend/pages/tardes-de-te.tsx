import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import styles from '../styles/tardesDeTe.module.css';
import { apiService } from '../services/api';

// Iconos SVG personalizados
function IconoTaza() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18C8 15.79 9.79 14 12 14H32C34.21 14 36 15.79 36 18V30C36 34.42 32.42 38 28 38H16C11.58 38 8 34.42 8 30V18Z" fill="#c2d29b"/>
      <path d="M36 20H38C40.21 20 42 21.79 42 24V26C42 28.21 40.21 30 38 30H36" stroke="#c2d29b" strokeWidth="2"/>
      <path d="M14 10C14 10 14 12 16 12C18 12 18 10 18 10M20 10C20 10 20 12 22 12C24 12 24 10 24 10M26 10C26 10 26 12 28 12C30 12 30 10 30 10" stroke="#c2d29b" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="22" cy="42" rx="12" ry="3" fill="#c2d29b" opacity="0.4"/>
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

function IconoCorazon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 17.5C10 17.5 2.5 12.5 2.5 7.5C2.5 5.5 4 4 6 4C7.5 4 8.5 5 10 6C11.5 5 12.5 4 14 4C16 4 17.5 5.5 17.5 7.5C17.5 12.5 10 17.5 10 17.5Z" fill="#ccbb94"/>
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
    "Shot de cheesecake de Frutos Rojos",
    "Brownie con dulce de leche y crema",
    "Alfajor de pistacho",
    "Mini torta de almendras"
  ],
  salados: [
    "Sandwich de roquefort",
    "Sandwich de jamón crudo y rúcula",
    "Sandwich de palta y jamón cocido"
  ],
  bebidas: [
    "Infusión grande + refill",
    "Limonada",
    "Café, Café con leche, Cortado, Manchado",
    "Submarino, Cappuccino, Té clásico y saborizado"
  ]
};

// Datos para Promo Básica (se cargarán desde la API)
const promoBasicaDataDefault = {
  dulces: [
    "1 brownie con dulce de leche y crema",
    "1 porción de budín de naranja",
    "1 alfajor de maicena"
  ],
  salados: [
    "Sandwich de jamón crudo y rúcula",
    "Sandwich de palta y jamón cocido",
    "Medialuna JyQ"
  ],
  bebidas: [
    "Infusión mediana + refill",
    "Jugo de naranjas"
  ]
};

const infoImportante = [
  "Para reservar indicar fecha, horario, nombre completo y cantidad de personas.",
  "Se contrata la misma promo para todos los invitados",
  "El valor es individual por persona.",
  "Se reserva con seña del 30% del total y mínimo 48 hs de anticipación.",
  "En caso de que asistan menos personas de las reservadas, finalizada la tarde de té se abonará la cantidad de personas reservadas independientemente de la cantidad de personas que asistan.",
  "En caso de que asistan más personas de las reservadas sin previo aviso de 24 hs de anticipación, deberán consumir a la carta (máximo de personas que pueden sumarse a últimos momento: 5 ).",
  "Este presupuesto no incluye propina."
];

const beneficiosCumple = [
  "Reservando el menú a partir de 10 o más invitados el menú de la cumpleañera es gratis + 20% de descuento en la torta",
  "Reservando el menú de 15 a 20 invitados el menú de la cumpleañera es gratis y tenes 30% de descuento en la torta",
  "Reservando el menú de 25 a 30 invitados, te regalamos el menú de la cumpleañera y la torta"
];

export default function TardesDeTe() {
  const [precioPromoOlivia, setPrecioPromoOlivia] = useState<number | null>(null);
  const [precioPromoBasica, setPrecioPromoBasica] = useState<number | null>(null);
  const [productosData, setProductosData] = useState(productosDataDefault);
  const [promoBasicaData, setPromoBasicaData] = useState(promoBasicaDataDefault);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiService.getPrecioPromoOlivia(),
      apiService.getPrecioPromoBasica(),
      apiService.getTardesTePromoOliviaContenido(),
      apiService.getTardesTePromoBasicaContenido()
    ]).then(([precioOlivia, precioBasica, contenidoOlivia, contenidoBasica]) => {
      setPrecioPromoOlivia(precioOlivia);
      setPrecioPromoBasica(precioBasica);
      if (contenidoOlivia) {
        setProductosData(contenidoOlivia);
      }
      if (contenidoBasica) {
        setPromoBasicaData(contenidoBasica);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Obtener el precio más bajo para mostrar en el hero
  const precioMinimo = precioPromoBasica !== null ? precioPromoBasica : precioPromoOlivia;

  return (
    <div className={styles.bgBeige}>
      <Navbar />
      
      {/* Hero Section con imagen de fondo */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Tardes de Té</h1>
            
            <div className={styles.heroSubtitle}>Para grupos de 10 o más personas</div>
            <div className={styles.heroPrice}>
              Desde {precioMinimo !== null ? `$${precioMinimo.toLocaleString('es-AR')}` : '...'} <span>por persona</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Promo Olivia */}
        <section className={styles.promoSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <IconoReloj />
              Promo Olivia
            </h2>
            
            <div className={styles.promoPrice}>
              {precioPromoOlivia !== null ? `$${precioPromoOlivia.toLocaleString('es-AR')}` : '...'} <span>por persona</span>
            </div>
            
            <div className={styles.promoGrid}>
              <div className={styles.promoItem}>
                <IconoBebida />
                <span>Infusión grande + refill</span>
              </div>
              <div className={styles.promoItem}>
                <IconoBebida />
                <span>Limonada</span>
              </div>
              <div className={styles.promoItem}>
                <IconoSalado />
                <span>3 salados</span>
              </div>
              <div className={styles.promoItem}>
                <IconoDulce />
                <span>4 dulces</span>
              </div>
            </div>

            <div className={styles.reservarBtnWrapper}>
              <Link href="/reservar-tarde-te" className={styles.reservarBtn}>
                <IconoCheck />
                Reservar Promo Olivia
              </Link>
            </div>
          </div>
        </section>

        {/* Qué Incluye Promo Olivia */}
        <section className={styles.queIncluyeSection}>
          <div className={`${styles.sectionCard} ${styles.queIncluyeCard}`}>
            <h2 className={styles.sectionTitle}>¿Qué incluye la Promo Olivia?</h2>
            
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

        {/* Promo Básica */}
        <section className={styles.promoSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <IconoReloj />
              Promo Básica
            </h2>
            
            <div className={styles.promoPrice}>
              {precioPromoBasica !== null ? `$${precioPromoBasica.toLocaleString('es-AR')}` : '...'} <span>por persona</span>
            </div>
            
            <div className={styles.promoGrid}>
              <div className={styles.promoItem}>
                <IconoBebida />
                <span>Infusión mediana + refill</span>
              </div>
              <div className={styles.promoItem}>
                <IconoBebida />
                <span>Jugo de naranjas</span>
              </div>
              <div className={styles.promoItem}>
                <IconoSalado />
                <span>2 salados</span>
              </div>
              <div className={styles.promoItem}>
                <IconoDulce />
                <span>3 dulces</span>
              </div>
            </div>

            <div className={styles.reservarBtnWrapper}>
              <Link href="/reservar-tarde-te" className={styles.reservarBtn}>
                <IconoCheck />
                Reservar Promo Básica
              </Link>
            </div>
          </div>
        </section>

        {/* Qué Incluye Promo Básica */}
        <section className={styles.queIncluyeSection}>
          <div className={`${styles.sectionCard} ${styles.queIncluyeCard}`}>
            <h2 className={styles.sectionTitle}>¿Qué incluye la Promo Básica?</h2>
            
            <div className={styles.categoriasGrid}>
              <div className={styles.categoriaCard}>
                <div className={styles.categoriaHeader}>
                  <IconoDulce />
                  <h3>Dulces</h3>
                </div>
                <ul className={styles.categoriaList}>
                  {promoBasicaData.dulces.map((item, idx) => (
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
                  {promoBasicaData.salados.map((item, idx) => (
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
                  {promoBasicaData.bebidas.map((item, idx) => (
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
            <h2 className={styles.sectionTitle}>
              <IconoInfo />
              Información Importante
            </h2>
            <div className={styles.infoGrid}>
              {infoImportante.map((item, idx) => (
                <div key={idx} className={styles.infoItem}>
                  <IconoInfo />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios cumpleañeras */}
        <section className={styles.beneficiosSection}>
          <div className={styles.sectionCard + ' ' + styles.beneficiosCard}>
            <h2 className={styles.sectionTitle}>
              <IconoCorazon />
              Beneficios Cumpleañeras
            </h2>
            <div className={styles.infoGrid}>
              {beneficiosCumple.map((item, idx) => (
                <div key={idx} className={styles.infoItem}>
                  <IconoCorazon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 