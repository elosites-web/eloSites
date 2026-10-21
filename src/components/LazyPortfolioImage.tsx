import React, { useState, useEffect, useRef } from 'react';

interface LazyPortfolioImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  rootMargin?: string;
  onClick?: () => void;
  priority?: boolean;
}

/**
 * LazyPortfolioImage: Carregador agressivo e performático baseado na API IntersectionObserver.
 * Adia a requisição de rede do arquivo de imagem até que o elemento esteja a 500px da viewport
 * (ou margem configurada), eliminando sobrecarga inicial de rede em conexões móveis.
 */
export const LazyPortfolioImage: React.FC<LazyPortfolioImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = 'relative w-full h-full overflow-hidden',
  rootMargin = '500px 0px 500px 0px',
  onClick,
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState<boolean>(priority);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

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

      {/* Elemento de imagem real: renderizado somente quando dentro da margem de 500px */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          decoding="async"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
