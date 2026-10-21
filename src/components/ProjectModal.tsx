import React, { useEffect, useRef } from 'react';
import {
  ExternalLink,
  X,
  CheckCircle2,
  Target,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Layers,
  ZoomIn,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { PortfolioProjectData } from './PortfolioSection';
import { whatsappUrl } from '../types';
import { getPortfolioImageSource } from '../portfolioResponsiveImages';

export interface ProjectModalProps {
  project: PortfolioProjectData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenZoom?: (src: string, title: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenZoom,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Salva a posição exata de scroll da página ao abrir e restaura ao fechar,
  // impedindo rolagem do plano de fundo e evitando saltos na página.
  useEffect(() => {
    if (!isOpen || !project) return;

    scrollPositionRef.current = window.scrollY;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Garante que o scroll do modal inicie no topo imediatamente
    if (overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Restaura a posição original de rolagem da página
      window.scrollTo({
        top: scrollPositionRef.current,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    };
  }, [isOpen, project]);

  // Sempre que o projeto ou status abrir/mudar, reseta o scroll para o topo
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }
  }, [project?.id, isOpen]);

  if (!isOpen || !project) return null;

  const projectWhatsappMessage = `Olá! 💻 Estive analisando o case de sucesso *${project.title}* no portfólio da *ēloSites*.\n\nGostaria de entender melhor como vocês podem desenvolver uma solução personalizada com foco em conversão para o meu negócio!`;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="min-h-full w-full flex items-start justify-center p-3 sm:p-6 md:p-8 py-6 sm:py-10">
        <div
          ref={dialogRef}
          className="relative w-full max-w-4xl glass-panel bg-[#070B1A] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 my-auto sm:my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Sticky do Modal (com título, tags e botão de fechar acessível) */}
          <div className="sticky top-0 z-30 p-5 sm:p-6 bg-slate-950/95 backdrop-blur-md border-b border-white/[0.08] flex items-start justify-between gap-4 shrink-0 shadow-lg shadow-black/40">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
                  {project.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {project.status}
                </span>
              </div>
              <h2
                id="project-modal-title"
                className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight break-words"
              >
                {project.title}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-mono">
                <span className="text-indigo-400">🌐</span>
                <span className="text-slate-300 hover:text-white transition-colors">
                  {project.urlLabel}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar detalhes do projeto"
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-white/[0.12] transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo com fluxo de rolagem natural (sem área de scroll interna aninhada) */}
          <div className="p-5 sm:p-7 space-y-6 sm:space-y-8 text-slate-300">
            {/* Banner de Preview do Projeto com <picture> e WebP/AVIF otimizados */}
            <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-slate-950/70 p-2 sm:p-3">
              <div
                className={`rounded-lg overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-slate-900 ${
                  onOpenZoom ? 'cursor-zoom-in group relative' : ''
                }`}
                onClick={() => onOpenZoom?.(project.desktopImage, `${project.title} - Desktop`)}
                title={onOpenZoom ? 'Clique para ampliar captura em alta resolução' : undefined}
              >
                {(() => {
                  const previewSource = getPortfolioImageSource(project.desktopImage);
                  if (previewSource) {
                    return (
                      <picture className="w-full h-full block">
                        <source
                          type="image/avif"
                          srcSet={previewSource.avifSrcSet}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 860px"
                        />
                        <source
                          type="image/webp"
                          srcSet={previewSource.webpSrcSet}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 860px"
                        />
                        <img
                          src={previewSource.fallbackSrc}
                          alt={`Screenshot de ${project.title}`}
                          width={previewSource.width}
                          height={previewSource.height}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    );
                  }
                  return (
                    <img
                      src={project.desktopImage}
                      alt={`Screenshot de ${project.title}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                    />
                  );
                })()}
                {onOpenZoom && (
                  <div className="absolute bottom-2.5 right-2.5 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950/85 backdrop-blur-sm border border-white/[0.15] text-[11px] font-medium text-slate-200 group-hover:text-white shadow-md transition-colors">
                    <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ampliar captura</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seção 1: CHALLENGE / DESAFIO */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Target className="w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-white">
                  Desafio / Challenge
                </h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-300/95">
                {project.challenge}
              </p>
            </div>

            {/* Seção 2: SOLUTION / SOLUÇÃO */}
            <div className="p-5 sm:p-6 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-4">
              <div className="flex items-center gap-2.5 text-indigo-400">
                <Lightbulb className="w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-white">
                  Solução ēloSites / Solution
                </h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-300/95">
                {project.solution}
              </p>

              {/* Destaques e Features Implementadas */}
              {project.features && project.features.length > 0 && (
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                    Diferenciais Implementados:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                    {project.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags tecnológicas */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 border border-white/[0.06] text-[11px] font-medium text-slate-300"
                    >
                      <Layers className="w-3 h-3 text-indigo-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Seção 3: RESULTS / RESULTADOS */}
            <div className="p-5 sm:p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <TrendingUp className="w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-white">
                  Resultados / Results
                </h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                {project.resultsNote}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-emerald-300/80">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Estruturado com foco em conversão e carregamento ágil.</span>
              </div>
            </div>
          </div>

          {/* Rodapé com Ações: 'Ver Projeto Ao Vivo' + WhatsApp */}
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Ambiente publicado e verificado no ar.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Botão 'Ver Projeto Ao Vivo' */}
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30 group"
              >
                <span>Ver Projeto Ao Vivo</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Ação WhatsApp para Solicitar Projeto Similar */}
              <a
                href={whatsappUrl(projectWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-emerald-950/40 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Solicitar Projeto Similar</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
