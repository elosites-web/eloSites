import React, { useEffect, useRef } from 'react';
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

  // Mapeia o progresso para largura percentual com um valor mínimo sutil (0.3%)
  // para que a pontinha brilhante fique elegantemente visível desde o início
  const width = useTransform(springProgress, (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    const pct = clamped * 100;
    return `${Math.max(0.3, pct)}%`;
  });

  useEffect(() => {
    let frame: number | null = null;
    let heightDirty = true;
    let scrollRange = 0;
    const root = document.documentElement;
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(invalidateHeight) : null;

    function measure() {
      frame = null;
      if (heightDirty || !observer) {
        scrollRange = root.scrollHeight - window.innerHeight;
        heightDirty = false;
      }
      const ratio = scrollRange > 4 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
      progressMotion.set(ratio);
      const percent = Math.round(ratio * 100);
      if (percent !== lastPercentRef.current) {
        lastPercentRef.current = percent;
        barRef.current?.setAttribute('aria-valuenow', String(percent));
      }
    }

    function schedule() {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    }

    function invalidateHeight() {
      heightDirty = true;
      schedule();
    }

    observer?.observe(document.body);
    observer?.observe(root);
    schedule();
    document.fonts?.addEventListener('loadingdone', invalidateHeight);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', invalidateHeight);
    return () => {
      observer?.disconnect();
      document.fonts?.removeEventListener('loadingdone', invalidateHeight);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', invalidateHeight);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [progressMotion, currentScreen]);

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
