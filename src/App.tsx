import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
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
import { Sparkles } from 'lucide-react';
import { BiReveal } from './components/BiReveal';
import { CaseDetailPage } from './components/CaseDetailPage';
import { ProjectImageView } from './components/ProjectImageView';
import { CustomCursor } from './components/CustomCursor';
import { getProjectById } from './portfolioData';

// Code-splitting via React.lazy para acelerar a carga inicial da tela Início
const FounderCard = lazy(() =>
  import('./components/FounderCard').then((mod) => ({ default: mod.FounderCard }))
);
const PortfolioSection = lazy(() =>
  import('./components/PortfolioSection').then((mod) => ({ default: mod.PortfolioSection }))
);
const TestimonialsSection = lazy(() =>
  import('./components/TestimonialsSection').then((mod) => ({ default: mod.TestimonialsSection }))
);
const ServicesSection = lazy(() =>
  import('./components/ServicesSection').then((mod) => ({ default: mod.ServicesSection }))
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
const DigitalCardSection = lazy(() =>
  import('./components/DigitalCardSection').then((mod) => ({
    default: mod.DigitalCardSection,
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
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('inicio');
  const [direction, setDirection] = useState<number>(1);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isWhatsAppBubbleOpen, setIsWhatsAppBubbleOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Estados dedicados de navegação para Case e Captura de Imagem (Substituição de modais por páginas)
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeImageView, setActiveImageView] = useState<{
    projectId: string;
    imageType: 'desktop' | 'mobile';
  } | null>(null);

  // Armazenamento em memória das posições de scroll exclusivamente para o fluxo Portfólio <-> Case <-> Imagem
  const scrollPositionsRef = useRef<Record<string, number>>({});
  const currentRouteKeyRef = useRef<string>('inicio');
  const isRestoringScrollRef = useRef<boolean>(false);
  const activeScrollJobCancelRef = useRef<(() => void) | null>(null);

  const cancelActiveScrollJob = useCallback(() => {
    if (activeScrollJobCancelRef.current) {
      activeScrollJobCancelRef.current();
      activeScrollJobCancelRef.current = null;
    }
    isRestoringScrollRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      cancelActiveScrollJob();
    };
  }, [cancelActiveScrollJob]);

  // Calcula a posição exata de rolagem descontando a altura real do cabeçalho fixo
  const computeAnchorScrollTop = useCallback((el: HTMLElement): number => {
    const headerEl = document.getElementById('site-header') || document.querySelector('header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 72;
    const rect = el.getBoundingClientRect();
    const currentScrollY = window.scrollY || window.pageYOffset || 0;

    if (el.tagName === 'SECTION') {
      const computedStyle = window.getComputedStyle(el);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const desiredGap = 24;
      const contentTopInDoc = rect.top + currentScrollY + paddingTop;
      return Math.max(0, Math.round(contentTopInDoc - (headerHeight + desiredGap)));
    }

    const elementTopInDoc = rect.top + currentScrollY;
    return Math.max(0, Math.round(elementTopInDoc - (headerHeight + 20)));
  }, []);

  // Garante abertura no topo (scrollY = 0) para telas institucionais, inclusive após transições
  const scrollToInstitutionalTop = useCallback(() => {
    cancelActiveScrollJob();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    let cancelled = false;
    const timers: number[] = [];
    const rafId = window.requestAnimationFrame(() => {
      if (!cancelled) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });

    const onUserScroll = () => {
      cancelled = true;
    };

    window.addEventListener('wheel', onUserScroll, { passive: true, once: true });
    window.addEventListener('touchstart', onUserScroll, { passive: true, once: true });
    window.addEventListener('keydown', onUserScroll, { passive: true, once: true });

    [60, 180].forEach((ms) => {
      const tid = window.setTimeout(() => {
        if (!cancelled) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }, ms);
      timers.push(tid);
    });

    activeScrollJobCancelRef.current = () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      timers.forEach((tid) => window.clearTimeout(tid));
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchstart', onUserScroll);
      window.removeEventListener('keydown', onUserScroll);
    };
  }, [cancelActiveScrollJob]);

  // Aguarda o elemento de âncora existir no DOM (mesmo com lazy loading / Suspense) e posiciona abaixo do header fixo
  const scrollToAnchorWhenReady = useCallback(
    (candidateIds: string[]) => {
      cancelActiveScrollJob();
      preloadAllScreens();

      let cancelled = false;
      let attempts = 0;
      const maxAttempts = 60;
      const timers: number[] = [];
      let pollTimer: number | null = null;
      let observer: MutationObserver | null = null;

      const onUserInteracted = () => {
        cancelled = true;
      };

      window.addEventListener('wheel', onUserInteracted, { passive: true, once: true });
      window.addEventListener('touchstart', onUserInteracted, { passive: true, once: true });
      window.addEventListener('keydown', onUserInteracted, { passive: true, once: true });

      const findReadyTarget = (): HTMLElement | null => {
        for (const id of candidateIds) {
          const el = document.getElementById(id);
          if (el && el.isConnected) {
            const rect = el.getBoundingClientRect();
            if (rect.height > 0) {
              return el;
            }
          }
        }
        return null;
      };

      const applyScrollToElement = (el: HTMLElement, behavior: ScrollBehavior) => {
        if (cancelled) return;
        const targetY = computeAnchorScrollTop(el);
        window.scrollTo({ top: targetY, left: 0, behavior });
      };

      const scheduleStabilization = () => {
        [100, 220, 380, 560].forEach((delayMs) => {
          const tid = window.setTimeout(() => {
            if (cancelled) return;
            const currentEl = findReadyTarget();
            if (!currentEl) return;
            const targetY = computeAnchorScrollTop(currentEl);
            if (Math.abs((window.scrollY || 0) - targetY) > 3) {
              window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
            }
          }, delayMs);
          timers.push(tid);
        });
      };

      const tryResolve = (): boolean => {
        if (cancelled) return true;
        const el = findReadyTarget();
        const mainEl = document.getElementById('main-content');
        const hasPendingSkeleton = Boolean(mainEl?.querySelector('[aria-busy="true"]'));

        if (el && (!hasPendingSkeleton || attempts > 18)) {
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          if (pollTimer !== null) {
            window.clearTimeout(pollTimer);
            pollTimer = null;
          }
          applyScrollToElement(el, 'instant');
          scheduleStabilization();
          return true;
        }
        return false;
      };

      const step = () => {
        if (cancelled) return;
        if (tryResolve()) return;
        attempts += 1;
        if (attempts < maxAttempts) {
          pollTimer = window.setTimeout(step, 45);
        }
      };

      const mainRoot = document.getElementById('main-content') || document.body;
      if (typeof MutationObserver !== 'undefined' && mainRoot) {
        observer = new MutationObserver(() => {
          tryResolve();
        });
        observer.observe(mainRoot, { childList: true, subtree: true });
      }

      window.requestAnimationFrame(() => {
        step();
      });

      activeScrollJobCancelRef.current = () => {
        cancelled = true;
        if (pollTimer !== null) {
          window.clearTimeout(pollTimer);
          pollTimer = null;
        }
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        timers.forEach((tid) => window.clearTimeout(tid));
        window.removeEventListener('wheel', onUserInteracted);
        window.removeEventListener('touchstart', onUserInteracted);
        window.removeEventListener('keydown', onUserInteracted);
      };
    },
    [cancelActiveScrollJob, computeAnchorScrollTop]
  );

  // Desativa restauração automática truncada do navegador para controle milimétrico de scroll
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Monitora continuamente e salva a posição de rolagem vertical apenas das rotas de portfólio, case e imagem
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!isRestoringScrollRef.current) {
            const routeKey = currentRouteKeyRef.current;
            if (
              routeKey === 'portfolio' ||
              routeKey.startsWith('case/') ||
              routeKey.startsWith('imagem/')
            ) {
              scrollPositionsRef.current[routeKey] = window.scrollY || window.pageYOffset || 0;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Sincronização inicial e bidirecional com a hash da URL (telas oficiais + cases + imagens)
  useEffect(() => {
    const validIds: ScreenId[] = [
      'inicio',
      'servicos',
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

      const restoreSavedPosition = (targetY: number) => {
        cancelActiveScrollJob();
        isRestoringScrollRef.current = true;
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        const timers: number[] = [];
        const rafId = window.requestAnimationFrame(() => {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        });
        [50, 120, 220].forEach((ms, idx) => {
          const tid = window.setTimeout(() => {
            window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
            if (idx === 2) {
              isRestoringScrollRef.current = false;
            }
          }, ms);
          timers.push(tid);
        });
        activeScrollJobCancelRef.current = () => {
          window.cancelAnimationFrame(rafId);
          timers.forEach((tid) => window.clearTimeout(tid));
          isRestoringScrollRef.current = false;
        };
      };

      // 1. Rota de captura de imagem em alta resolução:
      // #case/:id/:type ou #case/:id/imagem/:type ou #imagem/:id/:type
      const imageMatch = rawHash.match(/^(?:case\/([a-z0-9-]+)\/(?:imagem\/)?(desktop|mobile)|imagem\/([a-z0-9-]+)\/(desktop|mobile)|case-([a-z0-9-]+)-(desktop|mobile))$/);
      if (imageMatch) {
        const pId = imageMatch[1] || imageMatch[3] || imageMatch[5];
        const iType = (imageMatch[2] || imageMatch[4] || imageMatch[6]) as 'desktop' | 'mobile';
        const project = getProjectById(pId);
        if (project) {
          const prevRouteKey = currentRouteKeyRef.current;
          if (
            !isRestoringScrollRef.current &&
            (prevRouteKey === 'portfolio' || prevRouteKey.startsWith('case/'))
          ) {
            scrollPositionsRef.current[prevRouteKey] = window.scrollY || window.pageYOffset || 0;
          }
          const routeKey = `case/${pId}/${iType}`;
          const savedY = scrollPositionsRef.current[routeKey];
          currentRouteKeyRef.current = routeKey;
          setCurrentScreen('portfolio');
          setActiveCaseId(null);
          setActiveImageView({ projectId: pId, imageType: iType });
          restoreSavedPosition(typeof savedY === 'number' ? savedY : 0);
          return;
        }
      }

      // 2. Rota de estudo de caso completo: #case/:id ou #case-:id
      const caseMatch = rawHash.match(/^(?:case\/([a-z0-9-]+)|case-([a-z0-9-]+))$/);
      if (caseMatch) {
        const pId = caseMatch[1] || caseMatch[2];
        const project = getProjectById(pId);
        if (project) {
          const prevRouteKey = currentRouteKeyRef.current;
          if (!isRestoringScrollRef.current && prevRouteKey === 'portfolio') {
            scrollPositionsRef.current['portfolio'] = window.scrollY || window.pageYOffset || 0;
          }
          const isReturningFromImage =
            prevRouteKey.startsWith(`case/${pId}/`) || prevRouteKey.startsWith(`imagem/${pId}/`);
          const routeKey = `case/${pId}`;
          const savedY = isReturningFromImage ? scrollPositionsRef.current[routeKey] : 0;
          currentRouteKeyRef.current = routeKey;
          setCurrentScreen('portfolio');
          setActiveImageView(null);
          setActiveCaseId(pId);
          restoreSavedPosition(typeof savedY === 'number' ? savedY : 0);
          return;
        }
      }

      // 3. Ao entrar em qualquer tela institucional, desativa visualizações de case e imagem
      setActiveCaseId(null);
      setActiveImageView(null);

      // 4. Redirecionamento de compatibilidade para links legados (#home -> #inicio)
      if (rawHash === 'home') {
        setCurrentScreen('inicio');
        currentRouteKeyRef.current = 'inicio';
        if (window.location.hash !== '#inicio') {
          history.replaceState(null, '', '#inicio');
        }
        scrollToInstitutionalTop();
        return;
      }

      if (rawHash === 'portfolio') {
        const prevRouteKey = currentRouteKeyRef.current;
        const isReturningFromCase =
          prevRouteKey.startsWith('case/') || prevRouteKey.startsWith('imagem/');
        const savedY = scrollPositionsRef.current['portfolio'];
        currentRouteKeyRef.current = 'portfolio';
        setCurrentScreen('portfolio');
        if (isReturningFromCase) {
          restoreSavedPosition(typeof savedY === 'number' ? savedY : 0);
        } else {
          scrollPositionsRef.current['portfolio'] = 0;
          scrollToInstitutionalTop();
        }
        return;
      }

      if (rawHash === 'solucoes-web' || rawHash === 'solucoes' || rawHash === 'especialidades') {
        currentRouteKeyRef.current = 'servicos';
        setCurrentScreen((prev) => {
          if (prev !== 'servicos') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'servicos');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'servicos';
        });
        scrollToInstitutionalTop();
      } else if (rawHash === 'testemunhos' || rawHash === 'depoimentos' || rawHash === 'social-proof' || rawHash === 'avaliacoes') {
        currentRouteKeyRef.current = 'avaliacoes';
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
        scrollToInstitutionalTop();
      } else if (rawHash === 'parceria' || rawHash === 'trafego' || rawHash === 'trafego-pago') {
        currentRouteKeyRef.current = 'parceria-trafego';
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
        scrollToInstitutionalTop();
      } else if (rawHash === 'como-funciona') {
        currentRouteKeyRef.current = 'processo';
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
        scrollToInstitutionalTop();
      } else if (rawHash === 'agendamento') {
        currentRouteKeyRef.current = 'orcamento';
        setCurrentScreen((prev) => {
          if (prev !== 'orcamento') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'orcamento');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'orcamento';
        });
        scrollToInstitutionalTop();
      } else if (validIds.includes(rawHash as ScreenId)) {
        const targetScreen = rawHash as ScreenId;
        currentRouteKeyRef.current = targetScreen;
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
        scrollToInstitutionalTop();
      } else if (rawHash === 'diferenciais') {
        currentRouteKeyRef.current = 'processo';
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
        scrollToAnchorWhenReady(['diferenciais']);
      } else if (rawHash === 'contato') {
        currentRouteKeyRef.current = 'faq';
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
        scrollToAnchorWhenReady(['contato']);
      } else if (
        rawHash === 'cartao-digital' ||
        rawHash === 'cartao' ||
        rawHash === 'cartao-visitas' ||
        rawHash === 'cartao-de-visitas'
      ) {
        currentRouteKeyRef.current = 'faq';
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
        const candidates =
          rawHash === 'cartao-de-visitas'
            ? ['cartao-de-visitas', 'cartao-digital']
            : ['cartao-digital', 'cartao-de-visitas'];
        scrollToAnchorWhenReady(candidates);
      } else if (rawHash === 'apresentacao' || rawHash === 'sobre') {
        currentRouteKeyRef.current = 'inicio';
        setCurrentScreen((prev) => {
          if (prev !== 'inicio') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'inicio');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'inicio';
        });
        scrollToAnchorWhenReady(['sobre-fundador', 'apresentacao', 'fundador']);
      } else if (rawHash === 'fundador' || rawHash === 'card-do-fundador' || rawHash === 'sobre-fundador') {
        currentRouteKeyRef.current = 'inicio';
        setCurrentScreen((prev) => {
          if (prev !== 'inicio') {
            const prevIdx = SCREENS.findIndex((s) => s.id === prev);
            const nextIdx = SCREENS.findIndex((s) => s.id === 'inicio');
            if (nextIdx !== -1 && prevIdx !== -1) {
              setDirection(nextIdx > prevIdx ? 1 : -1);
            }
          }
          return 'inicio';
        });
        const candidates =
          rawHash === 'sobre-fundador'
            ? ['sobre-fundador', 'fundador']
            : ['fundador', 'sobre-fundador'];
        scrollToAnchorWhenReady(candidates);
      } else if (rawHash === 'sitemap' || rawHash === 'mapa-do-site') {
        setIsSitemapOpen(true);
      }
    };

    // Lê na carga inicial
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [cancelActiveScrollJob, scrollToAnchorWhenReady, scrollToInstitutionalTop]);

  // Ao trocar de tela institucional pelo menu superior, rodapé ou CTAs, abre sempre no topo (scrollY = 0)
  const navigateToScreen = useCallback((screenId: ScreenId) => {
    setIsMenuOpen(false);
    setActiveCaseId(null);
    setActiveImageView(null);
    const prevIdx = SCREENS.findIndex((s) => s.id === currentScreen);
    const nextIdx = SCREENS.findIndex((s) => s.id === screenId);
    const nextDirection = nextIdx !== -1 && prevIdx !== -1 && nextIdx !== prevIdx ? (nextIdx > prevIdx ? 1 : -1) : direction;
    scrollPositionsRef.current[screenId] = 0;
    currentRouteKeyRef.current = screenId;
    withViewTransition(() => {
      setDirection(nextDirection);
      setCurrentScreen(screenId);
    });
    if (window.location.hash !== `#${screenId}`) {
      window.history.pushState(null, '', `#${screenId}`);
    }
    scrollToInstitutionalTop();
  }, [currentScreen, direction, scrollToInstitutionalTop]);

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



  // Sincronização dinâmica de meta tags OpenGraph, Twitter Cards, Canonical e Title para cada seção/tela/case
  useEffect(() => {
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

    // Caso 1: Captura de tela ampliada
    if (activeImageView) {
      const project = getProjectById(activeImageView.projectId);
      if (project) {
        const typeLabel = activeImageView.imageType === 'mobile' ? 'Mobile (Celular)' : 'Desktop (Computador)';
        const pageTitle = `${project.title} — Captura ${typeLabel} em Alta Resolução | ēloSites`;
        const pageDesc = `Visualização em tamanho real da captura ${typeLabel} do site ${project.title}, desenvolvido com foco em conversão pela ēloSites.`;
        const canonicalUrl = 'https://elosites.ia.br/';

        document.title = pageTitle;
        updateMeta('meta[name="description"]', 'name', 'description', pageDesc);

        let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonicalUrl);

        updateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
        updateMeta('meta[property="og:description"]', 'property', 'og:description', pageDesc);
        updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
        updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
        updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
        updateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
        return;
      }
    }

    // Caso 2: Estudo de Caso de Sucesso
    if (activeCaseId) {
      const project = getProjectById(activeCaseId);
      if (project) {
        const pageTitle = `${project.title} — Estudo de Caso de Sucesso | ēloSites`;
        const pageDesc = `Estudo de caso do site ${project.title} desenvolvido pela ēloSites. ${project.challenge}`;
        const canonicalUrl = 'https://elosites.ia.br/';

        document.title = pageTitle;
        updateMeta('meta[name="description"]', 'name', 'description', pageDesc);

        let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonicalUrl);

        updateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
        updateMeta('meta[property="og:description"]', 'property', 'og:description', pageDesc);
        updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
        updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
        updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
        updateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
        return;
      }
    }

    // Caso 3: Telas institucionais regulares
    const meta = SCREENS.find((s) => s.id === currentScreen) || SCREENS[0];
    const isHome = currentScreen === 'inicio';

    const pageTitle = isHome
      ? 'ēloSites | Sites profissionais e landing pages'
      : `${meta.title} | ēloSites — Sites profissionais e landing pages`;

    const pageDesc = isHome
      ? 'Criação de sites institucionais e landing pages responsivas, organizados para facilitar a compreensão pelos mecanismos de busca e o contato pelo WhatsApp.'
      : `${meta.description} Desenvolvimento de sites institucionais e landing pages pela ēloSites.`;

    const canonicalUrl = 'https://elosites.ia.br/';

    // Atualiza o <title> do documento
    document.title = pageTitle;

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
  }, [currentScreen, activeCaseId, activeImageView]);

  const currentMeta = SCREENS[currentIndex] || SCREENS[0];

  // Transição discreta de opacidade pura entre telas (sem deslocamento lateral)
  const fadeVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0.08 : 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: prefersReduced ? 0.06 : 0.15,
        ease: 'easeIn',
      },
    },
  };

  // Conteúdo da tela ativa, reutilizado pelos dois caminhos de transição:
  // View Transitions (crossfade) ou AnimatePresence (fallback suave atual).
  const renderActiveScreen = () => (
    <>
      {/* TELA 01: Início — HERO Institucional com scroll & Apresentação do Fundador */}
      {currentScreen === 'inicio' && (
        <div className="w-full space-y-0">
          <Hero
            mode="inicio"
            onNavigateToPortfolio={() => navigateToScreen('portfolio')}
          />
          <section
            id="sobre-fundador"
            aria-labelledby="sobre-fundador-heading"
            className="section-auto-contain pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-[#050814]/90 border-t border-blue-500/15 relative overflow-hidden"
          >
            {/* Luz ambiente sutil */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/[0.06] blur-[140px] rounded-full pointer-events-none" />

            <div className="page-shell page-x max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
              <BiReveal direction="up">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-cyan-300 text-xs sm:text-sm font-semibold uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                    <span>Sobre a ēloSites</span>
                  </div>

                  <h2
                    id="sobre-fundador-heading"
                    className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
                  >
                    Presença digital profissional feita com transparência e proximidade.
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    Acreditamos que todo negócio, autônomo ou empresa local merece um site rápido, claro e fácil de navegar. Desenvolvemos cada projeto com atendimento direto, sem termos complicados e com total respeito ao seu investimento.
                  </p>
                </div>
              </BiReveal>

              <div id="fundador" className="scroll-mt-24">
                <SectionErrorBoundary>
                  <Suspense fallback={<SimpleSectionSkeleton />}>
                    <FounderCard
                      onNavigateToCartao={() => {
                        setIsMenuOpen(false);
                        setActiveCaseId(null);
                        setActiveImageView(null);
                        currentRouteKeyRef.current = 'faq';
                        withViewTransition(() => {
                          setCurrentScreen('faq');
                        });
                        if (window.location.hash !== '#cartao-digital') {
                          window.history.pushState(null, '', '#cartao-digital');
                        }
                        scrollToAnchorWhenReady(['cartao-digital', 'cartao-de-visitas']);
                      }}
                    />
                  </Suspense>
                </SectionErrorBoundary>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TELA 02: Serviços & Condições Comerciais */}
      {currentScreen === 'servicos' && (
        <div className="w-full space-y-0">
          <SectionErrorBoundary>
            <Suspense fallback={<ServicesSkeleton />}>
              <ServicesSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 05: Portfólio de Projetos Reais */}
      {currentScreen === 'portfolio' && (
        <div className="w-full">
          <SectionErrorBoundary>
            <Suspense fallback={<PortfolioSkeleton />}>
              <PortfolioSection
                onNavigateToServices={() => navigateToScreen('servicos')}
                onOpenCase={(id) => {
                  window.location.hash = `case/${id}`;
                }}
                onOpenImage={(id, type) => {
                  window.location.hash = `case/${id}/${type}`;
                }}
              />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 06: Avaliações de Clientes Reais (Social Proof & Carrossel Cilíndrico) */}
      {currentScreen === 'avaliacoes' && (
        <div className="w-full">
          <SectionErrorBoundary>
            <Suspense fallback={<PortfolioSkeleton />}>
              <TestimonialsSection
                onNavigateToServices={() => navigateToScreen('servicos')}
              />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 07: Processo em 4 Etapas & Diferenciais como continuidade */}
      {currentScreen === 'processo' && (
        <div className="w-full space-y-0">
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
        <div className="w-full">
          <SectionErrorBoundary>
            <Suspense fallback={<BookingSkeleton />}>
              <ProjectBriefBookingSection onOpenPrivacy={() => setLegalModal('privacy')} />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 09: Tráfego Pago & Gestão de Leads */}
      {(currentScreen === 'parceria-trafego' || currentScreen === 'trafego-pago') && (
        <div className="w-full space-y-0">
          <SectionErrorBoundary>
            <Suspense fallback={<SimpleSectionSkeleton />}>
              <PaidTrafficPartnershipSection />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}

      {/* TELA 10: Perguntas Frequentes (FAQ) & Contato */}
      {currentScreen === 'faq' && (
        <div className="w-full space-y-0">
          <SectionErrorBoundary>
            <Suspense fallback={<SimpleSectionSkeleton />}>
              <FaqSection />
              <ContactCtaSection onNavigateToOrcamento={() => navigateToScreen('orcamento')} />
              <DigitalCardSection />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      )}
    </>
  );

  const activeProject =
    (activeImageView
      ? getProjectById(activeImageView.projectId)
      : activeCaseId
      ? getProjectById(activeCaseId)
      : null) || null;

  return (
    <div className={`min-h-screen-dvh text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white relative ${isHighContrast ? 'high-contrast' : ''}`}>
      {/* Cursor personalizado de mira redonda para dispositivos desktop com ponteiro fino */}
      <CustomCursor />

      {/* Link de pular para o conteúdo (primeiro elemento focável) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      {/* Região viva: anuncia a tela atual para leitores de tela */}
      <div className="sr-only" role="status" aria-live="polite">
        {activeImageView && activeProject
          ? `Visualização da Captura: ${activeProject.title}`
          : activeCaseId && activeProject
          ? `Estudo de Caso: ${activeProject.title}`
          : `Tela ${currentMeta.number}: ${currentMeta.title}`}
      </div>

      {/* Barra de Progresso de Leitura no Topo */}
      {!isMenuOpen && (
        <ReadingProgressBar
          key={activeImageView ? `img-${activeImageView.projectId}` : activeCaseId ? `case-${activeCaseId}` : currentScreen}
          currentScreen={currentScreen}
        />
      )}

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
        style={{ willChange: 'transform, opacity' }}
        className={`flex-1 relative z-10 overflow-x-hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
        }`}
        id="main-content"
        tabIndex={-1}
      >
        {activeImageView && activeProject ? (
          <div
            key={`image-${activeImageView.projectId}-${activeImageView.imageType}`}
            style={{ willChange: 'transform, opacity' }}
            className="w-full"
          >
            <ProjectImageView
              project={activeProject}
              imageType={activeImageView.imageType}
              onBack={() => {
                window.location.hash = `case/${activeProject.id}`;
              }}
              onSwitchType={(type) => {
                window.location.hash = `case/${activeProject.id}/${type}`;
              }}
            />
          </div>
        ) : activeCaseId && activeProject ? (
          <div
            key={`case-${activeCaseId}`}
            style={{ willChange: 'transform, opacity' }}
            className="w-full"
          >
            <CaseDetailPage
              project={activeProject}
              onBack={() => {
                window.location.hash = 'portfolio';
              }}
              onOpenImage={(type) => {
                window.location.hash = `case/${activeProject.id}/${type}`;
              }}
            />
          </div>
        ) : useViewTransitions ? (
          <div
            key={currentScreen}
            style={{ contain: 'layout style', willChange: 'transform, opacity' }}
            className="w-full [contain:layout_style]"
          >
            {renderActiveScreen()}
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentScreen}
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ contain: 'layout style', willChange: 'opacity' }}
              className="w-full [contain:layout_style]"
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Rodapé Institucional com Links de Telas e Termos Legais */}
      {!isMenuOpen && (
        <Footer
          onOpenPrivacy={() => setLegalModal('privacy')}
          onOpenTerms={() => setLegalModal('terms')}
          onSelectScreen={navigateToScreen}
          currentScreen={currentScreen}
          isWhatsAppBubbleOpen={isWhatsAppBubbleOpen}
        />
      )}

      {/* Botão Flutuante Oficial do WhatsApp */}
      {!isMenuOpen && (
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
