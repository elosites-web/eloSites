import React from 'react';
import { useLogoTaglineWidth } from './useLogoTaglineWidth';

interface EloLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  taglineClassName?: string;
  onClick?: () => void;
  isFooter?: boolean;
}

export const EloLogo: React.FC<EloLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  taglineClassName = '',
  onClick,
  isFooter = false,
}) => {
  const heights = { sm: 'h-6', md: 'h-8', lg: 'h-10' }[size];
  const taglineSizes = {
    sm: 'text-[7px] min-[360px]:text-[7.5px]',
    md: 'text-[7.5px] min-[380px]:text-[8.5px]',
    lg: 'text-[9px] min-[380px]:text-[10px]',
  }[size];

  const { logoRef, logoWidth, handleImageLoad } = useLogoTaglineWidth<HTMLImageElement>();

  // Exceção explícita: no rodapé o layout original (alinhado ao início com estilos preexistentes)
  // é rigorosamente preservado conforme especificação
  if (isFooter && showTagline) {
    const footerContent = (
      <div className="inline-flex flex-col items-start leading-tight">
        <img
          src="/logo-elosites-1360.png"
          alt="ēloSites — Logotipo Oficial"
          width={1360}
          height={337}
          fetchPriority="high"
          className={`${heights} w-auto shrink-0 object-contain ${className}`}
        />
        <span
          className={`font-semibold uppercase text-slate-400 select-none tracking-wider mt-0.5 ${taglineSizes} ${taglineClassName}`}
        >
          O melhor site pelo melhor preço
        </span>
      </div>
    );

    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center shrink-0 cursor-pointer"
          aria-label="ēloSites — Ir para a Página Inicial (Home)"
        >
          {footerContent}
        </button>
      );
    }
    return footerContent;
  }

  const imgElement = (
    <img
      ref={logoRef}
      src="/logo-elosites-1360.png"
      alt="ēloSites — Logotipo Oficial"
      width={1360}
      height={337}
      fetchPriority="high"
      onLoad={handleImageLoad}
      className={`${heights} w-auto shrink-0 object-contain ${className}`}
    />
  );

  const content = showTagline ? (
    <div className="inline-flex flex-col items-center leading-tight">
      {imgElement}
      <div
        style={{
          width: logoWidth ? `${logoWidth}px` : undefined,
          maxWidth: logoWidth ? `${logoWidth}px` : '100%',
        }}
        className="flex flex-col items-center justify-center text-center overflow-hidden"
      >
        <span
          className={`w-full text-center font-semibold uppercase text-slate-400 select-none tracking-wider mt-0.5 leading-tight ${taglineSizes} ${taglineClassName}`}
        >
          O melhor site pelo melhor preço
        </span>
      </div>
    </div>
  ) : (
    imgElement
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center shrink-0 cursor-pointer"
        aria-label="ēloSites — Ir para a Página Inicial (Home)"
      >
        {content}
      </button>
    );
  }

  return content;
};
