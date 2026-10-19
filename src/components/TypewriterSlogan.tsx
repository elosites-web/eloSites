import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';

interface TypewriterSloganProps {
  mode?: 'home' | 'inicio' | 'all';
  className?: string;
}

const PART1 = 'Tecnologia que transforma ';
const PART2 = 'ideias em sites.';
const FULL_TEXT = `${PART1}${PART2}`;

export const TypewriterSlogan: React.FC<TypewriterSloganProps> = ({
  mode = 'all',
  className = '',
}) => {
  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia() || getMotionTier() === 'none');

  const [displayedLength, setDisplayedLength] = useState<number>(isReduced ? FULL_TEXT.length : 0);
  const [isDone, setIsDone] = useState<boolean>(isReduced);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isReduced) {
      setDisplayedLength(FULL_TEXT.length);
      setIsDone(true);
      return;
    }

    // Se estiver em modo diferente de inicio/all, não animar
    if (mode && mode !== 'inicio' && mode !== 'all') {
      return;
    }

    // Iniciar ou reiniciar digitação limpa
    setDisplayedLength(0);
    setIsDone(false);

    let currentIndex = 0;

    // Atraso inicial para sincronizar com a entrada da seção
    const startTimeout = setTimeout(() => {
      const typeNextChar = () => {
        if (currentIndex < FULL_TEXT.length) {
          currentIndex += 1;
          setDisplayedLength(currentIndex);

          // Cadência orgânica de digitação humana
          let delay = 38;
          if (currentIndex === PART1.length) {
            delay = 220; // pausa estratégica antes do payoff com gradiente
          } else if (currentIndex > PART1.length) {
            delay = 44; // digitação ligeiramente mais ritmada para 'ideias em sites.'
          } else if (FULL_TEXT[currentIndex - 1] === ' ') {
            delay = 60; // respiro natural nos espaços
          }

          timerRef.current = setTimeout(typeNextChar, delay);
        } else {
          setIsDone(true);
        }
      };

      typeNextChar();
    }, 240);

    return () => {
      clearTimeout(startTimeout);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [mode, isReduced]);

  const part1Length = Math.min(displayedLength, PART1.length);
  const part2Length = Math.max(0, displayedLength - PART1.length);

  const displayedPart1 = PART1.slice(0, part1Length);
  const displayedPart2 = PART2.slice(0, part2Length);

  return (
    <h1
      className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance min-h-[88px] sm:min-h-[110px] lg:min-h-[120px] xl:min-h-[132px] ${className}`}
      aria-label={FULL_TEXT}
    >
      <span className="sr-only">{FULL_TEXT}</span>
      <span aria-hidden="true" className="inline">
        <span>{displayedPart1}</span>
        {displayedPart2 && (
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]">
            {displayedPart2}
          </span>
        )}
        {/* Cursor de digitação estilo terminal elétrico da ēloSites */}
        <span
          className={`inline-block w-[3px] sm:w-[3.5px] lg:w-[4px] h-[0.76em] ml-1 sm:ml-1.5 align-baseline rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.95),0_0_22px_rgba(59,130,246,0.8)] transition-opacity duration-300 ${
            isDone ? 'animate-pulse opacity-80' : 'animate-typewriter-cursor opacity-100'
          }`}
          aria-hidden="true"
        />
      </span>
    </h1>
  );
};
