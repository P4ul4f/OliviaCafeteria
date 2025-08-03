import React, { useEffect, useState, useRef } from 'react';
import styles from './Hero.module.css';
import InfoCard from './InfoCard';

const bgImages = [
  '/cafe.JPG',
  '/cafe2.jpg',
  '/cafe3.JPG',
  '/cafe4.jpg',
  '/cafe5.jpg',
  '/cafe6.JPG',
  '/cafe7.jpg',
  '/cafe8.jpg',
  '/cafe9.JPG',
  '/cafe10.JPG',
  '/cafe11.JPG',
  '/cafe12.jpg',
  '/cafe13.JPG',
  '/cafe14.JPG',
  '/cafe15.jpg',
  '/cafe16.jpg',
  '/cafe17.jpg',
  '/cafe18.JPG',
  '/cafe19.JPG',
  '/cafe20.JPG',
  '/cafe21.jpg',
  '/cafe22.jpg',
  '/cafe23.jpg',
  '/cafe24.jpg',
  '/cafe25.JPG',
  '/cafe26.jpg',
  '/cafe27.JPG',
  '/cafe28.JPG',
  '/tardeste.JPG',
];

// Función para generar índices únicos sin repetir imágenes adyacentes
const generateUniqueIndices = (imageCount: number, cellCount: number) => {
  const indices = [];
  const used = new Set();
  
  for (let i = 0; i < cellCount; i++) {
    let randomIndex;
    let attempts = 0;
    
    do {
      randomIndex = Math.floor(Math.random() * imageCount);
      attempts++;
    } while (used.has(randomIndex) && attempts < 50);
    
    indices.push(randomIndex);
    used.add(randomIndex);
    
    // Si hemos usado todas las imágenes, resetear el set
    if (used.size >= imageCount) {
      used.clear();
    }
  }
  
  return indices;
};

const Hero = () => {
  const [indices, setIndices] = useState([0, 1, 2]);
  const [nextIndices, setNextIndices] = useState([0, 1, 2]);
  const [showNext, setShowNext] = useState([false, false, false]);
  const [isClient, setIsClient] = useState(false);
  const [visibleCells, setVisibleCells] = useState(3);
  const currentCell = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Función para obtener las celdas adyacentes dependiendo del número de celdas visibles
  const getAdjacentCells = (cellIndex: number) => {
    const adjacents = [];
    const maxCells = visibleCells;
    
    // Celda de la izquierda
    if (cellIndex > 0) adjacents.push(cellIndex - 1);
    // Celda de la derecha
    if (cellIndex < maxCells - 1) adjacents.push(cellIndex + 1);
    
    return adjacents;
  };

  // Función para obtener una nueva imagen que no sea igual a las adyacentes
  const getNextUniqueImage = (currentIndices: number[], cellIndex: number) => {
    const adjacentCells = getAdjacentCells(cellIndex);
    const usedImages = adjacentCells.map(i => currentIndices[i]).filter(i => i !== undefined);
    usedImages.push(currentIndices[cellIndex]); // También evitar la imagen actual
    
    let newIndex;
    let attempts = 0;
    
    do {
      newIndex = Math.floor(Math.random() * bgImages.length);
      attempts++;
    } while (usedImages.includes(newIndex) && attempts < 100);
    
    return newIndex;
  };

  // Inicializar solo en el cliente para evitar problemas de hidratación
  useEffect(() => {
    setIsClient(true);
    const initialIndices = generateUniqueIndices(bgImages.length, 3);
    setIndices(initialIndices);
    
    // Detectar tamaño de pantalla para determinar celdas visibles
    const updateVisibleCells = () => {
      if (window.innerWidth <= 650) {
        setVisibleCells(2); // 2 filas, 1 columna
      } else if (window.innerWidth <= 900) {
        setVisibleCells(2); // 1 fila, 2 columnas
      } else {
        setVisibleCells(3); // 1 fila, 3 columnas
      }
    };
    
    updateVisibleCells();
    window.addEventListener('resize', updateVisibleCells);
    
    return () => window.removeEventListener('resize', updateVisibleCells);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const schedule = () => {
      timeoutRef.current = setTimeout(() => {
        const cell = currentCell.current;
        
        // Obtenemos la nueva imagen
        const newImage = getNextUniqueImage(indices, cell);
        
        // Preparamos la nueva imagen en la capa superior
        setNextIndices((prev) => {
          const copy = [...prev];
          copy[cell] = newImage;
          return copy;
        });
        
        // Mostramos la nueva imagen encima con fade in
        setTimeout(() => {
          setShowNext((prev) => {
            const copy = [...prev];
            copy[cell] = true;
            return copy;
          });
          
          // Después del fade in, actualizamos la imagen base y ocultamos la superior
          setTimeout(() => {
            setIndices((prev) => {
              const copy = [...prev];
              copy[cell] = newImage;
              return copy;
            });
            
            setShowNext((prev) => {
              const copy = [...prev];
              copy[cell] = false;
              return copy;
            });
          }, 800); // Duración del fade in
        }, 50);
        
        // Avanza a la siguiente celda (solo celdas visibles)
        currentCell.current = (currentCell.current + 1) % visibleCells;
        schedule();
      }, 4000); // Cambio cada 4 segundos para ser menos intrusivo
    };
    schedule();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line
  }, [isClient, indices, visibleCells]);

  if (!isClient) {
    return (
      <section className={styles.hero}>
        <div className={styles.bgGridWrapper}>
          {[0, 1, 2].map((cell, idx) => (
            <div key={idx} className={styles.bgGridCell}>
              <div
                className={styles.bgGridImg + ' ' + styles.bgGridImgActive}
                style={{
                  backgroundImage: `url(${bgImages[idx]})`,
                }}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero}>
      <div className={styles.bgGridWrapper}>
        {[0, 1, 2].map((cell, idx) => (
          <div key={idx} className={styles.bgGridCell}>
            {/* Imagen base (siempre visible) */}
            <div
              className={styles.bgGridImg + ' ' + styles.bgGridImgBase}
              style={{
                backgroundImage: `url(${bgImages[indices[idx]]})`,
              }}
            />
            {/* Imagen de transición (aparece encima) */}
            {showNext[idx] && (
              <div
                className={styles.bgGridImg + ' ' + styles.bgGridImgTransition}
                style={{
                  backgroundImage: `url(${bgImages[nextIndices[idx]]})`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className={styles.overlay}></div>
      <div className={styles.overlayContent}>
        <InfoCard />
      </div>
    </section>
  );
};

export default Hero; 