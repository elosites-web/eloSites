import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { X } from 'lucide-react';

const PROMPT_DELAY_MS = 20000;

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (showTooltip) return;
    const timer = window.setTimeout(() => {
      setShowTooltip(true);
    }, PROMPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [showTooltip]);

  const floatingUrl = whatsappUrl(SITE_CONFIG.floatingWhatsappMessage);

  return (
    <aside
      aria-label="Atendimento rápido via WhatsApp"
      className="floating-whatsapp flex flex-col items-end justify-end pointer-events-none select-none"
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            key="whatsapp-popup-tooltip"
            id="whatsapp-popup-tooltip"
            role="status"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: [0, 1, 1, 1], y: [16, -10, 4, 0] }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 6, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.62, times: [0, 0.38, 0.72, 1], ease: [0.16, 1, 0.3, 1] }
            }
            className="mb-2.5 w-max max-w-[calc(100vw-2.5rem)] whitespace-nowrap bg-slate-900/94 border border-white/[0.08] text-white rounded-xl px-2.5 py-2 pr-12 shadow-[0_16px_36px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md pointer-events-auto relative origin-bottom-right"
          >
            <button
              type="button"
              id="close-whatsapp-tooltip"
              onClick={() => setShowTooltip(false)}
              className="absolute -top-1 -right-1 text-slate-400 hover:text-white p-2 rounded-md transition-colors min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Fechar mensagem de atendimento"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-1.5 pr-1">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse shrink-0"
              />
              <p className="text-xs font-semibold leading-snug text-white">
                Dúvidas sobre seu projeto?
              </p>
            </div>

            <span
              aria-hidden="true"
              className="absolute -bottom-2 right-[23px] w-2.5 h-2.5 rotate-45 bg-slate-900/94 border-r border-b border-white/[0.08]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <a
        id="floating-whatsapp-btn"
        href={floatingUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com a ēloSites"
        className="cta-primary pointer-events-auto relative group flex items-center justify-center w-14 h-14 rounded-full text-white border-2 border-indigo-300/30 animate-subtle-pulse"
      >
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5" aria-hidden="true">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#090D16]" />
        </span>
        <WhatsAppIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
      </a>
    </aside>
  );
};
