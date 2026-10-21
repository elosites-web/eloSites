import { useRef, useState, useEffect } from 'react';

/**
 * Hook utilitário para sincronizar a largura do contêiner do slogan
 * à largura real renderizada do logotipo da ēloSites (ícone + tipografia),
 * garantindo centralização e prevenindo transbordamento visual em qualquer viewport.
 */
export function useLogoTaglineWidth<T extends HTMLElement = HTMLImageElement>() {
  const logoRef = useRef<T>(null);
  const [logoWidth, setLogoWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setLogoWidth(rect.width);
        }
      }
    };

    // Atualização imediata
    updateWidth();

    // Timers para garantir que layouts animados ou modais montados tenham dimensões calculadas
    const timer = setTimeout(updateWidth, 40);
    const timer2 = setTimeout(updateWidth, 120);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && logoRef.current) {
      ro = new ResizeObserver(updateWidth);
      ro.observe(logoRef.current);
    }

    window.addEventListener('resize', updateWidth, { passive: true });
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handleImageLoad = () => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        setLogoWidth(rect.width);
      }
    }
  };

  return { logoRef, logoWidth, handleImageLoad };
}
