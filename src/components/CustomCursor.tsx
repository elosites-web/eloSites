import React, { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label, input[type="submit"], input[type="button"], input[type="reset"], input[type="checkbox"], input[type="radio"], .pressable, .cta-primary, .cta-secondary';

const TEXT_INPUT_SELECTOR =
  'input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, [contenteditable="true"]';

// 6 partículas em cascata para um rastro com desvanecimento dinâmico suave
const TRAIL_COUNT = 6;
const TRAIL_SIZES = [5.5, 4.6, 3.8, 3.0, 2.3, 1.6];
const MAX_FADE_DISTANCE = 160; // Distância limite de dispersão para o desvanecimento progressivo

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
  const prevTargetPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const ringPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const trailPosRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );

  // Estados de física e dinâmica
  const velocityRef = useRef<number>(0);
  const ringScaleRef = useRef<number>(1);
  const isMouseDownRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(false);
  const isOverTextRef = useRef<boolean>(false);
  const isInteractiveRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);
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

      // 1. Ponto central da mira: acompanha instantaneamente com latência zero
      dotEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) translate(-50%, -50%)`;

      if (reduced) {
        ringPosRef.current.x = tx;
        ringPosRef.current.y = ty;
        ringEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) translate(-50%, -50%)`;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          const tEl = trailRefs.current[i];
          if (tEl) tEl.style.opacity = '0';
        }
        return;
      }

      // Calcula a velocidade do mouse para complementar o rastro dinâmico
      const dxMove = tx - prevTargetPosRef.current.x;
      const dyMove = ty - prevTargetPosRef.current.y;
      const instantVelocity = Math.hypot(dxMove, dyMove);
      velocityRef.current += (instantVelocity - velocityRef.current) * 0.35;
      prevTargetPosRef.current.x = tx;
      prevTargetPosRef.current.y = ty;

      // 2. Interpolação suave de escala do anel com lerping (hover em links/botões e clique)
      let targetScale = 1;
      if (isInteractiveRef.current) {
        targetScale = isMouseDownRef.current ? 1.05 : 1.35;
      } else if (isMouseDownRef.current) {
        targetScale = 0.82;
      }
      ringScaleRef.current += (targetScale - ringScaleRef.current) * 0.22;
      const currentScale = ringScaleRef.current;

      // 3. Interpolação com lerping (desaceleração suavizada) para o anel externo
      const ringLerp = 0.40;
      const rx = ringPosRef.current.x + (tx - ringPosRef.current.x) * ringLerp;
      const ry = ringPosRef.current.y + (ty - ringPosRef.current.y) * ringLerp;
      ringPosRef.current.x = rx;
      ringPosRef.current.y = ry;

      ringEl.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%) scale(${currentScale.toFixed(3)})`;

      let maxDelta = Math.hypot(tx - rx, ty - ry);
      let leaderX = rx;
      let leaderY = ry;

      // 4. Perseguição orgânica em cascata (lerping) e desvanecimento dinâmico por distância
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const current = trailPosRef.current[i];

        // Lerping com desaceleração progressiva: cada ponto segue o anterior com amortecimento suave
        const lerpFactor = 0.44 - i * 0.045; // 0.44, 0.395, 0.35, 0.305, 0.26, 0.215
        current.x += (leaderX - current.x) * lerpFactor;
        current.y += (leaderY - current.y) * lerpFactor;

        const deltaFromLeader = Math.hypot(leaderX - current.x, leaderY - current.y);
        maxDelta = Math.max(maxDelta, deltaFromLeader);

        // Distância euclidiana exata deste ponto em relação à posição atual do mouse (tx, ty)
        const distFromMouse = Math.hypot(current.x - tx, current.y - ty);

        // Desvanecimento dinâmico do rastro com base na distância em relação ao mouse:
        // A opacidade diminui progressivamente conforme o ponto se afasta da posição do mouse
        const distanceFade = Math.max(0, 1 - distFromMouse / MAX_FADE_DISTANCE);
        const rankFade = Math.pow((TRAIL_COUNT - i) / TRAIL_COUNT, 1.15); // Decaimento progressivo ao longo do rastro
        // Suavização no repouso: ao aproximar do centro (< 3px), o rastro se extingue suavemente
        const motionFade = Math.min(1, distFromMouse / 3.0);

        const targetOpacity =
          isVisibleRef.current && !isOverTextRef.current
            ? Math.max(0, Math.min(0.75, 0.75 * rankFade * distanceFade * motionFade)).toFixed(3)
            : '0';

        const tEl = trailRefs.current[i];
        if (tEl) {
          tEl.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
          tEl.style.opacity = targetOpacity;
        }

        leaderX = current.x;
        leaderY = current.y;
      }

      // Ciclo contínuo no requestAnimationFrame enquanto houver movimento (> 0.06px); repousa quando estabilizado
      if ((maxDelta > 0.06 || velocityRef.current > 0.04) && isVisibleRef.current) {
        rafIdRef.current = window.requestAnimationFrame(renderFrame);
      } else {
        // Estabiliza e economiza 100% de CPU com o cursor em repouso
        ringPosRef.current.x = tx;
        ringPosRef.current.y = ty;
        velocityRef.current = 0;
        for (let i = 0; i < TRAIL_COUNT; i++) {
          trailPosRef.current[i].x = tx;
          trailPosRef.current[i].y = ty;
          const tEl = trailRefs.current[i];
          if (tEl) tEl.style.opacity = '0';
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
      updateNativeCursorState(isInitializedRef.current && visible);
    };

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
        prevTargetPosRef.current.x = x;
        prevTargetPosRef.current.y = y;
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

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      isMouseDownRef.current = true;
      scheduleFrame();
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      isMouseDownRef.current = false;
      scheduleFrame();
    };

    const handlePointerLeaveWindow = () => {
      isVisibleRef.current = false;
      isMouseDownRef.current = false;
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

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        isMouseDownRef.current = false;
        setContainerVisibility(false);
        stopLoop();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeaveWindow, { passive: true });
    document.addEventListener('pointerenter', handlePointerEnterWindow, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    return () => {
      stopLoop();
      updateNativeCursorState(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
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
      {/* Série de pontos do rastro com desvanecimento dinâmico por distância */}
      {TRAIL_SIZES.map((sizePx, idx) => {
        const isHead = idx < 2;
        const isMid = idx >= 2 && idx < 4;
        return (
          <div
            key={idx}
            ref={(el) => {
              trailRefs.current[idx] = el;
            }}
            className={`custom-cursor-trail pointer-events-none fixed top-0 left-0 rounded-full transition-transform duration-75 ease-out ${
              isHead
                ? 'bg-cyan-400'
                : isMid
                ? 'bg-sky-400'
                : 'bg-gradient-to-r from-sky-400 to-indigo-400'
            }`}
            style={{
              width: `${sizePx}px`,
              height: `${sizePx}px`,
              opacity: 0,
              boxShadow: isHead
                ? '0 0 8px rgba(56, 189, 248, 0.7)'
                : isMid
                ? '0 0 7px rgba(14, 165, 233, 0.6)'
                : '0 0 6px rgba(99, 102, 241, 0.5)',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}

      {/* Anel circular da mira com escala suave e brilho de alta fidelidade */}
      <div
        ref={ringRef}
        data-interactive="false"
        className="custom-cursor-ring pointer-events-none fixed top-0 left-0 w-7 h-7 rounded-full border border-cyan-400/60 bg-blue-500/[0.04] shadow-[0_0_14px_rgba(56,189,248,0.3),inset_0_0_6px_rgba(59,130,246,0.2)] transition-[border-color,background-color,box-shadow] duration-200 ease-out"
        style={{
          willChange: 'transform',
        }}
      />

      {/* Ponto central de mira instantânea sem latência */}
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
