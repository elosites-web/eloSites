import React, { useLayoutEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label, input[type="submit"], input[type="button"], input[type="reset"], input[type="checkbox"], input[type="radio"], .pressable, .cta-primary, .cta-secondary';

const TEXT_INPUT_SELECTOR =
  'input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, [contenteditable="true"]';

// 6 partículas para um rastro com desvanecimento dinâmico suave
const TRAIL_SIZES = [5.5, 4.6, 3.8, 3.0, 2.3, 1.6];
const MAX_FADE_DISTANCE = 160; // Distância limite de dispersão para o desvanecimento progressivo

function centeredTransform(x: number, y: number) {
  return `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
}

export const CustomCursor: React.FC = React.memo(function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pointer = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const root = containerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const particles = trailRefs.current.flatMap((element, i) => element ? [{
      element, x: 0, y: 0,
      // Constante de tempo em ms: a cauda alcança o ponteiro depois da cabeça.
      decayMs: 14 + i * 7,
      alpha: 0.75 * ((TRAIL_SIZES.length - i) / TRAIL_SIZES.length) ** 1.15,
    }] : []);
    let visible = false;
    let frame: number | null = null;
    let previousTime = 0;

    function resetTrail() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      for (const particle of particles) {
        particle.x = pointer.current.x;
        particle.y = pointer.current.y;
        particle.element.style.opacity = '0';
      }
    }

    function animateTrail(time: number) {
      frame = null;
      const dt = Math.max(0, time - previousTime);
      previousTime = time;
      const { x, y } = pointer.current;
      let moving = false;
      for (const p of particles) {
        const weight = -Math.expm1(-dt / p.decayMs);
        p.x += (x - p.x) * weight;
        p.y += (y - p.y) * weight;
        const distance = Math.hypot(x - p.x, y - p.y);
        if (distance < 0.1) {
          p.x = x;
          p.y = y;
          p.element.style.opacity = '0';
          continue;
        }
        moving = true;
        p.element.style.transform = centeredTransform(p.x, p.y);
        const fade = Math.max(0, 1 - distance / MAX_FADE_DISTANCE) * Math.min(1, distance / 3);
        p.element.style.opacity = String(p.alpha * fade);
      }
      if (moving) frame = requestAnimationFrame(animateTrail);
    }

    const hide = () => {
      if (!visible) return;
      document.documentElement.classList.remove('custom-cursor-active');
      root.dataset.visible = 'false';
      visible = false;
      resetTrail();
    };

    const update = (event: PointerEvent) => {
      const target = event.target;
      if (event.pointerType !== 'mouse' || document.hidden ||
          (target instanceof Element && target.closest(TEXT_INPUT_SELECTOR))) {
        hide();
        return;
      }

      const x = event.clientX;
      const y = event.clientY;
      const moved = x !== pointer.current.x || y !== pointer.current.y;
      pointer.current.x = x;
      pointer.current.y = y;

      // O ponteiro principal é atualizado no evento. Só o rastro precisa de frames adicionais.
      const interactive = target instanceof Element && !!target.closest(INTERACTIVE_SELECTOR);
      const pressed = event.buttons !== 0;
      const scale = interactive ? (pressed ? 1.05 : 1.35) : (pressed ? 0.82 : 1);
      const position = centeredTransform(x, y);
      dot.style.transform = position;
      ring.style.transform = position + ` scale(${scale})`;
      if (ring.dataset.interactive !== String(interactive)) {
        dot.dataset.interactive = ring.dataset.interactive = String(interactive);
      }

      if (!visible) {
        resetTrail();
        root.dataset.visible = 'true';
        document.documentElement.classList.add('custom-cursor-active');
        visible = true;
      } else if (moved && !motion.matches && frame === null) {
        previousTime = performance.now();
        frame = requestAnimationFrame(animateTrail);
      }
    };

    const onVisibility = () => { if (document.hidden) hide(); };
    // A captura também acompanha controles que interrompem a propagação.
    const events = ['pointermove', 'pointerover', 'pointerdown', 'pointerup'] as const;
    for (const type of events) window.addEventListener(type, update, { capture: true, passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('pointercancel', hide, true);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', resetTrail);
    return () => {
      hide();
      for (const type of events) window.removeEventListener(type, update, true);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('pointercancel', hide, true);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', resetTrail);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-visible="false"
      className="custom-cursor-root pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
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
            className={`custom-cursor-trail pointer-events-none fixed top-0 left-0 rounded-full ${
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

      {/* Anel circular da mira com escala de interação e brilho de alta fidelidade */}
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
