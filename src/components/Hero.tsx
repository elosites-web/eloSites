import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { shouldReduceMedia, getMotionTier } from '../mediaPrefs';
import {
  Monitor,
  Zap,
  Search,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Scissors,
  Dumbbell,
  HeartPulse,
  Gem,
  Apple,
  Brain,
  PenTool,
  ShieldCheck,
  SprayCan,
  Compass,
  GraduationCap,
  Scale,
  Car,
  Stethoscope,
  Activity,
} from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';
import { InfiniteMarquee } from './InfiniteMarquee';
import { BiReveal } from './BiReveal';
import { useReveal } from './Reveal';
import { TypewriterSlogan } from './TypewriterSlogan';

interface HeroCodeLine {
  text: string;
  className: string;
}

interface HeroCodeTypingStep {
  lineIdx: number;
  charLen: number;
  timeOffsetMs: number;
}

const HERO_CODE_LINES: HeroCodeLine[] = [
  { text: '// Arquitetura limpa com React 19 + TypeScript', className: 'text-slate-500' },
  { text: 'export default function Home() {', className: 'text-blue-400' },
  { text: 'return (', className: 'pl-4 text-slate-300' },
  { text: '<main className="hero-section">', className: 'pl-8 text-sky-300' },
  { text: '<h1>Seu site, sob medida.</h1>', className: 'pl-12 text-slate-200' },
  { text: '<ConversionEngine focus="whatsapp" seo={true} />', className: 'pl-12 text-cyan-300' },
  { text: '</main>', className: 'pl-8 text-sky-300' },
  { text: ');', className: 'pl-4 text-slate-300' },
  { text: '}', className: 'text-blue-400' },
];

const HERO_CODE_STEPS: HeroCodeTypingStep[] = (() => {
  const steps: HeroCodeTypingStep[] = [];
  let cumulativeMs = 0;

  for (let lIdx = 0; lIdx < HERO_CODE_LINES.length; lIdx++) {
    const lineText = HERO_CODE_LINES[lIdx].text;
    for (let cLen = 1; cLen <= lineText.length; cLen++) {
      if (lIdx === 0 && cLen === 1) {
        cumulativeMs += 14;
      } else if (cLen === 1) {
        cumulativeMs += 48;
      } else {
        cumulativeMs += 15;
      }
      steps.push({
        lineIdx: lIdx,
        charLen: cLen,
        timeOffsetMs: cumulativeMs,
      });
    }
  }

  return steps;
})();

interface HeroInicioSectionProps {
  mode: 'inicio' | 'all';
  onNavigateToPortfolio?: () => void;
  heroWhatsappUrl: string;
  isReduced: boolean;
  motionTier: string;
}

const HeroInicioSection: React.FC<HeroInicioSectionProps> = ({
  mode,
  onNavigateToPortfolio,
  heroWhatsappUrl,
  isReduced,
  motionTier,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isShowcaseExpanded, setIsShowcaseExpanded] = useState<boolean>(false);
  const [isPillarsExpanded, setIsPillarsExpanded] = useState<boolean>(false);
  const mockupCardReveal = useReveal<HTMLDivElement>({ once: true });
  const codeLineTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const codeLineGhostRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const codeCursorRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleToggleShowcaseExpand = () => {
    setIsShowcaseExpanded((prev) => !prev);
  };

  const handleTogglePillarsExpand = () => {
    setIsPillarsExpanded((prev) => !prev);
  };

  const handlePillarsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPillarsExpanded((prev) => !prev);
    }
  };

  const showcaseSummaryVariants: Variants = {
    hidden: {
      opacity: 0,
      transition: {
        ease: 'easeOut',
        duration: isReduced ? 0 : 0.15,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        ease: 'easeOut',
        duration: isReduced ? 0 : 0.2,
      },
    },
  };

  useEffect(() => {
    if (activeTab !== 'code') return;

    const lastLineIndex = HERO_CODE_LINES.length - 1;

    if (isReduced) {
      for (let i = 0; i < HERO_CODE_LINES.length; i++) {
        const textEl = codeLineTextRefs.current[i];
        const ghostEl = codeLineGhostRefs.current[i];
        const cursorEl = codeCursorRefs.current[i];
        if (textEl) textEl.textContent = HERO_CODE_LINES[i].text;
        if (ghostEl) ghostEl.textContent = '';
        if (cursorEl) {
          cursorEl.style.display = i === lastLineIndex ? 'inline-block' : 'none';
          cursorEl.classList.remove('animate-typewriter-cursor');
          cursorEl.classList.add('animate-pulse');
        }
      }
      return;
    }

    for (let i = 0; i < HERO_CODE_LINES.length; i++) {
      const textEl = codeLineTextRefs.current[i];
      const ghostEl = codeLineGhostRefs.current[i];
      const cursorEl = codeCursorRefs.current[i];
      if (textEl) textEl.textContent = '';
      if (ghostEl) ghostEl.textContent = HERO_CODE_LINES[i].text;
      if (cursorEl) {
        cursorEl.style.display = i === 0 ? 'inline-block' : 'none';
        cursorEl.classList.remove('animate-pulse');
        cursorEl.classList.add('animate-typewriter-cursor');
      }
    }

    let rafId = 0;
    let startTime: number | null = null;
    let lastAppliedStep = -1;
    let activeCursorLine = 0;

    const tick = (now: number) => {
      if (startTime === null) {
        startTime = now + 80;
      }

      const elapsed = now - startTime;
      if (elapsed < 0) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      let targetStep = -1;
      for (let i = lastAppliedStep + 1; i < HERO_CODE_STEPS.length; i++) {
        if (HERO_CODE_STEPS[i].timeOffsetMs <= elapsed) {
          targetStep = i;
        } else {
          break;
        }
      }

      if (targetStep > lastAppliedStep) {
        for (let s = lastAppliedStep + 1; s <= targetStep; s++) {
          const step = HERO_CODE_STEPS[s];
          const fullText = HERO_CODE_LINES[step.lineIdx].text;
          const textEl = codeLineTextRefs.current[step.lineIdx];
          const ghostEl = codeLineGhostRefs.current[step.lineIdx];

          if (textEl) {
            textEl.textContent = fullText.slice(0, step.charLen);
          }
          if (ghostEl) {
            ghostEl.textContent = fullText.slice(step.charLen);
          }

          if (step.lineIdx !== activeCursorLine) {
            const prevCursor = codeCursorRefs.current[activeCursorLine];
            if (prevCursor) prevCursor.style.display = 'none';
            const nextCursor = codeCursorRefs.current[step.lineIdx];
            if (nextCursor) nextCursor.style.display = 'inline-block';
            activeCursorLine = step.lineIdx;
          }
        }
        lastAppliedStep = targetStep;
      }

      if (lastAppliedStep >= HERO_CODE_STEPS.length - 1) {
        const finalCursor = codeCursorRefs.current[lastLineIndex];
        if (finalCursor) {
          finalCursor.style.display = 'inline-block';
          finalCursor.classList.remove('animate-typewriter-cursor');
          finalCursor.classList.add('animate-pulse');
        }
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [activeTab, isReduced]);

  const handleScrollToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToPortfolio) {
      onNavigateToPortfolio();
    } else {
      const portfolio = document.querySelector('#portfolio');
      if (portfolio) {
        portfolio.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Referência do container do Hero institucional para animações controladas por scroll
  const heroInicioRef = useRef<HTMLElement>(null);

  // Scroll progressivo contínuo e bidirecional vinculado ao Hero
  const { scrollYProgress } = useScroll({
    target: heroInicioRef,
    offset: ['start start', 'end start'],
  });

  // Mola inercial suave para amortecimento orgânico estilo cinematográfico
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  const isFullMotion = !isReduced && motionTier === 'full';
  const isLiteMotion = !isReduced && motionTier === 'lite';

  // 1. Orbes e iluminação de fundo (Parallax sutil em velocidade diferente)
  const radialBgY = useTransform(
    smoothProgress,
    [0, 1],
    isFullMotion ? [0, 24] : [0, 0]
  );
  const orb1Y = useTransform(
    smoothProgress,
    [0, 1],
    isFullMotion ? [0, 60] : isLiteMotion ? [0, 24] : [0, 0]
  );
  const orb2Y = useTransform(
    smoothProgress,
    [0, 1],
    isFullMotion ? [0, 42] : isLiteMotion ? [0, 18] : [0, 0]
  );

  // 2. Coluna esquerda (Headline, Pilares e CTAs com movimentação progressiva coordenada)
  const headlineY = useTransform(
    smoothProgress,
    [0, 0.7, 1],
    isFullMotion ? [0, -28, -48] : isLiteMotion ? [0, -14, -24] : [0, 0, 0]
  );
  const headlineOpacity = useTransform(
    smoothProgress,
    [0, 0.65, 1],
    isFullMotion ? [1, 0.95, 0.4] : isLiteMotion ? [1, 0.95, 0.55] : [1, 1, 1]
  );

  const pillarsY = useTransform(
    smoothProgress,
    [0, 0.7, 1],
    isFullMotion ? [0, -18, -32] : isLiteMotion ? [0, -8, -14] : [0, 0, 0]
  );
  const pillarsOpacity = useTransform(
    smoothProgress,
    [0, 0.7, 1],
    isFullMotion ? [1, 0.95, 0.5] : isLiteMotion ? [1, 0.95, 0.65] : [1, 1, 1]
  );

  const ctaY = useTransform(
    smoothProgress,
    [0, 0.7, 1],
    isFullMotion ? [0, -10, -18] : isLiteMotion ? [0, -4, -8] : [0, 0, 0]
  );
  const ctaOpacity = useTransform(
    smoothProgress,
    [0, 0.75, 1],
    isFullMotion ? [1, 0.95, 0.65] : isLiteMotion ? [1, 0.95, 0.75] : [1, 1, 1]
  );

  // 3. Coluna direita: Mockup do Laptop 3D (Aproximação de escala discreta e inclinação suave)
  const laptopY = useTransform(
    smoothProgress,
    [0, 0.7, 1],
    isFullMotion ? [0, 32, 54] : isLiteMotion ? [0, 16, 26] : [0, 0, 0]
  );
  const laptopScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    isFullMotion ? [1, 1.026, 1.01] : isLiteMotion ? [1, 1.014, 1] : [1, 1, 1]
  );
  const laptopRotateX = useTransform(
    smoothProgress,
    [0, 0.6, 1],
    isFullMotion ? [0, 2.6, 4.0] : [0, 0, 0]
  );
  const laptopOpacity = useTransform(
    smoothProgress,
    [0, 0.8, 1],
    isFullMotion ? [1, 0.96, 0.65] : isLiteMotion ? [1, 0.96, 0.75] : [1, 1, 1]
  );

  return (
    <section
      id="inicio"
      ref={heroInicioRef}
      className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 overflow-hidden"
    >
      {/* Fundo técnico com gradiente e luzes volumétricas azuis da og-image.png com parallax sutil */}
      <motion.div
        style={isReduced ? undefined : { y: radialBgY }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.22),rgba(5,8,20,0))] pointer-events-none"
      />
      <motion.div
        style={isReduced ? undefined : { y: orb1Y }}
        className="absolute top-1/4 right-10 w-[500px] h-[400px] bg-blue-600/12 blur-[140px] rounded-full pointer-events-none"
      />
      <motion.div
        style={isReduced ? undefined : { y: orb2Y }}
        className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* COLUNA ESQUERDA: Tipografia de Impacto da og-image.png com BiReveal e Scroll Cinematográfico */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-7">
            
            {/* Brand Wordmark & Tagline Kicker + Headline Oficial */}
            <motion.div
              style={isReduced ? undefined : { y: headlineY, opacity: headlineOpacity }}
              className="flex flex-col items-center lg:items-start space-y-6 sm:space-y-7 w-full"
            >
              {/* Brand Wordmark & Tagline Kicker */}
              <BiReveal direction="left" delay={50}>
                <div className="floating-badge inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/25 shadow-[0_0_20px_-4px_rgba(59,130,246,0.3)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-blue-200">
                    ēloSites | Estúdio de Desenvolvimento Web
                  </span>
                </div>
              </BiReveal>

              {/* Headline Oficial com efeito Typewriter dinâmico */}
              <BiReveal direction="left" delay={120}>
                <TypewriterSlogan mode={mode} />
              </BiReveal>
            </motion.div>

            {/* 4 Pilares da ēloSites com deslocamento coordenado */}
            <motion.div
              style={isReduced ? undefined : { y: pillarsY, opacity: pillarsOpacity }}
              className="w-full flex flex-col items-center lg:items-start"
            >
              <BiReveal direction="up" delay={200} className="w-full max-w-xl">
                <div
                  onClick={handleTogglePillarsExpand}
                  onKeyDown={handlePillarsKeyDown}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isPillarsExpanded}
                  aria-label="Pilares do seu site: clique para ler a explicação simples"
                  className="hero-pillars-grid animate-in fade-in zoom-in-95 duration-500 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-2 w-full max-w-xl items-stretch cursor-pointer select-none"
                >
                  {/* Pilar 1 */}
                  <div className="hero-pillar-card flex flex-col items-center justify-between text-center p-3 sm:p-3.5 rounded-xl bg-[#0b1229] border border-blue-500/20 shadow-sm group hover:border-blue-400/40 transition-colors h-full min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 w-full gap-0.5">
                      <span className="hero-pillar-title text-[11.5px] sm:text-xs font-semibold text-white text-center leading-tight text-balance w-full">
                        Design sob medida
                      </span>
                      <span className="hero-pillar-subtitle text-[10.5px] sm:text-[11px] text-slate-300 font-medium text-center leading-snug text-balance w-full">
                        Identidade própria
                      </span>
                    </div>
                  </div>

                  {/* Pilar 2 */}
                  <div className="hero-pillar-card flex flex-col items-center justify-between text-center p-3 sm:p-3.5 rounded-xl bg-[#0b1229] border border-blue-500/20 shadow-sm group hover:border-blue-400/40 transition-colors h-full min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 w-full gap-0.5">
                      <span className="hero-pillar-title text-[11.5px] sm:text-xs font-semibold text-white text-center leading-tight text-balance w-full">
                        Carregamento rápido
                      </span>
                      <span className="hero-pillar-subtitle text-[10.5px] sm:text-[11px] text-slate-300 font-medium text-center leading-snug text-balance w-full">
                        Sem lentidão
                      </span>
                    </div>
                  </div>

                  {/* Pilar 3 */}
                  <div className="hero-pillar-card flex flex-col items-center justify-between text-center p-3 sm:p-3.5 rounded-xl bg-[#0b1229] border border-blue-500/20 shadow-sm group hover:border-blue-400/40 transition-colors h-full min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Search className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 w-full gap-0.5">
                      <span className="hero-pillar-title text-[11.5px] sm:text-xs font-semibold text-white text-center leading-tight text-balance w-full">
                        Estrutura
                      </span>
                      <span className="hero-pillar-subtitle text-[10.5px] sm:text-[11px] text-slate-300 font-medium text-center leading-snug text-balance w-full">
                        Preparada para o Google
                      </span>
                    </div>
                  </div>

                  {/* Pilar 4 */}
                  <div className="hero-pillar-card flex flex-col items-center justify-between text-center p-3 sm:p-3.5 rounded-xl bg-[#0b1229] border border-blue-500/20 shadow-sm group hover:border-blue-400/40 transition-colors h-full min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 w-full gap-0.5">
                      <span className="hero-pillar-title text-[11.5px] sm:text-xs font-semibold text-white text-center leading-tight text-balance w-full">
                        Layout responsivo
                      </span>
                      <span className="hero-pillar-subtitle text-[10.5px] sm:text-[11px] text-slate-300 font-medium text-center leading-snug text-balance w-full">
                        Para diferentes telas
                      </span>
                    </div>
                  </div>

                  {/* Contêiner expansível com parágrafo em linguagem simples para leigos (oculto por padrão) */}
                  <div
                    aria-hidden={!isPillarsExpanded}
                    className={`col-span-2 sm:col-span-4 grid transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      isPillarsExpanded
                        ? 'grid-rows-[1fr] opacity-100 pt-1'
                        : 'grid-rows-[0fr] opacity-0 pt-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="hero-pillars-expanded-text rounded-xl bg-[#0b1229] border border-blue-500/20 px-3.5 py-3 text-xs sm:text-[13px] text-slate-200 leading-relaxed text-justify [text-align-last:left] hyphens-auto">
                        Em palavras simples: criamos um site com a cara da sua empresa, que abre rápido sem travar, tem conteúdo organizado para facilitar a leitura pelo Google e funciona bem tanto no celular quanto no computador.
                      </p>
                    </div>
                  </div>
                </div>
              </BiReveal>
            </motion.div>

            {/* Botões de Ação com Micro-interações e estabilização de scroll */}
            <motion.div
              style={isReduced ? undefined : { y: ctaY, opacity: ctaOpacity }}
              className="w-full flex flex-col items-center lg:items-start"
            >
              <BiReveal direction="up" delay={300}>
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
                  <a
                    href={heroWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-primary w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white inline-flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(37,99,235,0.45)] hover:shadow-[0_0_36px_rgba(59,130,246,0.65)] cursor-pointer group text-sm sm:text-base"
                  >
                    <span>Solicitar orçamento</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>

                  <button
                    type="button"
                    onClick={handleScrollToPortfolio}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-blue-400/40 text-slate-200 hover:text-white transition-all text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Ver projetos reais</span>
                  </button>
                </div>
              </BiReveal>
            </motion.div>

          </div>

          {/* COLUNA DIREITA: Mockup Composto Interativo com abas Preview ao Vivo / Código React e Scroll Cinematográfico */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            <BiReveal direction="right" delay={150}>
              <motion.div
                style={
                  isReduced
                    ? undefined
                    : {
                        y: laptopY,
                        scale: laptopScale,
                        rotateX: laptopRotateX,
                        transformPerspective: 1200,
                        opacity: laptopOpacity,
                      }
                }
                className="relative mx-auto max-w-[540px] lg:max-w-none [transform-style:preserve-3d] rounded-2xl transition-all duration-300"
              >
                
                {/* Indicador de Status do Mockup com Abas */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="flex items-center justify-between mb-3 px-2"
                >
                  <div
                    className="glow-border-animated inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-blue-500/20 backdrop-blur-md"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'preview'
                          ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Preview ao Vivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('code')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'code'
                          ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Código React
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2 sm:px-2.5 py-1 rounded-lg shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-center font-mono font-medium leading-tight">
                      Build <br className="lg:hidden" />100% OK
                    </span>
                  </div>
                </motion.div>

                {/* MOCKUP DO LAPTOP 3D */}
                <Interactive3DCard maxTilt={5} animatedBorder={true}>
                  <div
                    ref={mockupCardReveal.ref}
                    className={`reveal ${mockupCardReveal.visible ? 'is-visible' : ''} scroll-fade-card relative rounded-2xl bg-[#090E23] border border-blue-500/25 p-2 shadow-2xl shadow-black/80 backdrop-blur-xl`}
                  >
                    
                    {/* Moldura da Tela do Laptop */}
                    <div className="rounded-xl overflow-hidden bg-[#030712] border border-white/10 shadow-inner relative min-h-[300px] sm:min-h-[340px]">
                      
                      {/* Topbar do Navegador */}
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-white/[0.08]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        </div>
                        <div className="scroll-fade-text text-[11px] font-mono text-slate-300 bg-slate-900/80 px-4 py-0.5 rounded-md border border-white/5 flex items-center gap-1.5">
                          <span className="text-emerald-400">🔒</span>
                          <span>https://elosites.ia.br</span>
                        </div>
                        <div className="w-10" />
                      </div>

                      {/* Conteúdo da Tela Alternável */}
                      {activeTab === 'preview' ? (
                        <div className="relative p-4 sm:p-6 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] bg-gradient-to-br from-[#050814] via-[#090E23] to-[#0D1535] overflow-hidden">
                          {/* Efeito de onda azul cobalto */}
                          <div className="absolute inset-0 opacity-40 pointer-events-none">
                            <svg
                              className="w-full h-full object-cover"
                              viewBox="0 0 500 300"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M-50,220 C100,280 200,120 350,180 C450,220 500,150 550,190 L550,320 L-50,320 Z"
                                fill="url(#blueWave)"
                                opacity="0.8"
                              />
                              <path
                                d="M-50,180 C80,100 240,240 380,140 C480,80 520,160 550,120 L550,320 L-50,320 Z"
                                fill="url(#indigoWave)"
                                opacity="0.5"
                              />
                              <defs>
                                <linearGradient id="blueWave" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#1d4ed8" />
                                </linearGradient>
                                <linearGradient id="indigoWave" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#6366f1" />
                                  <stop offset="100%" stopColor="#7c3aed" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>

                          {/* Mini Barra de Navegação Interna da Tela */}
                          <div className="scroll-fade-text relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-1.5">
                              <img
                                src="/favicon-32x32.png"
                                alt="Ícone ēloSites"
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full object-contain shrink-0 shadow-[0_0_8px_#3b82f6]"
                              />
                              <span className="font-bold text-xs tracking-tight text-white">ēloSites</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-[10px] text-slate-300 font-medium">
                              <span className="text-blue-400 font-semibold">Sobre</span>
                              <span>Serviços</span>
                              <span>Projetos</span>
                              <span>Contato</span>
                            </div>
                          </div>

                          {/* Conteúdo Central da Tela */}
                          <div className="scroll-fade-text relative z-10 my-auto py-4 space-y-2.5 max-w-sm lg:max-w-none">
                            <h2 className="scroll-fade-text text-xl sm:text-2xl lg:text-[clamp(1.05rem,1.6vw,1.375rem)] lg:whitespace-nowrap font-extrabold text-white leading-tight">
                              Um site profissional para o seu negócio.
                            </h2>
                            <p className="scroll-fade-text text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-md">
                              Apresente seus serviços com clareza, transmita confiança e receba novos contatos direto no seu WhatsApp.
                            </p>
                            <div className="pt-1">
                              <a
                                href={heroWhatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold shadow-md shadow-blue-950/50 cursor-pointer"
                              >
                                <span>Solicitar orçamento</span>
                              </a>
                            </div>
                          </div>

                          {/* Mini Indicador de Pilares na Tela */}
                          <div className="scroll-fade-text relative z-10 grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 text-slate-300">
                            <div className="flex items-center justify-center text-center py-1 px-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                              <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-slate-200 tracking-wider uppercase text-center">
                                Design
                              </span>
                            </div>
                            <div className="flex items-center justify-center text-center py-1 px-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                              <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-slate-200 tracking-wider uppercase text-center">
                                Veloz
                              </span>
                            </div>
                            <div className="flex items-center justify-center text-center py-1 px-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                              <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-slate-200 tracking-wider uppercase text-center">
                                SEO
                              </span>
                            </div>
                            <div className="flex items-center justify-center text-center py-1 px-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                              <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-slate-200 tracking-wider uppercase text-center">
                                Mobile
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative p-4 sm:p-5 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] bg-[#020617] font-mono text-[11px] text-slate-300 overflow-hidden">
                          <div className="scroll-fade-text space-y-2" aria-label={HERO_CODE_LINES.map((l) => l.text).join('\n')}>
                            {HERO_CODE_LINES.map((line, idx) => (
                              <div key={idx} className={line.className}>
                                <span
                                  ref={(el) => {
                                    codeLineTextRefs.current[idx] = el;
                                  }}
                                >
                                  {isReduced ? line.text : ''}
                                </span>
                                <span
                                  ref={(el) => {
                                    codeCursorRefs.current[idx] = el;
                                  }}
                                  aria-hidden="true"
                                  style={{
                                    display:
                                      isReduced && idx === HERO_CODE_LINES.length - 1
                                        ? 'inline-block'
                                        : !isReduced && idx === 0
                                          ? 'inline-block'
                                          : 'none',
                                  }}
                                  className="w-[6px] h-[13px] ml-[1px] align-middle bg-blue-400 rounded-[1px] shadow-[0_0_8px_rgba(96,165,250,0.85)] animate-typewriter-cursor"
                                />
                                <span
                                  ref={(el) => {
                                    codeLineGhostRefs.current[idx] = el;
                                  }}
                                  aria-hidden="true"
                                  className="opacity-0 select-none pointer-events-none"
                                >
                                  {isReduced ? '' : line.text}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="scroll-fade-text pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="text-emerald-400">✓ 0 erros de sintaxe</span>
                            <span>TypeScript 5.6 • Vite 6</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Base do Laptop (Entalhe e teclado escuro com luz sutil) */}
                    <div className="h-3 w-full bg-slate-900/90 rounded-b-xl border-t border-white/10 flex items-center justify-center">
                      <div className="w-16 h-1 bg-slate-700/60 rounded-full" />
                    </div>
                  </div>
                </Interactive3DCard>

                {/* Botão semântico de expansão e Conteúdo Oculto em linguagem simples e acessível */}
                <button
                  type="button"
                  onClick={handleToggleShowcaseExpand}
                  aria-expanded={isShowcaseExpanded}
                  aria-controls="hero-showcase-summary"
                  className="mt-2.5 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#3b82f6] hover:from-[#9333ea] hover:via-[#4f46e5] hover:to-[#2563eb] border border-white/20 hover:border-white/35 flex items-center justify-between text-xs sm:text-[13px] text-white font-semibold select-none cursor-pointer shadow-[0_0_20px_rgba(129,140,248,0.35)] hover:shadow-[0_0_28px_rgba(168,85,247,0.5)] transition-all active:scale-[0.99] touch-manipulation"
                >
                  <span className="inline-flex items-center gap-2 text-left">
                    <Sparkles className="w-3.5 h-3.5 text-white shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" aria-hidden="true" />
                    <span>
                      {isShowcaseExpanded
                        ? 'Ocultar resumo dos benefícios práticos'
                        : 'Clique e veja como um site ajuda o seu negócio'}
                    </span>
                  </span>
                  <ArrowDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 text-white shrink-0 transition-transform duration-200 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)] ${
                      isShowcaseExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <motion.div
                  id="hero-showcase-summary"
                  aria-hidden={!isShowcaseExpanded}
                  initial="hidden"
                  animate={isShowcaseExpanded ? 'visible' : 'hidden'}
                  variants={showcaseSummaryVariants}
                  className={`grid transition-[grid-template-rows,margin] duration-200 ease-out will-change-[grid-template-rows] ${
                    isShowcaseExpanded
                      ? 'grid-rows-[1fr] mt-2.5'
                      : 'grid-rows-[0fr] mt-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden min-h-0 p-1">
                    <div className="bracket-panel relative rounded-2xl bg-slate-950/95 border border-blue-400/40 hover:border-blue-400/60 p-3.5 sm:p-4 space-y-2.5 text-left shadow-[0_0_24px_rgba(37,99,235,0.18),inset_0_1px_0_0_rgba(147,197,253,0.25)] transition-[border-color,box-shadow] duration-300">
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-2 sm:gap-1.5 border-b border-blue-500/20 pb-2">
                        <span className="text-xs sm:text-[13px] font-semibold text-white flex items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left tracking-tight">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-center sm:text-left font-sans">O que o seu negócio ganha na prática</span>
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-mono font-medium text-blue-300 bg-blue-950/70 px-2.5 py-0.5 rounded-md border border-blue-500/30 text-center tracking-wide shrink-0">
                          Simples e direto
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed">
                        Você não precisa entender de programação nem se preocupar com configurações complicadas: nós cuidamos de toda a parte técnica para entregar seu site pronto para receber clientes.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5">
                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-blue-500/20 hover:border-blue-400/40 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Preparado para o Google</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            Conteúdo organizado para facilitar a compreensão das informações pelos mecanismos de busca.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-blue-500/20 hover:border-blue-400/40 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Bom no celular</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            Abre rápido e fica fácil de ler tanto no celular quanto no computador, sem travar.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-blue-500/20 hover:border-blue-400/40 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Direto no WhatsApp</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            O cliente conhece o seu trabalho e já chama você no WhatsApp com apenas um clique.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </BiReveal>
          </div>

        </div>

        {/* BANNER DESLIZANTE DOS NICHOS */}
        <div className="mt-14 pt-8 border-t border-blue-500/15 scroll-fade-card">
          <div className="text-center mb-5 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 shadow-sm uppercase select-none cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <span>Sites sob medida para o seu negócio</span>
              <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>

          <InfiniteMarquee
            items={[
              { text: 'Barbearias & Barbeiros', icon: <Scissors className="w-3.5 h-3.5 text-cyan-400" />, badge: 'Agendamentos' },
              { text: 'Salões de Beleza & Cabeleireiros', icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />, badge: 'Estética' },
              { text: 'Personal Trainers & Consultoria Fitness', icon: <Dumbbell className="w-3.5 h-3.5 text-indigo-400" />, badge: 'Treinos' },
              { text: 'Clínicas de Estética & Biomédicas', icon: <HeartPulse className="w-3.5 h-3.5 text-rose-400" />, badge: 'Procedimentos' },
              { text: 'Funilaria, Pintura & Estética Automotiva', icon: <Car className="w-3.5 h-3.5 text-sky-400" />, badge: 'Automotivo' },
              { text: 'Manicures & Nail Designers', icon: <Gem className="w-3.5 h-3.5 text-fuchsia-400" />, badge: 'Serviços' },
              { text: 'Nutricionistas & Saúde Integrativa', icon: <Apple className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Consultas' },
              { text: 'Terapeutas, Psicólogos & Saúde Mental', icon: <Brain className="w-3.5 h-3.5 text-violet-400" />, badge: 'Atendimento' },
              { text: 'Estúdios de Tatuagem & Piercing', icon: <PenTool className="w-3.5 h-3.5 text-cyan-400" />, badge: 'Galeria' },
              { text: 'Segurança & Portaria Privada', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />, badge: 'Corporativo' },
              { text: 'Empresas de Limpeza & Conservação', icon: <SprayCan className="w-3.5 h-3.5 text-teal-400" />, badge: 'Serviços' },
              { text: 'Arquitetura & Design de Interiores', icon: <Compass className="w-3.5 h-3.5 text-cyan-400" />, badge: 'Portfólio' },
              { text: 'Professores & Aulas Particulares', icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />, badge: 'Cursos' },
              { text: 'Advogados & Escritórios de Advocacia', icon: <Scale className="w-3.5 h-3.5 text-blue-300" />, badge: 'Atendimento' },
              { text: 'Clínicas Médicas & Odontológicas', icon: <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Saúde' },
              { text: 'Fisioterapia & Reabilitação', icon: <Activity className="w-3.5 h-3.5 text-teal-300" />, badge: 'Bem-Estar' },
            ]}
            speed={70}
            ariaLabel="Banner deslizante dos nichos atendidos pela ēloSites"
          />
        </div>

      </div>
    </section>
  );
};

interface HeroProps {
  mode?: 'inicio' | 'all';
  onNavigateToPortfolio?: () => void;
  isMenuOpen?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  mode = 'inicio',
  onNavigateToPortfolio,
  isMenuOpen = false,
}) => {
  const heroWhatsappUrl = whatsappUrl(SITE_CONFIG.heroWhatsappMessage);

  const systemPrefersReduced = useReducedMotion();
  const motionTier = getMotionTier();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia() || motionTier === 'none');

  return (
    <div className="w-full bg-transparent">
      <HeroInicioSection
        mode={mode}
        onNavigateToPortfolio={onNavigateToPortfolio}
        heroWhatsappUrl={heroWhatsappUrl}
        isReduced={isReduced}
        motionTier={motionTier}
      />
    </div>
  );
};

