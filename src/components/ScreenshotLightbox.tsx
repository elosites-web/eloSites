import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getPortfolioImageSource } from '../portfolioResponsiveImages';

export interface ScreenshotLightboxProps {
  isOpen: boolean;
  src: string;
  title: string;
  onClose: () => void;
}

export const ScreenshotLightbox: React.FC<ScreenshotLightboxProps> = ({
  isOpen,
  src,
  title,
  onClose,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Identifica se a captura é mobile ou desktop com base no arquivo ou no título
  const isMobileScreenshot =
    src.toLowerCase().includes('mobile') || title.toLowerCase().includes('mobile');

  // Trava a rolagem do plano de fundo e restaura a posição original ao fechar
  useEffect(() => {
    if (!isOpen) return;

    scrollPositionRef.current = window.scrollY;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Sempre redefine a rolagem do lightbox para o topo no momento da abertura
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

      // Restaura a posição exata da página sem saltos
      window.scrollTo({
        top: scrollPositionRef.current,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    };
  }, [isOpen]);

  // Ao alternar imagens ou abrir uma nova captura, redefine o scroll para o topo da imagem
  useEffect(() => {
    if (isOpen && overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }
  }, [src, isOpen]);

  if (!isOpen || !src) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/92 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="min-h-full w-full flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 pt-4 sm:pt-6 pb-16">
        {/* Barra superior de controle sticky (fixada no topo visível com botão de fechar acessível) */}
        <div
          className={`sticky top-3 sm:top-5 z-40 w-full ${
            isMobileScreenshot ? 'max-w-md' : 'max-w-5xl'
          } bg-slate-950/95 backdrop-blur-md border border-white/[0.12] rounded-xl px-4 py-3 shadow-2xl flex items-center justify-between gap-3 mb-4 sm:mb-6`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-white truncate">
              {title}
            </span>
            <span
              className={`shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold border ${
                isMobileScreenshot
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30'
                  : 'bg-blue-950/80 text-blue-300 border-blue-500/30'
              }`}
            >
              {isMobileScreenshot ? 'Mobile' : 'Desktop'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ampliação"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-white/[0.12] transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Fechar</span>
          </button>
        </div>

        {/* Container da captura em alta resolução preservando aspect-ratio original */}
        <div
          className={`relative ${
            isMobileScreenshot
              ? 'w-full max-w-sm sm:max-w-md rounded-[26px] p-2 sm:p-2.5 bg-[#090d16] border-2 border-indigo-500/40'
              : 'w-full max-w-5xl rounded-xl border border-white/[0.12] bg-[#0c101a]'
          } shadow-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {isMobileScreenshot && (
            <div className="w-12 h-1 bg-slate-700/80 mx-auto rounded-full mb-2" />
          )}
          {(() => {
            const responsiveSource = getPortfolioImageSource(src);
            if (responsiveSource) {
              return (
                <picture className="w-full block">
                  <source
                    type="image/avif"
                    srcSet={responsiveSource.avifSrcSet}
                    sizes={
                      isMobileScreenshot
                        ? '(max-width: 640px) 100vw, 448px'
                        : '(max-width: 1024px) 100vw, 1024px'
                    }
                  />
                  <source
                    type="image/webp"
                    srcSet={responsiveSource.webpSrcSet}
                    sizes={
                      isMobileScreenshot
                        ? '(max-width: 640px) 100vw, 448px'
                        : '(max-width: 1024px) 100vw, 1024px'
                    }
                  />
                  <img
                    src={responsiveSource.fallbackSrc}
                    alt={title}
                    width={responsiveSource.width}
                    height={responsiveSource.height}
                    className="w-full h-auto object-contain block rounded-lg sm:rounded-xl"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                </picture>
              );
            }
            return (
              <img
                src={src}
                alt={title}
                className="w-full h-auto object-contain block rounded-lg sm:rounded-xl"
                loading="eager"
                decoding="async"
              />
            );
          })()}
        </div>

        {/* Dica de rolagem no rodapé para capturas longas */}
        <div
          className="mt-4 text-center text-xs text-slate-400 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          Role a página para visualizar a captura completa. Clique em Fechar ou pressione Esc para retornar.
        </div>
      </div>
    </div>
  );
};
