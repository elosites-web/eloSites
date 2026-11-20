import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export const WA_TIMINGS = {
  loadDelay: 30_000,
  skeleton: 700,
  statusRefresh: 60_000,
  pulseDelay: 5_000,
  first: 71_000,
  open: 10_000,
  repeat: 142_000,
} as const;

// Cada fase possui um único prazo. Na pausa, descontamos só o tempo decorrido desde a retomada.
export function useEligibleTimeout(duration: number, running: boolean, advance: () => void) {
  const remaining = useRef(duration);
  useLayoutEffect(() => {
    remaining.current = duration;
  }, [duration]);
  useLayoutEffect(() => {
    if (!running) return;
    const deadline = performance.now() + remaining.current;
    const id = window.setTimeout(advance, Math.ceil(remaining.current));
    return () => {
      window.clearTimeout(id);
      remaining.current = Math.max(0, deadline - performance.now());
    };
  }, [duration, running, advance]);
}

export function useWhatsAppSchedule(eligible: boolean, bubbleVisible: boolean) {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [requested, setRequested] = useState(false);
  const [phase, setPhase] = useState<'first' | 'open' | 'repeat'>('first');
  const [held, setHeld] = useState(false);

  useEffect(() => {
    let timer: number;
    const onLoad = () => {
      setLoaded(true);
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const elapsed = navigation?.loadEventStart ? performance.now() - navigation.loadEventStart : 0;
      timer = window.setTimeout(() => setReady(true), Math.ceil(Math.max(0, WA_TIMINGS.loadDelay - elapsed)));
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(timer);
    };
  }, []);

  useLayoutEffect(() => {
    if (ready && eligible) setRequested(true);
    if (!eligible) setHeld(false);
  }, [eligible, ready]);

  const advance = useCallback(() => {
    const next = phase === 'open' ? 'repeat' : 'open';
    setPhase(current => current === phase ? next : current);
  }, [phase]);
  const close = useCallback(() => {
    setPhase(previous => previous === 'open' ? 'repeat' : previous);
    setHeld(false);
  }, []);

  const open = phase === 'open';
  const counting = loaded && eligible && (!open || (bubbleVisible && !held));
  useEligibleTimeout(WA_TIMINGS[phase], counting, advance);
  return { requested, open, held, setHeld, close };
}
