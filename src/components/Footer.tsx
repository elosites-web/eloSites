import React from 'react';
import { EloLogo, logoSrcSet } from './EloLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { NAVIGATION_ITEMS, SITE_CONFIG, whatsappUrl } from '../types';
import { Mail, ArrowUp } from 'lucide-react';

import type { ScreenId } from '../types';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onPrefetchLegal?: () => void;
  onSelectScreen?: (screenId: ScreenId) => void;
  currentScreen?: ScreenId;
  isWhatsAppBubbleOpen?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onPrefetchLegal,
  onSelectScreen,
  currentScreen,
  isWhatsAppBubbleOpen = false,
}) => {
  const currentYear = new Date().getFullYear();

  // Monitora visibilidade do balão de WhatsApp para expandir o respiro inferior e não cobrir nenhum texto
  const [bubbleOpen, setBubbleOpen] = React.useState<boolean>(isWhatsAppBubbleOpen);

  React.useEffect(() => {
    setBubbleOpen(isWhatsAppBubbleOpen);
  }, [isWhatsAppBubbleOpen]);

  React.useEffect(() => {
    const handleBubbleVisibility = (e: Event) => {
      const custom = e as CustomEvent<{ isVisible: boolean }>;
      if (custom.detail && typeof custom.detail.isVisible === 'boolean') {
        setBubbleOpen(custom.detail.isVisible);
      }
    };
    window.addEventListener('elosites-bubble-visibility', handleBubbleVisibility);
    return () => {
      window.removeEventListener('elosites-bubble-visibility', handleBubbleVisibility);
    };
  }, []);

  const footerWhatsappUrl = whatsappUrl(SITE_CONFIG.footerWhatsappMessage);

  const handleSelectInstitutionalScreen = (screenId: ScreenId) => {
    if (onSelectScreen) {
      onSelectScreen(screenId);
    } else {
      window.location.hash = screenId;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleNavigateHome = () => {
    handleSelectInstitutionalScreen('inicio');
  };

  const footerRef = React.useRef<HTMLElement>(null);
  const [footerVisible, setFooterVisible] = React.useState(false);
  React.useEffect(() => {
    if (!footerRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      data-visible={footerVisible}
      className="relative bg-gradient-to-b from-[#0e1b48] via-[#0b163b] to-[#08112e] border-t border-blue-400/30 text-slate-300 text-sm pb-[3px] overflow-hidden"
    >
      <div className="nav-ambient" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Marca e Posicionamento */}
          <div className="md:col-span-5 space-y-4">
            <button
              type="button"
              id="footer-brand-logo-link"
              onClick={handleNavigateHome}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center shrink-0 cursor-pointer"
              aria-label="ēloSites — Ir para a Página Inicial (Início)"
            >
              <EloLogo size="md" isFooter />
            </button>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm">
              Em Jundiaí (SP), criamos sites para negócios de todo o Brasil. Seu cliente vê o que você vende, lê as informações em uma página preparada para o Google e pode pedir um orçamento pelo WhatsApp.
            </p>
            <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 pt-2 w-full max-w-md">
              <a
                id="footer-whatsapp-link"
                href={footerWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 inline-flex items-center justify-center text-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-300/60 text-slate-950 shadow-lg shadow-emerald-950/40 hover:shadow-[0_0_22px_rgba(37,211,102,0.65)] active:scale-[0.97] transition-transform duration-150 text-[11px] sm:text-xs font-bold tracking-wide cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="text-slate-950 text-center truncate sm:whitespace-normal">Falar no WhatsApp</span>
              </a>

              {SITE_CONFIG.email && (
                <a
                  id="footer-email-link"
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex-1 min-w-0 inline-flex items-center justify-center text-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-colors text-[11px] sm:text-xs font-medium"
                >
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-center truncate sm:whitespace-normal">{SITE_CONFIG.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Links de navegação */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = item.href === `#${currentScreen}`;

                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`text-left transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] duration-200 relative flex items-center gap-2 py-0.5 cursor-pointer group hover:-translate-y-0.5 hover:translate-x-1 ${
                        isActive
                          ? 'text-cyan-300 font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                          : 'text-slate-400 hover:text-cyan-300 hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.65)]'
                      }`}
                    >
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] shrink-0"
                        />
                      )}
                      <span className="transition-transform duration-200">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Serviços e Formatos */}
          <div className="md:col-span-4 space-y-3">
            <button
              type="button"
              onClick={() => handleSelectInstitutionalScreen('servicos')}
              className="text-left text-xs font-mono font-semibold uppercase tracking-wider text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer group flex items-center gap-1.5"
            >
              <span>Serviços de Desenvolvimento</span>
              <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-[13px] text-slate-300/90 leading-relaxed">
              Criação de landing pages focadas em contato e conversão pelo WhatsApp, e sites institucionais completos para apresentar sua empresa com credibilidade.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              </span>
              <span>Projetos sob medida • Atendimento direto com o desenvolvedor</span>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Copyright, Botão Voltar ao Topo e Políticas */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {currentYear} ēloSites. Todos os direitos reservados.</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              onPointerEnter={onPrefetchLegal}
              onFocus={onPrefetchLegal}
              className="text-slate-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Política de Privacidade
            </button>
            <button
              type="button"
              onClick={onOpenTerms}
              onPointerEnter={onPrefetchLegal}
              onFocus={onPrefetchLegal}
              className="text-slate-400 hover:text-indigo-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Termos de Uso
            </button>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center justify-center text-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Voltar ao topo da página"
          >
            <span className="text-center">Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Última linha do rodapé: Linha com quebra em telas móveis e sem quebra no desktop */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col items-center justify-center text-center select-none overflow-hidden max-w-full px-2">
          <div className="flex flex-col md:flex-row md:flex-nowrap items-center justify-center gap-1.5 md:gap-2.5 text-[9px] min-[380px]:text-[10px] sm:text-[10.5px] font-semibold tracking-wide sm:tracking-wider uppercase text-slate-300 md:whitespace-nowrap">
            <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 shrink-0">
              <span>CRIADO E DESENVOLVIDO POR</span>
              <button
                type="button"
                onClick={handleNavigateHome}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded transition-transform hover:scale-105 active:scale-95 inline-flex items-center align-middle cursor-pointer"
                aria-label="ēloSites — Ir para a Página Inicial (Home)"
              >
                <picture className="inline-flex shrink-0">
                  <source
                    type="image/webp"
                    srcSet={logoSrcSet}
                    sizes="(min-width: 640px) 65px, 57px"
                  />
                  <img
                    src="/logo-elosites-320w.webp"
                    alt="ēloSites"
                    width={1360}
                    height={337}
                    loading="lazy"
                    decoding="async"
                    className="h-[14px] sm:h-[16px] w-auto shrink-0 inline-block align-middle object-contain"
                  />
                </picture>
              </button>
            </div>
            <span className="text-slate-400 font-medium shrink-0">O MELHOR SITE PELO MELHOR PREÇO</span>
          </div>
        </div>

        {/* Espaço adicional dinâmico abaixo da frase quando o balão do WhatsApp surge, prevenindo sobreposição em qualquer tela */}
        <div
          className={`transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,height,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] duration-500 ease-out w-full pointer-events-none ${
            bubbleOpen ? 'h-36 sm:h-44 md:h-48' : 'h-6 sm:h-8'
          }`}
          aria-hidden="true"
        />
      </div>
    </footer>
  );
};
