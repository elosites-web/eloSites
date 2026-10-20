import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import {
  DifferentialsSkeleton,
  PortfolioSkeleton,
  ServicesSkeleton,
  BookingSkeleton,
  SimpleSectionSkeleton,
} from './components/SectionSkeletons';
import { preloadAllScreens } from './preloadScreens';
import { ScreenId, SCREENS } from './types';
import { shouldReduceMedia, getMotionTier } from './mediaPrefs';
import { withViewTransition, supportsViewTransitions } from './viewTransition';

// Code-splitting via React.lazy para acelerar a carga inicial da tela Início
const PortfolioSection = lazy(() =>
  import('./components/PortfolioSection').then((mod) => ({ default: mod.PortfolioSection }))
);
const TestimonialsSection = lazy(() =>
  import('./components/TestimonialsSection').then((mod) => ({ default: mod.TestimonialsSection }))
);
const ServicesSection = lazy(() =>
  import('./components/ServicesSection').then((mod) => ({ default: mod.ServicesSection }))
);
const SpecialtiesSection = lazy(() =>
  import('./components/SpecialtiesSection').then((mod) => ({ default: mod.SpecialtiesSection }))
);
const DifferentialsSection = lazy(() =>
  import('./components/DifferentialsSection').then((mod) => ({ default: mod.DifferentialsSection }))
);
const ProjectBriefBookingSection = lazy(() =>
  import('./components/ProjectBriefBookingSection').then((mod) => ({
    default: mod.ProjectBriefBookingSection,
  }))
);
const ProcessSection = lazy(() =>
  import('./components/ProcessSection').then((mod) => ({ default: mod.ProcessSection }))
);
const FaqSection = lazy(() =>
  import('./components/FaqSection').then((mod) => ({ default: mod.FaqSection }))
);
const ContactCtaSection = lazy(() =>
  import('./components/ContactCtaSection').then((mod) => ({
    default: mod.ContactCtaSection,
  }))
);
const PaidTrafficPartnershipSection = lazy(() =>
  import('./components/PaidTrafficPartnershipSection').then((mod) => ({
    default: mod.PaidTrafficPartnershipSection,
  }))
);
const LegalModals = lazy(() =>
  import('./components/LegalModals').then((mod) => ({ default: mod.LegalModals }))
);
const SitemapModal = lazy(() =>
  import('./components/SitemapModal').then((mod) => ({ default: mod.SitemapModal }))
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [direction, setDirection] = useState<number>(1);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isWhatsAppBubbleOpen, setIsWhatsAppBubbleOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Hook do Framer Motion combinado com a preferência de acessibilidade
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // View Transitions (crossfade) quando suportado e o tier de movimento permite.
  // Caso contrário mantemos a transição suave atual (fallback).
  const useViewTransitions = supportsViewTransitions() && getMotionTier() !== 'none';

  // Modo de alto contraste para acessibilidade
  const [isHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('elosites_contrast') === 'high';
    } catch {
      return false;
    }
  });

  // Pré-carrega os chunks das telas secundárias e dos modais quando o navegador
  // estiver ocioso (ou no primeiro toque/clique/foco), para trocas instantâneas.
  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let done = false;

    const run = () => {
      if (done) return;
      done = true;
      preloadAllScreens();
    };

    const onFirstInteraction = () => run();

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(run, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(run, 3000);
    }

    window.addEventListener('pointerdown', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
  }, []);

  // Sincronização inicial e bidirecional com a hash da URL (9 telas oficiais)
  useEffect(() => {
    const validIds: ScreenId[] = [
      'home',
      'inicio',
      'servicos',
      'solucoes-web',
      'portfolio',
      'avaliacoes',
      'processo',
      'orcamento',
      'parceria-trafego',
      'trafego-pago',
      'faq',
    ];

    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash === 'solucoes-web' || rawHash === 'solucoes' || rawHash === 'especialidades') {
        setCurrentScreen((prev) => {
          if (prev !== 'solucoes-web') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'solucoes-web');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'solucoes-web';
        });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (rawHash === 'testemunhos' || rawHash === 'depoimentos' || rawHash === 'social-proof' || rawHash === 'avaliacoes') {
        setCurrentScreen((prev) => {
          if (prev !== 'avaliacoes') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'avaliacoes');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'avaliacoes';
        });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (rawHash === 'parceria' || rawHash === 'trafego' || rawHash === 'trafego-pago') {
        setCurrentScreen((prev) => {
          if (prev !== 'parceria-trafego') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'parceria-trafego');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'parceria-trafego';
        });
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (validIds.includes(rawHash as ScreenId)) {
        const targetScreen = rawHash as ScreenId;
        setCurrentScreen((prev) => {
          if (prev !== targetScreen) {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === targetScreen);
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return targetScreen;
        });
      } else if (rawHash === 'diferenciais') {
        setCurrentScreen((prev) => {
          if (prev !== 'processo') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'processo');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'processo';
        });
        setTimeout(() => {
          const el = document.getElementById('diferenciais');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (rawHash === 'contato') {
        setCurrentScreen((prev) => {
          if (prev !== 'faq') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'faq');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'faq';
        });
        setTimeout(() => {
          const el = document.getElementById('contato');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (rawHash === 'apresentacao') {
        setCurrentScreen('inicio');
        setTimeout(() => {
          const el = document.getElementById('apresentacao');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (rawHash === 'sitemap' || rawHash === 'mapa-do-site') {
        setIsSitemapOpen(true);
      }
    };

    // Lê na carga inicial
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Ao trocar de tela, atualiza o hash, a direção do slide lateral e rola para o topo
  const navigateToScreen = useCallback((screenId: ScreenId) => {
    setIsMenuOpen(false);
    const prevIdx = SCREENS.findIndex((s) => s.id === currentScreen);
    const nextIdx = SCREENS.findIndex((s) => s.id === screenId);
    const nextDirection = nextIdx !== -1 && prevIdx !== -1 && nextIdx !== prevIdx ? (nextIdx > prevIdx ? 1 : -1) : direction;
    withViewTransition(() => {
      setDirection(nextDirection);
      setCurrentScreen(screenId);
    });
    window.location.hash = screenId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentScreen, direction]);

  const currentIndex = SCREENS.findIndex((s) => s.id === currentScreen);
  const previousScreen = currentIndex > 0 ? SCREENS[currentIndex - 1] : null;
  const nextScreen = currentIndex < SCREENS.length - 1 ? SCREENS[currentIndex + 1] : null;

  const handlePrevious = useCallback(() => {
    if (previousScreen) {
      navigateToScreen(previousScreen.id);
    }
  }, [previousScreen, navigateToScreen]);

  const handleNext = useCallback(() => {
    if (nextScreen) {
      navigateToScreen(nextScreen.id);
    }
  }, [nextScreen, navigateToScreen]);

  // Suporte a navegação por setas do teclado (Esquerda e Direita)
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      // Atalhos com modificadores pertencem ao navegador (ex.: Alt+Seta = voltar)
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const targetTag = target.tagName?.toLowerCase();
        if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
          return;
        }
        if (target.isContentEditable) return;
        // O carrossel de depoimentos trata as setas por conta própria
        if (target.closest('[data-testimonials-carousel]')) return;
      }

      // Não navegar quando um modal/diálogo (legal ou menu) está aberto
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;

      if (e.key === 'ArrowLeft' && previousScreen) {
        handlePrevious();
      } else if (e.key === 'ArrowRight' && nextScreen) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [previousScreen, nextScreen, handlePrevious, handleNext]);

  // Suporte a gestos de swipe em dispositivos móveis (Swipe-to-navigate entre seções)
  useEffect(() => {
    // Detecta dispositivos com capacidade de toque
    const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (!hasTouch) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwipingIgnored = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Ignora gestos multi-toque (ex.: pinça/zoom)
      if (e.touches.length !== 1) {
        isSwipingIgnored = true;
        return;
      }

      // Ignora se o menu ou algum modal/diálogo estiver aberto
      if (isMenuOpen || legalModal !== null || isSitemapOpen || document.querySelector('[role="dialog"][aria-modal="true"]')) {
        isSwipingIgnored = true;
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const targetTag = target.tagName?.toLowerCase();
        // Não interfere em formulários ou elementos editáveis
        if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select' || target.isContentEditable) {
          isSwipingIgnored = true;
          return;
        }
        // Não interfere em elementos horizontais dedicados (ex.: carrossel de depoimentos Embla)
        if (target.closest('[data-testimonials-carousel]') || target.closest('[data-no-swipe]')) {
          isSwipingIgnored = true;
          return;
        }
      }

      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
      isSwipingIgnored = false;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSwipingIgnored) return;
      if (e.changedTouches.length !== 1) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      // Critérios rigorosos para disparo de swipe horizontal intencional:
      // 1. Duração <= 650ms (gesto rápido e deliberado, não toque demorado)
      // 2. Deslocamento horizontal >= 50px
      // 3. Predominância horizontal (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) para não colidir com a rolagem vertical de leitura
      if (deltaTime <= 650 && Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0 && nextScreen) {
          // Deslizar para a esquerda -> avança para a próxima tela
          handleNext();
        } else if (deltaX > 0 && previousScreen) {
          // Deslizar para a direita -> volta para a tela anterior
          handlePrevious();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMenuOpen, legalModal, isSitemapOpen, nextScreen, previousScreen, handleNext, handlePrevious]);

  // Sincronização dinâmica de meta tags OpenGraph, Twitter Cards, Canonical e Title para cada seção/tela
  useEffect(() => {
    const meta = SCREENS.find((s) => s.id === currentScreen) || SCREENS[0];
    const isHome = currentScreen === 'home' || currentScreen === 'inicio';

    const pageTitle = isHome
      ? 'ēloSites — Criação de Sites Profissionais com SEO Técnico e Conversão'
      : `${meta.title} | ēloSites — Sites Profissionais com SEO Técnico`;

    const pageDesc = isHome
      ? 'Criação de sites profissionais e landing pages com SEO técnico e foco em conversão para pequenos negócios e profissionais liberais. Alta performance e código limpo.'
      : `${meta.description} Desenvolvimento de sites institucionais e landing pages de alta conversão pela ēloSites.`;

    const canonicalUrl = currentScreen === 'home'
      ? 'https://elosites.ia.br/'
      : `https://elosites.ia.br/#${currentScreen}`;

    // Atualiza o <title> do documento
    document.title = pageTitle;

    // Helper para atualizar ou criar meta tag
    const updateMeta = (selector: string, attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta Description padrão
    updateMeta('meta[name="description"]', 'name', 'description', pageDesc);

    // Canonical Tag
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // OpenGraph dinâmico
    updateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', pageDesc);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

    // Twitter Cards dinâmico
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
    updateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
  }, [currentScreen]);

  const currentMeta = SCREENS[currentIndex] || SCREENS[0];

  // 'SlideFade' transition variant for AnimatePresence:
  // Uses a smooth deceleration curve [0.16, 1, 0.3, 1] on entrance,
  // and a distinctly differentiated exit easing curve [0.7, 0, 0.84, 0] (anticipation & swift departure)
  const slideFadeVariants: Variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir >= 0 ? 16 : -16,
      y: prefersReduced ? 0 : dir >= 0 ? 8 : -8,
      scale: prefersReduced ? 1 : 0.995,
    }),
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        x: {
          duration: prefersReduced ? 0 : 0.26,
          ease: [0.16, 1, 0.3, 1], // Deceleration entrance curve
        },
        y: {
          duration: prefersReduced ? 0 : 0.26,
          ease: [0.16, 1, 0.3, 1],
        },
        scale: {
          duration: prefersReduced ? 0 : 0.24,
          ease: [0.16, 1, 0.3, 1],
        },
        opacity: {
          duration: prefersReduced ? 0.15 : 0.22,
          ease: 'easeOut',
        },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir >= 0 ? -16 : 16,
      y: prefersReduced ? 0 : dir >= 0 ? -8 : 8,
      scale: prefersReduced ? 1 : 0.99,
      transition: {
        x: {
          duration: prefersReduced ? 0 : 0.18,
          ease: [0.7, 0, 0.84, 0], // Differentiated exit easing curve (crisp anticipation acceleration)
        },
        y: {
          duration: prefersReduced ? 0 : 0.18,
          ease: [0.7, 0, 0.84, 0],
        },
        scale: {
          duration: prefersReduced ? 0 : 0.16,
          ease: [0.7, 0, 0.84, 0],
        },
        opacity: {
          duration: prefersReduced ? 0.12 : 0.15,
          ease: [0.4, 0, 1, 1],
        },
      },
    }),
  };

  // Conteúdo da tela ativa, reutilizado pelos dois caminhos de transição:
  // View Transitions (crossfade) ou AnimatePresence (fallback suave atual).
  const renderActiveScreen = () => (
    <>
      {/* TELA 01: Home (Background-only Hero com Menu Centralizado e Logo Flutuante) */}
      {currentScreen === 'home' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style]">
          <Hero
            mode="home"
            isMenuOpen={isMenuOpen}
          />
        </div>
      )}

      {/* TELA 02: Início (Apresentação Completa, Marquee 85s dos Nichos, CTAs e Terminal 3D) */}
      {currentScreen === 'inicio' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style]">
          <Hero
            mode="inicio"
            onNavigateToPortfolio={() => navigateToScreen('servicos')}
          />
        </div>
      )}

      {/* TELA 03: Serviços & Condições Comerciais */}
      {currentScreen === 'servicos' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style]">
          <SectionErrorBoundary>
            <Suspense fallback={<ServicesSkeleton />}>
              <ServicesSection onNavigateToOrcamento={() => navigateToScreen('solucoes-web')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 04: Soluções Web (Página Independente de Especialidades Web) */}
      {currentScreen === 'solucoes-web' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style]">
          <SectionErrorBoundary>
            <Suspense fallback={<ServicesSkeleton />}>
              <SpecialtiesSection onNavigateToContact={() => navigateToScreen('portfolio')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 05: Portfólio de Projetos Reais */}
      {currentScreen === 'portfolio' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style]">
          <SectionErrorBoundary>
            <Suspense fallback={<PortfolioSkeleton />}>
              <PortfolioSection
                onNavigateToServices={() => navigateToScreen('avaliacoes')}
              />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 06: Avaliações de Clientes Reais (Social Proof & Carrossel Cilíndrico) */}
      {currentScreen === 'avaliacoes' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style]">
          <SectionErrorBoundary>
            <Suspense fallback={<PortfolioSkeleton />}>
              <TestimonialsSection
                onNavigateToServices={() => navigateToScreen('processo')}
              />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 07: Processo em 4 Etapas & Diferenciais como continuidade */}
      {currentScreen === 'processo' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style] space-y-0">
          <SectionErrorBoundary>
            <Suspense fallback={<DifferentialsSkeleton />}>
              <ProcessSection />
              <Suspense fallback={<DifferentialsSkeleton />}>
                <DifferentialsSection onNavigateToPortfolio={() => navigateToScreen('orcamento')} />
              </Suspense>
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 08: Briefing & Agendamento */}
      {currentScreen === 'orcamento' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style]">
          <SectionErrorBoundary>
            <Suspense fallback={<BookingSkeleton />}>
              <ProjectBriefBookingSection onOpenPrivacy={() => setLegalModal('privacy')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 09: Tráfego Pago & Gestão de Leads */}
      {(currentScreen === 'parceria-trafego' || currentScreen === 'trafego-pago') && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style] space-y-0">
          <SectionErrorBoundary>
            <Suspense fallback={<SimpleSectionSkeleton />}>
              <PaidTrafficPartnershipSection />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 10: Perguntas Frequentes (FAQ) & Contato */}
      {currentScreen === 'faq' && (
        <div style={{ contain: 'layout style' }} className="w-full [contain:layout_style] space-y-0">
          <SectionErrorBoundary>
            <Suspense fallback={<SimpleSectionSkeleton />}>
              <FaqSection />
              <ContactCtaSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}
    </>
  );

  return (
    <div className={`min-h-screen-dvh text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white relative ${isHighContrast ? 'high-contrast' : ''}`}>
      {/* Link de pular para o conteúdo (primeiro elemento focável) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      {/* Região viva: anuncia a tela atual para leitores de tela */}
      <div className="sr-only" role="status" aria-live="polite">
        {`Tela ${currentMeta.number}: ${currentMeta.title}`}
      </div>

      {/* Barra de Progresso de Leitura no Topo */}
      {!isMenuOpen && <ReadingProgressBar key={currentScreen} currentScreen={currentScreen} />}

      {/* Header Fixo com Botão Único "MENU DE NAVEGAÇÃO" */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={navigateToScreen}
        onPreviousScreen={handlePrevious}
        onNextScreen={handleNext}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Conteúdo Principal — Exibição Estratégica da Tela Ativa */}
      <main
        className={`flex-1 relative z-10 overflow-x-hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
        }`}
        id="main-content"
        tabIndex={-1}
      >
        {useViewTransitions ? (
          <div
            key={currentScreen}
            style={{ contain: 'layout style' }}
            className="w-full [contain:layout_style]"
          >
            {renderActiveScreen()}
          </div>
        ) : (
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentScreen}
              custom={direction}
              variants={slideFadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ contain: 'layout style' }}
              className="w-full [contain:layout_style]"
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Rodapé Institucional com Links de Telas e Termos Legais — Oculto exclusivamente na tela inicial (Home) */}
      {!isMenuOpen && currentScreen !== 'home' && (
        <Footer
          onOpenPrivacy={() => setLegalModal('privacy')}
          onOpenTerms={() => setLegalModal('terms')}
          onSelectScreen={navigateToScreen}
          currentScreen={currentScreen}
          isWhatsAppBubbleOpen={isWhatsAppBubbleOpen}
        />
      )}

      {/* Botão Flutuante Oficial do WhatsApp — Oculto na tela Home e com menu aberto */}
      {!isMenuOpen && currentScreen !== 'home' && (
        <FloatingWhatsApp
          currentScreen={currentScreen}
          onBubbleStateChange={setIsWhatsAppBubbleOpen}
        />
      )}

      {/* Modais Legais (Política de Privacidade e Termos de Uso) */}
      <Suspense fallback={null}>
        <LegalModals
          isOpen={legalModal !== null}
          type={legalModal}
          onClose={() => setLegalModal(null)}
        />
      </Suspense>

      {/* Modal do Mapa do Site Dinâmico XML (Google Search Console) */}
      <Suspense fallback={null}>
        <SitemapModal
          isOpen={isSitemapOpen}
          onClose={() => setIsSitemapOpen(false)}
          onNavigateToScreen={navigateToScreen}
        />
      </Suspense>
    </div>
  );
}
