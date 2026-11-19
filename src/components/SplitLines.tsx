import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getMotionTier } from '../mediaPrefs';

interface SplitLinesProps {
  /** Texto completo do título. Permanece no DOM; nada é inventado. */
  text: string;
  as?: React.ElementType;
  className?: string;
  id?: string;
  /** Espaço reservado em fundo: mantém o texto real acessível por padrão. */
}

/**
 * Revelação "linha a linha" de títulos (técnica inspirada na referência Blink),
 * sem alterar o texto:
 *  - medida real das linhas via offsetTop das palavras (agrupa por linha);
 *  - cada linha sobe de dentro de uma máscara (overflow hidden) com stagger;
 *  - o título continua sendo um único elemento real com o texto completo;
 *  - `aria-label` no heading + spans internos `aria-hidden`.
 * Em tier 'none' o título é renderizado como texto puro (sem split/DOM extra).
 */
export const SplitLines: React.FC<SplitLinesProps> = ({ text, as, className = '', id }) => {
  const Tag = (as ?? 'h2') as React.ElementType;
  const enabled = React.useRef(getMotionTier() !== 'none').current;
  const containerRef = useRef<HTMLElement | null>(null);
  const lastWidthRef = useRef<number | null>(null);
  const [lineMap, setLineMap] = useState<number[]>([]);
  const [isMeasured, setIsMeasured] = useState(!enabled);
  const [inView, setInView] = useState(!enabled);

  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const visible = !enabled || (inView && isMeasured);

  // Agrupa palavras por linha visual para que o stagger seja por linha.
  useLayoutEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let rafId: number | null = null;

    const measure = () => {
      if (cancelled) return;
      const spans = el.querySelectorAll<HTMLElement>('[data-sl-word]');
      if (!spans.length) {
        setIsMeasured(true);
        return;
      }

      // Lê todos os offsetTop em uma única passagem contígua (sem intercalar escritas no DOM)
      const tops: number[] = [];
      const nextMap: number[] = new Array(spans.length);
      for (let i = 0; i < spans.length; i++) {
        const top = spans[i].offsetTop;
        let idx = -1;
        for (let j = 0; j < tops.length; j++) {
          if (Math.abs(tops[j] - top) < 2) {
            idx = j;
            break;
          }
        }
        if (idx === -1) {
          tops.push(top);
          idx = tops.length - 1;
        }
        nextMap[i] = idx;
      }

      setLineMap((prev) => {
        if (
          prev.length === nextMap.length &&
          prev.every((val, index) => val === nextMap[index])
        ) {
          return prev;
        }
        return nextMap;
      });
      setIsMeasured(true);
    };

    const scheduleMeasure = () => {
      if (cancelled || typeof window === 'undefined') return;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        measure();
      });
    };

    // Medição inicial síncrona antes da primeira pintura para evitar flash antes da animação
    measure();

    // Re-mede em rAF apenas se as fontes ainda estiverem carregando (pode alterar quebras de linha).
    if (
      typeof document !== 'undefined' &&
      document.fonts?.ready &&
      document.fonts.status !== 'loaded'
    ) {
      document.fonts.ready.then(() => {
        if (!cancelled) scheduleMeasure();
      });
    }

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect?.width;
        if (
          typeof width === 'number' &&
          lastWidthRef.current !== null &&
          Math.abs(lastWidthRef.current - width) < 1
        ) {
          return;
        }
        if (typeof width === 'number') {
          lastWidthRef.current = width;
        }
        scheduleMeasure();
      });
      ro.observe(el);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', scheduleMeasure, { passive: true });
    }

    return () => {
      cancelled = true;
      if (rafId !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(rafId);
      }
      if (ro) {
        ro.disconnect();
      } else if (typeof window !== 'undefined') {
        window.removeEventListener('resize', scheduleMeasure);
      }
    };
  }, [enabled, words]);

  useEffect(() => {
    if (!enabled) {
      setInView(true);
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef}
      id={id}
      className={`split-lines${visible ? ' is-visible' : ''} ${className}`.trim()}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="sl-mask" data-sl-word aria-hidden="true">
          <span className="sl-inner" style={{ ['--d' as string]: lineMap[i] ?? 0 } as React.CSSProperties}>
            {word}
          </span>
        </span>
      )).reduce<React.ReactNode[]>((acc, node, i) => {
        acc.push(node);
        if (i < words.length - 1) acc.push(' ');
        return acc;
      }, [])}
    </Tag>
  );
};
