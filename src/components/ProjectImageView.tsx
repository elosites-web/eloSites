import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Monitor,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { PortfolioProjectData, preloadProjectWebpImages } from '../portfolioData';
import { whatsappUrl } from '../types';
import { getPortfolioImageSource } from '../portfolioResponsiveImages';

export interface ProjectImageViewProps {
  project: PortfolioProjectData;
  imageType: 'desktop' | 'mobile';
  onBack: () => void;
  onSwitchType: (type: 'desktop' | 'mobile') => void;
}

export const ProjectImageView: React.FC<ProjectImageViewProps> = ({
  project,
  imageType,
  onBack,
  onSwitchType,
}) => {
  // Pré-carrega ambas as capturas WebP do projeto para alternância instantânea entre Desktop e Mobile
  useEffect(() => {
    preloadProjectWebpImages(project, 'high');
  }, [project]);
  // Tecla Escape para voltar ao case
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

  const isMobile = imageType === 'mobile';
  const currentSrc = isMobile ? project.mobileImage : project.desktopImage;
  const imageSource = getPortfolioImageSource(currentSrc);

  const whatsappMessage = `Olá! 💻 Estive analisando a captura em alta resolução do case *${project.title}* (${isMobile ? 'Mobile' : 'Desktop'}) na *ēloSites*.\n\nGostaria de solicitar um orçamento para um site com esse padrão para o meu negócio!`;

  return (
    <article
      id="project-image-view"
      className="w-full min-h-screen pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 px-3 sm:px-6 lg:px-8 relative text-slate-100"
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/[0.05] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        {/* Barra superior acessível de controles e navegação rápida */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090e26] border border-blue-500/30 shadow-xl shadow-black/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-blue-400/40 hover:border-blue-300 transition-all cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Voltar para o Estudo de Caso"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Voltar ao Case</span>
            </button>

            {/* Alternador Desktop <-> Mobile */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-blue-500/20">
              <button
                type="button"
                onClick={() => onSwitchType('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isMobile
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => onSwitchType('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isMobile
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>

          {/* Breadcrumbs e Título */}
          <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <span className="text-slate-400">{project.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-white">
              {isMobile ? 'Captura Mobile Completa' : 'Captura Desktop Completa'}
            </span>
          </div>
        </div>

        {/* Informações da Captura */}
        <div className="text-center space-y-2 max-w-2xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {project.title} — Versão {isMobile ? 'Mobile (Celular)' : 'Desktop (Computador)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Role a página verticalmente para visualizar todos os detalhes e seções da página.
          </p>
        </div>

        {/* Container da Imagem em Alta Resolução — Normal vertical page scrolling */}
        <div className="flex justify-center w-full">
          {isMobile ? (
            /* Mockup Mobile em formato de celular com proporção natural */
            <div className="w-full max-w-md sm:max-w-lg rounded-[32px] p-2.5 sm:p-3 bg-[#090d16] border-2 border-indigo-500/50 shadow-2xl shadow-black">
              {/* Speaker pill */}
              <div className="w-16 h-1.5 bg-slate-700/80 mx-auto rounded-full mb-2.5" />

              <div className="rounded-[22px] overflow-hidden bg-black border border-white/[0.1] w-full">
                {imageSource ? (
                  <picture className="w-full block">
                    <source type="image/avif" srcSet={imageSource.avifSrcSet} sizes="(max-width: 640px) 100vw, 512px" />
                    <source type="image/webp" srcSet={imageSource.webpSrcSet} sizes="(max-width: 640px) 100vw, 512px" />
                    <img
                      src={imageSource.fallbackSrc}
                      alt={`Captura Mobile completa do site ${project.title}`}
                      width={imageSource.width}
                      height={imageSource.height}
                      className="w-full h-auto object-contain block"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                ) : (
                  <img
                    src={currentSrc}
                    alt={`Captura Mobile completa do site ${project.title}`}
                    className="w-full h-auto object-contain block"
                    loading="eager"
                  />
                )}
              </div>
            </div>
          ) : (
            /* Mockup Desktop em formato de janela de navegador com proporção natural */
            <div className="w-full max-w-6xl rounded-2xl overflow-hidden border border-blue-500/30 bg-[#0c101a] shadow-2xl shadow-black">
              {/* Browser window top bar */}
              <div className="px-4 py-2.5 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                </div>

                <div className="flex-1 max-w-md bg-slate-950 rounded-lg px-3 py-1 text-xs text-slate-300 font-mono truncate border border-white/[0.08] text-center">
                  https://{project.urlLabel}
                </div>

                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
                  title="Abrir site no ar em nova aba"
                >
                  <span className="hidden sm:inline">Visitar site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Imagem Desktop em tamanho integral proporcional */}
              <div className="w-full bg-slate-950">
                {imageSource ? (
                  <picture className="w-full block">
                    <source type="image/avif" srcSet={imageSource.avifSrcSet} sizes="(max-width: 1280px) 100vw, 1152px" />
                    <source type="image/webp" srcSet={imageSource.webpSrcSet} sizes="(max-width: 1280px) 100vw, 1152px" />
                    <img
                      src={imageSource.fallbackSrc}
                      alt={`Captura Desktop completa do site ${project.title}`}
                      width={imageSource.width}
                      height={imageSource.height}
                      className="w-full h-auto object-contain block"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                ) : (
                  <img
                    src={currentSrc}
                    alt={`Captura Desktop completa do site ${project.title}`}
                    className="w-full h-auto object-contain block"
                    loading="eager"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé da Visualização com Botões de Navegação e Ação */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090e26] border border-blue-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Ambiente verificado e publicado no ar sob medida pela ēloSites.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 border border-blue-400/40 transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Voltar ao Estudo de Caso</span>
            </button>

            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/40 transition-colors cursor-pointer shadow-md"
            >
              <span>Ver Site no Ar</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={whatsappUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 border border-emerald-300 shadow-md shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-slate-950" />
              <span className="font-extrabold text-slate-950">Solicitar Projeto Similar</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
