import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
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
  Code2,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Folder,
  FileCode,
  Shield,
  Check,
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
import { TypewriterSlogan } from './TypewriterSlogan';

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

  const handleToggleShowcaseExpand = () => {
    setIsShowcaseExpanded((prev) => !prev);
  };

  const handleShowcaseKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsShowcaseExpanded((prev) => !prev);
    }
  };

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
              <BiReveal direction="up" delay={200}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 w-full max-w-xl">
                  {/* Pilar 1 */}
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white text-center">Design sob medida</span>
                    <span className="text-[11px] text-slate-300 font-medium text-center">Identidade própria</span>
                  </div>

                  {/* Pilar 2 */}
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white text-center">Carregamento rápido</span>
                    <span className="text-[11px] text-slate-300 font-medium text-center">Sem lentidão</span>
                  </div>

                  {/* Pilar 3 */}
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Search className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white text-center">Estrutura para indexação</span>
                    <span className="text-[11px] text-slate-300 font-medium text-center">Preparada para o Google</span>
                  </div>

                  {/* Pilar 4 */}
                  <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white text-center">Layout responsivo</span>
                    <span className="text-[11px] text-slate-300 font-medium text-center">Para diferentes telas</span>
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
                    <span>Conhecer projetos reais</span>
                  </button>
                </div>
              </BiReveal>
            </motion.div>

          </div>

          {/* COLUNA DIREITA: Mockup Composto Interativo com abas Preview ao Vivo / Código React e Scroll Cinematográfico */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            <BiReveal direction="right" delay={150}>
              <motion.div
                onClick={handleToggleShowcaseExpand}
                onKeyDown={handleShowcaseKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={isShowcaseExpanded}
                aria-label="Painel interativo do projeto: clique para expandir especificações técnicas"
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
                className="hero-showcase-expandable relative mx-auto max-w-[540px] lg:max-w-none [transform-style:preserve-3d]"
              >
                
                {/* Indicador de Status do Mockup com Abas */}
                <div className="flex items-center justify-between mb-3 px-2">
                  <div
                    className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-blue-500/20 backdrop-blur-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('preview');
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('code');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === 'code'
                          ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Código React
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Build 100% OK</span>
                  </div>
                </div>

                {/* MOCKUP DO LAPTOP 3D */}
                <Interactive3DCard maxTilt={5} animatedBorder={true}>
                  <div className="relative rounded-2xl bg-[#090E23] border border-blue-500/25 p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
                    
                    {/* Moldura da Tela do Laptop */}
                    <div className="rounded-xl overflow-hidden bg-[#030712] border border-white/10 shadow-inner relative min-h-[300px] sm:min-h-[340px]">
                      
                      {/* Topbar do Navegador */}
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-white/[0.08]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        </div>
                        <div className="text-[11px] font-mono text-slate-300 bg-slate-900/80 px-4 py-0.5 rounded-md border border-white/5 flex items-center gap-1.5">
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
                          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_8px_#3b82f6]">
                                ē
                              </div>
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
                          <div className="relative z-10 my-auto py-4 space-y-2.5 max-w-sm">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                              Um site profissional para o seu negócio.
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
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
                          <div className="relative z-10 grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 text-[9px] text-slate-300">
                            <div className="flex items-center justify-center gap-1">
                              <span>Design</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <span>Veloz</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <span>SEO</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <span>Mobile</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative p-4 sm:p-5 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] bg-[#020617] font-mono text-[11px] text-slate-300 overflow-hidden">
                          <div className="space-y-2">
                            <div className="text-slate-500">// Arquitetura limpa com React 19 + TypeScript</div>
                            <div className="text-blue-400">export default function Home() {'{'}</div>
                            <div className="pl-4 text-slate-300">return (</div>
                            <div className="pl-8 text-sky-300">&lt;main className=&quot;hero-section&quot;&gt;</div>
                            <div className="pl-12 text-slate-200">&lt;h1&gt;Seu site, sob medida.&lt;/h1&gt;</div>
                            <div className="pl-12 text-cyan-300">&lt;ConversionEngine focus=&quot;whatsapp&quot; seo={'{'}true{'}'} /&gt;</div>
                            <div className="pl-8 text-sky-300">&lt;/main&gt;</div>
                            <div className="pl-4 text-slate-300">);</div>
                            <div className="text-blue-400">{'}'}</div>
                          </div>
                          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
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

                {/* Barra de indicação de expansão e Conteúdo Técnico Oculto Expansível */}
                <div className="mt-2.5 px-2 flex items-center justify-between text-xs text-blue-300/90 font-medium select-none">
                  <span className="inline-flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {isShowcaseExpanded
                        ? 'Ocultar especificações da arquitetura'
                        : 'Clique para expandir especificações técnicas'}
                    </span>
                  </span>
                  <ArrowDown
                    className={`w-3.5 h-3.5 text-blue-400 transition-transform duration-300 ${
                      isShowcaseExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </div>

                <div
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isShowcaseExpanded
                      ? 'grid-rows-[1fr] opacity-100 mt-3'
                      : 'grid-rows-[0fr] opacity-0 mt-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-xl bg-slate-950/90 border border-blue-500/25 p-3.5 sm:p-4 space-y-2.5 text-left shadow-inner">
                      <div className="flex items-center justify-between border-b border-blue-500/15 pb-2">
                        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                          <span>Padrão de Engenharia ēloSites</span>
                        </span>
                        <span className="text-[10px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/20">
                          Core Web Vitals Ready
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5">
                        <div className="p-2.5 rounded-lg bg-slate-900/70 border border-blue-500/15">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Performance</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            Imagens AVIF/WebP e carregamento otimizado sem travamentos.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-900/70 border border-blue-500/15">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>SEO Técnico</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            Dados estruturados Schema.org, Open Graph e Sitemap XML.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-900/70 border border-blue-500/15">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Conversão</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            Integração direta com WhatsApp e navegação mobile-first.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </BiReveal>
          </div>

        </div>

        {/* BANNER DESLIZANTE DOS NICHOS */}
        <div className="mt-14 pt-8 border-t border-blue-500/15 scroll-fade-card">
          <div className="text-center mb-5 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:scale-102 active:scale-98 uppercase">
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

