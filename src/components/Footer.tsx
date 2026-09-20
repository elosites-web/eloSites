import React from 'react';
import { EloLogo } from './EloLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { NAVIGATION_ITEMS, SITE_CONFIG, whatsappUrl, motionSafeScrollBehavior } from '../types';
import { Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenCookies: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onOpenCookies }) => {
  const currentYear = new Date().getFullYear();
  const footerWhatsappUrl = whatsappUrl(SITE_CONFIG.defaultWhatsappMessage);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: motionSafeScrollBehavior() });
  };

  return (
    <footer className="bg-[#070A11] border-t border-white/[0.05] text-slate-400 text-sm overflow-x-clip">
      <div className="page-shell page-x pt-16 sm:pt-20 pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom,0px)))] sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <EloLogo size="md" />
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm">
              O elo entre pequenos negócios e a presença digital profissional.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                id="footer-whatsapp-link"
                href={footerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/80 border border-white/[0.07] text-slate-200 hover:text-white hover:border-indigo-400/40 transition-all duration-200 text-xs font-semibold min-h-11"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                id="footer-email-link"
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/80 border border-white/[0.07] text-slate-300 hover:text-white hover:border-indigo-400/40 transition-all duration-200 text-xs font-medium min-h-11 min-w-0 max-w-full"
              >
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
                <span className="break-all">{SITE_CONFIG.email}</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-slate-200">
              Navegação
            </h2>
            <ul className="space-y-2 text-sm">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={`footer-${item.id}`}>
                  <a
                    href={item.href}
                    className="inline-flex items-center min-h-11 text-slate-400 hover:text-indigo-300 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-slate-200">
              Para quem
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Personal trainers, salões, barbearias, profissionais independentes e
              pequenos negócios locais.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {currentYear} ēloSites. Todos os direitos reservados.</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-slate-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline min-h-11"
            >
              Política de Privacidade
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-slate-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline min-h-11"
            >
              Termos de Uso
            </button>
            <button
              type="button"
              onClick={onOpenCookies}
              className="text-slate-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline min-h-11"
            >
              Política de Cookies
            </button>
            <span className="w-full inline-flex flex-wrap items-center gap-x-1 text-[11px] font-mono uppercase tracking-[0.14em] text-slate-500">
              CRIADO E DESENVOLVIDO POR
              <EloLogo size="sm" className="inline-block mx-1.5 -mb-0.5" />
              · O MELHOR SITE PELO MELHOR PREÇO!
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors min-h-11"
            aria-label="Voltar ao início da página"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
