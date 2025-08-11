import React, { useState, useEffect } from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  isLoading: boolean;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading, progress = 0 }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setIsFading(false);
    } else {
      setIsFading(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Tiempo de la transición CSS
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.overlay} ${isFading ? styles.fadeOut : ''}`}>
      <div className={styles.spinnerContainer}>
        <div className={styles.logoContainer}>
          <img src="/logo-olivia.svg" alt="Olivia" className={styles.logo} />
        </div>
        <div className={styles.spinner}></div>
        <div className={styles.loadingText}>Cargando...</div>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.progressText}>{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
