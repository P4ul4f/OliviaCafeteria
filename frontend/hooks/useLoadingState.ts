import { useState, useEffect } from 'react';

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    let progressInterval: NodeJS.Timeout;
    
    const startProgressAnimation = () => {
      progressInterval = setInterval(() => {
        progress += Math.random() * 20; // Más rápido
        if (progress > 90) progress = 90;
        setLoadingProgress(Math.min(progress, 90));
      }, 100); // Más frecuente
    };

    // Función para verificar si las fuentes están cargadas
    const checkFontsLoaded = async () => {
      try {
        // Verificar si las fuentes personalizadas están disponibles
        const customFonts = ['RhymeTH', 'Canter'];
        
        // Esperar a que las fuentes se carguen (pero con timeout)
        const fontsPromise = document.fonts.ready;
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 800)); // Máximo 800ms
        
        await Promise.race([fontsPromise, timeoutPromise]);
        
        const fontsLoaded = customFonts.every(font => {
          return document.fonts.check(`12px ${font}`);
        });

        // Tiempo mínimo muy reducido para mejor UX
        const minLoadTime = 600; // Solo 0.6 segundos mínimo
        const startTime = Date.now();

        const checkComplete = () => {
          const elapsed = Date.now() - startTime;
          if (fontsLoaded && elapsed >= minLoadTime) {
            setLoadingProgress(100);
            setTimeout(() => {
              setIsLoading(false);
            }, 200); // Pausa más corta
          } else {
            setTimeout(checkComplete, 50); // Verificación más frecuente
          }
        };

        checkComplete();
      } catch (error) {
        console.warn('Error checking fonts:', error);
        // Si hay error, continuar rápidamente
        setTimeout(() => {
          setLoadingProgress(100);
          setTimeout(() => {
            setIsLoading(false);
          }, 200);
        }, 600);
      }
    };

    // Iniciar la verificación cuando el componente se monta
    startProgressAnimation();
    checkFontsLoaded();

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, []);

  return { isLoading, loadingProgress };
};
