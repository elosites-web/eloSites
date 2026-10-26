import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';

interface TypewriterSloganProps {
  mode?: 'home' | 'inicio' | 'all';
  className?: string;
}

const PREFIX = 'Tecnologia que transforma ';
const HIGHLIGHT_TEXT = 'ideias em sites profissionais.';
const FULL_SLOGAN = `${PREFIX}${HIGHLIGHT_TEXT}`;
const PREFIX_LENGTH = PREFIX.length;

export const TypewriterSlogan: React.FC<TypewriterSloganProps> = ({
  mode = 'all',
  className = '',
}) => {
  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(
    systemPrefersReduced || shouldReduceMedia() || getMotionTier() === 'none'
  );

  // Se preferir movimento reduzido, inicia com o texto completo
  const [charCount, setCharCount] = useState(isReduced ? FULL_SLOGAN.length : 0);
  const [isComplete, setIsComplete] = useState(isReduced);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isReduced) {
      setCharCount(FULL_SLOGAN.length);
      setIsComplete(true);
      return;
    }

    if (mode && mode !== 'inicio' && mode !== 'all') {
      return;
    }

    // Pequeno atraso inicial de 200ms para coordenar com o reveal da seção Hero
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, 200);

    return () => clearTimeout(startTimeout);
  }, [isReduced, mode]);

  useEffect(() => {
    if (isReduced || !started || isComplete) return;

    if (charCount >= FULL_SLOGAN.length) {
      setIsComplete(true);
      return;
    }

    const currentChar = FULL_SLOGAN[charCount];

    // Cadência fluida e natural: pequenas variações orgânicas com respiração em espaços e pontuação
    let delay = 44;
    if (currentChar === ' ') {
      delay = 82;
    } else if (currentChar === '.') {
      delay = 180;
    } else {
      delay = 38 + ((charCount * 7) % 18);
    }

    const timer = setTimeout(() => {
      setCharCount((prev) => {
        const next = prev + 1;
        if (next >= FULL_SLOGAN.length) {
          setIsComplete(true);
        }
        return next;
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [charCount, started, isComplete, isReduced]);

  // Separação de trechos para aplicar o gradiente característico da ēloSites
  const typedPrefix = FULL_SLOGAN.slice(0, Math.min(charCount, PREFIX_LENGTH));
  const typedHighlight =
    charCount > PREFIX_LENGTH ? FULL_SLOGAN.slice(PREFIX_LENGTH, charCount) : '';

  return (
    <h1
      className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance min-h-[88px] sm:min-h-[110px] lg:min-h-[120px] xl:min-h-[132px] ${className}`}
      aria-label={FULL_SLOGAN}
    >
      <span className="sr-only">{FULL_SLOGAN}</span>
      <span aria-hidden="true" className="inline">
        <span>{typedPrefix}</span>
        {typedHighlight && (
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]">
            {typedHighlight}
          </span>
        )}
        {/* Cursor elétrico de digitação da ēloSites estilo terminal neon */}
        <span
          className={`inline-block w-[3px] sm:w-[3.5px] lg:w-[4px] h-[0.76em] ml-1 sm:ml-1.5 align-baseline rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.95),0_0_22px_rgba(59,130,246,0.8)] transition-opacity duration-500 ${
            isComplete
              ? 'animate-pulse opacity-70'
              : 'animate-typewriter-cursor opacity-100'
          }`}
          aria-hidden="true"
        />
      </span>
    </h1>
  );
};


