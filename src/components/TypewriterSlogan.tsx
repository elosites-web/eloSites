import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';

interface TypewriterSloganProps {
  mode?: 'inicio' | 'all';
  className?: string;
}

interface WordMeta {
  text: string;
  isHighlight: boolean;
}

interface TypingStep {
  wordIdx: number;
  charLen: number;
  timeOffsetMs: number;
}

const WORDS: WordMeta[] = [
  { text: 'Tecnologia', isHighlight: false },
  { text: 'que', isHighlight: false },
  { text: 'transforma', isHighlight: false },
  { text: 'ideias', isHighlight: true },
  { text: 'em', isHighlight: true },
  { text: 'sites', isHighlight: true },
  { text: 'profissionais.', isHighlight: true },
];

const FULL_SLOGAN = WORDS.map((w) => w.text).join(' ');

// Pré-calcula a linha do tempo de cada caractere uma única vez fora do render
const STEPS: TypingStep[] = (() => {
  const list: TypingStep[] = [];
  let cumulativeMs = 0;

  for (let wIdx = 0; wIdx < WORDS.length; wIdx++) {
    const word = WORDS[wIdx].text;
    for (let cLen = 1; cLen <= word.length; cLen++) {
      if (wIdx === 0 && cLen === 1) {
        cumulativeMs += 16;
      } else if (cLen === 1) {
        // Pausa sutil e natural na transição entre palavras (espaço)
        cumulativeMs += 54;
      } else if (word[cLen - 1] === '.') {
        cumulativeMs += 42;
      } else {
        cumulativeMs += 28;
      }
      list.push({
        wordIdx: wIdx,
        charLen: cLen,
        timeOffsetMs: cumulativeMs,
      });
    }
  }

  return list;
})();

const INITIAL_START_DELAY_MS = 140;

export const TypewriterSlogan: React.FC<TypewriterSloganProps> = ({
  mode = 'all',
  className = '',
}) => {
  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(
    systemPrefersReduced || shouldReduceMedia() || getMotionTier() === 'none'
  );

  const wordTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const lastWordIndex = WORDS.length - 1;

    // Se o usuário prefere movimento reduzido, exibe a frase completa imediatamente sem animação
    if (isReduced) {
      for (let i = 0; i < WORDS.length; i++) {
        const textEl = wordTextRefs.current[i];
        if (textEl) textEl.textContent = WORDS[i].text;
        const cursorEl = cursorRefs.current[i];
        if (cursorEl) {
          cursorEl.style.display = i === lastWordIndex ? 'inline-block' : 'none';
          cursorEl.classList.remove('animate-typewriter-cursor', 'opacity-100');
          cursorEl.classList.add('animate-pulse', 'opacity-70');
        }
      }
      return;
    }

    if (mode && mode !== 'inicio' && mode !== 'all') {
      return;
    }

    // Estado inicial limpo: texto vazio nas camadas visíveis e cursor posicionado na 1ª palavra
    for (let i = 0; i < WORDS.length; i++) {
      const textEl = wordTextRefs.current[i];
      if (textEl) textEl.textContent = '';
      const cursorEl = cursorRefs.current[i];
      if (cursorEl) {
        cursorEl.style.display = i === 0 ? 'inline-block' : 'none';
        cursorEl.classList.remove('animate-pulse', 'opacity-70');
        cursorEl.classList.add('animate-typewriter-cursor', 'opacity-100');
      }
    }

    let rafId = 0;
    let startTime: number | null = null;
    let lastAppliedStep = -1;
    let activeCursorWord = 0;

    const tick = (now: number) => {
      if (startTime === null) {
        startTime = now + INITIAL_START_DELAY_MS;
      }

      const elapsed = now - startTime;
      if (elapsed < 0) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      let targetStep = lastAppliedStep;
      while (
        targetStep + 1 < STEPS.length &&
        STEPS[targetStep + 1].timeOffsetMs <= elapsed
      ) {
        targetStep++;
      }

      if (targetStep > lastAppliedStep) {
        for (let s = lastAppliedStep + 1; s <= targetStep; s++) {
          const step = STEPS[s];
          const textEl = wordTextRefs.current[step.wordIdx];
          if (textEl) {
            textEl.textContent = WORDS[step.wordIdx].text.slice(0, step.charLen);
          }
        }

        const nextCursorWord = STEPS[targetStep].wordIdx;
        if (nextCursorWord !== activeCursorWord) {
          const prevCursor = cursorRefs.current[activeCursorWord];
          const nextCursor = cursorRefs.current[nextCursorWord];
          if (prevCursor) prevCursor.style.display = 'none';
          if (nextCursor) nextCursor.style.display = 'inline-block';
          activeCursorWord = nextCursorWord;
        }

        lastAppliedStep = targetStep;
      }

      if (lastAppliedStep >= STEPS.length - 1) {
        const finalCursor = cursorRefs.current[lastWordIndex];
        if (finalCursor) {
          finalCursor.classList.remove('animate-typewriter-cursor', 'opacity-100');
          finalCursor.classList.add('animate-pulse', 'opacity-70');
        }
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isReduced, mode]);

  return (
    <h1
      className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance min-h-[88px] sm:min-h-[110px] lg:min-h-[120px] xl:min-h-[132px] ${className}`}
      aria-label={FULL_SLOGAN}
    >
      <span className="sr-only">{FULL_SLOGAN}</span>
      <span aria-hidden="true" className="inline">
        {WORDS.map((wordObj, idx) => {
          const isInitialCursor = isReduced ? idx === WORDS.length - 1 : idx === 0;
          return (
            <React.Fragment key={wordObj.text}>
              <span className="relative inline-block whitespace-nowrap align-baseline">
                {/* Camada fantasma invisível: reserva a largura exata de cada palavra desde o frame 0, evitando saltos de linha e reflows */}
                <span className="invisible select-none pointer-events-none">
                  {wordObj.text}
                </span>
                {/* Camada ativa de digitação: atualizada via requestAnimationFrame direto no DOM (0 re-renders) */}
                <span className="absolute left-0 top-0 whitespace-pre pointer-events-none">
                  <span
                    ref={(el) => {
                      wordTextRefs.current[idx] = el;
                    }}
                    className={
                      wordObj.isHighlight
                        ? 'bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent'
                        : 'text-white'
                    }
                  >
                    {isReduced ? wordObj.text : ''}
                  </span>
                  <span
                    ref={(el) => {
                      cursorRefs.current[idx] = el;
                    }}
                    style={{ display: isInitialCursor ? 'inline-block' : 'none' }}
                    className={`w-[3px] sm:w-[3.5px] lg:w-[4px] h-[0.76em] ml-0.5 sm:ml-1 align-baseline rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] ${
                      isReduced
                        ? 'animate-pulse opacity-70'
                        : 'animate-typewriter-cursor opacity-100'
                    }`}
                  />
                </span>
              </span>
              {idx < WORDS.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </span>
    </h1>
  );
};



