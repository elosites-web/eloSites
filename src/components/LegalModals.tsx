import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | null;
}

export const LegalModals: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen || !type) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const dialog = dialogRef.current;
    const getFocusable = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    const firstFocusable = getFocusable()[0];
    (firstFocusable || dialog)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === firstItem || !dialog?.contains(active)) {
          e.preventDefault();
          lastItem.focus();
        }
      } else if (active === lastItem || !dialog?.contains(active)) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, type]);

  if (!isOpen || !type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overscroll-none select-none"
      onClick={onClose}
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        tabIndex={-1}
        className="glass-panel rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-300 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <h3 id="legal-modal-title" className="font-display text-lg sm:text-xl font-bold text-white">
            {isPrivacy ? 'Política de Privacidade' : 'Termos de Uso'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-xs sm:text-sm leading-relaxed">
          {isPrivacy ? (
            <>
              <section className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">1. Dados coletados</h4>
                <p>
                  A <strong>ēloSites</strong> coleta unicamente os dados que você fornece voluntariamente ao entrar em contato conosco (por exemplo: nome, WhatsApp, ramo de atuação e mensagem sobre o projeto).
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">2. Finalidade do contato</h4>
                <p>
                  Suas informações são utilizadas de forma estrita e exclusiva para responder suas dúvidas, prestar atendimento personalizado e elaborar propostas sob medida para o seu site.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">3. Não compartilhamento</h4>
                <p>
                  Garantimos que seus dados nunca são vendidos, repassados ou compartilhados com terceiros para fins publicitários ou comerciais.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">4. Controlador e solicitação de exclusão</h4>
                <p>
                  O controlador responsável pelo tratamento de dados é a <strong>ēloSites</strong> (contato: <a href="mailto:contato@elosites.ia.br" className="text-indigo-400 underline">contato@elosites.ia.br</a>). A qualquer momento você pode solicitar a confirmação, correção ou exclusão definitiva de seus dados nos termos da LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018).
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">1. Sobre a ēloSites</h4>
                <p>
                  A <strong>ēloSites</strong> é um estúdio digital dedicado à criação de sites institucionais e landing pages focados em credibilidade e conversão para pequenos negócios e profissionais liberais.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">2. Propostas e Orçamentos</h4>
                <p>
                  Os valores e prazos são personalizados de acordo com as necessidades e o escopo acordado para cada projeto.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-white text-sm">3. Direitos e Portfólio</h4>
                <p>
                  Após a entrega e aprovação do projeto, o cliente é o titular do site desenvolvido. A ēloSites reserva-se o direito de exibir capturas do projeto em seu portfólio como comprovação de trabalho realizado.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors inline-flex items-center justify-center text-center"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
