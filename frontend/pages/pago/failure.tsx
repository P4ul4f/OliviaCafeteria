import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import styles from '../../styles/pago.module.css';

export default function PagoFailure() {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener información del pago desde los query params
    const { payment_id, external_reference, status } = router.query;
    
    if (payment_id) {
      console.log('Pago fallido:', { payment_id, external_reference, status });
      setPaymentInfo({ payment_id, external_reference, status });
    }
    
    setLoading(false);
  }, [router.query]);

  const handleReintentar = () => {
    router.push('/pago');
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
          <h1 className={styles.tituloPrincipal}>Pago Fallido</h1>
          <div className={styles.promoOliviaWrapper}>
            <span className={styles.promoLinea}></span>
            <span className={styles.promoCorazon}>♥</span>
            <span className={styles.promoLinea}></span>
          </div>
          <p className={styles.subtitle}>No se pudo procesar tu pago</p>
        </section>

        <div className={styles.formularioContainer}>
          <div style={{ 
            backgroundColor: 'rgba(211, 47, 47, 0.1)', 
            border: '1px solid #d32f2f', 
            borderRadius: '8px', 
            padding: '1.5rem', 
            marginBottom: '2rem', 
            textAlign: 'center', 
            color: '#d32f2f' 
          }}>
            <h3>Lo sentimos</h3>
            <p>No se pudo procesar tu pago. Esto puede deberse a:</p>
            <ul style={{ textAlign: 'left', margin: '1rem 0' }}>
              <li>Fondos insuficientes en tu cuenta</li>
              <li>Tarjeta rechazada por el banco</li>
              <li>Datos de pago incorrectos</li>
              <li>Problemas temporales del sistema</li>
            </ul>
            {paymentInfo && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(211, 47, 47, 0.1)', borderRadius: '8px' }}>
                <p><strong>ID de Pago:</strong> {paymentInfo.payment_id}</p>
                <p><strong>Estado:</strong> {paymentInfo.status}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handleReintentar} className={styles.submitBtn}>
              Reintentar Pago
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