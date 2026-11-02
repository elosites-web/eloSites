import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  strength?: number; // Mantido por compatibilidade de assinatura (sem deslocamento físico)
  glowColor?: string;
  ariaLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  className = '',
  strength: _strength = 0,
  glowColor = 'rgba(6, 182, 212, 0.35)',
  ariaLabel,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  const canGlow = !isReduced && getMotionTier() !== 'none';

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canGlow || (e.pointerType && e.pointerType !== 'mouse')) return;

    pointerPosRef.current.x = e.clientX;
    pointerPosRef.current.y = e.clientY;

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = buttonRef.current;
      const glowEl = glowRef.current;
      if (!el || !glowEl) return;

      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const gx = Math.max(0, Math.min(100, ((pointerPosRef.current.x - rect.left) / rect.width) * 100));
      const gy = Math.max(0, Math.min(100, ((pointerPosRef.current.y - rect.top) / rect.height) * 100));

      glowEl.style.background = `radial-gradient(circle 90px at ${gx}% ${gy}%, ${glowColor}, transparent 70%)`;
      glowEl.style.opacity = '1';
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  const commonProps = {
    className: `relative flex items-center justify-center font-medium transition-colors select-none overflow-hidden ${className}`,
    onClick,
    'aria-label': ariaLabel,
  };

  const glowSpan = canGlow ? (
    <span
      ref={glowRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit]"
      style={{ opacity: 0 }}
    />
  ) : null;

  return (
    <div
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className="inline-block"
    >
      {href ? (
        <a {...commonProps} href={href} target={target} rel={rel}>
          {glowSpan}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </a>
      ) : (
        <button {...commonProps} type="button">
          {glowSpan}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
      )}
    </div>
  );
};

