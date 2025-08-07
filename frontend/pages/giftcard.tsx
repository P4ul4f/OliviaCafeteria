import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/giftcard.module.css';

// Iconos SVG personalizados
function IconoGiftClaro() {
  return (
    <Image 
      src="/tarjeta-de-regalo.png" 
      alt="Tarjeta de regalo" 
      width={48} 
      height={48}
      className={styles.giftIcon}
    />
  );
}

function IconoCorazon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 17.5C10 17.5 2.5 12.5 2.5 7.5C2.5 5.5 4 4 6 4C7.5 4 8.5 5 10 6C11.5 5 12.5 4 14 4C16 4 17.5 5.5 17.5 7.5C17.5 12.5 10 17.5 10 17.5Z" fill="#c2d29b"/>
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

function IconoStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L12.5 7.5L18.5 8.5L14 12.5L15.5 18.5L10 15.5L4.5 18.5L6 12.5L1.5 8.5L7.5 7.5L10 2Z" fill="#c2d29b"/>
    </svg>
  );
}

function IconoWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 2.5C15.5 0.5 12.5 0.5 10.5 2.5C8.5 4.5 8.5 7.5 10.5 9.5C12.5 11.5 15.5 11.5 17.5 9.5C19.5 7.5 19.5 4.5 17.5 2.5Z" fill="#c2d29b"/>
      <path d="M10 15C7.5 15 5.5 13 5.5 10.5C5.5 8 7.5 6 10 6C12.5 6 14.5 8 14.5 10.5C14.5 13 12.5 15 10 15Z" fill="#c2d29b"/>
    </svg>
  );
}

function SeparadorElegante() {
  return (
    <div className={styles.separadorElegante}>
      <div className={styles.linea}></div>
      <div className={styles.circulo}>
        <IconoGiftClaro />
      </div>
      <div className={styles.linea}></div>
    </div>
  );
}

// Modal de Gift Card
function GiftCardModal({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    nombreDestinatario: '',
    telefonoDestinatario: '',
    mensaje: '',
    monto: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Crear Gift Card</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.giftCardForm}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre">Tu nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nombreDestinatario">Nombre del destinatario *</label>
            <input
              type="text"
              id="nombreDestinatario"
              name="nombreDestinatario"
              value={formData.nombreDestinatario}
              onChange={handleInputChange}
              required
              placeholder="Nombre de quien recibirá la gift card"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefonoDestinatario">Teléfono del destinatario *</label>
            <input
              type="tel"
              id="telefonoDestinatario"
              name="telefonoDestinatario"
              value={formData.telefonoDestinatario}
              onChange={handleInputChange}
              required
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mensaje">Mensaje personalizado (opcional)</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              placeholder="Escribe un mensaje especial para el destinatario..."
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="monto">Monto de la Gift Card *</label>
            <div className={styles.montoInput}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                required
                min="1000"
                step="100"
                placeholder="15000"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              <IconoGiftClaro />
              Ir a Pagar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GiftCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateGiftCard = (formData: any) => {
    try {
      // Guardar los datos en localStorage y redirigir a pago
      localStorage.setItem('giftCardData', JSON.stringify(formData));
      window.location.href = '/pago-giftcard';
      
    } catch (error) {
      console.error('Error al procesar la gift card:', error);
      // setErrors({ submit: 'Error al procesar la gift card. Por favor, inténtalo de nuevo.' });
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.bgBeige}>
      <Head>
        <title>Gift Cards - Olivia</title>
        <meta name="description" content="Regala momentos especiales con nuestras gift cards personalizadas" />
      </Head>
      
      <Navbar />
      
      {/* Hero Section elaborado */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>
            <IconoGiftClaro />
          </div>
          <h1 className={styles.heroTitle}>Gift Cards</h1>
          <div className={styles.heroSubtitle}>Regala momentos especiales en Olivia</div>
        </div>
        <div className={styles.heroDecoration}>
          <div className={styles.floatingElement}></div>
          <div className={styles.floatingElement}></div>
          <div className={styles.floatingElement}></div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Descripción elaborada */}
        <section className={styles.descripcionSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              ¿Qué son nuestras Gift Cards?
            </h2>
            <div className={styles.descripcionContent}>
              <p>
                Nuestras Gift Cards son la forma perfecta de regalar momentos especiales en Olivia. 
                El destinatario podrá usar el monto de la gift card para disfrutar de cualquiera de 
                nuestros servicios: reservas a la carta, meriendas libres, tardes de té, o cualquier 
                consumo en nuestro café.
              </p>
              <div className={styles.featureHighlight}>
                <IconoCorazon />
                <span>Regala momentos inolvidables con nuestras gift cards personalizadas</span>
              </div>
            </div>
          </div>
        </section>

        <SeparadorElegante />

        {/* CTA Section elaborado */}
        <section className={styles.ctaSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              ¡Regala una experiencia única!
            </h2>
            <div className={styles.ctaContent}>
              <p>
                Sorprende a alguien especial con una gift card de Olivia. 
                Es el regalo perfecto para cualquier ocasión: cumpleaños, aniversarios, 
                o simplemente para demostrar tu cariño.
              </p>
              <div className={styles.ctaFeatures}>
                <div className={styles.ctaFeature}>
                  <IconoCheck />
                  <span>Proceso súper fácil</span>
                </div>
                <div className={styles.ctaFeature}>
                  <IconoWhatsApp />
                  <span>Entrega inmediata</span>
                </div>
                <div className={styles.ctaFeature}>
                  <IconoStar />
                  <span>Experiencia garantizada</span>
                </div>
              </div>
              <div className={styles.ctaBtnWrapper}>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className={styles.ctaBtn}
                >
                  <IconoGiftClaro />
                  Crear Gift Card
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Gift Card */}
      <GiftCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGiftCard}
      />
    </div>
  );
} 