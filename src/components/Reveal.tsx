import React, { useEffect, useRef, useState } from 'react';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';
import { useScrollDirection } from '../useScrollDirection';
import { useReducedMotion } from 'motion/react';

export { BiReveal } from './BiReveal';

interface UseRevealOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(options: UseRevealOptions = {}) {
  const { once = false, threshold = 0.12, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const enabled = useRef(getMotionTier() !== 'none');

  useEffect(() => {
    if (!enabled.current) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setVisible(entry.isIntersecting);
          if (entry.isIntersecting && once) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, visible, enabled: enabled.current };
}

interface RevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  y?: number;
  direction?: 'left' | 'right' | 'up' | 'down' | 'auto';
  index?: number;
  variant?: 'fade' | 'mask';
  once?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  as,
  className = '',
  delay = 0,
  y,
  direction = 'up',
  index,
  once = false,
  id,
  style,
}) => {
  const Tag = (as ?? 'div') as React.ElementType;
  const { ref, visible, enabled } = useReveal<HTMLElement>({ once });
  const { direction: scrollDir } = useScrollDirection();
  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia() || !enabled);

  const effectiveDirection =
    direction === 'auto'
      ? index !== undefined
        ? index % 2 === 0
          ? 'left'
          : 'right'
        : 'up'
      : direction;

  const dist = y ?? (effectiveDirection === 'up' || effectiveDirection === 'down' ? 28 : 48);

  let transformHidden = 'none';
  if (!isReduced) {
    if (scrollDir === 'down') {
      switch (effectiveDirection) {
        case 'left':
          transformHidden = `translate3d(-${dist}px, 0, 0)`;
          break;
        case 'right':
          transformHidden = `translate3d(${dist}px, 0, 0)`;
          break;
        case 'up':
          transformHidden = `translate3d(0, ${dist}px, 0)`;
          break;
        case 'down':
          transformHidden = `translate3d(0, -${dist}px, 0)`;
          break;
      }
    } else {
      // Reversão bidirecional ao rolar para cima
      switch (effectiveDirection) {
        case 'left':
          transformHidden = `translate3d(${dist}px, 0, 0)`;
          break;
        case 'right':
          transformHidden = `translate3d(-${dist}px, 0, 0)`;
          break;
        case 'up':
          transformHidden = `translate3d(0, -${dist}px, 0)`;
          break;
        case 'down':
          transformHidden = `translate3d(0, ${dist}px, 0)`;
          break;
      }
    }
  }

  const mergedStyle: React.CSSProperties = {
    ...style,
    opacity: visible || isReduced ? 1 : 0,
    transform: visible || isReduced ? 'translate3d(0, 0, 0)' : transformHidden,
    willChange: !visible && !isReduced ? 'transform, opacity' : 'auto',
    transition: isReduced
      ? 'opacity 0.2s ease-out'
      : `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  };

  return (
    <Tag ref={ref} id={id} className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
};
