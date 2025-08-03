import React from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/nosotros.module.css';

export default function Nosotros() {
  return (
    <div className={styles.bgBeige}>
      <Navbar />
      <div className={styles.heroSection}>
        <div className={styles.logoContainer}>
          <img src="/2.svg" alt="Olivia Logo" className={styles.mainLogo} />
        </div>
        <h1 className={styles.mainTitle}>Nosotros</h1>
        <div className={styles.decorativeLine}></div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.storyCard}>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>Donde comenzó todo</h2>
            <p className={styles.storyText}>
              Olivia nació del sueño de crear un espacio donde el aroma del café recién molido 
              se mezcla con la dulzura de nuestras creaciones artesanales. Cada receta que 
              preparamos lleva el cariño de la tradición familiar y la pasión por los sabores auténticos.
            </p>
            <p className={styles.storyText}>
              Nuestro equipo está formado por personas que comparten la misma visión: 
              brindar momentos especiales a través de cada taza de café y cada bocado de nuestras tartas caseras.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <div className={styles.cafeGallery}>
              <img src="/cafe.JPG" alt="Café Olivia" className={styles.galleryImage} />
              <img src="/cafe2.jpg" alt="Postres artesanales" className={styles.galleryImage} />
              <img src="/cafe16.jpg" alt="Ambiente acogedor" className={`${styles.galleryImage} ${styles.desktopOnly}`} />
              <img src="/cafe12.jpg" alt="Deliciosas creaciones" className={`${styles.galleryImage} ${styles.desktopOnly}`} />
            </div>
          </div>
        </div>



        <div className={styles.invitationSection}>
          <div className={styles.invitationCard}>
            <h2 className={styles.invitationTitle}>Te esperamos</h2>
            <p className={styles.invitationText}>
              Ven a descubrir un lugar donde cada detalle está pensado para hacerte sentir como en casa. 
              Donde cada café cuenta una historia y cada postre despierta una sonrisa.
            </p>
            <div className={styles.signatureText}>Con cariño, el equipo de Olivia</div>
          </div>
        </div>
      </div>
    </div>
  );
} 