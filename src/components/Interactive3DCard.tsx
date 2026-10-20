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
  maxTilt = 1.5,
  glare = true,
  animatedBorder = false,
  style = {},
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  const tier = getMotionTier();
  const tiltEnabled = !prefersReduced && tier === 'full' && maxTilt > 0;

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Tilt 3D ativado ESTRITAMENTE para mouse de desktop.
    // Toques de dedo (touch) nunca sofrem tilt, garantindo scroll nativo 100% fluido e livre.
    if (!tiltEnabled || e.pointerType !== 'mouse') return;
    const card = cardRef.current;
    if (!card) return;

    // ESTABILIZAÇÃO DE CLIQUES E BOTÕES:
    // Se o ponteiro estiver sobre botões de CTA, links, inputs ou controles interativos,
    // o cartão repousa plano (0deg), garantindo cliques firmes e sem balanço instável.
    const target = e.target as HTMLElement | null;
    const isOverInteractive = Boolean(
      target?.closest(
        'button, a, input, select, textarea, label, [role="button"], .cta-primary, .cta-secondary, .pressable, [data-interactive]'
      )
    );

    if (isOverInteractive) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      card.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      if (glareRef.current) glareRef.current.style.opacity = '0';
      return;
    }

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = Number((((y - centerY) / centerY) * -maxTilt).toFixed(2));
      const rotateY = Number((((x - centerX) / centerX) * maxTilt).toFixed(2));

      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      el.style.transition = 'transform 0.16s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.willChange = 'transform';
      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      if (glare && glareRef.current) {
        const gx = Math.round((x / rect.width) * 100);
        const gy = Math.round((y / rect.height) * 100);
        glareRef.current.style.background = `radial-gradient(circle 280px at ${gx}% ${gy}%, rgba(59, 130, 246, 0.12), transparent 70%)`;
        glareRef.current.style.opacity = '1';
      }
    });
  };

  const handlePointerLeave = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(() => {
        if (!cardRef.current) return;
        cardRef.current.style.willChange = 'auto';
        cardRef.current.style.transition = '';
      }, 420);
    }
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`interactive-3d-card-root relative rounded-2xl ${animatedBorder ? 'glow-border-animated' : ''} ${className}`}
      style={{
        transformStyle: tiltEnabled ? 'preserve-3d' : undefined,
        touchAction: 'pan-y',
        overscrollBehaviorY: 'auto',
        ...style,
      }}
    >
      {children}

      {/* Brilho especular dinâmico no mouse — pointer-events-none para nunca interceptar cliques/scroll */}
      {glare && tiltEnabled && (
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
