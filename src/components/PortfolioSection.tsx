import React, { useState } from 'react';
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
import { ProjectModal } from './ProjectModal';
import { ScreenshotLightbox } from './ScreenshotLightbox';
import { LazyPortfolioImage } from './LazyPortfolioImage';
import { SplitLines } from './SplitLines';
import { Reveal } from './Reveal';
import { BiReveal } from './BiReveal';
import { Interactive3DCard } from './Interactive3DCard';
import { MagneticButton } from './MagneticButton';
import { getDynamicCardVariants } from '../motionVariants';

export interface PortfolioProjectData {
  id: string;
  badge: string;
  status: string;
  title: string;
  category: 'landing' | 'institutional';
  challenge: string;
  solution: string;
  tags: string[];
  urlLabel: string;
  href: string;
  desktopImage: string;
  mobileImage: string;
  features: string[];
  resultsNote: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProjectData[] = [
  {
    id: 'jv-salvaia',
    badge: 'Landing page responsiva',
    status: 'Publicado & Ativo',
    title: 'JV Salvaia Personal Trainer',
    category: 'landing',
    challenge:
      'Personal trainer atuante em treino presencial, consultoria online e avaliação física. Necessitava de uma landing page ágil para apresentar suas modalidades e conduzir interessados ao contato direto no WhatsApp.',
    solution:
      'Desenvolvimento de landing page responsiva, com chamadas de WhatsApp parametrizadas por modalidade de treino, galeria de resultados, apresentação de benefícios e prova social em destaque.',
    tags: ['Treino Presencial', 'Consultoria Online', 'Avaliação Física', 'Foco em Conversão'],
    urlLabel: 'jvsalvaiapersonal.netlify.app',
    href: 'https://jvsalvaiapersonal.netlify.app',
    desktopImage: '/portifolio-jvsalvaia-desktop.webp',
    mobileImage: '/portifolio-jvsalvaia-mobile.webp',
    features: [
      'Gatilho direto para WhatsApp com mensagem personalizada para cada plano',
      'Interface responsiva adaptada para smartphone, tablet e desktop',
      'Otimização de carregamento de imagens e fundamentos de SEO técnico',
    ],
    resultsNote: 'Leads direcionados com mensagem específica do serviço de interesse.',
  },
  {
    id: 'toledo-seguranca',
    badge: 'Site institucional corporativo',
    status: 'Publicado & Ativo',
    title: 'Toledo Segurança',
    category: 'institutional',
    challenge:
      'Empresa especializada em segurança para eventos, portaria terceirizada e rondas preventivas em Jundiaí/SP. Precisava de presença institucional clara para transmitir autoridade e receber solicitações de cotação.',
    solution:
      'Site institucional com paleta corporativa dark & gold, estruturação detalhada dos serviços prestados, formulário direto de cotação empresarial e canal de recrutamento integrado ao WhatsApp.',
    tags: ['Segurança para Eventos', 'Portaria & Acesso', 'Rondas Preventivas', 'B2B & Condomínios'],
    urlLabel: 'toledoseguranca.netlify.app',
    href: 'https://toledoseguranca.netlify.app/',
    desktopImage: '/portifolio-toledoseguranca-desktop.webp',
    mobileImage: '/portifolio-toledoseguranca-mobile.webp',
    features: [
      'Apresentação institucional estruturada com foco em credibilidade',
      'Seções organizadas para serviços de eventos, condomínios e empresas',
      'Fluxo duplo de atendimento no WhatsApp (Orçamento comercial e Banco de talentos)',
    ],
    resultsNote: 'Presença institucional consolidada para apresentação corporativa e atendimento ágil de cotações.',
  },
  {
    id: 'duelo-fim-de-ano',
    badge: 'Plataforma interativa & evento',
    status: 'Publicado & Ativo',
    title: 'Duelo de Fim de Ano — Badem vs Becala',
    category: 'landing',
    challenge:
      'Organização de clássico esportivo comunitário e beneficente de fim de ano que necessitava de engajamento dos torcedores, votação dos melhores da partida e mural de fotos dinâmico sem complexidade de infraestrutura.',
    solution:
      'Aplicação web com campo tático interativo, votação no navegador ("Bola Cheia vs Bola Murcha") com persistência local, cronologia de edições e integração com a comunidade esportiva.',
    tags: ['Interatividade', 'Engajamento Comunitário', 'Futebol Amador', 'UX Interativa'],
    urlLabel: 'jogodefimdeano.netlify.app',
    href: 'https://jogodefimdeano.netlify.app',
    desktopImage: '/portifolio-jogodefimdeano-desktop.webp',
    mobileImage: '/portifolio-jogodefimdeano-mobile.webp',
    features: [
      'Escalações em campo tático interativo de futebol',
      'Votação no navegador com persistência no armazenamento local (localStorage)',
      'Galeria de fotos com carregamento sob demanda',
    ],
    resultsNote: 'Engajamento comunitário interativo com interface leve, dinâmica e sem necessidade de login.',
  },
];

type ViewMode = 'composite' | 'desktop' | 'mobile';

interface ProjectCardProps {
  project: PortfolioProjectData;
  onOpenZoom: (imgSrc: string, title: string) => void;
  onOpenDetails: (project: PortfolioProjectData) => void;
  priority?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenZoom,
  onOpenDetails,
  priority = false,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('composite');

  return (
    <Interactive3DCard maxTilt={1.2} animatedBorder={true} className="h-full">
      <article className="glass-card-interactive surface-card portfolio-card scroll-perf-card relative rounded-2xl bg-[#090E23] border border-blue-500/20 hover:border-blue-400/50 flex flex-col h-full overflow-hidden group lg:row-span-8 lg:grid lg:grid-rows-subgrid shadow-2xl shadow-black/80 bracket-panel transition-all">
        {/* Top Header / Informações */}
        <div className="p-6 sm:p-7 border-b border-white/[0.06] bg-[#070B1A]/80 space-y-4 lg:row-span-5 lg:grid lg:grid-rows-subgrid">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono uppercase bg-blue-950/70 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full font-semibold">
            {project.badge}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {project.status}
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="text-left font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-blue-200 hover:text-blue-300 transition-colors cursor-pointer w-full"
            title="Ver estudo de caso e resultados"
          >
            {project.title}
          </button>
          <p className="mt-1 text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <span className="text-blue-400 font-bold">🌐</span>
            <span>{project.urlLabel}</span>
          </p>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white font-semibold">Desafio:</strong> {project.challenge}
          </p>
          <p>
            <strong className="text-blue-300 font-semibold">Solução ēloSites:</strong> {project.solution}
          </p>
        </div>

        {/* Ver Detalhes e Tags */}
        <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Ver detalhes (Desafio, Solução & Resultados)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1 portfolio-list scroll-perf-list">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 border border-blue-500/15 text-[11px] font-medium text-slate-300"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-400" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Visual Mockup Area com Seletor */}
      <div className="p-4 sm:p-5 bg-[#04060E] flex-1 flex flex-col justify-between space-y-4 lg:flex-none lg:row-span-3 lg:grid lg:grid-rows-subgrid">
        {/* Controles de visualização: Composto, Desktop, Mobile */}
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 lg:justify-center lg:gap-3">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-blue-500/15 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('composite')}
              aria-label="Ver mockup composto sobreposto"
              className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
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
              className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
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
              className={`flex items-center justify-center text-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
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
              onOpenZoom(
                viewMode === 'mobile' ? project.mobileImage : project.desktopImage,
                `${project.title} (${viewMode.toUpperCase()})`
              )
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Ampliar captura em alta resolução"
            aria-label="Ampliar captura em tela cheia"
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
                  className="aspect-[16/10] overflow-hidden bg-slate-900 cursor-zoom-in"
                  onClick={() => onOpenZoom(project.desktopImage, `${project.title} - Desktop`)}
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
                className="absolute right-1 sm:right-2 -bottom-1 sm:bottom-0 w-[36%] sm:w-[33%] max-w-[155px] sm:max-w-[170px] rounded-[20px] p-1.5 sm:p-2 bg-[#090d16] border-2 border-indigo-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] shadow-indigo-950/60 breakout-layer-front cursor-zoom-in z-20 hover:scale-105 transition-all duration-300"
                style={{ transform: 'translateZ(38px)' }}
                onClick={() => onOpenZoom(project.mobileImage, `${project.title} - Mobile`)}
                title="Clique para ampliar versão mobile"
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
                className="aspect-[16/10] overflow-hidden bg-slate-950 cursor-zoom-in"
                onClick={() => onOpenZoom(project.desktopImage, `${project.title} - Desktop`)}
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
                className="w-[210px] sm:w-[240px] max-w-full rounded-[26px] p-2 sm:p-2.5 bg-[#090d16] border-2 border-indigo-500/50 shadow-2xl shadow-black cursor-zoom-in"
                onClick={() => onOpenZoom(project.mobileImage, `${project.title} - Mobile`)}
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
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetails(project)}
              className="inline-flex items-center justify-center text-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-indigo-300 hover:text-white hover:bg-slate-800 border border-white/[0.08] transition-colors"
            >
              <span>Ver Case</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-1"
              title="Abrir site publicado em nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <a
            href={whatsappUrl(
              `Olá! 💻 Vi o projeto *${project.title}* no portfólio da *ēloSites*.\n\nGostei muito do resultado e gostaria de solicitar um orçamento para desenvolver um site similar para o meu negócio!`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white border border-emerald-400/40 shadow-md shadow-emerald-950/40 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] active:shadow-[0_0_28px_rgba(37,211,102,0.8)] hover:-translate-y-0.5 active:translate-y-0 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] duration-200"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
            <span className="text-white drop-shadow-sm text-center">Quero similar</span>
          </a>
        </div>
      </div>
    </article>
    </Interactive3DCard>
  );
};

interface PortfolioSectionProps {
  onNavigateToServices?: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onNavigateToServices,
}) => {
  const [filter, setFilter] = useState<'all' | 'landing' | 'institutional'>('all');
  const [zoomModal, setZoomModal] = useState<{ src: string; title: string } | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProjectData | null>(null);

  // Detecção de preferências de acessibilidade e redução de movimento
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const whatsappInquiryUrl = whatsappUrl(SITE_CONFIG.portfolioWhatsappMessage);

  return (
    <section
      id="portfolio"
      className="section-auto-contain pt-24 pb-3 sm:pt-28 sm:pb-4 lg:pt-32 lg:pb-5 bg-[#090D16]/30 backdrop-blur-[0.5px] relative"
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
              <span>Portfólio de Projetos Reais</span>
            </div>
            <SplitLines
              as="h2"
              text="Sites reais no ar, prontos para converter"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight"
            />
            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Explore nossos trabalhos recentes com alternador de tela Desktop e Mobile ou visualize o mockup composto sobreposto. Todos os projetos contam com código limpo, SEO técnico e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#a855f7] font-semibold">carregamento instantâneo</span>.
            </p>

            {/* Filtros de Categoria */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Todos ({PORTFOLIO_PROJECTS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('landing')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] ${
                  filter === 'landing'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Landing Pages
              </button>
              <button
                type="button"
                onClick={() => setFilter('institutional')}
                className={`inline-flex items-center justify-center text-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] ${
                  filter === 'institutional'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                Sites Institucionais
              </button>
            </div>
          </div>

          {/* Grade de Projetos Reais */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch lg:grid-rows-[repeat(8,auto)] portfolio-list"
          >
            {filteredProjects.map((project, index) => {
              const isOddLastOnTwoCols =
                filteredProjects.length === 3 && index === 2;
              return (
                <BiReveal
                  key={project.id}
                  direction={index % 2 === 0 ? 'left' : 'right'}
                  index={index}
                  className={`h-full lg:row-span-8 lg:grid lg:grid-rows-subgrid ${
                    isOddLastOnTwoCols
                      ? 'md:col-span-2 md:w-[calc(50%-0.5rem)] md:mx-auto lg:col-span-1 lg:w-full lg:mx-0'
                      : ''
                  }`}
                >
                  <Interactive3DCard maxTilt={5} className="h-full w-full">
                    <ProjectCard
                      project={project}
                      priority={index === 0}
                      onOpenZoom={(src, title) => setZoomModal({ src, title })}
                      onOpenDetails={(p) => setSelectedProject(p)}
                    />
                  </Interactive3DCard>
                </BiReveal>
              );
            })}
          </div>
        </div>

        {/* Banner Inferior com Conversão Direta e 3D Tilt com variantes dinâmicas */}
        <motion.div
          variants={getDynamicCardVariants(prefersReduced)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
          className="mt-4 sm:mt-5 w-full"
        >
          <Interactive3DCard maxTilt={3} className="w-full">
            <div className="glass-card-interactive surface-card portfolio-card scroll-perf-card p-6 sm:p-7 md:p-8 rounded-2xl bg-[#090E23] border border-blue-500/25 hover:border-blue-400/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl shadow-black/80 bracket-panel transition-all">
              <div className="space-y-2 text-left w-full lg:max-w-xl">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Gostou do nível dos projetos da ēloSites?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cada projeto recebe um orçamento específico baseado no escopo. 50% de entrada no início + 50% na aprovação final (PIX), 20% de desconto à vista, até 5x sem juros ou de 6x a 12x no cartão.
                </p>
              </div>

              <div className="card-action-cluster flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                {onNavigateToServices && (
                  <button
                    type="button"
                    onClick={onNavigateToServices}
                    className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border border-blue-400/40 shadow-lg shadow-blue-600/30 hover:shadow-[0_0_24px_rgba(59,130,246,0.55)] active:shadow-[0_0_32px_rgba(124,58,237,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <span className="text-center">Ver Formatos & Condições</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                )}
                <MagneticButton
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  strength={12}
                  glowColor="rgba(37, 211, 102, 0.45)"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-400/40 shadow-lg shadow-emerald-950/40 hover:shadow-[0_0_24px_rgba(37,211,102,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  ariaLabel="Solicitar Orçamento no WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span className="text-center">Solicitar Orçamento</span>
                </MagneticButton>
              </div>
            </div>
          </Interactive3DCard>
        </motion.div>
    </div>

      {/* Modal de Detalhes do Projeto (Challenge, Solution, Results) */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenZoom={(src, title) => setZoomModal({ src, title })}
      />

      {/* Modal de Zoom / Lightbox de Capturas em Alta Resolução */}
      <ScreenshotLightbox
        isOpen={!!zoomModal}
        src={zoomModal?.src || ''}
        title={zoomModal?.title || ''}
        onClose={() => setZoomModal(null)}
      />
    </section>
  );
};

export { TestimonialsSection } from './TestimonialsSection';
