import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, animate, useReducedMotion } from 'motion/react';
import {
  Quote,
  Star,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia, isInAppBrowser } from '../mediaPrefs';
import { getDynamicCardVariants } from '../motionVariants';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  companyOrProject: string;
  category: string;
  projectUrl: string;
  quote: string;
  rating?: number;
  isDraftProposal?: boolean;
}

export type TestimonialCategoryTag = 'all' | 'landing' | 'institutional';

export const TESTIMONIAL_TAGS: { id: TestimonialCategoryTag; label: string }[] = [
  { id: 'all', label: 'Todos os formatos' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'institutional', label: 'Site Institucional' },
];

// Avaliações de clientes reais da ēloSites
export const CLIENT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'jv-salvaia',
    name: 'João Victor Salvaia',
    role: 'Personal Trainer & Consultor Online',
    companyOrProject: 'JV Salvaia Personal Trainer',
    category: 'Landing Page de Alta Conversão',
    projectUrl: 'https://jvsalvaiapersonal.netlify.app',
    quote:
      'Gostei muito do resultado do site! Ficou profissional, moderno e com a identidade do meu trabalho como personal trainer. Agora consigo apresentar melhor meus serviços e transmitir mais confiança para quem está buscando um profissional para acompanhar seus treinos. O resultado ficou muito bom!',
    rating: 5,
  },
  {
    id: 'garagem-mailasque',
    name: 'Fabio',
    role: 'Proprietário',
    companyOrProject: 'Garagem Mailasque',
    category: 'Landing Page Automotiva',
    projectUrl: 'https://www.garagemmailasque.com.br',
    quote:
      'Rapaz, ficou top o trabalho! A ēloSites pegou a ideia da Garagem Mailasque e colocou tudo no site de um jeito organizado, bonito e com a cara da gente. Agora quem chega pela internet consegue conhecer melhor nosso trabalho e ver o que a garagem oferece. Ficou bem feito, sem enrolação, do jeito que tem que ser. Tamo junto!',
    rating: 5,
    isDraftProposal: true,
  },
  {
    id: 'toledo-seguranca',
    name: 'Jonathan Toledo',
    role: 'Proprietário & Diretor Operacional',
    companyOrProject: 'Toledo Segurança',
    category: 'Site Institucional Corporativo',
    projectUrl: 'https://www.toledoseg.com.br',
    quote:
      'O desenvolvimento do site da Toledo Segurança ficou excelente! O projeto transmitiu a seriedade e o profissionalismo que eu queria passar para os nossos clientes. Ter um site próprio faz diferença na apresentação da empresa e fortalece nossa presença na internet. Fiquei muito satisfeito com o resultado e com o trabalho realizado.',
    rating: 5,
  },
  {
    id: 'duelo-fim-de-ano',
    name: 'Renato Becala',
    role: 'Comissão Organizadora',
    companyOrProject: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'Landing Page para Evento',
    projectUrl: 'https://jogodefimdeano.netlify.app',
    quote:
      'A landing page para o nosso evento de fim de ano ficou muito bacana! A proposta era ter uma página que reunisse as principais informações do evento de forma organizada e atrativa, e o resultado atendeu muito bem à ideia. Ficou uma apresentação moderna, prática e com a cara do nosso encontro. Com certeza fez o evento ter uma presença digital ainda mais especial!',
    rating: 5,
  },
];

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
};

interface CylinderGeometry {
  cardMaxWidth: number;
  orbitRadiusX: number;
  orbitRadiusZ: number;
  maxTiltDeg: number;
  perspective: number;
  sideScale: number;
  backScale: number;
  sideOpacity: number;
  backOpacity: number;
}

function computeCylinderGeometry(
  stageWidth: number,
  stageHeight: number,
  inApp: boolean,
  reduced: boolean
): CylinderGeometry {
  const isLandscapeShort = stageHeight > 0 && stageHeight < 500 && stageWidth > stageHeight;

  if (reduced) {
    return {
      cardMaxWidth: Math.min(Math.max(stageWidth - 24, 280), 560),
      orbitRadiusX: Math.min(Math.round(stageWidth * 0.22), 220),
      orbitRadiusZ: 0,
      maxTiltDeg: 0,
      perspective: 1200,
      sideScale: 0.92,
      backScale: 0.85,
      sideOpacity: 0.25,
      backOpacity: 0,
    };
  }

  // Smartphones compactos (< 400px)
  if (stageWidth < 400) {
    return {
      cardMaxWidth: Math.max(260, stageWidth - 20),
      orbitRadiusX: Math.round(stageWidth * 0.26),
      orbitRadiusZ: inApp ? 85 : 110,
      maxTiltDeg: inApp ? 26 : 32,
      perspective: 920,
      sideScale: 0.84,
      backScale: 0.72,
      sideOpacity: 0.28,
      backOpacity: 0.06,
    };
  }

  // Smartphones grandes e modo paisagem mobile (400px - 639px)
  if (stageWidth < 640) {
    const maxW = isLandscapeShort
      ? Math.min(stageWidth - 88, 460)
      : Math.min(stageWidth - 32, 460);
    return {
      cardMaxWidth: Math.max(290, maxW),
      orbitRadiusX: Math.round(stageWidth * 0.3),
      orbitRadiusZ: inApp ? 110 : 140,
      maxTiltDeg: inApp ? 30 : 36,
      perspective: 1080,
      sideScale: 0.85,
      backScale: 0.73,
      sideOpacity: 0.36,
      backOpacity: 0.08,
    };
  }

  // Tablets (640px - 1023px)
  if (stageWidth < 1024) {
    return {
      cardMaxWidth: Math.min(Math.round(stageWidth * 0.68), 530),
      orbitRadiusX: Math.min(Math.round(stageWidth * 0.31), 290),
      orbitRadiusZ: inApp ? 145 : 185,
      maxTiltDeg: inApp ? 34 : 40,
      perspective: 1260,
      sideScale: 0.86,
      backScale: 0.74,
      sideOpacity: 0.46,
      backOpacity: 0.1,
    };
  }

  // Laptops, Desktops e Telas Ultrawide (>= 1024px)
  return {
    cardMaxWidth: Math.min(Math.round(stageWidth * 0.54), 560),
    orbitRadiusX: Math.min(Math.round(stageWidth * 0.31), 340),
    orbitRadiusZ: 225,
    maxTiltDeg: 44,
    perspective: 1420,
    sideScale: 0.86,
    backScale: 0.74,
    sideOpacity: 0.52,
    backOpacity: 0.11,
  };
}

interface TestimonialsSectionProps {
  onNavigateToServices?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onNavigateToServices,
}) => {
  const [selectedTag, setSelectedTag] = useState<TestimonialCategoryTag>('all');
  // Contador contínuo de passos para rotação 3D cilíndrica consistente nas duas direções
  const [virtualStep, setVirtualStep] = useState(0);
  const [renderAngle, setRenderAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationDirection, setRotationDirection] = useState<'next' | 'prev' | null>(null);

  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const virtualStepRef = useRef(0);
  const lastNavTimestampRef = useRef(0);
  const glowTimeoutRef = useRef<number | null>(null);

  // Detecção de preferências de acessibilidade, WebViews e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  const inApp = useMemo(() => isInAppBrowser(), []);

  const cardVariants = getDynamicCardVariants(prefersReduced);

  // Medição responsiva do palco para recalcular o cilindro em resize e orientationchange
  const [viewportMetrics, setViewportMetrics] = useState<{ width: number; height: number }>(() => ({
    width: typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 1024) : 960,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const updateMetrics = () => {
      const stageEl = stageRef.current;
      const measuredWidth = stageEl?.clientWidth || Math.min(window.innerWidth - 32, 1024);
      setViewportMetrics({
        width: Math.max(280, measuredWidth),
        height: window.innerHeight || 800,
      });
    };

    updateMetrics();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && stageRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateMetrics();
      });
      resizeObserver.observe(stageRef.current);
    }

    const handleOrientationOrVisibility = () => {
      updateMetrics();
    };

    window.addEventListener('resize', updateMetrics, { passive: true });
    window.addEventListener('orientationchange', handleOrientationOrVisibility, { passive: true });
    window.addEventListener('pageshow', handleOrientationOrVisibility, { passive: true });
    document.addEventListener('visibilitychange', handleOrientationOrVisibility);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('orientationchange', handleOrientationOrVisibility);
      window.removeEventListener('pageshow', handleOrientationOrVisibility);
      document.removeEventListener('visibilitychange', handleOrientationOrVisibility);
    };
  }, []);

  const testimonials = useMemo(
    () =>
      CLIENT_TESTIMONIALS.filter((item) => {
        if (selectedTag === 'all') return true;
        if (selectedTag === 'landing') return item.category.toLowerCase().includes('landing');
        if (selectedTag === 'institutional')
          return item.category.toLowerCase().includes('institucional');
        return true;
      }),
    [selectedTag]
  );

  const total = testimonials.length;
  const stepAngle = total > 1 ? 360 / total : 0;

  // Índice ativo normalizado sempre em [0, total - 1]
  const selectedIndex = total > 0 ? ((virtualStep % total) + total) % total : 0;

  // MotionValue para interpolação suave e sem engasgos do ângulo do cilindro
  const cylinderAngleMv = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = cylinderAngleMv.on('change', (latest) => {
      setRenderAngle(latest);
    });
    return () => unsubscribe();
  }, [cylinderAngleMv]);

  // Limpa timeout de brilho ao desmontar
  useEffect(() => {
    return () => {
      if (glowTimeoutRef.current !== null) {
        window.clearTimeout(glowTimeoutRef.current);
      }
    };
  }, []);

  // Anima o cilindro até um passo inteiro específico sem parar entre cards
  const animateToVirtualStep = useCallback(
    (nextStep: number, directionHint: 'next' | 'prev') => {
      virtualStepRef.current = nextStep;
      setVirtualStep(nextStep);

      const targetDeg = total > 1 ? -nextStep * (360 / total) : 0;

      if (prefersReduced || total <= 1) {
        cylinderAngleMv.stop();
        cylinderAngleMv.set(targetDeg);
        setRenderAngle(targetDeg);
        setIsRotating(false);
        setRotationDirection(null);
        return;
      }

      setRotationDirection(directionHint);
      setIsRotating(true);

      if (glowTimeoutRef.current !== null) {
        window.clearTimeout(glowTimeoutRef.current);
      }

      const controls = animate(cylinderAngleMv, targetDeg, {
        duration: 0.68,
        // Curva com aceleração inicial decidida e desaceleração suave de precisão
        ease: [0.24, 0.96, 0.32, 1],
        onComplete: () => {
          cylinderAngleMv.set(targetDeg);
          setRenderAngle(targetDeg);
          setIsRotating(false);
          setRotationDirection(null);
        },
      });

      glowTimeoutRef.current = window.setTimeout(() => {
        setIsRotating(false);
        setRotationDirection(null);
      }, 720);

      return () => controls.stop();
    },
    [cylinderAngleMv, prefersReduced, total]
  );

  // Ao trocar a categoria de filtro, reposiciona no card 0 sem salto brusco
  useEffect(() => {
    cylinderAngleMv.stop();
    virtualStepRef.current = 0;
    setVirtualStep(0);
    cylinderAngleMv.set(0);
    setRenderAngle(0);
    setIsRotating(false);
    setRotationDirection(null);
  }, [selectedTag, cylinderAngleMv]);

  // Quando o usuário retorna de outra aba ou WebView in-app, garante alinhamento exato do card
  useEffect(() => {
    const snapToCurrentCard = () => {
      if (document.visibilityState === 'visible') {
        const exactDeg = total > 1 ? -virtualStepRef.current * (360 / total) : 0;
        cylinderAngleMv.stop();
        cylinderAngleMv.set(exactDeg);
        setRenderAngle(exactDeg);
        setIsRotating(false);
      }
    };
    document.addEventListener('visibilitychange', snapToCurrentCard);
    window.addEventListener('pageshow', snapToCurrentCard);
    return () => {
      document.removeEventListener('visibilitychange', snapToCurrentCard);
      window.removeEventListener('pageshow', snapToCurrentCard);
    };
  }, [cylinderAngleMv, total]);

  // Navegação protegida contra cliques/toques sobrepostos acidentais
  const rotateBySteps = useCallback(
    (delta: number) => {
      if (total <= 1 || delta === 0) return;
      const now = performance.now();
      if (now - lastNavTimestampRef.current < 160) return;
      lastNavTimestampRef.current = now;

      const nextStep = virtualStepRef.current + delta;
      animateToVirtualStep(nextStep, delta > 0 ? 'next' : 'prev');
    },
    [animateToVirtualStep, total]
  );

  const scrollPrev = useCallback(() => {
    rotateBySteps(-1);
  }, [rotateBySteps]);

  const scrollNext = useCallback(() => {
    rotateBySteps(1);
  }, [rotateBySteps]);

  // Seleciona qualquer indicador pelo caminho angular mais curto ao redor do cilindro
  const scrollTo = useCallback(
    (targetIdx: number) => {
      if (total <= 1) return;
      const currentStep = virtualStepRef.current;
      const currentIdx = ((currentStep % total) + total) % total;
      if (targetIdx === currentIdx) {
        // Garante que o card esteja perfeitamente alinhado caso um arraste tenha sido solto
        animateToVirtualStep(currentStep, 'next');
        return;
      }

      let diff = targetIdx - currentIdx;
      if (total > 2) {
        if (diff > total / 2) diff -= total;
        else if (diff < -total / 2) diff += total;
      }

      const now = performance.now();
      if (now - lastNavTimestampRef.current < 120) return;
      lastNavTimestampRef.current = now;

      animateToVirtualStep(currentStep + diff, diff >= 0 ? 'next' : 'prev');
    },
    [animateToVirtualStep, total]
  );

  // Gestos de deslize horizontal (touch & pointer) preservando a rolagem vertical da página
  const gestureRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    startTime: number;
    baseAngle: number;
    lockedAxis: 'x' | 'y' | null;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    baseAngle: 0,
    lockedAxis: null,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (total <= 1 || e.touches.length !== 1) return;
      const touch = e.touches[0];
      gestureRef.current = {
        active: true,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: performance.now(),
        baseAngle: -virtualStepRef.current * stepAngle,
        lockedAxis: null,
      };
    },
    [stepAngle, total]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const g = gestureRef.current;
      if (!g.active || total <= 1 || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const dx = touch.clientX - g.startX;
      const dy = touch.clientY - g.startY;

      if (g.lockedAxis === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        g.lockedAxis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'x' : 'y';
      }

      if (g.lockedAxis === 'y') {
        // Permite rolagem vertical nativa sem interferência
        return;
      }

      if (!prefersReduced) {
        // Feedback tátil suave no cilindro durante o arraste horizontal
        const maxDragDeg = Math.min(stepAngle * 0.36, 32);
        const dragDeg = Math.max(-maxDragDeg, Math.min(maxDragDeg, dx * 0.16));
        cylinderAngleMv.stop();
        cylinderAngleMv.set(g.baseAngle + dragDeg);
      }
    },
    [cylinderAngleMv, prefersReduced, stepAngle, total]
  );

  const finishSwipeGesture = useCallback(
    (endX: number, endY: number) => {
      const g = gestureRef.current;
      if (!g.active) return;
      g.active = false;

      if (total <= 1) return;

      const dx = endX - g.startX;
      const dy = endY - g.startY;
      const dt = Math.max(1, performance.now() - g.startTime);
      const velocityX = Math.abs(dx) / dt; // px/ms

      const isHorizontalSwipe =
        g.lockedAxis === 'x' || (Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) >= 28);
      const passedThreshold = Math.abs(dx) >= 42 || (velocityX > 0.35 && Math.abs(dx) >= 22);

      if (isHorizontalSwipe && passedThreshold) {
        if (dx < 0) {
          // Swipe para a esquerda -> avança para o próximo card
          animateToVirtualStep(virtualStepRef.current + 1, 'next');
        } else {
          // Swipe para a direita -> retorna para o card anterior
          animateToVirtualStep(virtualStepRef.current - 1, 'prev');
        }
      } else {
        // Retorna suavemente para o card atual se o gesto foi curto
        animateToVirtualStep(virtualStepRef.current, 'next');
      }
    },
    [animateToVirtualStep, total]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.changedTouches.length < 1) return;
      const touch = e.changedTouches[0];
      finishSwipeGesture(touch.clientX, touch.clientY);
    },
    [finishSwipeGesture]
  );

  const handleTouchCancel = useCallback(() => {
    if (!gestureRef.current.active) return;
    gestureRef.current.active = false;
    animateToVirtualStep(virtualStepRef.current, 'next');
  }, [animateToVirtualStep]);

  // Suporte a arraste com mouse no desktop
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (total <= 1 || e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a')) return;

      gestureRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now(),
        baseAngle: -virtualStepRef.current * stepAngle,
        lockedAxis: null,
      };
    },
    [stepAngle, total]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const g = gestureRef.current;
      if (!g.active || total <= 1) return;
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;

      if (g.lockedAxis === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        g.lockedAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      }

      if (g.lockedAxis === 'x' && !prefersReduced) {
        const maxDragDeg = Math.min(stepAngle * 0.32, 28);
        const dragDeg = Math.max(-maxDragDeg, Math.min(maxDragDeg, dx * 0.14));
        cylinderAngleMv.stop();
        cylinderAngleMv.set(g.baseAngle + dragDeg);
      }
    },
    [cylinderAngleMv, prefersReduced, stepAngle, total]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!gestureRef.current.active) return;
      finishSwipeGesture(e.clientX, e.clientY);
    },
    [finishSwipeGesture]
  );

  const handleMouseLeave = useCallback(() => {
    if (!gestureRef.current.active) return;
    gestureRef.current.active = false;
    animateToVirtualStep(virtualStepRef.current, 'next');
  }, [animateToVirtualStep]);

  // Suporte a teclado acessível (setas direcionais esquerda/direita, Home e End)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || total <= 1) return;

      const activeElement = document.activeElement;
      const isInput =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'SELECT';

      if (isInput) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollTo(total - 1);
      }
    },
    [scrollPrev, scrollNext, scrollTo, total]
  );

  const geometry = useMemo(
    () =>
      computeCylinderGeometry(
        viewportMetrics.width,
        viewportMetrics.height,
        inApp,
        prefersReduced
      ),
    [viewportMetrics.width, viewportMetrics.height, inApp, prefersReduced]
  );

  return (
    <section
      id="avaliacoes"
      aria-label="Avaliações de Clientes e Prova Social"
      className="section-auto-contain pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 bg-[#050814] relative border-t border-blue-500/15 overflow-hidden"
    >
      {/* Luzes ambiente de fundo azul elétrico e violeta */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/[0.08] blur-[150px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção com Reveal Suave */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: prefersReduced ? 0 : 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-10"
        >
          <div className="section-kicker inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span>SOCIAL PROOF & CLIENTES REAIS</span>
          </div>

          <SplitLines
            as="h2"
            text="O que dizem os clientes que colocaram o site no ar"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
          />

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Depoimentos autênticos de quem confiou na ēloSites para construir sua presença digital com código profissional, performance máxima e foco em conversão.
          </p>

          {/* Destaque de métricas de confiabilidade */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] shadow-sm">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                ))}
              </div>
              <span className="font-semibold text-white">5.0 / 5.0</span>
              <span className="text-slate-400">• Avaliação máxima</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-slate-300">Projetos reais entregues no Netlify</span>
            </div>
          </div>
        </motion.div>

        {/* Filtro por Formato de Serviço */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 px-2">
          {TESTIMONIAL_TAGS.map((tag) => {
            const isTagActive = selectedTag === tag.id;
            const count =
              tag.id === 'all'
                ? CLIENT_TESTIMONIALS.length
                : CLIENT_TESTIMONIALS.filter((t) => {
                    if (tag.id === 'landing') return t.category.toLowerCase().includes('landing');
                    if (tag.id === 'institutional')
                      return t.category.toLowerCase().includes('institucional');
                    return true;
                  }).length;

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.id)}
                className={`relative px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                  isTagActive
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/50 shadow-[0_0_14px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20'
                }`}
                aria-pressed={isTagActive}
              >
                <span>{tag.label}</span>
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            PALCO DO CARROSSEL CILÍNDRICO 3D (CSS 3D + PRESERVE-3D)
           ========================================================================= */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
          className="w-full"
        >
          <div
            ref={carouselContainerRef}
            data-testimonials-carousel
            role="region"
            aria-roledescription="carousel"
            aria-label="Carrossel 3D de Depoimentos"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="relative max-w-6xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-2xl"
          >
            {/* Anúncio acessível do slide ativo para leitores de tela */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {testimonials[selectedIndex]
                ? `Depoimento ${selectedIndex + 1} de ${total}: ${testimonials[selectedIndex].name}, ${testimonials[selectedIndex].companyOrProject}`
                : ''}
            </div>

            {/* Palco 3D com perspectiva calibrada e anéis orbitais do cilindro */}
            <div
              ref={stageRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: `${geometry.perspective}px`,
                perspectiveOrigin: '50% 50%',
              }}
              className="relative w-full py-5 sm:py-8 px-1 sm:px-8 md:px-14 select-none touch-pan-y cursor-grab active:cursor-grabbing overflow-visible"
            >
              {/* Iluminação direcional e brilho cinético azul/violeta durante a rotação do cilindro */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-8 sm:inset-x-20 top-1/2 -translate-y-1/2 h-64 sm:h-72 rounded-full transition-opacity duration-500 ${
                  isRotating ? 'opacity-95' : 'opacity-45'
                }`}
                style={{
                  background:
                    rotationDirection === 'prev'
                      ? 'radial-gradient(ellipse at 38% 50%, rgba(139, 92, 246, 0.24) 0%, rgba(59, 130, 246, 0.18) 42%, rgba(5, 8, 20, 0) 74%)'
                      : 'radial-gradient(ellipse at 62% 50%, rgba(59, 130, 246, 0.24) 0%, rgba(139, 92, 246, 0.18) 42%, rgba(5, 8, 20, 0) 74%)',
                  filter: 'blur(28px)',
                }}
              />

              {/* Anel orbital superior e inferior para reforçar a leitura espacial do cilindro 3D */}
              {total > 1 && !prefersReduced && (
                <>
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 w-[78%] max-w-[680px] h-7 rounded-[100%] border transition-all duration-500 ${
                      isRotating
                        ? 'border-blue-400/35 shadow-[0_0_24px_rgba(59,130,246,0.25)]'
                        : 'border-blue-500/15'
                    }`}
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.02) 60%, transparent 80%)',
                      transform: 'translateX(-50%) rotateX(76deg)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-1/2 bottom-2 -translate-x-1/2 w-[82%] max-w-[720px] h-8 rounded-[100%] border transition-all duration-500 ${
                      isRotating
                        ? 'border-purple-400/40 shadow-[0_0_28px_rgba(139,92,246,0.28)]'
                        : 'border-indigo-500/15'
                    }`}
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 58%, transparent 82%)',
                      transform: 'translateX(-50%) rotateX(76deg)',
                    }}
                  />
                </>
              )}

              {/* Botões laterais de navegação (visíveis em telas médias e grandes, mantendo fácil alcance) */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={scrollPrev}
                    aria-label="Depoimento anterior"
                    title="Depoimento anterior (Seta para a esquerda)"
                    className="hidden md:flex items-center justify-center absolute left-1 lg:left-2 top-1/2 -translate-y-1/2 z-[120] w-11 h-11 rounded-full bg-[#090E23]/90 hover:bg-blue-950/90 text-slate-200 hover:text-white border border-blue-400/35 hover:border-blue-400/80 shadow-[0_8px_24px_rgba(2,6,23,0.85),0_0_16px_rgba(59,130,246,0.22)] hover:shadow-[0_0_24px_rgba(59,130,246,0.48)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    aria-label="Próximo depoimento"
                    title="Próximo depoimento (Seta para a direita)"
                    className="hidden md:flex items-center justify-center absolute right-1 lg:right-2 top-1/2 -translate-y-1/2 z-[120] w-11 h-11 rounded-full bg-[#090E23]/90 hover:bg-blue-950/90 text-slate-200 hover:text-white border border-blue-400/35 hover:border-blue-400/80 shadow-[0_8px_24px_rgba(2,6,23,0.85),0_0_16px_rgba(59,130,246,0.22)] hover:shadow-[0_0_24px_rgba(59,130,246,0.48)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}

              {/* Rotor 3D: todos os cards compartilham a mesma célula central e eixo vertical Y */}
              <div
                style={{
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                }}
                className="relative grid grid-cols-1 place-items-center w-full"
              >
                {testimonials.map((item, idx) => {
                  const isActive = selectedIndex === idx;

                  // Ângulo relativo do painel ao redor do cilindro em [-180°, +180°]
                  const baseCardDeg = idx * stepAngle;
                  const rawDeg = baseCardDeg + renderAngle;
                  const wrappedDeg = ((((rawDeg + 180) % 360) + 360) % 360) - 180;
                  const rad = (wrappedDeg * Math.PI) / 180;

                  // Coordenadas 3D sobre o cilindro compartilhado
                  const sinTheta = total > 1 ? Math.sin(rad) : 0;
                  const cosTheta = total > 1 ? Math.cos(rad) : 1;
                  // Fator de profundidade normalizado: 1.0 na frente (0°), 0.5 nas laterais (±90°), 0.0 atrás (180°)
                  const depthFactor = (cosTheta + 1) * 0.5;

                  const translateX = sinTheta * geometry.orbitRadiusX;
                  // Frente em z = 0 para nitidez 1:1 sem distorção tipográfica
                  const translateZ = (cosTheta - 1) * geometry.orbitRadiusZ;
                  // Inclinação tangencial convexa do painel ao redor do cilindro/globo 3D
                  const panelRotateY = sinTheta * geometry.maxTiltDeg;

                  // Escala e opacidade progressivas conforme a posição no cilindro
                  const scale =
                    cosTheta >= 0
                      ? geometry.sideScale + (1 - geometry.sideScale) * cosTheta
                      : geometry.backScale + (geometry.sideScale - geometry.backScale) * (1 + cosTheta);

                  const opacity =
                    total <= 1
                      ? 1
                      : cosTheta >= 0
                      ? geometry.sideOpacity + (1 - geometry.sideOpacity) * Math.pow(cosTheta, 1.35)
                      : geometry.backOpacity +
                        (geometry.sideOpacity - geometry.backOpacity) * Math.max(0, 1 + cosTheta);

                  const zIndex = Math.round(depthFactor * 100);
                  const isBackFacing = cosTheta < -0.35;

                  return (
                    <div
                      key={item.id}
                      style={{
                        gridArea: '1 / 1 / 2 / 2',
                        width: '100%',
                        maxWidth: `${geometry.cardMaxWidth}px`,
                        transform: prefersReduced
                          ? `translate3d(${Math.round(translateX * 0.35)}px, 0px, 0px) scale(${
                              isActive ? 1 : 0.94
                            })`
                          : `translate3d(${translateX.toFixed(2)}px, 0px, ${translateZ.toFixed(
                              2
                            )}px) rotateY(${panelRotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                        opacity: prefersReduced ? (isActive ? 1 : 0) : Number(opacity.toFixed(3)),
                        zIndex,
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        willChange: 'transform, opacity',
                        pointerEvents: isBackFacing || (prefersReduced && !isActive) ? 'none' : 'auto',
                      }}
                      aria-hidden={!isActive}
                      onFocus={() => {
                        if (!isActive) {
                          scrollTo(idx);
                        }
                      }}
                      className="w-full h-full flex items-stretch justify-center px-1 sm:px-2"
                    >
                      {/* Painel do cilindro 3D */}
                      <article
                        style={{ contain: 'none' }}
                        onClick={() => {
                          if (!isActive) {
                            scrollTo(idx);
                          }
                        }}
                        tabIndex={isActive ? 0 : -1}
                        aria-label={`Depoimento de ${item.name}, ${item.companyOrProject}`}
                        className={`relative w-full rounded-2xl bracket-panel overflow-hidden select-none flex flex-col justify-between h-full transition-[border-color,box-shadow,background-color] duration-300 ${
                          isActive
                            ? isRotating
                              ? 'bg-[#090E23]/95 border border-blue-400/85 shadow-[0_22px_55px_-12px_rgba(2,6,23,0.95),0_0_38px_-4px_rgba(59,130,246,0.52),0_0_22px_-4px_rgba(139,92,246,0.42)] ring-1 ring-purple-400/45 cursor-default'
                              : 'bg-[#090E23]/95 border border-blue-500/65 shadow-[0_20px_50px_-12px_rgba(2,6,23,0.92),0_0_32px_-6px_rgba(59,130,246,0.38),0_0_18px_-6px_rgba(139,92,246,0.25)] ring-1 ring-blue-400/35 cursor-default'
                            : 'bg-[#060A1A]/92 border border-blue-500/25 hover:border-blue-400/50 shadow-[0_14px_34px_-10px_rgba(2,6,23,0.85)] cursor-pointer'
                        }`}
                      >
                        {/* Iluminação especular superior e reflexo direcional azul/violeta no painel ativo */}
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-40'
                          }`}
                          style={{
                            background:
                              'linear-gradient(180deg, rgba(59, 130, 246, 0.16) 0%, rgba(99, 102, 241, 0.06) 48%, rgba(9, 14, 35, 0) 100%)',
                          }}
                        />

                        {/* Filete neon superior e inferior para acabamento de painel cilíndrico */}
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-6 top-0 h-[1px] transition-opacity duration-300 ${
                            isActive ? 'opacity-90' : 'opacity-30'
                          }`}
                          style={{
                            background:
                              'linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.85) 35%, rgba(167, 139, 250, 0.85) 65%, transparent 100%)',
                          }}
                        />
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-10 bottom-0 h-[1px] transition-opacity duration-300 ${
                            isActive ? 'opacity-75' : 'opacity-20'
                          }`}
                          style={{
                            background:
                              'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.7) 50%, transparent 100%)',
                          }}
                        />

                        {/* Sombreamento direcional nos painéis laterais do cilindro para dar profundidade volumétrica */}
                        {!isActive && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
                            style={{
                              background:
                                sinTheta > 0
                                  ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.06) 0%, rgba(5, 8, 20, 0.35) 55%, rgba(2, 6, 23, 0.65) 100%)'
                                  : 'linear-gradient(270deg, rgba(139, 92, 246, 0.06) 0%, rgba(5, 8, 20, 0.35) 55%, rgba(2, 6, 23, 0.65) 100%)',
                            }}
                          />
                        )}

                        {/* Conteúdo do Card com composição equilibrada, espaçamento proporcional e clara separação */}
                        <div className="p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-4 sm:gap-5 relative z-10 h-full">
                          {/* Top Bar do Card: Categoria, Estrelas e Contador */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-white/[0.08]">
                            <div className="flex items-center gap-2">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-400/30 text-blue-300 text-[11px] font-semibold">
                                <ShieldCheck
                                  className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{item.category}</span>
                              </div>

                              {!item.isDraftProposal && (
                                <div className="hidden min-[420px]:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono">
                                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>VERIFICADO</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Estrelas da avaliação */}
                              {item.rating ? (
                                <div
                                  className="flex items-center gap-0.5 text-amber-400"
                                  title={`Classificação ${item.rating} de 5 estrelas`}
                                >
                                  {[...Array(item.rating)].map((_, starIdx) => (
                                    <Star
                                      key={starIdx}
                                      className="w-3.5 h-3.5 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                                      aria-hidden="true"
                                    />
                                  ))}
                                </div>
                              ) : null}

                              {/* Contador de Slides */}
                              <div className="font-mono text-[10px] text-blue-300 px-1.5 py-0.5 rounded bg-slate-900/90 border border-blue-500/20 tabular-nums">
                                0{idx + 1} / 0{total}
                              </div>
                            </div>
                          </div>

                          {/* Corpo da Citação com largura de leitura equilibrada e entrelinha confortável */}
                          <div className="relative flex-1 flex flex-col justify-center py-1 sm:py-1.5">
                            <div className="rounded-xl bg-slate-950/45 border border-blue-500/15 px-4 py-3.5 sm:px-5 sm:py-4 shadow-inner">
                              <div className="flex items-center justify-between mb-2">
                                <Quote
                                  className="w-4 h-4 text-blue-400/50 shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="h-[1px] flex-1 ml-3 bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-transparent" />
                              </div>
                              <blockquote className="text-xs sm:text-[13px] md:text-sm text-slate-100 leading-[1.68] italic border-l-2 border-blue-500/45 pl-3 sm:pl-3.5 max-w-[60ch]">
                                “{item.quote}”
                              </blockquote>
                            </div>
                          </div>

                          {/* Rodapé com Dados do Cliente claramente separados da citação */}
                          <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative shrink-0">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600/35 via-indigo-600/30 to-purple-600/35 border border-blue-400/45 flex items-center justify-center text-blue-200 font-bold font-mono text-xs shadow-inner">
                                  {getInitials(item.name)}
                                </div>
                                {!item.isDraftProposal && (
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1 bg-slate-950 rounded-full"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="font-display text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                                  {item.name}
                                </div>
                                <p className="text-[11px] text-blue-300 font-medium truncate">
                                  {item.role}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {item.companyOrProject}
                                </p>
                              </div>
                            </div>

                            {!item.isDraftProposal && (
                              <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/80 border border-white/[0.06] text-[10px] text-slate-400 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>Cliente Verificado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =========================================================================
                CONTROLES DE NAVEGAÇÃO SINCRONIZADOS: ANTERIOR / INDICADORES / PRÓXIMO
               ========================================================================= */}
            <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center gap-2.5 px-2">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                {total > 1 && (
                  <button
                    type="button"
                    onClick={scrollPrev}
                    aria-label="Girar cilindro para o depoimento anterior"
                    title="Depoimento anterior"
                    className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/85 hover:bg-blue-950/90 text-slate-200 hover:text-white border border-blue-500/25 hover:border-blue-400/60 shadow-[0_0_14px_rgba(59,130,246,0.18)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" aria-hidden="true" />
                  </button>
                )}

                {/* Indicadores dos slides minimalistas com identidade visual roxo/azul ēloSites */}
                <div
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/75 border border-purple-500/20 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.12)]"
                  role="tablist"
                  aria-label="Indicadores dos slides de depoimentos"
                >
                  {testimonials.map((t, idx) => {
                    const isCurrent = selectedIndex === idx;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        aria-label={`Depoimento ${idx + 1} de ${total}: ${t.name}`}
                        title={`Depoimento ${idx + 1} de ${total}: ${t.name}`}
                        onClick={() => scrollTo(idx)}
                        disabled={total <= 1}
                        className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                          total <= 1
                            ? 'w-7 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.7)] cursor-default'
                            : isCurrent
                            ? 'w-7 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.7)] cursor-pointer'
                            : 'w-2.5 bg-slate-700/80 hover:bg-slate-500 hover:border-purple-400/40 cursor-pointer'
                        }`}
                      />
                    );
                  })}
                </div>

                {total > 1 && (
                  <button
                    type="button"
                    onClick={scrollNext}
                    aria-label="Girar cilindro para o próximo depoimento"
                    title="Próximo depoimento"
                    className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/85 hover:bg-blue-950/90 text-slate-200 hover:text-white border border-blue-500/25 hover:border-blue-400/60 shadow-[0_0_14px_rgba(59,130,246,0.18)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Rótulo informativo discreto */}
              {total > 1 && (
                <span className="text-[11px] font-mono text-slate-400 text-center">
                  Gire o cilindro pelas setas, deslize para o lado ou selecione um indicador
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bloco de Ação Rápida no Rodapé dos Testemunhos */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01, margin: '0px 0px 80px 0px' }}
          className="glass-card-interactive surface-card mt-10 p-6 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 border border-white/[0.08] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 max-w-4xl mx-auto shadow-2xl shadow-black/60 bracket-panel"
        >
          <div className="space-y-2 text-left w-full lg:max-w-xl">
            <h4 className="font-display text-base sm:text-lg font-bold text-white">
              Quer um site com essa mesma qualidade para o seu negócio?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fale diretamente com quem vai desenvolver seu site, com prazos claros e condições transparentes.
            </p>
          </div>

          <div className="card-action-cluster flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            {onNavigateToServices && (
              <button
                type="button"
                onClick={onNavigateToServices}
                className="inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.08] transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] cursor-pointer"
              >
                <span className="text-center">Ver Serviços & Condições</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-300" />
              <span className="text-center">Conversar no WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
