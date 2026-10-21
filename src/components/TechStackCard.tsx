import React from 'react';
import {
  Cpu,
  Code2,
  FileCode2,
  Layers,
  Zap,
  Search,
  Sparkles,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { BiReveal } from './BiReveal';

interface TechItem {
  id: string;
  name: string;
  description: string;
  category: string;
  tagColor: string;
  borderHover: string;
  glowColor: string;
  renderIcon: () => React.ReactNode;
}

const TECHNOLOGIES: TechItem[] = [
  {
    id: 'react',
    name: 'React',
    description: 'Biblioteca UI para interfaces dinâmicas',
    category: 'Componentes & Estado',
    tagColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    borderHover: 'hover:border-cyan-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
    id: 'typescript',
    name: 'TypeScript',
    description: 'Tipagem estática e segurança de código',
    category: 'Segurança Estrutural',
    tagColor: 'text-blue-400 bg-blue-950/40 border-blue-500/30',
    borderHover: 'hover:border-blue-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]',
    renderIcon: () => (
      <div className="w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs bg-blue-500/20 text-blue-400 border border-blue-500/40">
        TS
      </div>
    ),
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Lógica e interatividade moderna',
    category: 'ESNext Nativo',
    tagColor: 'text-amber-300 bg-amber-950/40 border-amber-500/30',
    borderHover: 'hover:border-amber-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(251,191,36,0.25)]',
    renderIcon: () => (
      <div className="w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40">
        JS
      </div>
    ),
  },
  {
    id: 'html5',
    name: 'HTML5 Semântico',
    description: 'Estruturação acessível e SEO',
    category: 'Arquitetura Web',
    tagColor: 'text-orange-400 bg-orange-950/40 border-orange-500/30',
    borderHover: 'hover:border-orange-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]',
    renderIcon: () => <FileCode2 className="w-6 h-6 text-orange-400" aria-hidden="true" />,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Estilização performática e responsiva',
    category: 'Design System',
    tagColor: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
    borderHover: 'hover:border-sky-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]',
    renderIcon: () => <Layers className="w-6 h-6 text-sky-400" aria-hidden="true" />,
  },
  {
    id: 'vite',
    name: 'Vite',
    description: 'Build veloz e empacotamento otimizado',
    category: 'Bundler Moderno',
    tagColor: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    borderHover: 'hover:border-purple-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    renderIcon: () => <Zap className="w-6 h-6 text-purple-400" aria-hidden="true" />,
  },
  {
    id: 'seo-tecnico',
    name: 'SEO Técnico',
    description: 'Schema.org, metadados e indexação',
    category: 'Visibilidade no Google',
    tagColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    borderHover: 'hover:border-emerald-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    renderIcon: () => <Search className="w-6 h-6 text-emerald-400" aria-hidden="true" />,
  },
  {
    id: 'whatsapp-integracao',
    name: 'Integração com WhatsApp',
    description: 'Links diretos, CTAs contextuais e mensagens personalizadas',
    category: 'Conversão Comercial',
    tagColor: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30',
    borderHover: 'hover:border-emerald-400/60',
    glowColor: 'group-hover:shadow-[0_0_20px_rgba(37,211,102,0.25)]',
    renderIcon: () => <WhatsAppIcon className="w-6 h-6 text-emerald-400" aria-hidden="true" />,
  },
];

interface TechStackCardProps {
  className?: string;
}

/**
 * Card Premium da Base Tecnológica Oficial
 * Inspirado fielmente na referência visual com formato técnico em grade, cantoneiras técnicas,
 * 8 tecnologias individuais com ícones oficiais, badge Jamstack & Edge e nota de rodapé estilizada.
 */
export const TechStackCard: React.FC<TechStackCardProps> = ({ className = '' }) => {
  return (
    <BiReveal direction="up" delay={50} className={`w-full ${className}`}>
      <div className="relative w-full rounded-3xl p-6 sm:p-8 lg:p-10 bg-[#070b1a]/95 border border-blue-500/25 shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
        {/* Cantoneiras decorativas técnicas nos vértices (top-left & bottom-right) */}
        <div
          className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400/40 rounded-tl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400/40 rounded-br pointer-events-none"
          aria-hidden="true"
        />

        {/* Halos de luz ambiente volumétrica ciano e cobalto */}
        <div
          className="absolute -top-28 -left-28 w-80 h-80 bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-28 -right-28 w-80 h-80 bg-blue-600/10 blur-[110px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        {/* TOPO: Kicker, Headline, Parágrafo e Badge Superior Direito */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-3 max-w-2xl text-left">
            {/* Kicker com ícone Cpu */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>STACK TECNOLÓGICA OFICIAL</span>
            </div>

            {/* Headline Oficial */}
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Tecnologias modernas aplicadas a cada entrega
            </h3>

            {/* Parágrafo de Apresentação Técnica */}
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
              Utilizamos uma base técnica sólida de desenvolvimento frontend combinando tecnologias modernas como <strong className="text-white font-medium">React</strong>, <strong className="text-white font-medium">TypeScript</strong>, <strong className="text-white font-medium">Vite</strong> e <strong className="text-white font-medium">Tailwind CSS</strong> para entregar código limpo, interfaces fluidas e alta fidelidade visual, sem dependência de plataformas lentas ou templates engessados.
            </p>
          </div>

          {/* Badge no Canto Superior Direito: Frontend Moderno e Responsivo */}
          <div className="shrink-0 self-start lg:self-center">
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2.5 px-4 py-2.5 rounded-2xl bg-[#050814]/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-950/40">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span className="font-semibold text-white">Frontend moderno e responsivo</span>
              </div>
              <span className="hidden sm:inline text-slate-600" aria-hidden="true">•</span>
              <span className="text-slate-400 text-[11px]">Código limpo e interfaces ágeis</span>
            </div>
          </div>
        </div>

        {/* GRADE DE 8 TECNOLOGIAS EM FORMATO PREMIUM */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 sm:pt-8">
          {TECHNOLOGIES.map((tech) => (
            <div
              key={tech.id}
              className={`group relative rounded-2xl p-4 sm:p-5 bg-[#050814]/80 border border-blue-500/20 ${tech.borderHover} ${tech.glowColor} transition-all duration-300 min-h-[175px] sm:min-h-[185px] flex flex-col items-center text-center justify-center hover:-translate-y-1`}
            >
              {/* Efeito de brilho de fundo no hover */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                aria-hidden="true"
              />

              {/* Ícone Técnico */}
              <div className="relative z-10 w-10 h-10 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-center mb-2.5 shadow-inner group-hover:scale-110 transition-transform shrink-0">
                {tech.renderIcon()}
              </div>

              {/* Nome da Tecnologia */}
              <div className="relative z-10 space-y-1 max-w-[95%] flex flex-col items-center">
                <h4 className="font-display text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors leading-tight">
                  {tech.name}
                </h4>

                {/* Descrição em estilo técnico e conciso - 100% visível sem truncamento */}
                <p className="text-[11px] sm:text-xs text-slate-400 font-mono leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* NOTA DE RODAPÉ ESTILIZADA */}
        <div className="relative z-10 mt-6 sm:mt-8 pt-4 border-t border-white/[0.06] text-center">
          <p className="text-xs text-slate-400 font-mono tracking-wide">
            * Cada projeto recebe a combinação técnica ideal para seu escopo e objetivos específicos.
          </p>
        </div>
      </div>
    </BiReveal>
  );
};
