import React from 'react';

export interface FluidRippleFallbackProps {
  className?: string;
  variant?: 'fullscreen' | 'contained';
}

/**
 * Fundo estático de contingência CSS em degradê sutil e blur harmônico.
 * Não depende do Three.js nem inicializa contexto WebGL.
 */
export const FluidRippleFallback: React.FC<FluidRippleFallbackProps> = ({
  className = '',
  variant = 'fullscreen',
}) => {
  const isContained = variant === 'contained';
  return (
    <div
      aria-hidden="true"
      data-testid="fluid-ripple-css-fallback"
      className={`pointer-events-none ${
        isContained ? 'absolute inset-0' : 'fixed inset-0 -z-20'
      } overflow-hidden ${className}`}
    >
      <div className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-blue-600/10 blur-[130px] animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[140px] animate-pulse duration-[10000ms]" />
      <div className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-blue-500/[0.08] blur-[150px]" />
    </div>
  );
};
