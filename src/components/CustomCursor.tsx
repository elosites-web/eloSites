import React, { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label, input[type="submit"], input[type="button"], input[type="reset"], input[type="checkbox"], input[type="radio"], .pressable, .cta-primary, .cta-secondary';

const TEXT_INPUT_SELECTOR =
  'input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, [contenteditable="true"]';

const TRAIL_COUNT = 2; // Rastro discreto e leve com apenas 2 elementos auxiliares

export const CustomCursor: React.FC = React.memo(function CustomCursor() {
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rafIdRef = useRef<number | null>(null);
  const targetPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const ringPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const trailPosRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const isVisibleRef = useRef(false);
  const isOverTextRef = useRef(false);
  const isInteractiveRef = useRef(false);
  const isInitializedRef = useRef(false);
  const prefersReducedMotionRef = useRef<boolean>(
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const pointerMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncCapabilities = () => {
      prefersReducedMotionRef.current = motionMq.matches;
      setIsSupported(pointerMq.matches);
    };

    syncCapabilities();

    pointerMq.addEventListener('change', syncCapabilities);
    motionMq.addEventListener('change', syncCapabilities);

    return () => {
      pointerMq.removeEventListener('change', syncCapabilities);
      motionMq.removeEventListener('change', syncCapabilities);
    };
  }, []);

  useEffect(() => {
    if (!isSupported) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    const stopLoop = () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const updateNativeCursorState = (shouldHideNative: boolean) => {
      if (shouldHideNative) {
        document.documentElement.classList.add('custom-cursor-active');
      } else {
        document.documentElement.classList.remove('custom-cursor-active');
      }
    };

    const renderFrame = () => {
      rafIdRef.current = null;

      const dotEl = dotRef.current;
      const ringEl = ringRef.current;
      if (!dotEl || !ringEl) return;

      const tx = targetPosRef.current.x;
      const ty = targetPosRef.current.y;
      const reduced = prefersReducedMotionRef.current;
      const scale = isInteractiveRef.current ? 1.3 : 1;

      // Ponto central da mira acompanha o ponteiro imediatamente sem latência
      dotEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) translate(-50%, -50%)`;

      if (reduced) {
        ringPosRef.current.x = tx;
        ringPosRef.current.y = ty;
        ringEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale})`;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          const tEl = trailRefs.current[i];
          if (tEl) tEl.style.opacity = '0';
        }
        return;
      }

      // Anel da mira acompanha com amortecimento ágil (0.78) para máxima responsividade
      const rx = ringPosRef.current.x + (tx - ringPosRef.current.x) * 0.78;
      const ry = ringPosRef.current.y + (ty - ringPosRef.current.y) * 0.78;
      ringPosRef.current.x = rx;
      ringPosRef.current.y = ry;

      ringEl.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale})`;

      let maxDelta = Math.hypot(tx - rx, ty - ry);
      let leadX = rx;
      let leadY = ry;

      // Rastro curto e suave: converge rapidamente sem movimentos residuais longos
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const current = trailPosRef.current[i];
        const factor = 0.58 - i * 0.12;
        current.x += (leadX - current.x) * factor;
        current.y += (leadY - current.y) * factor;
        const trailDelta = Math.hypot(leadX - current.x, leadY - current.y);
        maxDelta = Math.max(maxDelta, trailDelta);

        const tEl = trailRefs.current[i];
        if (tEl) {
          tEl.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
          // Rastro discreto com opacidade decrescente
          tEl.style.opacity = isVisibleRef.current && !isOverTextRef.current ? String(0.28 - i * 0.1) : '0';
        }

        leadX = current.x;
        leadY = current.y;
      }

      // Evita loops permanentes quando o cursor estiver parado: se delta < 0.2px, estabiliza e para o RAF
      if (maxDelta > 0.2 && isVisibleRef.current) {
        rafIdRef.current = window.requestAnimationFrame(renderFrame);
      } else {
        // Estabiliza as coordenadas para prevenir drift
        ringPosRef.current.x = tx;
        ringPosRef.current.y = ty;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          trailPosRef.current[i].x = tx;
          trailPosRef.current[i].y = ty;
        }
      }
    };

    const scheduleFrame = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(renderFrame);
      }
    };

    const setContainerVisibility = (visible: boolean) => {
      const container = containerRef.current;
      if (!container) return;
      container.dataset.visible = visible ? 'true' : 'false';
      // Só oculta o cursor nativo após a mira estar inicializada e visível
      updateNativeCursorState(isInitializedRef.current && visible);
    };

    // Detecção com Pointer Events; ignora toques e canetas stylus
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') {
        return;
      }

      const x = e.clientX;
      const y = e.clientY;
      targetPosRef.current.x = x;
      targetPosRef.current.y = y;

      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        ringPosRef.current.x = x;
        ringPosRef.current.y = y;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          trailPosRef.current[i].x = x;
          trailPosRef.current[i].y = y;
        }
      }

      const target = e.target as Element | null;
      const overText = Boolean(target && typeof target.closest === 'function' && target.closest(TEXT_INPUT_SELECTOR));
      const overInteractive = Boolean(
        !overText && target && typeof target.closest === 'function' && target.closest(INTERACTIVE_SELECTOR)
      );

      if (overText !== isOverTextRef.current) {
        isOverTextRef.current = overText;
      }

      if (overInteractive !== isInteractiveRef.current) {
        isInteractiveRef.current = overInteractive;
        if (ringRef.current) {
          ringRef.current.dataset.interactive = overInteractive ? 'true' : 'false';
        }
        if (dotRef.current) {
          dotRef.current.dataset.interactive = overInteractive ? 'true' : 'false';
        }
      }

      const shouldShow = !overText;
      isVisibleRef.current = true;
      setContainerVisibility(shouldShow);
      scheduleFrame();
    };

    const handlePointerLeaveWindow = () => {
      isVisibleRef.current = false;
      setContainerVisibility(false);
      stopLoop();
    };

    const handlePointerEnterWindow = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (!isInitializedRef.current) return;
      isVisibleRef.current = true;
      setContainerVisibility(!isOverTextRef.current);
      scheduleFrame();
    };

    // Pausa processamento ao ocultar a aba
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        setContainerVisibility(false);
        stopLoop();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeaveWindow, { passive: true });
    document.addEventListener('pointerenter', handlePointerEnterWindow, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    return () => {
      stopLoop();
      updateNativeCursorState(false);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeaveWindow);
      document.removeEventListener('pointerenter', handlePointerEnterWindow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSupported]);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-visible="false"
      className="custom-cursor-root pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-150"
    >
      {/* Rastro curto e delicado */}
      {Array.from({ length: TRAIL_COUNT }).map((_, idx) => {
        const sizePx = 4.5 - idx * 1.0;
        return (
          <div
            key={idx}
            ref={(el) => {
              trailRefs.current[idx] = el;
            }}
            className="custom-cursor-trail pointer-events-none fixed top-0 left-0 rounded-full bg-cyan-400/70"
            style={{
              width: `${sizePx}px`,
              height: `${sizePx}px`,
              opacity: 0,
              boxShadow: '0 0 6px rgba(56, 189, 248, 0.4)',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}

      {/* Anel circular fino da mira com brilho azul/ciano suave */}
      <div
        ref={ringRef}
        data-interactive="false"
        className="custom-cursor-ring pointer-events-none fixed top-0 left-0 w-7 h-7 rounded-full border border-cyan-400/60 bg-blue-500/[0.04] shadow-[0_0_14px_rgba(56,189,248,0.28),inset_0_0_6px_rgba(59,130,246,0.2)] transition-[border-color,background-color,box-shadow] duration-150 ease-out"
        style={{
          willChange: 'transform',
        }}
      />

      {/* Ponto central pequeno da mira */}
      <div
        ref={dotRef}
        data-interactive="false"
        className="custom-cursor-dot pointer-events-none fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.9)] transition-colors duration-150"
        style={{
          willChange: 'transform',
        }}
      />
    </div>
  );
});
