import React, { useEffect, useState } from 'react';
import styles from './InfoCard.module.css';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { apiService } from '../services/api';
import type { SiteConfig } from '../services/api';

const InfoCard = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    apiService.getSiteConfig().then(setConfig).catch(() => setConfig(null));
  }, []);

  // Agrupar horarios de lunes a sábado
  const horariosManana: string[] = [];
  const horariosNoche: string[] = [];
  let domingo = null;
  if (config) {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const;
    dias.forEach(dia => {
      const h = config.horarios[dia];
      if (h?.abierto) {
        if (h.manana && !horariosManana.includes(h.manana)) horariosManana.push(h.manana);
        if (h.noche && !horariosNoche.includes(h.noche)) horariosNoche.push(h.noche);
      }
    });
    const dom = config.horarios['domingo'];
    if (dom?.abierto && (dom.manana || dom.noche)) {
      domingo = dom;
    }
  }

  return (
    <section className={styles.sectionCard}>
      <div className={styles.card}>
        <div className={styles.hoursSection}>
          <h3 className={styles.title}>HORARIOS</h3>
          <div className={styles.hoursList}>
            {config ? (
              <>
                <div style={{ fontWeight: 600 }}>Lunes a Sábados</div>
                {horariosManana.map((h, i) => (
                  <div key={'manana-' + i}>{h}</div>
                ))}
                {horariosNoche.map((h, i) => (
                  <div key={'noche-' + i}>{h}</div>
                ))}
                {domingo && (
                  <>
                    <div style={{ fontWeight: 600, marginTop: '0.7em' }}>Domingo</div>
                    {domingo.manana && <div>{domingo.manana}</div>}
                    {domingo.noche && <div>{domingo.noche}</div>}
                  </>
                )}
              </>
            ) : (
              <>
                <div>Lunes a Sábados </div>
                <div>9:00 - 13:00</div>
                <div>17:00 a 20:30</div>
              </>
            )}
          </div>
        </div>
        <div className={styles.locationSection}>
          <h3 className={styles.title}>UBICACIÓN</h3>
          <div className={styles.locationText}>
            {config?.direccion || 'Avenida Godoy Cruz 506, Mendoza'}
          </div>
        </div>
      </div>
      <div className={styles.socialSection}>
        <span className={styles.follow}>CONTACTO</span>
        <a href="https://wa.me/5492617148842" target="_blank" rel="noopener noreferrer" className={styles.icon}><FaWhatsapp /></a>
        <a href="https://www.instagram.com/oliviapasteleriaycafe/" className={styles.icon}><FaInstagram /></a>
      </div>
    </section>
  );
};

export default InfoCard; 