import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { EloLogo } from './EloLogo';
import { FluidRippleBackground } from './FluidRippleBackground';
import { ScreenId, SCREENS } from '../types';
import { preloadScreen } from '../preloadScreens';

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

  // Componente do Botão de Menu com a identidade visual do logotipo ēloSites
  // Traço superior e inferior com degradê de "ēlo" (púrpura ao azul elétrico)
  // Traço do meio alinhado à esquerda com degradê de "Sites" (branco prateado puro)
  const renderMenuButton = () => (
    <button
      id="menu-de-navegacao-btn"
      type="button"
      onClick={toggleMenu}
      aria-expanded={isMenuOpen}
      aria-controls="multi-screen-navigation-modal"
      aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      className="relative group p-2.5 flex items-center justify-center bg-transparent border-0 shadow-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 rounded-lg transition-transform duration-200 hover:scale-108 active:scale-95"
    >
      {/* Container com largura exata dos traços oficiais */}
      <div className="relative w-7 h-5 flex items-center pointer-events-none">
        {/* Traço superior (degradê púrpura para azul de 'ēlo') / Diagonal 1 do X */}
        <span
          className={`absolute left-0 top-1/2 w-full h-[3px] rounded-full origin-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isMenuOpen
              ? '-translate-y-1/2 rotate-45 bg-gradient-to-r from-[#a855f7] via-[#818cf8] to-[#3b82f6] shadow-[0_0_8px_rgba(168,85,247,0.5)]'
              : '-translate-y-[8.5px] rotate-0 bg-gradient-to-r from-[#a855f7] via-[#818cf8] to-[#3b82f6] shadow-[0_0_8px_rgba(168,85,247,0.4)]'
          }`}
        />

        {/* Traço do meio (degradê branco de 'Sites', alinhado estritamente à esquerda) */}
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
      {/* Menu Fechado na Home: Botão de menu flutuante rigorosamente centralizado no topo */}
      {isHome && !isMenuOpen && (
        <header
          id="header-nav"
          className="fixed top-5 sm:top-7 left-0 right-0 z-50 pointer-events-none flex justify-center items-center"
        >
          <div className="pointer-events-auto flex items-center justify-center">
            {renderMenuButton()}
          </div>
        </header>
      )}

      {/* Menu Fechado nas demais telas: Cabeçalho minimalista (apenas Logo e Menu Hambúrguer) */}
      {!isHome && !isMenuOpen && (
        <header
          id="header-nav"
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#050814]/90 backdrop-blur-md border-b border-blue-500/20 py-2 sm:py-2.5 shadow-xl shadow-black/60 pointer-events-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between gap-4 sm:gap-6 min-h-[46px]">
              {/* Logo Wordmark oficial */}
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

              {/* Apenas o Botão do Menu Hambúrguer */}
              <div className="flex items-center ml-auto shrink-0 z-10 pointer-events-auto">
                {renderMenuButton()}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* MODAL DO MENU DE NAVEGAÇÃO COMPLETO COM BACKGROUND DE ESPAÇO-TEMPO E MOVIMENTO FLUTUANTE */}
      {isMenuOpen && (
        <div
          id="multi-screen-navigation-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação das Seções ēloSites"
          className="nav-menu-modal-container fixed inset-0 z-[100] flex flex-col items-center justify-between pt-4 sm:pt-6 pb-6 sm:pb-8 px-4 bg-[#050814]/92 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-y-auto overscroll-contain"
          onClick={handleCloseMenuWithoutNav}
        >
          {/* Fundo de grade azul de espaço-tempo com bolha em movimento contínuo e aleatório */}
          <FluidRippleBackground variant="contained" className="absolute inset-0 z-0 opacity-70 pointer-events-none" />

          {/* Botão de Fechar ('X') que sobe e desce junto com o scroll das seções */}
          <header
            id="header-nav-active"
            className="w-full shrink-0 relative z-20 flex justify-center items-center pt-2 sm:pt-3 pb-2 sm:pb-3 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center">
              {renderMenuButton()}
            </div>
          </header>

          {/* Lista de seções minimalista com movimento flutuante suave */}
          <div
            className="nav-menu-list-wrap relative z-20 w-full flex flex-col items-center justify-center text-center my-auto px-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="nav-menu-list flex flex-col items-center justify-center py-1 w-full gap-[1px] sm:gap-[3px]">
              {SCREENS.map((screen, index) => {
                const isActive = screen.id === currentScreen;

                return (
                  <motion.li
                    key={screen.id}
                    animate={{
                      y: [-4, 4, -4],
                      x: [2, -2, 2],
                      rotate: [-0.25, 0.25, -0.25],
                    }}
                    transition={{
                      y: {
                        duration: 6.5 + (index % 3) * 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.12,
                      },
                      x: {
                        duration: 7.2 + (index % 2) * 0.9,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.12,
                      },
                      rotate: {
                        duration: 8.0,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.1,
                      },
                    }}
                    className="nav-menu-list-item w-full flex justify-center py-[1px]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSelectScreen(screen.id);
                      }}
                      onPointerEnter={() => preloadScreen(screen.id)}
                      onFocus={() => preloadScreen(screen.id)}
                      onTouchStart={() => preloadScreen(screen.id)}
                      className={`nav-menu-link-item group relative px-4 py-1 sm:py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 rounded-lg flex items-center justify-center gap-2.5 cursor-pointer transition-colors duration-200 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 shadow-[0_0_8px_#3b82f6]" />
                      )}
                      <span
                        className={`font-display text-[17px] sm:text-[19px] md:text-[22px] tracking-tight transition-colors duration-200 ${
                          isActive
                            ? 'text-white font-bold'
                            : 'font-medium text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {screen.shortTitle}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Logotipo oficial centralizado no rodapé do modal sem sobreposição */}
          <div
            className="nav-menu-logo-wrap shrink-0 flex flex-col items-center justify-center pointer-events-auto mt-auto pt-4 pb-4 sm:pb-6 relative z-20 min-h-[56px] overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            <EloLogo
              size="menu"
              showTagline={true}
              taglineClassName="whitespace-nowrap"
              onClick={() => {
                setIsMenuOpen(false);
                onSelectScreen('home');
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

