import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { ScreenId, SCREENS } from '../types';
import { preloadScreen } from '../preloadScreens';
import { shouldReduceMedia } from '../mediaPrefs';
import { canFitNavbar } from '../navSpace';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  onPreviousScreen?: () => void;
  onNextScreen?: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'processo', label: 'Como Funciona' },
  { id: 'orcamento', label: 'Orçamento' },
  { id: 'parceria-trafego', label: 'Tráfego Pago' },
  { id: 'faq', label: 'FAQ & Contato' },
];

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const firstDesktopNavItemRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const savedScrollPositionRef = useRef<number>(0);
  const wasMenuOpenRef = useRef<boolean>(false);
  const isNavigatingToScreenRef = useRef<boolean>(false);
  const [canFitHorizontalNav, setCanFitHorizontalNav] = useState<boolean>(false);

  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // Verificação dinâmica baseada no espaço real disponível vs largura necessária de logo e links
  const checkNavFit = useCallback(() => {
    if (!navContainerRef.current) return;
    const containerWidth = navContainerRef.current.clientWidth;
    const measuredWidth = measureRef.current ? measureRef.current.scrollWidth : 0;
    // Fallback defensivo (~1030px) caso o elemento de medição ainda não tenha reportado scrollWidth
    const requiredWidth = measuredWidth > 0 ? measuredWidth : 1030;
    const fits = canFitNavbar(containerWidth, requiredWidth, { buffer: 24 });
    setCanFitHorizontalNav(fits);
  }, []);

  // Fecha o menu de navegação de forma segura quando a barra horizontal couber confortavelmente
  useEffect(() => {
    if (canFitHorizontalNav && isMenuOpen) {
      setIsMenuOpen(false);
      firstDesktopNavItemRef.current?.focus();
    }
  }, [canFitHorizontalNav, isMenuOpen, setIsMenuOpen]);

  useEffect(() => {
    checkNavFit();

    if (typeof window === 'undefined') return;
    window.addEventListener('resize', checkNavFit, { passive: true });
    window.addEventListener('orientationchange', checkNavFit, { passive: true });

    let ro: ResizeObserver | null = null;
    if (navContainerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        checkNavFit();
      });
      ro.observe(navContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkNavFit);
      window.removeEventListener('orientationchange', checkNavFit);
      if (ro) ro.disconnect();
    };
  }, [checkNavFit]);

  // Gerenciamento de foco: move o foco para o primeiro item quando o menu abre,
  // e devolve o foco ao botão de abertura no mobile, ou para a navegação desktop ao redimensionar
  useEffect(() => {
    if (isMenuOpen) {
      wasMenuOpenRef.current = true;
      const timer = setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (wasMenuOpenRef.current) {
      wasMenuOpenRef.current = false;
      if (canFitHorizontalNav) {
        firstDesktopNavItemRef.current?.focus();
      } else {
        menuButtonRef.current?.focus();
      }
    }
  }, [isMenuOpen, canFitHorizontalNav]);

  // Focus trap por teclado (Tab e Shift+Tab em ciclo fechado) e tecla Escape para fechamento
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseMenu();
        return;
      }

      if (e.key === 'Tab') {
        const drawer = drawerRef.current;
        if (!drawer) return;

        const focusableElements = drawer.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleOpenMenu = () => {
    savedScrollPositionRef.current = window.scrollY || window.pageYOffset || 0;
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  };

  // Trava de rolagem absoluta do fundo da página enquanto o menu hambúrguer estiver aberto
  useEffect(() => {
    if (!isMenuOpen) return;

    // Captura a posição exata de scroll no momento da abertura
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Congela a página no scroll atual (prevenindo momentum scrolling no mobile/iOS Safari e mouse wheel no desktop)
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      // Restaura estilos originais e posição exata de rolagem sem salto visual
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.paddingRight = originalBodyPaddingRight;

      // Se o fechamento foi apenas dismiss (sem navegar para outra tela), preserva a posição exata anterior
      if (!isNavigatingToScreenRef.current) {
        window.scrollTo(0, scrollY);
      }
      isNavigatingToScreenRef.current = false;
    };
  }, [isMenuOpen]);

  // Botão com identidade visual do logotipo ēloSites
  const renderMenuButton = () => (
    <button
      ref={menuButtonRef}
      id="menu-de-navegacao-btn"
      type="button"
      onClick={toggleMenu}
      aria-expanded={isMenuOpen}
      aria-controls="multi-screen-navigation-drawer"
      aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      className="relative group p-2.5 flex items-center justify-center bg-transparent border-0 shadow-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95 shrink-0"
    >
      <div className="relative w-7 h-5 flex items-center pointer-events-none">
        {/* Traço superior (degradê púrpura para azul de 'ēlo') / Diagonal 1 do X */}
        <span
          className={`absolute left-0 top-1/2 w-full h-[3px] rounded-full origin-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isMenuOpen
              ? '-translate-y-1/2 rotate-45 bg-gradient-to-r from-[#a855f7] via-[#818cf8] to-[#3b82f6] shadow-[0_0_8px_rgba(168,85,247,0.5)]'
              : '-translate-y-[8.5px] rotate-0 bg-gradient-to-r from-[#a855f7] via-[#818cf8] to-[#3b82f6] shadow-[0_0_8px_rgba(168,85,247,0.4)]'
          }`}
        />

        {/* Traço do meio (degradê branco de 'Sites') */}
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full origin-left bg-gradient-to-r from-white via-slate-100 to-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200 ease-out ${
            isMenuOpen ? 'w-0 opacity-0 scale-x-0' : 'w-[17px] opacity-100 scale-x-100 group-hover:w-[20px]'
          }`}
        />

        {/* Traço inferior (degradê azul para púrpura de 'ēlo') / Diagonal 2 do X */}
        <span
          className={`absolute left-0 top-1/2 w-full h-[3px] rounded-full origin-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isMenuOpen
              ? '-translate-y-1/2 -rotate-45 bg-gradient-to-r from-[#3b82f6] via-[#818cf8] to-[#a855f7] shadow-[0_0_8px_rgba(59,130,246,0.5)]'
              : 'translate-y-[5.5px] rotate-0 bg-gradient-to-r from-[#3b82f6] via-[#818cf8] to-[#a855f7] shadow-[0_0_8px_rgba(59,130,246,0.4)]'
          }`}
        />
      </div>
    </button>
  );

  return (
    <>
      {/* Cabeçalho Fixo — Permanece visível continuamente, com ou sem menu aberto */}
      <header
        ref={headerRef}
        id="header-nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-blue-500/20 py-2 sm:py-2.5 shadow-xl shadow-black/60 pointer-events-auto ${
          isMenuOpen ? 'bg-[#090E23]/95' : 'bg-[#050814]/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div ref={navContainerRef} className="flex items-center justify-between gap-3 sm:gap-6 min-h-[46px]">
            {/* Logo Wordmark oficial */}
            <div className="flex items-center gap-2 shrink-0 z-10">
              <button
                type="button"
                id="brand-logo-link"
                onClick={() => {
                  if (isMenuOpen) {
                    isNavigatingToScreenRef.current = true;
                    setIsMenuOpen(false);
                  }
                  onSelectScreen('inicio');
                }}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center gap-2.5 shrink-0 cursor-pointer"
                aria-label="ēloSites — Ir para a Página Inicial (Início)"
              >
                <EloLogo size="md" className="brand-logo-entry" />
              </button>
            </div>

            {/* Medidor fora da tela para apurar dinamicamente o espaço real exigido pela logo e pelos 8 links */}
            <div
              ref={measureRef}
              aria-hidden="true"
              className="absolute left-0 -top-[9999px] invisible pointer-events-none flex items-center gap-6 whitespace-nowrap select-none"
              style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', left: '-9999px' }}
            >
              <div className="flex items-center gap-2 shrink-0">
                <EloLogo size="md" />
              </div>
              <nav className="flex items-center gap-1 xl:gap-1.5 shrink-0">
                {NAV_ITEMS.map((item) => (
                  <span
                    key={item.id}
                    className="px-2.5 py-1.5 text-[13px] xl:text-[14px] font-medium"
                  >
                    {item.label}
                  </span>
                ))}
              </nav>
            </div>

            {/* Navbar Horizontal para Desktop e Tablets com largura suficiente */}
            {canFitHorizontalNav ? (
              <nav
                aria-label="Navegação institucional"
                className="flex items-center gap-1 xl:gap-1.5 ml-auto shrink-0 z-10"
              >
                {NAV_ITEMS.map((item, index) => {
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      ref={index === 0 ? firstDesktopNavItemRef : undefined}
                      id={index === 0 ? 'desktop-nav-first-item' : undefined}
                      type="button"
                      onClick={() => onSelectScreen(item.id)}
                      onPointerEnter={() => preloadScreen(item.id)}
                      onFocus={() => preloadScreen(item.id)}
                      className={`relative group px-2.5 py-1.5 rounded-lg text-[13px] xl:text-[14px] font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                        isActive
                          ? 'text-white font-semibold bg-blue-600/20 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                          : 'text-slate-300 hover:text-blue-100 hover:bg-blue-500/[0.07] border border-transparent hover:border-blue-500/20'
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {/* Sublinhado sutil e suave no hover para links inativos */}
                      {!isActive && (
                        <span
                          className="absolute bottom-1 left-2.5 right-2.5 h-[1.5px] rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/80 to-blue-400/0 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-200 ease-out origin-center pointer-events-none"
                          aria-hidden="true"
                        />
                      )}
                      {/* Marcador luminoso exclusivo do estado ativo */}
                      {isActive && (
                        <span
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            ) : (
              /* Botão Hambúrguer quando a barra horizontal não couber confortavelmente */
              <div className="flex items-center ml-auto shrink-0 z-10 pointer-events-auto">
                {renderMenuButton()}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CAMADA DE NAVEGAÇÃO DO MENU HAMBÚRGUER ABERTO */}
      {isMenuOpen && !canFitHorizontalNav && (
        <div
          ref={drawerRef}
          id="multi-screen-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Seções ēloSites"
          className="fixed inset-0 top-[54px] sm:top-[60px] z-40 flex flex-col justify-start bg-[#090E23]/95 backdrop-blur-md select-none overflow-y-auto overscroll-contain transition-opacity duration-200 shadow-2xl shadow-black/80"
          onClick={handleCloseMenu}
        >
          {/* Painel de links sobre a página atual */}
          <div
            className="relative z-10 w-full max-w-lg mx-auto py-6 sm:py-8 px-6 flex flex-col items-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col items-center justify-center w-full gap-2 sm:gap-2.5">
              {SCREENS.map((screen, index) => {
                const isActive = screen.id === currentScreen;

                return (
                  <motion.li
                    key={screen.id}
                    initial={
                      prefersReduced
                        ? { opacity: 0 }
                        : { opacity: 0, y: -10 }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: prefersReduced ? 0.15 : 0.24,
                      delay: prefersReduced ? 0 : index * 0.035,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="w-full flex justify-center"
                  >
                    <button
                      ref={index === 0 ? firstMenuItemRef : undefined}
                      type="button"
                      onClick={() => {
                        isNavigatingToScreenRef.current = true;
                        setIsMenuOpen(false);
                        onSelectScreen(screen.id);
                      }}
                      onPointerEnter={() => preloadScreen(screen.id)}
                      onFocus={() => preloadScreen(screen.id)}
                      onTouchStart={() => preloadScreen(screen.id)}
                      className={`group relative w-full max-w-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer text-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                        isActive
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white shadow-[0_0_16px_rgba(59,130,246,0.25)]'
                          : 'bg-slate-900/40 hover:bg-slate-900/70 border border-white/[0.05] hover:border-blue-500/30 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <span
                          className="w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-[0_0_8px_#3b82f6]"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`font-display text-[17px] sm:text-[18px] tracking-tight ${
                          isActive
                            ? 'text-white font-bold'
                            : 'font-medium text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {screen.shortTitle}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {/* Linha discreta de fechamento / dica de navegação */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] text-center w-full max-w-xs">
              <span className="text-xs text-slate-400">
                Toque fora ou pressione <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-300">Esc</kbd> para fechar
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
