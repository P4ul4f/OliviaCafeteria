import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/pago.module.css';
import Link from 'next/link';

export default function Success() {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { payment_id, status, external_reference } = router.query;
    
    if (payment_id) {
      // Simular información del pago basada en los parámetros
      const isSimulated = payment_id.toString().startsWith('SIMULATED_');
      
      setPaymentInfo({
        paymentId: payment_id,
        status: status || 'approved',
        isSimulated,
        externalReference: external_reference,
        timestamp: new Date().toLocaleString('es-AR'),
      });
      
      setLoading(false);
      
      // Limpiar localStorage
      localStorage.removeItem('reservaData');
      localStorage.removeItem('mercadopago_preference_id');
      localStorage.removeItem('mercadopago_external_reference');
    }
  }, [router.query]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          Procesando pago...
        </div>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.pagoCard}>
          <h1 className={styles.title}>Información de pago no encontrada</h1>
          <p>No se pudo obtener la información del pago.</p>
          <Link href="/" className={styles.volverBtn}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pagoCard}>
        <div className={styles.success}>
          <h1>🎉 ¡Pago Exitoso!</h1>
          
          <div className={styles.paymentDetails}>
            <h3>Detalles del pago:</h3>
            <div className={styles.resumenItem}>
              <span>ID de pago:</span>
              <span>{paymentInfo.paymentId}</span>
            </div>
            <div className={styles.resumenItem}>
              <span>Estado:</span>
              <span className={styles.statusApproved}>
                {paymentInfo.status === 'approved' ? 'Aprobado' : paymentInfo.status}
              </span>
            </div>
            <div className={styles.resumenItem}>
              <span>Fecha:</span>
              <span>{paymentInfo.timestamp}</span>
            </div>
            {paymentInfo.isSimulated && (
              <div className={styles.simulationNotice}>
                <strong>💡 Modo demostración:</strong> Este es un pago simulado para fines de desarrollo.
              </div>
            )}
          </div>

          <div className={styles.reservationStatus}>
            <h3>Tu reserva:</h3>
            <p>✅ <strong>Reserva confirmada automáticamente</strong></p>
            <p>📧 Te llegará un email de confirmación con todos los detalles</p>
            <p>📱 También puedes consultar tu reserva contactándonos</p>
          </div>

          <div className={styles.nextSteps}>
            <h3>Próximos pasos:</h3>
            <ul>
              <li>Guarda este comprobante de pago</li>
              <li>Llega 15 minutos antes de tu turno</li>
              <li>Trae un documento de identidad</li>
              <li>¡Prepárate para disfrutar!</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <Link href="/" className={styles.volverBtn}>
              Volver al inicio
            </Link>
            <button 
              onClick={() => window.print()} 
              className={styles.printBtn}
            >
              Imprimir comprobante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 