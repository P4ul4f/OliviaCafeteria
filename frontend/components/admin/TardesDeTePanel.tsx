import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin.module.css';
import { apiService } from '../../services/api';

function SuccessModal({ open, onClose, mensaje }: any) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <p style={{color: '#c2d29b', fontSize: '16px', textAlign: 'center', margin: '20px 0'}}>{mensaje}</p>
      </div>
    </div>
  );
}

export default function TardesDeTePanel() {
  const [precioPromoOlivia, setPrecioPromoOlivia] = useState<number>(0);
  const [precioPromoOliviaEdit, setPrecioPromoOliviaEdit] = useState<number>(0);
  const [precioPromoBasica, setPrecioPromoBasica] = useState<number>(0);
  const [precioPromoBasicaEdit, setPrecioPromoBasicaEdit] = useState<number>(0);
  const [cupos, setCupos] = useState<number>(65);
  const [cuposEdit, setCuposEdit] = useState<number>(65);
  const [precioPromoOliviaError, setPrecioPromoOliviaError] = useState<string>('');
  const [precioPromoBasicaError, setPrecioPromoBasicaError] = useState<string>('');
  const [cuposError, setCuposError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [precioOliviaData, precioBasicaData, cuposData] = await Promise.all([
        apiService.getPrecioPromoOlivia(),
        apiService.getPrecioPromoBasica(),
        apiService.getCuposTardesDeTe()
      ]);
      
      setPrecioPromoOlivia(precioOliviaData);
      setPrecioPromoOliviaEdit(precioOliviaData);
      setPrecioPromoBasica(precioBasicaData);
      setPrecioPromoBasicaEdit(precioBasicaData);
      setCupos(cuposData);
      setCuposEdit(cuposData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrecioPromoOliviaChange = (e: any) => {
    const value = parseFloat(e.target.value);
    setPrecioPromoOliviaEdit(value);
    setPrecioPromoOliviaError('');
  };

  const handlePrecioPromoBasicaChange = (e: any) => {
    const value = parseFloat(e.target.value);
    setPrecioPromoBasicaEdit(value);
    setPrecioPromoBasicaError('');
  };

  const handleCuposChange = (e: any) => {
    const value = parseInt(e.target.value);
    setCuposEdit(value);
    setCuposError('');
  };

  const handlePrecioPromoOliviaSave = async () => {
    if (!precioPromoOliviaEdit || precioPromoOliviaEdit <= 0) {
      setPrecioPromoOliviaError('El precio debe ser mayor a 0');
      return;
    }

    try {
      await apiService.updatePrecioPromoOlivia(precioPromoOliviaEdit, adminToken || '');
      setPrecioPromoOlivia(precioPromoOliviaEdit);
      setSuccessMessage('Precio Promo Olivia actualizado exitosamente');
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch (error) {
      setPrecioPromoOliviaError('Error al actualizar el precio');
    }
  };

  const handlePrecioPromoBasicaSave = async () => {
    if (!precioPromoBasicaEdit || precioPromoBasicaEdit <= 0) {
      setPrecioPromoBasicaError('El precio debe ser mayor a 0');
      return;
    }

    try {
      await apiService.updatePrecioPromoBasica(precioPromoBasicaEdit, adminToken || '');
      setPrecioPromoBasica(precioPromoBasicaEdit);
      setSuccessMessage('Precio Promo Básica actualizado exitosamente');
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch (error) {
      setPrecioPromoBasicaError('Error al actualizar el precio');
    }
  };

  const handleCuposSave = async () => {
    if (!cuposEdit || cuposEdit <= 0) {
      setCuposError('Los cupos deben ser mayor a 0');
      return;
    }

    try {
      await apiService.updateCuposTardesDeTe(cuposEdit, adminToken || '');
      setCupos(cuposEdit);
      setSuccessMessage('Cupos actualizados exitosamente');
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch (error) {
      setCuposError('Error al actualizar los cupos');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.adminPanel} style={{minHeight: 'auto', height: 'fit-content'}}>
      <h3 className={styles.meriendasLibresTitle}>Tardes de Té</h3>
      
      <div>
        <h2 className={styles.sectionTitle}>Precios Tardes de Té</h2>
        <div className={styles.precioCuposContainer}>
          <div className={styles.precioCuposField}>
            <label className={styles.precioCuposLabel}>Promo Olivia:</label>
            <div className={styles.precioCuposInputGroup}>
              <input
                type="number"
                value={precioPromoOliviaEdit}
                onChange={handlePrecioPromoOliviaChange}
                className={styles.precioCuposInput}
                placeholder="Precio"
              />
              <button 
                onClick={handlePrecioPromoOliviaSave}
                className={styles.precioCuposBtn}
                disabled={loading}
              >
                Guardar Precio
              </button>
            </div>
            {precioPromoOliviaError && <div className={styles.precioCuposError}>{precioPromoOliviaError}</div>}
          </div>
          
          <div className={styles.precioCuposField}>
            <label className={styles.precioCuposLabel}>Promo Básica:</label>
            <div className={styles.precioCuposInputGroup}>
              <input
                type="number"
                value={precioPromoBasicaEdit}
                onChange={handlePrecioPromoBasicaChange}
                className={styles.precioCuposInput}
                placeholder="Precio"
              />
              <button 
                onClick={handlePrecioPromoBasicaSave}
                className={styles.precioCuposBtn}
                disabled={loading}
              >
                Guardar Precio
              </button>
            </div>
            {precioPromoBasicaError && <div className={styles.precioCuposError}>{precioPromoBasicaError}</div>}
          </div>
        </div>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Cupos Tardes de Té</h2>
        <div className={styles.precioCuposContainer}>
          <div className={styles.precioCuposField}>
            <label className={styles.precioCuposLabel}>Cupos:</label>
            <div className={styles.precioCuposInputGroup}>
              <input
                type="number"
                value={cuposEdit}
                onChange={handleCuposChange}
                className={styles.precioCuposInput}
                placeholder="Cupos"
              />
              <button 
                onClick={handleCuposSave}
                className={styles.precioCuposBtn}
                disabled={loading}
              >
                Guardar Cupos
              </button>
            </div>
            {cuposError && <div className={styles.precioCuposError}>{cuposError}</div>}
          </div>
        </div>
      </div>

      <SuccessModal 
        open={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)} 
        mensaje={successMessage} 
      />
    </div>
  );
} 