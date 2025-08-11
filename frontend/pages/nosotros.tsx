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
            {/* <h2 className={styles.sectionTitle}>Donde comenzó todo</h2> */}
            <p className={styles.storyText}>
            Somos dos jóvenes que decidimos transformar nuestra pasión por la pastelería y 
            el café en un lugar donde cada visita sea un momento especial. Así nació Olivia: 
            una cafetería y pastelería artesanal, hecha con amor, aromas que reconfortan y sabores 
            que invitan a quedarse.
            </p>
            <p className={styles.storyText}>
            Creemos que un buen café y una porción de algo rico y casero pueden convertir cualquier 
            día en algo memorable. Por eso, cada receta que sale de nuestra cocina está inspirada en la 
            alegría de compartir, en las tardes con amigos, en los pequeños instantes que se convierten 
            en recuerdos. Hoy, seguimos creciendo gracias a cada cliente que nos elige, y a ese sueño que 
            nos impulsó desde el principio.
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
              Te invitamos a ser parte de nuestra historia, donde cada momento se convierte en una experiencia 
              única. Donde los aromas del café se mezclan con la dulzura de la pastelería artesanal, creando 
              memorias que perduran en el corazón.
            </p>
            <div className={styles.signatureText}>Con cariño, el equipo de Olivia</div>
          </div>
        </div>
      </div>
    </div>
  );
} 