import React, { useState, useEffect, useRef } from 'react';
import { getPortfolioImageSource } from '../portfolioResponsiveImages';

export interface LazyPortfolioImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  rootMargin?: string;
  onClick?: () => void;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

/**
 * LazyPortfolioImage: Carregador agressivo e performático baseado na API IntersectionObserver
 * e suporte nativo a elementos <picture> com variantes otimizadas em WebP e AVIF com srcset responsivo.
 * Reduz drasticamente o tempo de LCP servindo imagens proporcionais à largura da viewport.
 */
export const LazyPortfolioImage: React.FC<LazyPortfolioImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = 'relative w-full h-full overflow-hidden',
  rootMargin = '500px 0px 500px 0px',
  onClick,
  priority = false,
  sizes,
  width,
  height,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const responsive = getPortfolioImageSource(src);
  const effectiveSizes = sizes || responsive?.defaultSizes;

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, priority, src]);

  // Se o src mudar (ex.: alternando entre projetos), reseta o estado de carregamento
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`${wrapperClassName} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Placeholder sutil enquanto a imagem ainda não entrou na margem de 500px ou não terminou de decodificar */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-[#070b18] flex items-center justify-center animate-pulse z-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-8 h-8 rounded-full border border-blue-500/20 bg-blue-950/30 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-blue-500/50" />
          </div>
        </div>
      )}

      {/* Fallback limpo caso ocorra erro no carregamento da imagem */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-3 text-center text-xs text-slate-400">
          <span>Prévia indisponível</span>
        </div>
      )}

      {/* Elemento <picture> responsivo com WebP / AVIF otimizados para reduzir o LCP */}
      {isInView && !hasError && (
        <picture className="w-full h-full block">
          {responsive?.avifSrcSet && (
            <source
              type="image/avif"
              srcSet={responsive.avifSrcSet}
              sizes={effectiveSizes}
            />
          )}
          {responsive?.webpSrcSet && (
            <source
              type="image/webp"
              srcSet={responsive.webpSrcSet}
              sizes={effectiveSizes}
            />
          )}
          <img
            src={responsive?.fallbackSrc || src}
            alt={alt}
            width={width || responsive?.width}
            height={height || responsive?.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`${className} transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      )}
    </div>
  );
};
