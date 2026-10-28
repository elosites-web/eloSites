import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';
import {
  ExternalLink,
  CheckCircle2,
  Maximize2,
  Monitor,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { LazyPortfolioImage } from './LazyPortfolioImage';
import { SplitLines } from './SplitLines';
import { Reveal } from './Reveal';
import { BiReveal } from './BiReveal';
import { Interactive3DCard } from './Interactive3DCard';
import { MagneticButton } from './MagneticButton';
import {
  PORTFOLIO_PROJECTS,
  PortfolioProjectData,
  preloadProjectWebpImages,
  preloadAllPortfolioWebpImages,
} from '../portfolioData';

export type { PortfolioProjectData };
export { PORTFOLIO_PROJECTS };

type ViewMode = 'composite' | 'desktop' | 'mobile';

interface ProjectCardProps {
  project: PortfolioProjectData;
  onOpenCase: (projectId: string) => void;
  onOpenImage: (projectId: string, type: 'desktop' | 'mobile') => void;
  priority?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenCase,
  onOpenImage,
  priority = false,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('composite');

  // Disparo de preload imediato por intenção de navegação
  const handleIntentPreload = () => {
    preloadProjectWebpImages(project);
  };

  return (
    <Interactive3DCard maxTilt={1.2} animatedBorder={true} className="h-full">
      <article
        onMouseEnter={handleIntentPreload}
        onFocusCapture={handleIntentPreload}
        onTouchStart={handleIntentPreload}
        className="glass-card-interactive surface-card portfolio-card scroll-perf-card scroll-snap-card card-snap-item relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 p-5 sm:p-6 md:p-8 flex flex-col h-full group lg:row-span-8 lg:grid lg:grid-rows-subgrid shadow-2xl shadow-black/80 bracket-panel transition-all w-full min-w-0 max-w-full box-border"
      >
        {/* Top Header / Informações */}
        <div className="pb-5 sm:pb-6 border-b border-white/[0.06] space-y-4 lg:row-span-5 lg:grid lg:grid-rows-subgrid">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase bg-blue-950 text-blue-200 border border-blue-400/40 px-3 py-1 rounded-full font-bold">
              {project.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-950/60 border border-emerald-400/40 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {project.status}
            </span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => onOpenCase(project.id)}
              className="text-left font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-blue-200 hover:text-blue-300 transition-colors cursor-pointer w-full drop-shadow-sm"
              title="Ver o case completo"
            >
              {project.title}
            </button>
            <p className="mt-1 text-xs text-slate-300 font-mono flex items-center gap-1.5 font-medium">
              <span className="text-blue-400 font-bold">🌐</span>
              <span>{project.urlLabel}</span>
            </p>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            <p>
              <strong className="text-white font-bold">Desafio:</strong> {project.challenge}
            </p>
            <p>
              <strong className="text-blue-300 font-bold">Solução ēloSites:</strong> {project.solution}
            </p>
          </div>

          {/* Ver o Case Completo e Tags */}
          <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenCase(project.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-blue-200 transition-colors cursor-pointer"
            >
              <span>Ver detalhes do projeto (Desafio & Solução)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 portfolio-list scroll-perf-list">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-blue-400/30 text-[11px] font-semibold text-slate-200"
              >
                <CheckCircle2 className="w-3 h-3 text-blue-400" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Mockup Area com Seletor */}
        <div className="pt-4 sm:pt-5 flex-1 flex flex-col justify-between space-y-4 lg:flex-none lg:row-span-3 lg:grid lg:grid-rows-subgrid">
          {/* Controles de visualização: Composto, Desktop, Mobile */}
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 lg:justify-center lg:gap-3">
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-blue-500/15 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('composite')}
                aria-label="Ver mockup composto sobreposto"
                className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'composite'
                    ? 'bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-center">Composto</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('desktop')}
                aria-label="Ver imagem desktop"
                className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'desktop'
                    ? 'bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-center">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('mobile')}
                aria-label="Ver imagem mobile"
                className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'mobile'
                    ? 'bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-center">Mobile</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenImage(
                  project.id,
                  viewMode === 'mobile' ? 'mobile' : 'desktop'
                )
              }
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Abrir captura em tela cheia"
              aria-label="Abrir captura em tela cheia"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Display do Mockup conforme Modo (revelado em máscara, uma vez) */}
          <Reveal
            variant="mask"
            className="relative min-h-[300px] sm:min-h-[330px] w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/70 border border-white/[0.05] p-2 sm:p-3"
          >
            {/* MODO 1: COMPOSTO (Desktop com largura total + Celular sobreposto à direita e abaixo) */}
            {viewMode === 'composite' && (
              <div className="relative w-full h-full flex items-center justify-center py-2">
                {/* Desktop Window Frame com largura total expandida */}
                <div className="w-full rounded-xl overflow-hidden border border-white/[0.12] bg-[#0c101a] shadow-2xl shadow-black/80 transition-transform duration-300 group-hover:scale-[1.01]">
                  {/* Browser topbar */}
                  <div className="px-3 py-1.5 bg-slate-900 border-b border-white/[0.08] flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex-1 bg-slate-950 rounded px-2 py-0.5 text-[10px] text-slate-400 font-mono truncate border border-white/[0.05]">
                      {project.urlLabel}
                    </div>
                  </div>
                  {/* Desktop Screenshot */}
                  <div
                    className="aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                    onClick={() => onOpenImage(project.id, 'desktop')}
                    title="Clique para abrir captura Desktop completa"
                  >
                    <LazyPortfolioImage
                      src={project.desktopImage}
                      alt={`Versão Desktop do site ${project.title}`}
                      wrapperClassName="relative w-full h-full overflow-hidden"
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      rootMargin="500px 0px 500px 0px"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      priority={priority}
                    />
                  </div>
                </div>

                {/* Mobile Phone Mockup Sobreposto com 3D Breakout de Profundidade */}
                <div
                  className="absolute right-1 sm:right-2 -bottom-1 sm:bottom-0 w-[36%] sm:w-[33%] max-w-[155px] sm:max-w-[170px] rounded-[20px] p-1.5 sm:p-2 bg-[#090d16] border-2 border-indigo-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] shadow-indigo-950/60 breakout-layer-front cursor-pointer z-20 hover:scale-105 transition-all duration-300"
                  style={{ transform: 'translateZ(38px)' }}
                  onClick={() => onOpenImage(project.id, 'mobile')}
                  title="Clique para abrir captura Mobile completa"
                >
                  {/* Phone screen */}
                  <div className="rounded-[14px] overflow-hidden aspect-[9/18] bg-black border border-white/[0.1] w-full">
                    <LazyPortfolioImage
                      src={project.mobileImage}
                      alt={`Versão Mobile do site ${project.title}`}
                      wrapperClassName="relative w-full h-full overflow-hidden"
                      className="w-full h-full object-cover object-top"
                      rootMargin="500px 0px 500px 0px"
                      sizes="(max-width: 640px) 140px, 170px"
                    />
                  </div>
                  {/* Badge visual */}
                  <div className="absolute -bottom-2 -left-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow border border-indigo-400/30">
                    📱 Mobile
                  </div>
                </div>
              </div>
            )}

            {/* MODO 2: APENAS DESKTOP */}
            {viewMode === 'desktop' && (
              <div className="w-full rounded-xl overflow-hidden border border-white/[0.12] bg-[#0c101a] shadow-xl">
                <div className="px-3 py-2 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono truncate">
                    {project.urlLabel}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase">Desktop</span>
                </div>
                <div
                  className="aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => onOpenImage(project.id, 'desktop')}
                  title="Clique para abrir captura Desktop completa"
                >
                  <LazyPortfolioImage
                    src={project.desktopImage}
                    alt={`Captura Desktop completa de ${project.title}`}
                    wrapperClassName="relative w-full h-full overflow-hidden"
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    rootMargin="500px 0px 500px 0px"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    priority={priority}
                  />
                </div>
              </div>
            )}

            {/* MODO 3: APENAS MOBILE (Largura ampliada e centrada) */}
            {viewMode === 'mobile' && (
              <div className="flex items-center justify-center py-2 w-full">
                <div
                  className="w-[210px] sm:w-[240px] max-w-full rounded-[26px] p-2 sm:p-2.5 bg-[#090d16] border-2 border-indigo-500/50 shadow-2xl shadow-black cursor-pointer"
                  onClick={() => onOpenImage(project.id, 'mobile')}
                  title="Clique para abrir captura Mobile completa"
                >
                  {/* Speaker pill */}
                  <div className="w-12 h-1.5 bg-slate-700 mx-auto rounded-full mb-1.5" />
                  <div className="rounded-[20px] overflow-hidden aspect-[9/18] bg-black border border-white/[0.1] w-full">
                    <LazyPortfolioImage
                      src={project.mobileImage}
                      alt={`Captura Mobile completa de ${project.title}`}
                      wrapperClassName="relative w-full h-full overflow-hidden"
                      className="w-full h-full object-cover object-top"
                      rootMargin="500px 0px 500px 0px"
                      sizes="(max-width: 640px) 210px, 240px"
                    />
                  </div>
                </div>
              </div>
            )}
          </Reveal>

          {/* Rodapé do Card com Ações */}
          <div className="pt-3 border-t border-blue-500/20 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenCase(project.id)}
                className="inline-flex items-center justify-center text-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0c122e] text-blue-200 hover:text-white hover:bg-blue-950/80 border border-blue-400/40 transition-colors shadow-sm cursor-pointer"
              >
                <span>Ver Case</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </button>

              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-center gap-1 text-xs font-semibold text-slate-200 hover:text-white bg-[#0c122e] hover:bg-blue-950/80 border border-blue-400/40 rounded-lg p-1.5 transition-colors shadow-sm"
                title="Abrir site publicado em nova aba"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-200" aria-hidden="true" />
              </a>
            </div>

            <a
              href={whatsappUrl(
                `Olá! 💻 Vi o projeto *${project.title}* no portfólio da *ēloSites*.\n\nGostei muito do resultado e gostaria de solicitar um orçamento para desenvolver um site similar para o meu negócio!`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 border border-emerald-300 shadow-md shadow-emerald-950/40 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] active:shadow-[0_0_28px_rgba(37,211,102,0.8)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-slate-950" />
              <span className="text-slate-950 font-black tracking-tight text-center">Quero similar</span>
            </a>
          </div>
        </div>
      </article>
    </Interactive3DCard>
  );
};

export interface PortfolioSectionProps {
  onNavigateToServices?: () => void;
  onOpenCase?: (projectId: string) => void;
  onOpenImage?: (projectId: string, type: 'desktop' | 'mobile') => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onNavigateToServices,
  onOpenCase,
  onOpenImage,
}) => {
  const [filter, setFilter] = useState<'all' | 'landing' | 'institutional'>('all');

  // Detecção de preferências de acessibilidade e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // Pré-carregamento estratégico em segundo plano (idle) das capturas WebP dos projetos
  useEffect(() => {
    preloadAllPortfolioWebpImages({ idle: true });
  }, []);

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const whatsappInquiryUrl = whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage);

  const handleOpenCase = (projectId: string) => {
    if (onOpenCase) {
      onOpenCase(projectId);
    } else {
      window.location.hash = `case/${projectId}`;
    }
  };

  const handleOpenImage = (projectId: string, type: 'desktop' | 'mobile') => {
    if (onOpenImage) {
      onOpenImage(projectId, type);
    } else {
      window.location.hash = `case/${projectId}/${type}`;
    }
  };

  return (
    <section
      id="portfolio"
      className="section-auto-contain pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 bg-[#090D16]/30 backdrop-blur-[0.5px] relative"
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/[0.08] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative w-full">
        {/* Cabeçalho da Seção / Tela */}
        <div>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/[0.08] text-indigo-300 text-xs sm:text-sm font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>PORTFÓLIO DE PROJETOS REAIS</span>
            </div>
            <SplitLines
              as="h2"
              text="Sites reais no ar para apresentar seu negócio"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight"
            />
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Veja na prática como nossos sites se adaptam ao celular e ao computador. Cada projeto é estruturado para facilitar a leitura das suas informações, transmitir credibilidade e direcionar o visitante para o contato pelo WhatsApp.
            </p>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-900/50'
                    : 'bg-[#0c122e] text-slate-200 hover:text-white border border-blue-500/30 hover:border-blue-400'
                }`}
              >
                Todos ({PORTFOLIO_PROJECTS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('landing')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                  filter === 'landing'
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-900/50'
                    : 'bg-[#0c122e] text-slate-200 hover:text-white border border-blue-500/30 hover:border-blue-400'
                }`}
              >
                Landing Pages ({PORTFOLIO_PROJECTS.filter((p) => p.category === 'landing').length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('institutional')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                  filter === 'institutional'
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-900/50'
                    : 'bg-[#0c122e] text-slate-200 hover:text-white border border-blue-500/30 hover:border-blue-400'
                }`}
              >
                Sites Institucionais ({PORTFOLIO_PROJECTS.filter((p) => p.category === 'institutional').length})
              </button>
            </div>
          </div>

          {/* Grade de Projetos Reais */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch lg:grid-rows-[repeat(8,auto)] portfolio-list"
          >
            {filteredProjects.map((project, index) => {
              return (
                <BiReveal
                  key={project.id}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                  index={index}
                  className="h-full lg:row-span-8 lg:grid lg:grid-rows-subgrid"
                >
                  <Interactive3DCard maxTilt={5} className="h-full w-full">
                    <ProjectCard
                      project={project}
                      priority={index === 0}
                      onOpenCase={handleOpenCase}
                      onOpenImage={handleOpenImage}
                    />
                  </Interactive3DCard>
                </BiReveal>
              );
            })}
          </div>
        </div>

        {/* Banner Inferior com Conversão Direta e 3D Tilt */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01, margin: '0px 0px 80px 0px' }}
          transition={{ duration: prefersReduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 w-full"
        >
          <Interactive3DCard maxTilt={3} className="w-full">
            <div className="portfolio-card p-6 sm:p-7 md:p-8 rounded-2xl bg-[#090e26] border border-blue-400/40 hover:border-blue-400/70 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl shadow-black/90 bracket-panel transition-all">
              <div className="space-y-2 text-left w-full lg:max-w-xl">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight drop-shadow-sm">
                  Quer um site com esse mesmo nível de acabamento?
                </h3>
                <p className="text-sm sm:text-[15px] text-slate-100 font-medium leading-relaxed">
                  Cada projeto recebe uma proposta sob medida para as necessidades do seu negócio. Pagamento facilitado: 50% no início e 50% na aprovação final (PIX), 20% de desconto para pagamento à vista no PIX, ou cartão de crédito em até 5x sem juros (e de 6x a 12x com taxas da operadora).
                </p>
              </div>

              <div className="card-action-cluster flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                {onNavigateToServices && (
                  <button
                    type="button"
                    onClick={onNavigateToServices}
                    className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-300/50 shadow-lg shadow-blue-900/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <span className="text-center font-bold text-white drop-shadow-sm">Ver Formatos & Condições</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                )}
                <MagneticButton
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  strength={12}
                  glowColor="rgba(37, 211, 102, 0.45)"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#22c55e] border border-emerald-300/50 shadow-lg shadow-emerald-950/60 hover:shadow-[0_0_24px_rgba(37,211,102,0.7)] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  ariaLabel="Conversar no WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span className="text-center font-bold text-white drop-shadow-sm">Conversar no WhatsApp</span>
                </MagneticButton>
              </div>
            </div>
          </Interactive3DCard>
        </motion.div>
      </div>
    </section>
  );
};

export { TestimonialsSection } from './TestimonialsSection';
