import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  animatedBorder?: boolean; // Borda animada em conic gradient
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  allowDrag?: boolean; // Mantido para compatibilidade de tipos, sem captura de toque para não bloquear o scroll
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  maxTilt: _maxTilt = 1.5,
  glare = true,
  animatedBorder = false,
  style = {},
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  const tier = getMotionTier();
  const glareEnabled = glare && !prefersReduced && tier !== 'none';

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!glareEnabled || (e.pointerType && e.pointerType !== 'mouse')) return;

    pointerPosRef.current.x = e.clientX;
    pointerPosRef.current.y = e.clientY;

    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const el = cardRef.current;
      const glareEl = glareRef.current;
      if (!el || !glareEl) return;

      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const x = pointerPosRef.current.x - rect.left;
      const y = pointerPosRef.current.y - rect.top;
      const gx = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
      const gy = Math.max(0, Math.min(100, Math.round((y / rect.height) * 100)));

      glareEl.style.background = `radial-gradient(circle 280px at ${gx}% ${gy}%, rgba(59, 130, 246, 0.12), transparent 70%)`;
      glareEl.style.opacity = '1';
    });
  };

  const handlePointerLeave = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className={`interactive-3d-card-root relative rounded-2xl ${animatedBorder ? 'glow-border-animated' : ''} ${className}`}
      style={{
        touchAction: 'pan-y',
        overscrollBehaviorY: 'auto',
        ...style,
      }}
    >
      {children}

      {/* Brilho especular dinâmico no mouse — pointer-events-none para nunca interceptar cliques/scroll */}
      {glareEnabled && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 z-20 overflow-hidden"
          style={{ opacity: 0 }}
        />
      )}
    </div>
  );
};

