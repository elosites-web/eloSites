import React, { useEffect, useState, useCallback, useRef } from 'react';
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

  const [percent, setPercent] = useState(0);
  const lastPercentRef = useRef(0);

  // Mapeia o progresso para largura percentual com um valor mínimo sutil (0.4%)
  // para que a pontinha brilhante fique elegantemente visível desde o início
  const width = useTransform(springProgress, (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    // Garante que haja pelo menos uma pontinha visível (ou 0 quando na largada estrita)
    const pct = clamped * 100;
    return `${Math.max(0.3, pct)}%`;
  });

  // Cálculo robusto do progresso de rolagem vertical da página
  const updateScrollProgress = useCallback(() => {
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
      setPercent(intPercent);
    }
  }, [progressMotion]);

  useEffect(() => {
    // Atualização imediata na montagem
    updateScrollProgress();

    // Reavalia após a renderização da tela/seção (caso haja lazy loading ou expansão do DOM)
    const rafId = requestAnimationFrame(updateScrollProgress);
    const timeoutId = setTimeout(updateScrollProgress, 120);

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [updateScrollProgress, currentScreen]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[80] pointer-events-none h-[3.5px] bg-slate-950/70 border-b border-white/[0.04]"
      role="progressbar"
      aria-label="Progresso de leitura da página"
      aria-valuenow={percent}
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
