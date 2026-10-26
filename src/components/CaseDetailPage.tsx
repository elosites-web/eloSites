import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Target,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Layers,
  CheckCircle2,
  Maximize2,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { PortfolioProjectData, preloadProjectWebpImages } from '../portfolioData';
import { whatsappUrl } from '../types';
import { getPortfolioImageSource } from '../portfolioResponsiveImages';

export interface CaseDetailPageProps {
  project: PortfolioProjectData;
  onBack: () => void;
  onOpenImage: (type: 'desktop' | 'mobile') => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({
  project,
  onBack,
  onOpenImage,
}) => {
  // Pré-carrega imediatamente com alta prioridade as imagens WebP deste projeto (desktop e mobile)
  useEffect(() => {
    preloadProjectWebpImages(project, 'high');
  }, [project]);

  // Tecla Escape para voltar ao portfólio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const projectWhatsappMessage = `Olá! 💻 Estive analisando o case de sucesso *${project.title}* no portfólio da *ēloSites*.\n\nGostaria de entender melhor como vocês podem desenvolver uma solução personalizada com foco em conversão para o meu negócio!`;

  return (
    <article
      id="case-detail-page"
      className="w-full min-h-screen pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative text-slate-100"
    >
      {/* Luz ambiente de fundo sutil */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/[0.06] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/[0.06] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        {/* Barra superior acessível de navegação (próxima ao topo) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#090e26] border border-blue-500/30 shadow-xl shadow-black/60">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-blue-400/40 hover:border-blue-300 transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Voltar para o Portfólio de Trabalhos"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Voltar ao Portfólio</span>
          </button>

          {/* Breadcrumb e Status */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm">
            <span className="text-slate-400">Portfólio</span>
            <span className="text-blue-500/60">/</span>
            <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
              {project.title}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-950/70 border border-emerald-400/40 px-2.5 py-0.5 rounded-full ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {project.status}
            </span>
          </div>
        </div>

        {/* Cabeçalho do Estudo de Caso */}
        <header className="p-6 sm:p-8 rounded-2xl bg-[#090e26] border border-blue-500/30 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono uppercase bg-blue-950 text-blue-200 border border-blue-400/40 px-3.5 py-1.5 rounded-full font-bold">
              {project.badge}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-blue-300 hover:text-white transition-colors bg-blue-950/60 border border-blue-400/30 px-3 py-1.5 rounded-lg"
              >
                <span>🌐</span>
                <span>{project.urlLabel}</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400 ml-0.5" />
              </a>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium max-w-3xl">
            Estudo de caso detalhado do projeto desenvolvido pela ēloSites, com foco em presença no Google, velocidade no celular e conversão rápida pelo WhatsApp.
          </p>

          {/* Botões Rápidos de Ação */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/40 shadow-lg shadow-blue-900/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all cursor-pointer"
            >
              <span>Ver Site Publicado</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={whatsappUrl(projectWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 border border-emerald-300 shadow-lg shadow-emerald-950/50 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-slate-950" />
              <span className="font-extrabold text-slate-950">Quero um Site Parecido</span>
            </a>
          </div>
        </header>

        {/* Capturas de Tela em Destaque (Desktop e Mobile) com Clique para Tela Cheia */}
        <section aria-labelledby="capturas-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="capturas-heading" className="text-xl sm:text-2xl font-bold font-display text-white">
              Capturas de Tela do Projeto
            </h2>
            <span className="text-xs text-slate-300 font-medium">
              Clique nas capturas para navegar e visualizar em tela cheia
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Captura Desktop */}
            <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#090e26] border border-blue-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span className="text-xs sm:text-sm font-bold text-white">Versão Desktop (Computador)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenImage('desktop')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-200 bg-[#0c122e] hover:bg-blue-950 border border-blue-400/40 transition-colors shadow-sm cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>Ver ampliado</span>
                </button>
              </div>

              <div
                onClick={() => onOpenImage('desktop')}
                className="group relative rounded-xl overflow-hidden border border-white/[0.12] bg-[#0c101a] cursor-pointer"
                title="Clique para abrir a captura desktop completa"
              >
                {/* Browser bar */}
                <div className="px-3 py-1.5 bg-slate-900 border-b border-white/[0.08] flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 bg-slate-950 rounded px-2.5 py-0.5 text-[11px] text-slate-300 font-mono truncate border border-white/[0.05]">
                    https://{project.urlLabel}
                  </div>
                </div>

                <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative">
                  {(() => {
                    const srcInfo = getPortfolioImageSource(project.desktopImage);
                    if (srcInfo) {
                      return (
                        <picture className="w-full h-full block">
                          <source type="image/avif" srcSet={srcInfo.avifSrcSet} sizes="(max-width: 1024px) 100vw, 680px" />
                          <source type="image/webp" srcSet={srcInfo.webpSrcSet} sizes="(max-width: 1024px) 100vw, 680px" />
                          <img
                            src={srcInfo.fallbackSrc}
                            alt={`Screenshot Desktop de ${project.title}`}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                            loading="eager"
                          />
                        </picture>
                      );
                    }
                    return (
                      <img
                        src={project.desktopImage}
                        alt={`Screenshot Desktop de ${project.title}`}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="eager"
                      />
                    );
                  })()}

                  <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-slate-950/90 text-white text-xs font-bold border border-blue-400/40 shadow-xl flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-blue-400" />
                      <span>Clique para ver imagem completa</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Captura Mobile */}
            <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090e26] border border-blue-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs sm:text-sm font-bold text-white">Versão Mobile (Celular)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenImage('mobile')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-200 bg-[#0c122e] hover:bg-blue-950 border border-indigo-400/40 transition-colors shadow-sm cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Ver ampliado</span>
                </button>
              </div>

              <div
                onClick={() => onOpenImage('mobile')}
                className="group relative rounded-2xl p-2 bg-[#090d16] border-2 border-indigo-500/40 cursor-pointer shadow-xl max-w-[240px] mx-auto"
                title="Clique para abrir a captura mobile completa"
              >
                <div className="w-12 h-1 bg-slate-700 mx-auto rounded-full mb-1.5" />
                <div className="rounded-[16px] overflow-hidden aspect-[9/16] bg-black border border-white/[0.1] relative">
                  {(() => {
                    const srcInfo = getPortfolioImageSource(project.mobileImage);
                    if (srcInfo) {
                      return (
                        <picture className="w-full h-full block">
                          <source type="image/avif" srcSet={srcInfo.avifSrcSet} sizes="240px" />
                          <source type="image/webp" srcSet={srcInfo.webpSrcSet} sizes="240px" />
                          <img
                            src={srcInfo.fallbackSrc}
                            alt={`Screenshot Mobile de ${project.title}`}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="eager"
                          />
                        </picture>
                      );
                    }
                    return (
                      <img
                        src={project.mobileImage}
                        alt={`Screenshot Mobile de ${project.title}`}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="eager"
                      />
                    );
                  })()}

                  <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 text-white text-[11px] font-bold border border-indigo-400/40 shadow-xl flex items-center gap-1.5">
                      <Maximize2 className="w-3 h-3 text-indigo-400" />
                      <span>Ampliar</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Blocos Principais: Desafio, Solução e Resultados */}
        <div className="space-y-6">
          {/* Seção 1: O DESAFIO DO NEGÓCIO */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#090e26] border border-blue-500/30 space-y-3.5 shadow-xl">
            <div className="flex items-center gap-2.5 text-amber-400">
              <Target className="w-5 h-5 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wide text-white">
                O Desafio do Negócio
              </h2>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium">
              {project.challenge}
            </p>
          </section>

          {/* Seção 2: SOLUÇÃO DESENVOLVIDA PELA ēloSites */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#090e26] border border-blue-500/30 space-y-5 shadow-xl">
            <div className="flex items-center gap-2.5 text-blue-400">
              <Lightbulb className="w-5 h-5 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wide text-white">
                Solução Desenvolvida pela ēloSites
              </h2>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium">
              {project.solution}
            </p>

            {/* Diferenciais Implementados */}
            {project.features && project.features.length > 0 && (
              <div className="pt-4 border-t border-blue-500/20 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-300">
                  Diferenciais e Recursos Implementados:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-slate-100 font-medium">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 bg-[#0c122e] p-3 rounded-xl border border-blue-500/20">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags tecnológicas */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c122e] border border-blue-400/30 text-xs font-semibold text-slate-200"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Seção 3: RESULTADOS E BENEFÍCIOS */}
          <section className="p-6 sm:p-7 rounded-2xl bg-[#090e26] border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <TrendingUp className="w-5 h-5 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wide text-white">
                Resultados e Benefícios Práticos
              </h2>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium">
              {project.resultsNote}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs sm:text-sm text-emerald-300 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{project.highlightNote || 'Estruturado para apresentar serviços com autoridade e levar clientes qualificados direto para o WhatsApp.'}</span>
            </div>
          </section>
        </div>

        {/* Banner Inferior com Conversão e Botão Voltar */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090e26] border border-blue-400/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Precisa de um site com essa qualidade?
            </h3>
            <p className="text-sm text-slate-200 font-medium">
              Orçamento transparente sem custos ocultos. 20% à vista no PIX ou até 5x sem juros.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-blue-400/40 transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Voltar ao Portfólio</span>
            </button>

            <a
              href={whatsappUrl(projectWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 border border-emerald-300 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-slate-950" />
              <span className="font-extrabold text-slate-950">Solicitar Orçamento</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
