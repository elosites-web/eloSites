import React from 'react';
import { useLogoTaglineWidth } from './useLogoTaglineWidth';

interface EloLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'menu';
  showTagline?: boolean;
  taglineClassName?: string;
  onClick?: () => void;
  isFooter?: boolean;
  buttonClassName?: string;
}

export const EloLogo: React.FC<EloLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  taglineClassName = '',
  onClick,
  isFooter = false,
  buttonClassName,
}) => {
  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    menu: 'nav-menu-logo-img',
  }[size];

  const taglineSizes = {
    sm: 'text-[7px] min-[360px]:text-[7.5px]',
    md: 'text-[7.5px] min-[380px]:text-[8.5px]',
    lg: 'text-[9px] min-[380px]:text-[10px]',
    menu: 'text-[6.5px] min-[360px]:text-[7px] sm:text-[7.5px] md:text-[8px] tracking-[0.08em] sm:tracking-[0.11em]',
  }[size];

  const { logoRef, logoWidth, handleImageLoad } = useLogoTaglineWidth<HTMLImageElement>();

  // Exceção explícita: no rodapé o layout original (alinhado ao início com estilos preexistentes)
  // é rigorosamente preservado conforme especificação
  if (isFooter && showTagline) {
    const footerContent = (
      <div className="elo-logo-floating inline-flex flex-col items-start leading-tight">
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
          className={
            buttonClassName ||
            'group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center shrink-0 cursor-pointer'
          }
          aria-label="ēloSites — Ir para a Página Inicial (Home)"
        >
          {footerContent}
        </button>
      );
    }
    return footerContent;
  }

  const isMenu = size === 'menu';
  const effectiveTaglineWidth = logoWidth ? logoWidth + 2 : undefined;

  const imgElement = (
    <img
      ref={logoRef}
      src="/logo-elosites-1360.png"
      alt="ēloSites — Logotipo Oficial"
      width={1360}
      height={337}
      fetchPriority="high"
      onLoad={handleImageLoad}
      className={`${heights} w-auto shrink-0 object-contain ${
        isMenu ? 'drop-shadow-[0_0_24px_rgba(59,130,246,0.45)]' : ''
      } ${className}`}
    />
  );

  const content = showTagline ? (
    <div className="inline-flex flex-col items-center leading-tight overflow-visible">
      {imgElement}
      <div
        style={{
          width: effectiveTaglineWidth ? `${effectiveTaglineWidth}px` : undefined,
          minWidth: effectiveTaglineWidth ? `${effectiveTaglineWidth}px` : 'auto',
        }}
        className="flex flex-col items-center justify-center text-center overflow-visible mt-1"
      >
        <span
          className={`inline-block w-max max-w-none text-center font-bold uppercase select-none whitespace-nowrap leading-none ${
            isMenu
              ? 'bg-gradient-to-r from-[#a855f7] via-[#818cf8] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(129,140,248,0.45)]'
              : 'text-slate-300'
          } ${taglineSizes} ${taglineClassName}`}
        >
          O melhor site pelo melhor preço
        </span>
      </div>
    </div>
  ) : (
    imgElement
  );

  const floatingContent = (
    <div className="elo-logo-floating inline-flex flex-col items-center justify-center">
      {content}
    </div>
  );

  if (onClick) {
    const defaultBtnClass = isMenu
      ? 'group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg p-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex flex-col items-center justify-center'
      : 'group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 text-left flex items-center shrink-0 cursor-pointer';

    return (
      <button
        type="button"
        onClick={onClick}
        className={buttonClassName || defaultBtnClass}
        aria-label="ēloSites — Ir para a Página Inicial (Home)"
      >
        {floatingContent}
      </button>
    );
  }

  return floatingContent;
};
