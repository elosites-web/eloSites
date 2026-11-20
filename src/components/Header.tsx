import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { ScreenId, SCREENS } from '../types';
import { preloadScreen } from '../preloadScreens';
import { shouldReduceMedia } from '../mediaPrefs';
import { canFitNavbar } from '../navSpace';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

/** Trava a rolagem do documento enquanto o menu está aberto. */
export function useMobileMenuLock(isMenuOpen: boolean) {
  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add('lock-scroll');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove('lock-scroll');
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const menuContainerClassName =
    'fixed inset-0 top-[54px] sm:top-[60px] z-[49] flex flex-col justify-start bg-gradient-to-b from-[#0e1b48] via-[#0b163b] to-[#08112e] select-none overflow-y-auto overscroll-contain transition-opacity duration-200 shadow-2xl shadow-black/90';

  const menuContainerStyle: React.CSSProperties = {
    zIndex: 49,
    backgroundColor: '#0b163b',
    opacity: 1,
  };

  return {
    menuContainerClassName,
    menuContainerStyle,
  };
}

export const useMenuScrollLock = useMobileMenuLock;

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
  const activeMenuItemRef = useRef<HTMLAnchorElement>(null);
  const activeDesktopItemRef = useRef<HTMLAnchorElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasMenuOpenRef = useRef<boolean>(false);
  const [canFitHorizontalNav, setCanFitHorizontalNav] = useState<boolean>(false);

  const { menuContainerClassName, menuContainerStyle } = useMobileMenuLock(isMenuOpen);

  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const navMetricsRef = useRef<{ container: number; required: number } | null>(null);
  const navFitRafRef = useRef<number | null>(null);

  // Verificação dinâmica baseada no espaço real disponível vs largura necessária de logo e links
  const checkNavFit = useCallback(() => {
    if (!navContainerRef.current) return;
    const containerWidth = navContainerRef.current.clientWidth;
    const measuredWidth = measureRef.current ? measureRef.current.scrollWidth : 0;
    // Fallback defensivo (~1030px) caso o elemento de medição ainda não tenha reportado scrollWidth
    const requiredWidth = measuredWidth > 0 ? measuredWidth : 1030;
    const prev = navMetricsRef.current;
    if (prev && prev.container === containerWidth && prev.required === requiredWidth) {
      return;
    }
    navMetricsRef.current = { container: containerWidth, required: requiredWidth };
    const fits = canFitNavbar(containerWidth, requiredWidth, { buffer: 24 });
    setCanFitHorizontalNav(fits);
  }, []);

  const scheduleCheckNavFit = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (navFitRafRef.current !== null) {
      window.cancelAnimationFrame(navFitRafRef.current);
    }
    navFitRafRef.current = window.requestAnimationFrame(() => {
      navFitRafRef.current = null;
      checkNavFit();
    });
  }, [checkNavFit]);

  // Fecha o menu de navegação de forma segura quando a barra horizontal couber confortavelmente
  useEffect(() => {
    if (canFitHorizontalNav && isMenuOpen) {
      setIsMenuOpen(false);
      activeDesktopItemRef.current?.focus();
    }
  }, [canFitHorizontalNav, isMenuOpen, setIsMenuOpen]);

  useLayoutEffect(() => {
    checkNavFit();

    if (typeof window === 'undefined') return;
    let cancelled = false;

    window.addEventListener('orientationchange', scheduleCheckNavFit, { passive: true });

    let ro: ResizeObserver | null = null;
    if (navContainerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        scheduleCheckNavFit();
      });
      ro.observe(navContainerRef.current);
    } else {
      window.addEventListener('resize', scheduleCheckNavFit, { passive: true });
    }

    if (
      typeof document !== 'undefined' &&
      document.fonts?.ready &&
      document.fonts.status !== 'loaded'
    ) {
      document.fonts.ready.then(() => {
        if (!cancelled) scheduleCheckNavFit();
      });
    }

    return () => {
      cancelled = true;
      if (navFitRafRef.current !== null) {
        window.cancelAnimationFrame(navFitRafRef.current);
        navFitRafRef.current = null;
      }
      window.removeEventListener('orientationchange', scheduleCheckNavFit);
      if (ro) {
        ro.disconnect();
      } else {
        window.removeEventListener('resize', scheduleCheckNavFit);
      }
    };
  }, [checkNavFit, scheduleCheckNavFit]);

  // Gerenciamento de foco: move o foco para a seção ativa quando o menu abre,
  // e devolve o foco ao botão de abertura no mobile, ou para a navegação desktop ao redimensionar
  useEffect(() => {
    if (isMenuOpen) {
      wasMenuOpenRef.current = true;
      activeMenuItemRef.current?.focus({ preventScroll: true });
      activeMenuItemRef.current?.scrollIntoView({ block: 'nearest' });
    } else if (wasMenuOpenRef.current) {
      wasMenuOpenRef.current = false;
      if (canFitHorizontalNav) {
        activeDesktopItemRef.current?.focus();
      } else {
        menuButtonRef.current?.focus();
      }
    }
  }, [isMenuOpen, canFitHorizontalNav, currentScreen]);

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

  const selectSection = (event: React.MouseEvent<HTMLAnchorElement>, id: ScreenId) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onSelectScreen(id);
  };

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
          isMenuOpen ? 'bg-[#090E23]' : 'bg-[#050814]/90'
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
                {SCREENS.map((item) => (
                  <span
                    key={item.id}
                    className="nav-menu-link-item nav-top-link"
                  >
                    {item.shortTitle}
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
                {SCREENS.map((item) => {
                  const isActive = currentScreen === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      ref={isActive ? activeDesktopItemRef : undefined}
                      onClick={(event) => selectSection(event, item.id)}
                      onPointerEnter={() => preloadScreen(item.id)}
                      onFocus={() => preloadScreen(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className="nav-menu-link-item nav-top-link"
                    >
                      {item.shortTitle}
                    </a>
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
          aria-label="Menu de navegação"
          aria-modal="true"
          style={menuContainerStyle}
          className={menuContainerClassName}
          onClick={handleCloseMenu}
        >
          <div className="nav-ambient" aria-hidden="true" />

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
                    <a
                      href={`#${screen.id}`}
                      ref={isActive ? activeMenuItemRef : undefined}
                      onClick={(event) => selectSection(event, screen.id)}
                      onPointerEnter={() => preloadScreen(screen.id)}
                      onFocus={() => preloadScreen(screen.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className="nav-menu-link-item nav-drawer-link"
                    >
                      {screen.shortTitle}
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            {/* Dica de navegação */}
            <div className="mt-6 pt-2 text-center w-full max-w-xs">
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
