import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl, ScreenId } from '../types';
import { shouldReduceMedia } from '../mediaPrefs';
import { X, ArrowRight } from 'lucide-react';

/**
 * CONSTANTES DE TEMPORIZAÇÃO (em milissegundos)
 * Centralizadas no topo do arquivo para fácil ajuste pelo proprietário.
 */
export const FLOATING_WHATSAPP_TIMINGS = {
  // Tempo após o carregamento completo da página (window 'load') para o botão começar a aparecer (30 s)
  BUTTON_APPEAR_DELAY_MS: 30000,
  // Duração do skeleton loader na transição para visível, prevenindo layout shift e FOUC (700 ms)
  SKELETON_DURATION_MS: 700,
  // Tempo após o botão aparecer para iniciar o efeito de pulso gradiente nele e na bolinha (5 s)
  BUTTON_PULSE_DELAY_MS: 5000,
  // Tempo após a aparição do botão para o balão abrir (15 s após o botão = 45 s após o load)
  BUBBLE_APPEAR_DELAY_MS: 15000,
  // Tempo que o balão permanece visível antes de fechar sozinho (10 s)
  BUBBLE_VISIBLE_DURATION_MS: 10000,
  // Intervalo para o balão reaparecer após ser fechado (2 minutos = 120 s)
  BUBBLE_REAPPEAR_INTERVAL_MS: 120000,
  // Limite máximo de aparições do balão durante a sessão (Infinity = ciclo contínuo)
  BUBBLE_MAX_APPEARANCES: Infinity,
} as const;

// Verificação de horário comercial oficial (Segunda a Sexta, 09:00 - 18:00)
const isWithinBusinessHours = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 5 = Sexta, 6 = Sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;
  const isWeekday = day >= 1 && day <= 5;
  const isDuringHours = currentMinutes >= 9 * 60 && currentMinutes < 18 * 60;
  return isWeekday && isDuringHours;
};

/**
 * Skeleton Loader do Botão Flutuante do WhatsApp
 * Mantém o mesmo bounding box (56x56px) para garantir zero Cumulative Layout Shift (CLS)
 * e uma transição suave de oculto para visível sem flashes de conteúdo desestilizado (FOUC).
 */
export const SkeletonFloatingWhatsApp: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Carregando botão de atendimento via WhatsApp"
      className={`relative w-14 h-14 rounded-full bg-[#090E23]/95 border border-blue-500/30 shadow-xl flex items-center justify-center overflow-hidden select-none pointer-events-none animate-pulse ${className}`}
    >
      {/* Linha de shimmer suave */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"
        aria-hidden="true"
      />
      {/* Placeholder da bolinha de status */}
      <span
        className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 rounded-full bg-slate-700/80 border-2 border-[#050814]"
        aria-hidden="true"
      />
      {/* Placeholder central do ícone */}
      <div
        className="w-7 h-7 rounded-full bg-slate-700/60"
        aria-hidden="true"
      />
      <span className="sr-only">Carregando canal de atendimento...</span>
    </div>
  );
};

interface FloatingWhatsAppProps {
  onBubbleStateChange?: (isVisible: boolean) => void;
  currentScreen?: ScreenId;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onBubbleStateChange, currentScreen }) => {
  const isHomeScreen = currentScreen === 'home';
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => isWithinBusinessHours());

  // Notifica o rodapé e a aplicação quando o balão do WhatsApp surge ou fecha
  useEffect(() => {
    onBubbleStateChange?.(isBubbleVisible);
    try {
      window.dispatchEvent(
        new CustomEvent('elosites-bubble-visibility', {
          detail: { isVisible: isBubbleVisible },
        })
      );
    } catch {}
  }, [isBubbleVisible, onBubbleStateChange]);

  // Acessibilidade e preferências de redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // Refs de controle de temporizadores e estado
  const buttonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const skeletonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialBubbleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reappearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const remainingTimeRef = useRef<number>(FLOATING_WHATSAPP_TIMINGS.BUBBLE_VISIBLE_DURATION_MS);
  const timerStartTimeRef = useRef<number>(0);
  const appearanceCountRef = useRef<number>(0);
  const isBubbleVisibleRef = useRef<boolean>(false);

  // Mantém a ref sincronizada para uso seguro em callbacks assíncronos
  isBubbleVisibleRef.current = isBubbleVisible;

  // Atualização periódica do status de atendimento (online / responderemos em breve)
  useEffect(() => {
    setIsOnline(isWithinBusinessHours());
    const interval = setInterval(() => {
      setIsOnline(isWithinBusinessHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Limpa com segurança todos os temporizadores pendentes
  const clearAllTimers = useCallback(() => {
    if (buttonTimerRef.current) clearTimeout(buttonTimerRef.current);
    if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    if (initialBubbleTimerRef.current) clearTimeout(initialBubbleTimerRef.current);
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    if (reappearTimerRef.current) clearTimeout(reappearTimerRef.current);
  }, []);

  // Forward ref para quebrar dependência circular entre showBubble e closeBubble
  const showBubbleRef = useRef<() => void>(() => {});

  // Fecha o balão e agenda a próxima aparição no ciclo de 2 minutos
  const closeBubbleAndScheduleReappear = useCallback(() => {
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    autoCloseTimerRef.current = null;

    setIsBubbleVisible(false);
    setIsPaused(false);

    if (reappearTimerRef.current) clearTimeout(reappearTimerRef.current);

    if (appearanceCountRef.current < FLOATING_WHATSAPP_TIMINGS.BUBBLE_MAX_APPEARANCES) {
      reappearTimerRef.current = setTimeout(() => {
        showBubbleRef.current();
      }, FLOATING_WHATSAPP_TIMINGS.BUBBLE_REAPPEAR_INTERVAL_MS);
    }
  }, []);

  // Inicia o temporizador de auto-fechamento do balão
  const startAutoCloseCountdown = useCallback(
    (durationMs: number) => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      timerStartTimeRef.current = Date.now();
      autoCloseTimerRef.current = setTimeout(() => {
        closeBubbleAndScheduleReappear();
      }, durationMs);
    },
    [closeBubbleAndScheduleReappear]
  );

  // Exibe o balão e inicia a contagem de visibilidade
  const showBubble = useCallback(() => {
    if (appearanceCountRef.current >= FLOATING_WHATSAPP_TIMINGS.BUBBLE_MAX_APPEARANCES) {
      return;
    }

    appearanceCountRef.current += 1;
    setIsBubbleVisible(true);
    setIsPaused(false);
    remainingTimeRef.current = FLOATING_WHATSAPP_TIMINGS.BUBBLE_VISIBLE_DURATION_MS;
    startAutoCloseCountdown(FLOATING_WHATSAPP_TIMINGS.BUBBLE_VISIBLE_DURATION_MS);
  }, [startAutoCloseCountdown]);

  // Mantém showBubbleRef atualizado com a versão mais recente
  showBubbleRef.current = showBubble;

  // Pausa a contagem quando o ponteiro está sobre o balão ou o foco está dentro
  const handlePause = useCallback(() => {
    if (!isBubbleVisibleRef.current) return;
    setIsPaused(true);

    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }

    const elapsed = Date.now() - timerStartTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  }, []);

  // Retoma a contagem de onde parou quando o cursor/foco sai do balão
  const handleResume = useCallback(() => {
    if (!isBubbleVisibleRef.current || remainingTimeRef.current <= 0) return;
    setIsPaused(false);
    startAutoCloseCountdown(remainingTimeRef.current);
  }, [startAutoCloseCountdown]);

  // Tratamento de foco para acessibilidade (pausa se o foco estiver dentro do balão)
  const handleBubbleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
      }
      handleResume();
    },
    [handleResume]
  );

  // Fechamento manual pelo usuário (botão X ou tecla Escape)
  const handleManualClose = useCallback(() => {
    closeBubbleAndScheduleReappear();
  }, [closeBubbleAndScheduleReappear]);

  // Tecla Escape para fechar quando o foco está no balão
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleManualClose();
      }
    },
    [handleManualClose]
  );

  // Ao clicar no botão flutuante enquanto o balão está visível
  const handleButtonClick = useCallback(() => {
    if (isBubbleVisibleRef.current) {
      closeBubbleAndScheduleReappear();
    }
  }, [closeBubbleAndScheduleReappear]);

  // Refatorado com useLayoutEffect para aplicar o estado inicial hidden (display: none / opacity: 0)
  // antes da primeira pintura, prevenindo piscadas (FOUC) na carga inicial da página
  useLayoutEffect(() => {
    // Assegura explicitamente o estado inicial oculto antes de qualquer paint
    setIsButtonVisible(false);
    setIsSkeletonLoading(false);
    setIsPulsing(false);
    setIsBubbleVisible(false);

    const startInitialSequence = () => {
      buttonTimerRef.current = setTimeout(() => {
        // Exibe o skeleton loader primeiro para transição suave e zero layout shift
        setIsButtonVisible(true);
        setIsSkeletonLoading(true);

        skeletonTimerRef.current = setTimeout(() => {
          setIsSkeletonLoading(false);

          // Exatamente 5 segundos após o botão estar carregado: inicia o efeito de pulso gradiente
          pulseTimerRef.current = setTimeout(() => {
            setIsPulsing(true);
          }, FLOATING_WHATSAPP_TIMINGS.BUTTON_PULSE_DELAY_MS);

          // Balão surge 15 segundos após o botão ter aparecido
          initialBubbleTimerRef.current = setTimeout(() => {
            showBubbleRef.current();
          }, FLOATING_WHATSAPP_TIMINGS.BUBBLE_APPEAR_DELAY_MS);
        }, FLOATING_WHATSAPP_TIMINGS.SKELETON_DURATION_MS);
      }, FLOATING_WHATSAPP_TIMINGS.BUTTON_APPEAR_DELAY_MS);
    };

    if (document.readyState === 'complete') {
      startInitialSequence();
    } else {
      window.addEventListener('load', startInitialSequence, { once: true });
    }

    return () => {
      window.removeEventListener('load', startInitialSequence);
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const floatingWhatsappUrl = whatsappUrl(SITE_CONFIG.floatingWhatsappMessage);

  if (isHomeScreen) {
    return null;
  }

  return (
    <aside
      aria-label="Atendimento rápido via WhatsApp"
      style={{
        display: isButtonVisible ? 'flex' : 'none',
        opacity: isButtonVisible ? 1 : 0,
      }}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none select-none pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)] ${
        !isButtonVisible ? 'hidden opacity-0 pointer-events-none' : ''
      }`}
    >
      {/* Balão de Pop-up estilo Chat Preview Premium */}
      <AnimatePresence>
        {isBubbleVisible && (
          <motion.div
            key="whatsapp-bubble-popup"
            role="region"
            aria-label="Mensagem do WhatsApp"
            tabIndex={-1}
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
            onFocus={handlePause}
            onBlur={handleBubbleBlur}
            onKeyDown={handleKeyDown}
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 14, scale: 0.92 }
            }
            animate={
              prefersReduced
                ? { opacity: 1, transition: { duration: 0.15 } }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 350,
                      damping: 22,
                      mass: 0.75,
                    },
                  }
            }
            exit={
              prefersReduced
                ? { opacity: 0, transition: { duration: 0.15 } }
                : {
                    opacity: 0,
                    y: 10,
                    scale: 0.94,
                    transition: {
                      type: 'spring',
                      stiffness: 420,
                      damping: 26,
                      mass: 0.6,
                      opacity: { duration: 0.18 },
                    },
                  }
            }
            style={{ transformOrigin: 'bottom right' }}
            className="whatsapp-bubble-interactive pointer-events-auto relative mb-2 w-[calc(100vw-32px)] max-w-[240px] rounded-[14px] bg-[#090E23]/95 border border-blue-500/40 shadow-2xl shadow-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(59,130,246,0.25)] backdrop-blur-md px-3 py-2.5 space-y-2 z-50"
          >
            {/* 1. Header Row: Avatar com Logotipo Oficial, Nome ēloSites, Status com Dot e Botão Fechar */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = 'home';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-6 h-6 rounded-full bg-slate-900 border border-blue-500/30 p-0.5 flex items-center justify-center shrink-0 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                  aria-label="ēloSites — Ir para a Página Inicial (Home)"
                >
                  <img
                    src="/favicon-32x32.png"
                    alt="ēloSites"
                    className="w-full h-full object-contain"
                    width={24}
                    height={24}
                    loading="lazy"
                  />
                </a>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-white leading-none">
                    {SITE_CONFIG.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isOnline ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-medium text-slate-300 truncate leading-none">
                      {isOnline ? 'Online agora' : 'Responderemos em breve'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão Fechar com área de toque e foco visível */}
              <button
                type="button"
                onClick={handleManualClose}
                className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 -mr-0.5 -mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="Fechar mensagem"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Message Body: Texto centralizado com quebra de linha harmônica, abaixado em 0.7px */}
            <p
              style={{ transform: 'translateY(0.7px)' }}
              className="text-[12.5px] leading-snug text-slate-100 selection:bg-blue-600 text-center px-1 py-0.5 font-normal translate-y-[0.7px]"
            >
              Olá! Precisa de um site?
              <br />
              Me fale sobre o seu projeto.
            </p>

            {/* 3. Subtle Action Row: Ação curta 'Responder no WhatsApp' centralizada */}
            <div className="pt-1.5 border-t border-white/[0.06] flex items-center justify-center">
              <a
                href={floatingWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleButtonClick}
                className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded py-0.5 group/action"
              >
                <span>Responder no WhatsApp</span>
                <ArrowRight className="w-3 h-3 text-blue-400 group-hover/action:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Hairline de progresso fino (2px) na borda inferior */}
            {!prefersReduced && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden rounded-b-[14px] bg-white/[0.04] pointer-events-none"
                aria-hidden="true"
              >
                <div
                  className="h-full w-full bg-gradient-to-r from-indigo-500/50 to-purple-500/50"
                  style={{
                    animation: `shrinkProgress ${FLOATING_WHATSAPP_TIMINGS.BUBBLE_VISIBLE_DURATION_MS}ms linear forwards`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                />
              </div>
            )}

            {/* Tail / Seta apontando diretamente para o centro do botão flutuante */}
            <div
              className="absolute -bottom-[5px] right-[22px] w-2.5 h-2.5 rotate-45 bg-[#0B101D] border-r border-b border-indigo-400/60 pointer-events-none"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante Principal com Skeleton Loader na transição de oculto para visível */}
      {isButtonVisible && (
        <div className="relative pointer-events-auto w-14 h-14 shrink-0 [contain:layout_style]">
          <AnimatePresence mode="wait">
            {isSkeletonLoading ? (
              <motion.div
                key="whatsapp-skeleton-loader"
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: prefersReduced ? 0.12 : 0.22, ease: 'easeOut' }}
              >
                <SkeletonFloatingWhatsApp />
              </motion.div>
            ) : (
              <div key="whatsapp-interactive-container" className="relative w-14 h-14">
                {/* Aura de pulso gradiente expansiva com alto contraste contra o fundo escuro */}
                {isPulsing && !prefersReduced && (
                  <span
                    className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 blur-sm animate-gradient-pulse-aura pointer-events-none -z-10 [contain:strict]"
                    aria-hidden="true"
                  />
                )}

                <motion.a
                  id="floating-whatsapp-btn"
                  href={floatingWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Conversar no WhatsApp com a ēloSites"
                  onClick={handleButtonClick}
                  initial={
                    prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: -16 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: prefersReduced ? 0.2 : 0.36,
                    ease: 'easeOut',
                  }}
                  className={`relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] duration-200 border-2 border-indigo-400/50 active:scale-95 hover:shadow-indigo-500/40 z-50 select-none ${
                    isPulsing && !prefersReduced ? 'animate-gradient-pulse-button' : ''
                  }`}
                >
                  {/* Indicador de Status Online / Horário — com efeito de pulso gradiente 5s após carregar */}
                  <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 pointer-events-none">
                    {isPulsing && !prefersReduced && (
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full animate-gradient-dot-ping ${
                          isOnline
                            ? 'bg-gradient-to-tr from-emerald-400 to-teal-300'
                            : 'bg-gradient-to-tr from-amber-400 to-yellow-300'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#090D16] ${
                        isOnline ? 'bg-emerald-500' : 'bg-amber-400'
                      } ${isPulsing && !prefersReduced ? 'animate-gradient-dot-glow' : ''}`}
                    />
                  </span>

                  {/* Ícone Oficial do WhatsApp com efeito de preenchimento gradual sincronizado com a barra de progresso do balão */}
                  <div
                    className="relative w-7 h-7 flex items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-110"
                    aria-hidden="true"
                  >
                    {/* Estado de Espera (Waiting State): Base em tom calmo e sutil de espera */}
                    <WhatsAppIcon
                      className={`w-7 h-7 transition-colors duration-500 ${
                        isBubbleVisible ? 'text-emerald-200/40' : 'text-emerald-300'
                      }`}
                    />

                    {/* Estado de Ação (Action State): Preenchimento gradual que reflete a barra de progresso do balão */}
                    {isBubbleVisible && (
                      <div
                        key={`whatsapp-icon-fill-${appearanceCountRef.current}`}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                          clipPath: !prefersReduced ? 'inset(100% 0 0 0)' : 'none',
                          animation: !prefersReduced
                            ? `whatsappIconFill ${FLOATING_WHATSAPP_TIMINGS.BUBBLE_VISIBLE_DURATION_MS}ms linear forwards`
                            : `whatsappIconFadeReduced ${FLOATING_WHATSAPP_TIMINGS.BUBBLE_VISIBLE_DURATION_MS}ms ease-out forwards`,
                          animationPlayState: isPaused ? 'paused' : 'running',
                        }}
                      >
                        <WhatsAppIcon className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.75)]" />
                      </div>
                    )}
                  </div>
                </motion.a>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </aside>
  );
};
