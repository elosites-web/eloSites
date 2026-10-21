import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
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
import { FluidRippleBackground } from './FluidRippleBackground';
import { TypewriterSlogan } from './TypewriterSlogan';

interface HeroProps {
  mode?: 'home' | 'inicio' | 'all';
  onNavigateToPortfolio?: () => void;
  isMenuOpen?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  mode = 'all',
  onNavigateToPortfolio,
  isMenuOpen = false,
}) => {
  const heroWhatsappUrl = whatsappUrl(SITE_CONFIG.heroWhatsappMessage);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

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

  const systemPrefersReduced = useReducedMotion();
  const motionTier = getMotionTier();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia() || motionTier === 'none');
  const heavyMotion = !isReduced && motionTier === 'full';

  // Efeito de flutuação sutil da logo na Home
  const [counterDrift, setCounterDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!heavyMotion) return;

    let rafId = 0;
    let pending = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(() => {
        pending = false;
        const { innerWidth, innerHeight } = window;
        const normX = (lastX / innerWidth - 0.5) * 2;
        const normY = (lastY / innerHeight - 0.5) * 2;
        const nextX = normX * 6;
        const nextY = normY * 5;
        setCounterDrift((prev) =>
          Math.abs(prev.x - nextX) < 0.1 && Math.abs(prev.y - nextY) < 0.1
            ? prev
            : { x: nextX, y: nextY }
        );
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [heavyMotion]);

  return (
    <div className="w-full bg-[#050814]">
      {/* 1. TELA HOME: Apenas a logo flutuante da ēloSites centralizada sobre o fundo de espaço-tempo com grade azul distorcida */}
      {(mode === 'home' || mode === 'all') && (
        <section
          id="home"
          className="hero-home-viewport min-h-[320px] sm:min-h-[460px] md:min-h-[560px] h-[100dvh] w-full flex flex-col items-center justify-center relative select-none px-4 overflow-hidden pointer-events-none"
        >
          {/* Fundo de grade azul de espaço-tempo com distorção contínua (exatamente igual ao fundo do menu aberto) */}
          <FluidRippleBackground variant="contained" className="absolute inset-0 z-0 opacity-75 pointer-events-none" />

          {/* Halos luminosos elétricos inspirados na og-image.png */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[250px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

          <AnimatePresence>
            {!isMenuOpen && (
              <motion.div
                key="hero-main-floating-logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  heavyMotion
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: [-8 + counterDrift.y, 8 + counterDrift.y, -8 + counterDrift.y],
                        x: [4 + counterDrift.x, -4 + counterDrift.x, 4 + counterDrift.x],
                        rotate: [-0.5, 0.5, -0.5],
                      }
                    : { opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                transition={
                  heavyMotion
                    ? {
                        opacity: { duration: 0.45 },
                        scale: { duration: 0.45 },
                        y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                        x: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                      }
                    : { opacity: { duration: 0.45 }, scale: { duration: 0.45 } }
                }
                className="relative flex flex-col items-center justify-center pointer-events-auto"
              >
                {/* Brilho decorativo elétrico azul cobalto */}
                <div className="absolute -inset-8 sm:-inset-12 bg-gradient-to-r from-blue-600/[0.12] via-indigo-600/[0.18] to-purple-600/[0.12] blur-3xl rounded-full pointer-events-none" />

                <a
                  href="#inicio"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = 'inicio';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-2xl p-2 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                  aria-label="ēloSites — Entrar e Conhecer"
                >
                  <img
                    src="/logo-elosites-1360.png"
                    alt="ēloSites"
                    width={1360}
                    height={337}
                    className="hero-home-logo w-auto object-contain relative z-10 drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]"
                  />
                  {/* Texto minimalista proporcional ao espaço do logotipo e do contêiner */}
                  <span className="hero-home-subtitle text-slate-400 group-hover:text-blue-300 select-none transition-colors duration-300 relative z-10">
                    Web Development Studio
                  </span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* 2. TELA INÍCIO: Apresentação Completa Fiel à og-image.png com Mockup 3D, Código e 4 Pilares */}
      {(mode === 'inicio' || mode === 'all') && (
        <section
          id="inicio"
          className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24 overflow-hidden"
        >
          {/* Fundo técnico com gradiente e luzes volumétricas azuis da og-image.png */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.22),rgba(5,8,20,0))] pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-[500px] h-[400px] bg-blue-600/12 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* COLUNA ESQUERDA: Tipografia de Impacto da og-image.png com BiReveal */}
              <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-7">
                
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

                {/* Faixa dos 4 Pilares da og-image.png */}
                <BiReveal direction="up" delay={200}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 w-full max-w-xl">
                    {/* Pilar 1 */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white text-center">Design moderno</span>
                      <span className="text-[10px] text-slate-400 text-center">Estética autoral</span>
                    </div>

                    {/* Pilar 2 */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white text-center">Performance</span>
                      <span className="text-[10px] text-slate-400 text-center">Velocidade real</span>
                    </div>

                    {/* Pilar 3 */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                        <Search className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white text-center">SEO técnico</span>
                      <span className="text-[10px] text-slate-400 text-center">Google Schema</span>
                    </div>

                    {/* Pilar 4 */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-blue-500/15 shadow-sm backdrop-blur-sm group hover:border-blue-400/40 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 shadow-[0_0_12px_rgba(59,130,246,0.25)] group-hover:scale-110 transition-transform">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white text-center">100% responsivo</span>
                      <span className="text-[10px] text-slate-400 text-center">Mobile First</span>
                    </div>
                  </div>
                </BiReveal>

                {/* Botões de Ação com Micro-interações */}
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

              </div>

              {/* COLUNA DIREITA: Mockup Composto 3D Fiel à og-image.png */}
              <div className="lg:col-span-6 relative mt-6 lg:mt-0">
                <BiReveal direction="right" delay={150}>
                  <div className="relative mx-auto max-w-[540px] lg:max-w-none">
                    
                    {/* Barra de Alternância Interativa entre [ Preview do Site ] e [ Código React ] */}
                    <div className="flex items-center justify-between mb-3 px-2">
                      <div className="inline-flex p-1 rounded-xl bg-slate-950/80 border border-blue-500/20 backdrop-blur-md">
                        <button
                          type="button"
                          onClick={() => setActiveTab('preview')}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            activeTab === 'preview'
                              ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Preview ao Vivo
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('code')}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeTab === 'code'
                              ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Código React</span>
                        </button>
                      </div>

                      <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-blue-300/80 bg-blue-950/40 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Build 100% OK</span>
                      </div>
                    </div>

                    {/* MOCKUP DO LAPTOP 3D (com estilo metálico escuro da og-image.png) */}
                    <Interactive3DCard maxTilt={5} animatedBorder={true}>
                      <div className="relative rounded-2xl bg-[#090E23] border border-blue-500/25 p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
                        
                        {/* Moldura da Tela do Laptop */}
                        <div className="rounded-xl overflow-hidden bg-[#030712] border border-white/10 shadow-inner relative min-h-[300px] sm:min-h-[340px]">
                          
                          {/* Topbar do Navegador/IDE */}
                          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-white/[0.08]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-4 py-0.5 rounded-md border border-white/5 flex items-center gap-1.5">
                              <span className="text-emerald-400">🔒</span>
                              <span>{activeTab === 'preview' ? 'https://elosites.ia.br' : 'src/App.tsx'}</span>
                            </div>
                            <div className="w-10" />
                          </div>

                          {/* Conteúdo Interno da Tela */}
                          {activeTab === 'preview' ? (
                            <div className="relative p-4 sm:p-6 flex flex-col justify-between min-h-[260px] sm:min-h-[300px] bg-gradient-to-br from-[#050814] via-[#090E23] to-[#0D1535] overflow-hidden">
                              {/* Efeito de onda azul cobalto (inspirado no wallpaper da tela do laptop em og-image.png) */}
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

                              {/* Conteúdo Central da Tela (Fiel à Imagem) */}
                              <div className="relative z-10 my-auto py-4 space-y-2.5 max-w-sm">
                                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                                  Sites que geram{' '}
                                  <span className="text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                                    resultados.
                                  </span>
                                </h2>
                                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                                  Design, performance e SEO técnico para o seu negócio crescer no Google e converter no WhatsApp.
                                </p>
                                <div className="pt-1">
                                  <a
                                    href={heroWhatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold shadow-[0_0_14px_rgba(37,99,235,0.6)] cursor-pointer"
                                  >
                                    <span>Solicitar orçamento</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>

                              {/* Mini Indicador de Pilares na Tela */}
                              <div className="relative z-10 grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 text-[9px] text-slate-300">
                                <div className="flex items-center gap-1">
                                  <Monitor className="w-2.5 h-2.5 text-blue-400" />
                                  <span>Design</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap className="w-2.5 h-2.5 text-blue-400" />
                                  <span>Veloz</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Search className="w-2.5 h-2.5 text-blue-400" />
                                  <span>SEO</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Smartphone className="w-2.5 h-2.5 text-blue-400" />
                                  <span>Mobile</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Modo Código React (Visual IDE da og-image.png) */
                            <div className="p-4 font-mono text-xs leading-relaxed text-slate-300 bg-[#030712] overflow-x-auto min-h-[260px] sm:min-h-[300px]">
                              <div className="space-y-1 text-slate-400">
                                <p className="text-slate-500">// Arquitetura limpa com React 19 + TypeScript</p>
                                <p>
                                  <span className="text-purple-400">export default function</span>{' '}
                                  <span className="text-blue-400">Home</span>() &#123;
                                </p>
                                <p className="pl-4">
                                  <span className="text-purple-400">return</span> (
                                </p>
                                <p className="pl-8 text-sky-300">
                                  &lt;<span className="text-blue-400">main</span> className=
                                  <span className="text-emerald-300">"hero-section"</span>&gt;
                                </p>
                                <p className="pl-12 text-sky-300">
                                  &lt;<span className="text-blue-400">h1</span>&gt;
                                  <span className="text-white">Seu site, sob medida.</span>
                                  &lt;/<span className="text-blue-400">h1</span>&gt;
                                </p>
                                <p className="pl-12 text-sky-300">
                                  &lt;<span className="text-blue-400">ConversionEngine</span> focus=
                                  <span className="text-emerald-300">"whatsapp"</span> seo=
                                  <span className="text-amber-300">&#123;true&#125;</span> /&gt;
                                </p>
                                <p className="pl-8 text-sky-300">
                                  &lt;/<span className="text-blue-400">main</span>&gt;
                                </p>
                                <p className="pl-4">);</p>
                                <p>&#125;</p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                                <span className="flex items-center gap-1.5 text-emerald-400">
                                  <Check className="w-3.5 h-3.5" /> 0 erros de sintaxe
                                </span>
                                <span className="text-slate-500">TypeScript 5.8 &bull; Vite 6</span>
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
                  </div>
                </BiReveal>
              </div>

            </div>

            {/* BANNER DESLIZANTE INTERATIVO (MOUSE OU TOUCH) DOS NICHOS */}
            <div className="mt-14 pt-8 border-t border-blue-500/15 scroll-fade-card">
              <div className="text-center mb-5 flex items-center justify-center">
                <span className="floating-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/90 border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wider uppercase font-mono shadow-[0_0_22px_rgba(34,211,238,0.35)] backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" aria-hidden="true" />
                  <span>Sites sob medida para o seu negócio</span>
                </span>
              </div>

              <InfiniteMarquee
                items={[
                  { text: 'Barbearias & Barbeiros', icon: <Scissors className="w-3.5 h-3.5 text-cyan-400" />, badge: 'Alta Conversão' },
                  { text: 'Salões de Beleza & Cabeleireiros', icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />, badge: 'Estética' },
                  { text: 'Personal Trainers & Consultoria Fitness', icon: <Dumbbell className="w-3.5 h-3.5 text-indigo-400" />, badge: 'Treinos' },
                  { text: 'Clínicas de Estética & Biomédicas', icon: <HeartPulse className="w-3.5 h-3.5 text-rose-400" />, badge: 'Procedimentos' },
                  { text: 'Manicures & Nail Designers', icon: <Gem className="w-3.5 h-3.5 text-fuchsia-400" />, badge: 'Agendamentos' },
                  { text: 'Nutricionistas & Saúde Integrativa', icon: <Apple className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Consultas' },
                  { text: 'Terapeutas, Psicólogos & Saúde Mental', icon: <Brain className="w-3.5 h-3.5 text-violet-400" />, badge: 'Acolhimento' },
                  { text: 'Estúdios de Tatuagem & Piercing', icon: <PenTool className="w-3.5 h-3.5 text-amber-400" />, badge: 'Galeria' },
                  { text: 'Segurança & Portaria Privada', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />, badge: 'Corporativo' },
                  { text: 'Empresas de Limpeza & Conservação', icon: <SprayCan className="w-3.5 h-3.5 text-teal-400" />, badge: 'Serviços' },
                  { text: 'Arquitetura & Design de Interiores', icon: <Compass className="w-3.5 h-3.5 text-cyan-400" />, badge: 'Portfólio' },
                  { text: 'Professores & Cursos Particulares', icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />, badge: 'Aulas' },
                  { text: 'Advogados & Escritórios de Advocacia', icon: <Scale className="w-3.5 h-3.5 text-amber-300" />, badge: 'Autoridade' },
                  { text: 'Estética Automotiva & Detalhamento', icon: <Car className="w-3.5 h-3.5 text-sky-400" />, badge: 'Local' },
                  { text: 'Clínicas Médicas & Odontológicas', icon: <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Saúde' },
                  { text: 'Fisioterapia & Reabilitação', icon: <Activity className="w-3.5 h-3.5 text-teal-300" />, badge: 'Bem-Estar' },
                ]}
                speed={70}
                ariaLabel="Banner deslizante interativo dos nichos atendidos pela ēloSites"
              />
            </div>

          </div>
        </section>
      )}
    </div>
  );
};
