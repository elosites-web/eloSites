import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { PRICING, formatBRL } from '../types';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | null;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const LegalModals: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    closeRef.current?.focus();

    const getFocusable = (): HTMLElement[] => {
      const root = dialogRef.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el): el is HTMLElement => el instanceof HTMLElement && el.getClientRects().length > 0
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && dialogRef.current?.contains(active);

      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      previous?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !type) return null;

  const isPrivacy = type === 'privacy';
  const titleId = isPrivacy ? 'privacy-dialog-title' : 'terms-dialog-title';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom),var(--vv-bottom))] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#0C1220] border border-white/[0.08] rounded-2xl w-full max-w-xl max-h-[min(85dvh,100%)] flex flex-col shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] overflow-hidden text-slate-300 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/[0.06] bg-slate-950/55 shrink-0">
          <h2 id={titleId} className="font-display text-lg sm:text-xl font-bold text-white min-w-0 pr-1">
            {isPrivacy ? 'Política de Privacidade' : 'Termos de Uso'}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="w-11 h-11 shrink-0 rounded-lg bg-slate-800/90 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-xs sm:text-sm leading-relaxed min-h-0">
          {isPrivacy ? (
            <>
              <section className="space-y-1.5">
                <h3 className="font-bold text-white text-sm">1. Dados coletados</h3>
                <p>
                  A <strong>ēloSites</strong> coleta os dados que você envia ao entrar em contato
                  (por exemplo: nome, WhatsApp, ramo de atuação e mensagem sobre o projeto),
                  utilizando-os apenas para atendimento. Dados técnicos de acesso podem ser
                  processados automaticamente pela hospedagem e por recursos externos
                  necessários para exibir o site.
                </p>
              </section>
              <section className="space-y-1.5">
                <h3 className="font-bold text-white text-sm">2. Finalidade</h3>
                <p>
                  Suas informações são usadas somente para responder dúvidas, prestar atendimento
                  e elaborar propostas para o seu site.
                </p>
              </section>
              <section className="space-y-1.5">
                <h3 className="font-bold text-white text-sm">3. Não compartilhamento</h3>
                <p>
                  Seus dados não são vendidos nem compartilhados com terceiros para fins publicitários.
                </p>
              </section>
              <section className="space-y-1.5">
                <h3 className="font-bold text-white text-sm">4. Exclusão</h3>
                <p>
                  Você pode pedir a exclusão dos seus dados pelo WhatsApp ou pelo e-mail institucional.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1.5">
                <h3 className="font-bold text-white text-sm">1. Sobre a ēloSites</h3>
                <p>
                  A <strong>ēloSites</strong> cria landing pages e sites institucionais para pequenos
                  negócios locais e profissionais independentes.
                </p>
              </section>
              <section className="space-y-1.5">
                <h3 className="font-bold text-white text-sm">2. Propostas</h3>
                <p>
                  Valores iniciais: Landing Page a partir de {formatBRL(PRICING.landingPageFrom)} e Site institucional
                  a partir de {formatBRL(PRICING.professionalWebsiteFrom)}. O pagamento é 50% para iniciar o projeto e 50%
                  na entrega final. Manutenção mensal é opcional. O domínio personalizado
                  não está incluso. A publicação padrão é na URL do Netlify.
                </p>
              </section>
              <section className="space-y-1.5">
                <h3 className="font-bold text-white text-sm">3. Portfólio</h3>
                <p>
                  Após a entrega, o cliente é o titular do site. A ēloSites pode exibir o projeto
                  no portfólio como comprovação de trabalho realizado.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="p-4 border-t border-white/[0.06] bg-slate-950/55 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="cta-primary px-5 py-2 rounded-xl text-white text-xs font-semibold min-h-11"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
