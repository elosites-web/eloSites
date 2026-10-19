import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  useEffect(() => {
    if (isReduced) {
      setValue(to);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart curve
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = from + (to - from) * easeOutProgress;
            setValue(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setValue(to);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [from, to, duration, isReduced]);

  const formattedValue = value.toFixed(decimals);

  return (
    <span ref={ref} className={`tabular-nums font-mono-code ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};
