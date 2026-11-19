import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Hook utilitário para sincronizar a largura do contêiner do slogan
 * à largura real renderizada do logotipo da ēloSites (ícone + tipografia),
 * garantindo centralização e prevenindo transbordamento visual em qualquer viewport.
 */
export function useLogoTaglineWidth<T extends HTMLElement = HTMLImageElement>(enabled = true) {
  const logoRef = useRef<T>(null);
  const lastWidthRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [logoWidth, setLogoWidth] = useState<number | null>(null);

  const commitWidth = useCallback((rawWidth: number) => {
    if (!(rawWidth > 0)) return;
    const roundedWidth = Math.round(rawWidth * 10) / 10;
    if (
      lastWidthRef.current !== null &&
      Math.abs(lastWidthRef.current - roundedWidth) < 0.5
    ) {
      return;
    }
    lastWidthRef.current = roundedWidth;
    setLogoWidth(roundedWidth);
  }, []);

  const scheduleMeasure = useCallback(
    (observedWidth?: number) => {
      if (!enabled) return;
      if (typeof window === 'undefined') return;
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (typeof observedWidth === 'number' && observedWidth > 0) {
          commitWidth(observedWidth);
          return;
        }
        const el = logoRef.current;
        if (!el) return;
        // offsetWidth evita leituras distorcidas por scale() durante animações de entrada
        const width = el.offsetWidth || el.getBoundingClientRect().width;
        commitWidth(width);
      });
    },
    [commitWidth, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    scheduleMeasure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && logoRef.current) {
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        scheduleMeasure(entry?.contentRect?.width);
      });
      ro.observe(logoRef.current);
    } else if (typeof window !== 'undefined') {
      const onResize = () => scheduleMeasure();
      window.addEventListener('resize', onResize, { passive: true });
      return () => {
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        window.removeEventListener('resize', onResize);
      };
    }

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (ro) ro.disconnect();
    };
  }, [enabled, scheduleMeasure]);

  const handleImageLoad = useCallback(() => {
    scheduleMeasure();
  }, [scheduleMeasure]);

  return { logoRef, logoWidth, handleImageLoad };
}
