import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { ScreenId, SCREENS, SITE_CONFIG, whatsappUrl } from '../types';
import { preloadScreen } from '../preloadScreens';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  onPreviousScreen?: () => void;
  onNextScreen?: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onSelectScreen,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const isHome = currentScreen === 'home';
  const savedScrollPositionRef = useRef<number>(0);
  const headerWhatsappUrl = whatsappUrl(SITE_CONFIG.headerWhatsappMessage);

  // Tecla de atalho: Escape para fechar o menu, 'm' ou 'M' para abrir/fechar o menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.key === 'Escape' && isMenuOpen) {
        handleCloseMenuWithoutNav();
      } else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isMenuOpen) {
          handleCloseMenuWithoutNav();
        } else {
          handleOpenMenu();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Abre o menu salvando a posição de scroll anterior e travando a rolagem do documento
  const handleOpenMenu = () => {
    savedScrollPositionRef.current = window.scrollY || window.pageYOffset || 0;
    setIsMenuOpen(true);
  };

  // Fecha o menu sem navegação: restaura o scroll para a posição salva
  const handleCloseMenuWithoutNav = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: savedScrollPositionRef.current, behavior: 'instant' });
  };

  // Alterna o estado de abertura do menu
  const toggleMenu = () => {
    if (isMenuOpen) {
      handleCloseMenuWithoutNav();
    } else {
      handleOpenMenu();
    }
  };

  // Travar o scroll da página enquanto o menu de navegação estiver aberto
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

  const currentMeta = SCREENS.find((s) => s.id === currentScreen) || SCREENS[0];

  // Componente do Botão de Menu com 3 barras na identidade visual elétrica azul da og-image.png
  const renderMenuButton = () => (
    <button
      id="menu-de-navegacao-btn"
      type="button"
      onClick={toggleMenu}
      aria-expanded={isMenuOpen}
      aria-controls="multi-screen-navigation-modal"
      aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      className="relative group w-10 h-10 flex items-center justify-center bg-slate-900/80 border border-blue-500/25 shadow-md active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl hover:border-blue-400/50"
    >
      {/* Ícone com 3 traços que se transformam suavemente no X */}
      <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
        {/* Traço superior: tom de azul cobalto elétrico oficial da ēloSites */}
        <span
          className={`absolute left-1/2 -translate-x-1/2 top-[9px] h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isMenuOpen
              ? 'w-4 translate-y-0 rotate-45 bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 shadow-[0_0_10px_rgba(59,130,246,0.85)]'
              : 'w-4 -translate-y-[5px] rotate-0 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]'
          }`}
        />
        {/* Traço do meio: branco */}
        <span
          className={`absolute left-[2px] top-[9px] h-[2px] rounded-full bg-slate-100 transition-all duration-200 ease-out shadow-[0_0_6px_rgba(255,255,255,0.4)] origin-left ${
            isMenuOpen ? 'w-0 opacity-0 scale-x-0' : 'w-3 opacity-100 scale-x-100 translate-y-0 group-hover:w-4'
          }`}
        />
        {/* Traço inferior: tom de azul cobalto elétrico oficial */}
        <span
          className={`absolute left-1/2 -translate-x-1/2 top-[9px] h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isMenuOpen
              ? 'w-4 translate-y-0 -rotate-45 bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400 shadow-[0_0_10px_rgba(59,130,246,0.85)]'
              : 'w-4 translate-y-[5px] rotate-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]'
          }`}
        />
      </div>
    </button>
  );

  // Principais links visíveis na barra superior para desktop (Top Bar Contract)
  const navScreens = SCREENS.filter((s) => s.id !== 'home');

  return (
    <>
      {/* Menu Aberto em qualquer tela: 'X' posicionado centralizado no topo */}
      {isMenuOpen && (
        <header
          id="header-nav-active"
          className="fixed top-4 sm:top-6 left-0 right-0 z-50 pointer-events-none flex justify-center items-center"
        >
          <div className="pointer-events-auto">
            {renderMenuButton()}
          </div>
        </header>
      )}

      {/* Menu Fechado na Home: Botão de menu flutuante discreto no topo */}
      {isHome && !isMenuOpen && (
        <header
          id="header-nav"
          className="fixed top-4 sm:top-6 right-4 sm:right-8 z-50 pointer-events-none flex justify-end items-center"
        >
          <div className="pointer-events-auto flex items-center gap-3">
            <a
              href={headerWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-[0_0_14px_rgba(37,99,235,0.4)]"
            >
              <span>Orçamento</span>
              <ArrowRight className="w-3 h-3" />
            </a>
            {renderMenuButton()}
          </div>
        </header>
      )}

      {/* Menu Fechado nas demais telas: Top Bar Contract com Brand, Links e CTA */}
      {!isHome && !isMenuOpen && (
        <header
          id="header-nav"
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#050814]/90 backdrop-blur-md border-b border-blue-500/20 py-2 sm:py-2.5 shadow-xl shadow-black/60 pointer-events-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between gap-4 sm:gap-6 min-h-[46px]">
              
              {/* Zona 1: Logo Wordmark oficial */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
                <button
                  type="button"
                  id="brand-logo-link"
                  onClick={() => onSelectScreen('home')}
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center gap-2.5 shrink-0 cursor-pointer"
                  aria-label="ēloSites — Ir para a Página Inicial (Home)"
                >
                  <EloLogo size="md" />
                </button>
              </div>

              {/* Zona 2: Links de navegação desktop limpos (Top Bar Contract) */}
              <nav
                className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-blue-500/15 backdrop-blur-sm"
                aria-label="Navegação Principal"
              >
                {navScreens.map((screen) => {
                  const isActive = screen.id === currentScreen;
                  return (
                    <button
                      key={screen.id}
                      type="button"
                      onClick={() => onSelectScreen(screen.id)}
                      onPointerEnter={() => preloadScreen(screen.id)}
                      className={`relative px-3 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'text-white bg-blue-600/90 shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {screen.shortTitle}
                    </button>
                  );
                })}
              </nav>

              {/* Zona 3: CTA Principal + Botão do Menu Mobile */}
              <div className="flex items-center gap-2.5 sm:gap-3 ml-auto shrink-0 z-10 pointer-events-auto">
                <a
                  href={headerWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-[0_0_14px_rgba(37,99,235,0.45)] whitespace-nowrap"
                >
                  <span>Orçamento</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                {renderMenuButton()}
              </div>

            </div>
          </div>
        </header>
      )}

      {/* MODAL DO MENU DE NAVEGAÇÃO COMPLETO */}
      {isMenuOpen && (
        <div
          id="multi-screen-navigation-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Seções ēloSites"
          className="nav-menu-modal-container fixed inset-0 z-40 flex flex-col items-center justify-between pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 bg-[#050814]/96 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-y-auto"
          onClick={handleCloseMenuWithoutNav}
        >
          <div className="shrink-0 h-2" aria-hidden="true" />

          {/* Lista centralizada em cascata com estética obsidian e azul elétrico */}
          <div
            className="nav-menu-list-wrap relative w-full flex flex-col items-center justify-center text-center my-auto px-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="nav-menu-list flex flex-col items-center justify-center py-0.5 w-full gap-1">
              {SCREENS.map((screen, index) => {
                const isActive = screen.id === currentScreen;

                return (
                  <motion.li
                    key={screen.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.03 * index,
                      duration: 0.28,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="nav-menu-list-item w-full flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectScreen(screen.id)}
                      onPointerEnter={() => preloadScreen(screen.id)}
                      onFocus={() => preloadScreen(screen.id)}
                      onTouchStart={() => preloadScreen(screen.id)}
                      className={`nav-menu-link-item group relative px-6 py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 flex items-center justify-center cursor-pointer transition-all ${
                        isActive
                          ? 'bg-blue-600/25 border border-blue-500/40 text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                          : 'hover:bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="font-display text-xl sm:text-2xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105">
                        {screen.shortTitle}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Logotipo centralizado no rodapé do modal */}
          <div
            className="nav-menu-logo-wrap shrink-0 flex flex-col items-center justify-center pointer-events-auto mt-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onSelectScreen('home')}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg p-1 transition-transform hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
              aria-label="ēloSites — Ir para a Página Inicial (Home)"
            >
              <img
                src="/logo-elosites-1360.png"
                alt="ēloSites"
                width={1360}
                height={337}
                className="nav-menu-logo-img w-auto object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              />
              <span className="w-full text-center mt-1 text-[8px] sm:text-[9.5px] font-semibold tracking-wider uppercase text-blue-300/80 select-none leading-tight whitespace-nowrap">
                Tecnologia que transforma ideias em sites
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
