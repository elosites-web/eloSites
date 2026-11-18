import React, { useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';

interface ReadingProgressBarProps {
  currentScreen?: string;
}

/**
 * Barra horizontal de progresso de leitura no topo da página (logo acima do cabeçalho)
 * Acompanha o progresso real de rolagem vertical da tela com a identidade visual da ēloSites
 * (gradiente índigo/violeta) e uma ponta levemente brilhante (glowing tip) com beacon dinâmico.
 */
export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ currentScreen }) => {
  const prefersReduced = shouldReduceMedia();

  // Valor de movimento direto para o progresso normalizado (0 a 1)
  const progressMotion = useMotionValue(0);

  // Mola para suavizar acelerações e frenagens tácteis no scroll
  const springProgress = useSpring(progressMotion, {
    stiffness: prefersReduced ? 1200 : 180,
    damping: prefersReduced ? 100 : 28,
    restDelta: 0.0005,
  });

  const barRef = useRef<HTMLDivElement>(null);
  const lastPercentRef = useRef(0);
  const pendingRafRef = useRef<number | null>(null);

  // Mapeia o progresso para largura percentual com um valor mínimo sutil (0.3%)
  // para que a pontinha brilhante fique elegantemente visível desde o início
  const width = useTransform(springProgress, (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    const pct = clamped * 100;
    return `${Math.max(0.3, pct)}%`;
  });

  // Cálculo do progresso de rolagem vertical sem causar re-renders em React
  const measureProgress = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    let ratio = 0;
    if (docHeight > 4) {
      ratio = Math.min(1, Math.max(0, scrollTop / docHeight));
    }

    progressMotion.set(ratio);

    const intPercent = Math.round(ratio * 100);
    if (intPercent !== lastPercentRef.current) {
      lastPercentRef.current = intPercent;
      barRef.current?.setAttribute('aria-valuenow', String(intPercent));
    }
  }, [progressMotion]);

  useEffect(() => {
    const scheduleMeasure = () => {
      if (pendingRafRef.current !== null) return;
      pendingRafRef.current = window.requestAnimationFrame(() => {
        pendingRafRef.current = null;
        measureProgress();
      });
    };

    // Atualização imediata na montagem e após estabilização inicial
    measureProgress();
    const rafId = window.requestAnimationFrame(measureProgress);
    const timeoutId = window.setTimeout(measureProgress, 120);

    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (pendingRafRef.current !== null) {
        window.cancelAnimationFrame(pendingRafRef.current);
        pendingRafRef.current = null;
      }
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [measureProgress, currentScreen]);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[80] pointer-events-none h-[3.5px] bg-slate-950/70 border-b border-white/[0.04]"
      role="progressbar"
      aria-label="Progresso de leitura da página"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full relative bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.9),0_0_6px_rgba(56,189,248,0.8)] rounded-r-full"
        style={{ width }}
      >
        {/* Flare luminoso translúcido na borda de ataque da barra */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent via-white/15 to-white/40 pointer-events-none"
          aria-hidden="true"
        />

        {/* Pontinha da barra levemente brilhante: exatamente do tamanho da espessura da barra */}
        <div
          className="absolute right-0 top-0 h-full aspect-square rounded-full bg-white shadow-[0_0_4px_#ffffff,0_0_8px_#38bdf8,0_0_12px_#3b82f6] pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
};
