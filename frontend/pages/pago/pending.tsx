import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import styles from '../../styles/pago.module.css';

export default function PagoPending() {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener información del pago desde los query params
    const { payment_id, external_reference, status } = router.query;
    
    if (payment_id) {
      setPaymentInfo({ payment_id, external_reference, status });
      
      // Limpiar localStorage cuando el pago está pendiente
      localStorage.removeItem('reservaData');
      localStorage.removeItem('mercadopago_preference_id');
      localStorage.removeItem('mercadopago_external_reference');
    }
    
    setLoading(false);
  }, [router.query]);

  const handleVerificarEstado = () => {
    // Aquí podrías implementar una verificación del estado del pago
    alert('Verificando estado del pago...');
  };

  const handleVolverInicio = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.bgBeige}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.formularioContainer}>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bgBeige}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.headerDecor}></div>
        
        <section className={styles.hero}>
          <h1 className={styles.tituloPrincipal}>Pago en Proceso</h1>
          <div className={styles.promoOliviaWrapper}>
            <span className={styles.promoLinea}></span>
            <span className={styles.promoCorazon}>♥</span>
            <span className={styles.promoLinea}></span>
          </div>
          <p className={styles.subtitle}>Tu pago está siendo procesado</p>
        </section>

        <div className={styles.formularioContainer}>
          <div style={{ 
            backgroundColor: 'rgba(255, 152, 0, 0.1)', 
            border: '1px solid #ff9800', 
            borderRadius: '8px', 
            padding: '1.5rem', 
            marginBottom: '2rem', 
            textAlign: 'center', 
            color: '#ff9800' 
          }}>
            <h3>Pago Pendiente</h3>
            <p>Tu pago está siendo procesado por el sistema de pagos.</p>
            <p>Esto puede tomar unos minutos. Te notificaremos cuando se complete.</p>
            {paymentInfo && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px' }}>
                <p><strong>ID de Pago:</strong> {paymentInfo.payment_id}</p>
                <p><strong>Estado:</strong> {paymentInfo.status}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handleVerificarEstado} className={styles.submitBtn}>
              Verificar Estado
            </button>
            <button onClick={handleVolverInicio} style={{
              padding: '1rem 2rem',
              backgroundColor: 'transparent',
              color: '#8b816a',
              border: '2px solid #8b816a',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 