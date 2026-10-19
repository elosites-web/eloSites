import React, { useEffect, useRef } from 'react';
import {
  ExternalLink,
  X,
  CheckCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { PortfolioProjectData } from './PortfolioSection';
import { whatsappUrl } from '../types';

export interface ProjectModalProps {
  project: PortfolioProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen || !project) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const projectWhatsappMessage = `Olá! 💻 Estive analisando o case de sucesso *${project.title}* no portfólio da *ēloSites*.\n\nGostaria de entender melhor como vocês podem desenvolver uma solução personalizada com foco em conversão para o meu negócio!`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-4xl max-h-[92vh] glass-panel border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo do Modal */}
        <div className="p-5 sm:p-6 bg-slate-950/90 border-b border-white/[0.08] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-2">
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
              className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight"
            >
              {project.title}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-mono">
              <span className="text-indigo-400">🌐</span>
              <span className="hover:text-slate-200 transition-colors">{project.urlLabel}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes do projeto"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-white/[0.06] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável com as seções estruturadas: Challenge, Solution, Results */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6 sm:space-y-8 text-slate-300">
          {/* Banner de Preview do Projeto */}
          <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-slate-950/70 p-2 sm:p-3">
            <div className="rounded-lg overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-slate-900">
              <img
                src={project.desktopImage}
                alt={`Screenshot de ${project.title}`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
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
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
              <span>Otimizado para máxima taxa de conversão e carregamento instantâneo.</span>
            </div>
          </div>
        </div>

        {/* Rodapé Persistente (Sticky Footer) com Ações: 'View Live Project' + WhatsApp */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:block text-xs text-slate-400">
            Ambiente publicado e verificado no ar.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Botão Persistente 'View Live Project' */}
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] border border-indigo-400/30 group"
            >
              <span>Ver Projeto Ao Vivo</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Ação WhatsApp para Solicitar Projeto Similar */}
            <a
              href={whatsappUrl(projectWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-emerald-950/40 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops]"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Solicitar Projeto Similar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
