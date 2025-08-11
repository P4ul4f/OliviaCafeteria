import { useState, useEffect } from 'react';

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    let progressInterval: NodeJS.Timeout;
    
    const startProgressAnimation = () => {
      progressInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress > 85) progress = 85;
        setLoadingProgress(Math.min(progress, 85));
      }, 150);
    };

    // Función para verificar si las fuentes están cargadas
    const checkFontsLoaded = async () => {
      try {
        // Verificar si las fuentes personalizadas están disponibles
        const customFonts = ['RhymeTH', 'Canter'];
        
        // Esperar a que las fuentes se carguen
        await document.fonts.ready;
        
        const fontsLoaded = customFonts.every(font => {
          return document.fonts.check(`12px ${font}`);
        });

        // También esperar un tiempo mínimo para asegurar que todo esté listo
        const minLoadTime = 2500; // 2.5 segundos mínimo
        const startTime = Date.now();

        const checkComplete = () => {
          const elapsed = Date.now() - startTime;
          if (fontsLoaded && elapsed >= minLoadTime) {
            setLoadingProgress(100);
            setTimeout(() => {
              setIsLoading(false);
            }, 400); // Pequeña pausa para mostrar el 100%
          } else {
            setTimeout(checkComplete, 100);
          }
        };

        checkComplete();
      } catch (error) {
        console.warn('Error checking fonts:', error);
        // Si hay error, continuar después del tiempo mínimo
        setTimeout(() => {
          setLoadingProgress(100);
          setTimeout(() => {
            setIsLoading(false);
          }, 400);
        }, 2500);
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
