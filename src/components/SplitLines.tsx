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
  const [lineMap, setLineMap] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);

  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  // Agrupa palavras por linha visual para que o stagger seja por linha.
  useLayoutEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-sl-word]'));
      if (!spans.length) return;
      const tops: number[] = [];
      const map = spans.map((span) => {
        const top = span.offsetTop;
        let idx = tops.findIndex((t) => Math.abs(t - top) < 2);
        if (idx === -1) {
          tops.push(top);
          idx = tops.length - 1;
        }
        return idx;
      });
      setLineMap(map);
    };

    measure();
    // Re-mede quando as fontes terminam de carregar (mudam quebras de linha).
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    const onResize = () => measure();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
    };
  }, [enabled, words.length]);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
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
