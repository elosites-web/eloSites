import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { ScreenId, SCREENS } from '../types';
import { preloadScreen } from '../preloadScreens';
import { shouldReduceMedia } from '../mediaPrefs';

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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const savedScrollPositionRef = useRef<number>(0);
  const [canFitHorizontalNav, setCanFitHorizontalNav] = useState<boolean>(false);

  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // Verificação responsiva se o cabeçalho comporta os 8 links horizontais com conforto
  const checkNavFit = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    // Em desktop (>= 1024px) ou em tablets em orientação paisagem com largura suficiente (>= 960px)
    const fits = width >= 1024 || (isLandscape && width >= 960);
    setCanFitHorizontalNav(fits);

    // Se a tela for expandida para um tamanho com navbar horizontal, fecha o menu dropdown aberto
    if (fits && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen, setIsMenuOpen]);

  useEffect(() => {
    checkNavFit();

    if (typeof window === 'undefined') return;
    window.addEventListener('resize', checkNavFit, { passive: true });
    window.addEventListener('orientationchange', checkNavFit, { passive: true });

    let ro: ResizeObserver | null = null;
    if (headerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          const isLandscape = window.matchMedia('(orientation: landscape)').matches;
          const fits = width >= 980 || (isLandscape && width >= 940);
          setCanFitHorizontalNav(fits);
          if (fits && isMenuOpen) {
            setIsMenuOpen(false);
          }
        }
      });
      ro.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkNavFit);
      window.removeEventListener('orientationchange', checkNavFit);
      if (ro) ro.disconnect();
    };
  }, [checkNavFit, isMenuOpen, setIsMenuOpen]);

  // Gerenciamento de foco: move o foco para o primeiro item quando o menu abre, e restaura ao botão ao fechar
  useEffect(() => {
    if (isMenuOpen) {
      const timer = setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      menuButtonRef.current?.focus();
    }
  }, [isMenuOpen]);

  // Tecla Escape para fechar o menu; atalho 'm' para abrir/fechar quando focado fora de inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.key === 'Escape' && isMenuOpen) {
        handleCloseMenu();
      } else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isMenuOpen) {
          handleCloseMenu();
        } else if (!canFitHorizontalNav) {
          handleOpenMenu();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, canFitHorizontalNav]);

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

  // Trava de rolagem suave enquanto o menu suspenso estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#050814]/90 backdrop-blur-md border-b border-blue-500/20 py-2 sm:py-2.5 shadow-xl shadow-black/60 pointer-events-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between gap-3 sm:gap-6 min-h-[46px]">
            {/* Logo Wordmark oficial */}
            <div className="flex items-center gap-2 shrink-0 z-10">
              <button
                type="button"
                id="brand-logo-link"
                onClick={() => {
                  if (isMenuOpen) setIsMenuOpen(false);
                  onSelectScreen('inicio');
                }}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center gap-2.5 shrink-0 cursor-pointer"
                aria-label="ēloSites — Ir para a Página Inicial (Início)"
              >
                <EloLogo size="md" className="brand-logo-entry" />
              </button>
            </div>

            {/* Navbar Horizontal para Desktop e Tablets com largura suficiente */}
            {canFitHorizontalNav ? (
              <nav
                aria-label="Navegação institucional"
                className="flex items-center gap-1 xl:gap-1.5 ml-auto shrink-0 z-10"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectScreen(item.id)}
                      onPointerEnter={() => preloadScreen(item.id)}
                      onFocus={() => preloadScreen(item.id)}
                      className={`relative px-2.5 py-1.5 rounded-lg text-[13px] xl:text-[14px] font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                        isActive
                          ? 'text-white font-semibold bg-blue-600/15 border border-blue-500/35 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-blue-400 shadow-[0_0_6px_#3b82f6]"
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
          id="multi-screen-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Seções ēloSites"
          className="fixed inset-0 top-[54px] sm:top-[60px] z-40 flex flex-col justify-start bg-[#050814]/80 backdrop-blur-md select-none overflow-y-auto overscroll-contain transition-opacity duration-200"
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
