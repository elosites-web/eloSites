import React, { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  Code2,
  Sparkles,
  Cpu,
  Layers,
  FileCode2,
  Zap,
  Layout,
  Globe,
  Smartphone,
  Search,
  BarChart3,
  Target,
} from 'lucide-react';
import { shouldReduceMedia } from '../mediaPrefs';
import { BiReveal } from './BiReveal';

interface TechBadge {
  id: string;
  name: string;
  tag: string;
  icon: React.ReactNode;
}

const TECH_STACK_ITEMS: TechBadge[] = [
  {
    id: 'html5',
    name: 'HTML5',
    tag: 'Estrutura',
    icon: <FileCode2 className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />,
  },
  {
    id: 'css3',
    name: 'CSS3',
    tag: 'Estilização',
    icon: <Layers className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    tag: 'Interatividade',
    icon: (
      <span className="w-4 h-4 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center justify-center leading-none">
        JS
      </span>
    ),
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    tag: 'Confiabilidade',
    icon: (
      <span className="w-4 h-4 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 inline-flex items-center justify-center leading-none">
        TS
      </span>
    ),
  },
  {
    id: 'react',
    name: 'React',
    tag: 'Interface moderna',
    icon: (
      <svg
        className="w-3.5 h-3.5 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    id: 'vite',
    name: 'Vite',
    tag: 'Velocidade',
    icon: <Zap className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    tag: 'Design leve',
    icon: <Layers className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />,
  },
  {
    id: 'motion',
    name: 'Motion',
    tag: 'Transições suaves',
    icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />,
  },
];

const SPECIALTY_ITEMS: TechBadge[] = [
  {
    id: 'sites-institucionais',
    name: 'Sites institucionais',
    tag: 'Presença completa',
    icon: <Globe className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />,
  },
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    tag: 'Foco em conversão',
    icon: <Layout className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />,
  },
  {
    id: 'design-responsivo',
    name: 'Design responsivo',
    tag: 'Celular e PC',
    icon: <Smartphone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />,
  },
  {
    id: 'seo-tecnico',
    name: 'SEO técnico essencial',
    tag: 'Google & Buscadores',
    icon: <Search className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />,
  },
  {
    id: 'analytics',
    name: 'Integração com Analytics',
    tag: 'Métricas de visitas',
    icon: <BarChart3 className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />,
  },
  {
    id: 'pixels-gtm',
    name: 'Pixels e Tag Manager',
    tag: 'Acompanhamento',
    icon: <Target className="w-3.5 h-3.5 text-pink-400" aria-hidden="true" />,
  },
];

export const TechnicalSpecialtiesBanner: React.FC = () => {
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  const bannerContainerRef = useRef<HTMLDivElement>(null);

  // Renderiza um conjunto de selos acessíveis
  const renderBadges = (items: TechBadge[], isAriaHidden = false) => (
    <div
      className="flex items-center gap-3 shrink-0"
      aria-hidden={isAriaHidden ? 'true' : undefined}
    >
      {items.map((item) => (
        <div
          key={item.id}
          tabIndex={isAriaHidden ? -1 : 0}
          role="listitem"
          className="group/badge inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#080d22]/90 hover:bg-[#0e1635] focus-visible:bg-[#0e1635] border border-blue-500/20 hover:border-cyan-400/50 focus-visible:border-cyan-400/60 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none transition-all duration-200 select-none cursor-default shadow-sm shadow-black/40"
          title={`${item.name} — ${item.tag}`}
        >
          <span className="shrink-0">{item.icon}</span>
          <span className="text-xs sm:text-[13px] font-semibold text-slate-100 whitespace-nowrap tracking-tight group-hover/badge:text-cyan-200 transition-colors">
            {item.name}
          </span>
          <span className="text-[10px] font-mono text-slate-400/90 bg-slate-900/80 px-1.5 py-0.5 rounded border border-white/[0.06] whitespace-nowrap">
            {item.tag}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <BiReveal direction="up" delay={80} className="w-full">
      <section
        ref={bannerContainerRef}
        aria-labelledby="technical-specialties-heading"
        className="relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 bg-gradient-to-b from-[#070b1a]/95 to-[#050814]/95 border border-blue-500/20 shadow-2xl shadow-black/70 backdrop-blur-xl overflow-hidden mt-8 sm:mt-10"
      >
        {/* Efeitos de iluminação sutil (azul, ciano e violeta) */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/[0.08] blur-[90px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-600/[0.08] blur-[90px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-36 bg-cyan-500/[0.04] blur-[80px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Cabeçalho do Banner: Título e Frase Curta de Contexto */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 sm:pb-6 border-b border-white/[0.08]">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>Base técnica e especialidades</span>
            </div>

            <h3
              id="technical-specialties-heading"
              className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight leading-snug"
            >
              Tecnologias consagradas e soluções práticas para o seu negócio
            </h3>

            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-2xl font-normal">
              Desenvolvimento sob medida com ferramentas modernas para garantir carregamento ágil, estabilidade e navegação intuitiva em qualquer dispositivo.
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-[11px] font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <span>Padrão Web Profissional</span>
            </span>
          </div>
        </div>

        {/* CSS Scoped das Trilhas Deslizantes */}
        <style>{`
          @keyframes elo-track-slide-left {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes elo-track-slide-right {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          .elo-marquee-left {
            display: flex;
            width: max-content;
            animation: elo-track-slide-left 34s linear infinite;
          }
          .elo-marquee-right {
            display: flex;
            width: max-content;
            animation: elo-track-slide-right 32s linear infinite;
          }
          .elo-marquee-container:hover .elo-marquee-left,
          .elo-marquee-container:hover .elo-marquee-right,
          .elo-marquee-container:focus-within .elo-marquee-left,
          .elo-marquee-container:focus-within .elo-marquee-right {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .elo-marquee-left,
            .elo-marquee-right {
              animation: none !important;
              transform: none !important;
              width: 100% !important;
              flex-wrap: wrap !important;
            }
            .elo-marquee-left [aria-hidden="true"],
            .elo-marquee-right [aria-hidden="true"] {
              display: none !important;
            }
          }
        `}</style>

        {/* Conteúdo com os Selos em Duas Faixas Opostas */}
        {prefersReduced ? (
          /* Modo Acessível para Movimento Reduzido: Selos estáticos organizados */
          <div className="relative z-10 pt-5 space-y-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2 block">
                Base Técnica:
              </span>
              <div
                role="list"
                aria-label="Lista de tecnologias da base técnica"
                className="flex flex-wrap gap-2.5"
              >
                {TECH_STACK_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    role="listitem"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d22] border border-blue-500/20 text-xs font-semibold text-slate-100"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.tag})</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-violet-400 font-semibold mb-2 block">
                Especialidades:
              </span>
              <div
                role="list"
                aria-label="Lista de especialidades oferecidas"
                className="flex flex-wrap gap-2.5"
              >
                {SPECIALTY_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    role="listitem"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d22] border border-purple-500/20 text-xs font-semibold text-slate-100"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.tag})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Modo Padrão: Duas faixas contínuas deslizantes em direções opostas */
          <div className="relative z-10 pt-5 sm:pt-6 space-y-4">
            {/* Faixa 1: BASE TÉCNICA (Desliza suavemente para a esquerda) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Base Técnica
                </span>
              </div>

              <div
                className="elo-marquee-container relative overflow-hidden py-1"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                }}
              >
                <div
                  role="list"
                  aria-label="Tecnologias da base técnica (faixa interativa)"
                  className="elo-marquee-left gap-3"
                >
                  {renderBadges(TECH_STACK_ITEMS, false)}
                  {renderBadges(TECH_STACK_ITEMS, true)}
                </div>
              </div>
            </div>

            {/* Faixa 2: ESPECIALIDADES (Desliza suavemente para a direita) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" aria-hidden="true" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-violet-300 font-bold">
                  Especialidades
                </span>
              </div>

              <div
                className="elo-marquee-container relative overflow-hidden py-1"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                }}
              >
                <div
                  role="list"
                  aria-label="Especialidades oferecidas (faixa interativa)"
                  className="elo-marquee-right gap-3"
                >
                  {renderBadges(SPECIALTY_ITEMS, false)}
                  {renderBadges(SPECIALTY_ITEMS, true)}
                </div>
              </div>
            </div>

            {/* Dica de usabilidade discreta */}
            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-400 font-mono">
                Passe o mouse ou navegue com Tab para pausar os selos
              </span>
            </div>
          </div>
        )}
      </section>
    </BiReveal>
  );
};
