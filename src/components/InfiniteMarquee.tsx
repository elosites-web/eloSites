import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface MarqueeItem {
  text: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  speed?: number; // segundos aproximados para o ciclo completo
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  ariaLabel?: string;
  showControls?: boolean;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  items,
  speed = 45,
  reverse = false,
  className = '',
  itemClassName = '',
  ariaLabel = 'Banner deslizante interativo',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<1 | -1>(reverse ? 1 : -1);

  // Armazenamento em refs para loop com requestAnimationFrame livre de re-renders
  const offsetRef = useRef<number>(0);
  const singleWidthRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(reverse ? 1 : -1);
  const isHoveredRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  // Atualiza refs quando props mudam
  useEffect(() => {
    directionRef.current = reverse ? 1 : -1;
    setCurrentDirection(directionRef.current);
  }, [reverse]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Mede a largura de 1 bloco de itens
  const updateSingleWidth = useCallback(() => {
    if (singleSetRef.current) {
      const rect = singleSetRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        singleWidthRef.current = rect.width;
      }
    }
  }, []);

  useEffect(() => {
    updateSingleWidth();
    const handleResize = () => updateSingleWidth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateSingleWidth, items]);

  // Loop contínuo com requestAnimationFrame
  useEffect(() => {
    if (isReduced) return;

    lastTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      const singleWidth = singleWidthRef.current || (singleSetRef.current?.getBoundingClientRect().width ?? 1200);
      singleWidthRef.current = singleWidth;

      if (!isDraggingRef.current && singleWidth > 0) {
        // Velocidade base em pixels por segundo
        const pxPerSec = singleWidth / Math.max(speed, 10);
        const effectiveSpeed = isHoveredRef.current ? pxPerSec * 0.35 : pxPerSec;

        offsetRef.current += directionRef.current * effectiveSpeed * dt;

        // Wrap contínuo sem cortes
        while (offsetRef.current <= -singleWidth) {
          offsetRef.current += singleWidth;
        }
        while (offsetRef.current > 0) {
          offsetRef.current -= singleWidth;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isReduced, speed]);

  // Handlers de interação tátil e mouse (Pointer Events)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignora caso o navegador não suporte
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const currentX = e.clientX;
    const delta = currentX - lastXRef.current;
    lastXRef.current = currentX;
    velocityRef.current = delta;

    offsetRef.current += delta;

    const singleWidth = singleWidthRef.current;
    if (singleWidth > 0) {
      while (offsetRef.current <= -singleWidth) {
        offsetRef.current += singleWidth;
      }
      while (offsetRef.current > 0) {
        offsetRef.current -= singleWidth;
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignora caso não tenha captura
    }

    // Se o usuário arrastou com velocidade nítida para a direita ou esquerda,
    // inverte ou adapta a direção natural do marquee para permitir voltar e ler!
    if (Math.abs(velocityRef.current) > 2) {
      const newDir: 1 | -1 = velocityRef.current > 0 ? 1 : -1;
      directionRef.current = newDir;
      setCurrentDirection(newDir);
    }
  };

  const toggleDirection = (dir: 1 | -1) => {
    directionRef.current = dir;
    setCurrentDirection(dir);
  };

  if (isReduced) {
    return (
      <div
        className={`overflow-x-auto py-3 no-scrollbar flex items-center gap-4 ${className}`}
        role="region"
        aria-label={ariaLabel}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/08 whitespace-nowrap text-xs font-medium text-slate-300 ${itemClassName}`}
          >
            {item.icon}
            <span>{item.text}</span>
            {item.badge && (
              <span className="text-[10px] text-cyan-400 font-mono-code">{item.badge}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Renderiza 3 blocos completos para garantir rolagem contínua infinita tanto para esquerda quanto para direita
  const renderItemSet = (isKeyRef = false) => (
    <div
      ref={isKeyRef ? singleSetRef : undefined}
      className="flex items-center gap-4 sm:gap-6 shrink-0"
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#090E23]/90 border border-blue-500/20 hover:border-cyan-400/50 hover:bg-[#0E1527] transition-colors duration-200 text-xs sm:text-sm font-medium text-slate-300 backdrop-blur-md shadow-md shadow-black/40 select-none ${itemClassName}`}
        >
          {item.icon && <span className="text-cyan-400 shrink-0">{item.icon}</span>}
          <span className="tracking-wide text-slate-100 whitespace-nowrap">{item.text}</span>
          {item.badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/90 text-cyan-300 border border-blue-500/30 font-mono font-medium shrink-0">
              {item.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`relative group/marquee ${className}`}>
      {/* Controles de direção táteis e acessíveis nas laterais (desktop e mobile) */}
      {showControls && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1 right-1 z-20 flex justify-between pointer-events-none opacity-0 group-hover/marquee:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDirection(1);
            }}
            aria-label="Deslizar para a direita (voltar itens)"
            title="Deslizar para a direita"
            className="pointer-events-auto p-1.5 rounded-full bg-slate-950/80 border border-blue-500/30 text-cyan-300 hover:text-white hover:bg-blue-600/60 shadow-lg shadow-black/60 transition-transform active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDirection(-1);
            }}
            aria-label="Deslizar para a esquerda (avançar itens)"
            title="Deslizar para a esquerda"
            className="pointer-events-auto p-1.5 rounded-full bg-slate-950/80 border border-blue-500/30 text-cyan-300 hover:text-white hover:bg-blue-600/60 shadow-lg shadow-black/60 transition-transform active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Container Principal com Máscara de Desfoque nas Bordas */}
      <div
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        className={`relative overflow-hidden select-none py-2.5 sm:py-3 cursor-grab active:cursor-grabbing touch-pan-y ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-4 sm:gap-6 will-change-transform whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {renderItemSet(true)}
          {renderItemSet(false)}
          {renderItemSet(false)}
        </div>
      </div>

      {/* Dica discreta ao passar o mouse ou interagir */}
      <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-slate-400/80 font-mono select-none">
        <span className="hidden sm:inline">↔ Arraste com o mouse ou toque para navegar livremente</span>
        <span className="sm:hidden">↔ Deslize para voltar ou avançar</span>
        <span className="inline-block px-1.5 py-0.2 rounded bg-slate-900 border border-white/10 text-cyan-400 text-[9px]">
          {currentDirection === -1 ? 'Fluxo: Avançando →' : 'Fluxo: Voltando ←'}
        </span>
      </div>
    </div>
  );
};
