import React, { useRef, useEffect, useState } from 'react';
import { useScrollDirection } from '../useScrollDirection';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';
import { useReducedMotion } from 'motion/react';

export type RevealDirection = 'left' | 'right' | 'up' | 'down' | 'auto';

interface BiRevealProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  direction?: RevealDirection;
  index?: number;
  delay?: number;
  distance?: number;
  duration?: number;
  id?: string;
  style?: React.CSSProperties;
}

export const BiReveal: React.FC<BiRevealProps> = ({
  children,
  as: Component = 'div',
  className = '',
  direction = 'auto',
  index,
  delay = 0,
  distance,
  duration = 0.55,
  id,
  style,
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const { direction: scrollDir } = useScrollDirection();

  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia() || getMotionTier() === 'none');

  // Determina a direção efetiva (se auto, alterna baseado no index)
  const effectiveDirection: RevealDirection =
    direction === 'auto'
      ? index !== undefined
        ? index % 3 === 0
          ? 'left'
          : index % 3 === 1
          ? 'right'
          : 'up'
        : 'left'
      : direction;

  const resolvedDistance = distance ?? (effectiveDirection === 'up' || effectiveDirection === 'down' ? 36 : 56);

  useEffect(() => {
    if (isReduced) {
      setIsInView(true);
      return;
    }

    const el = elementRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsInView(entry.isIntersecting);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isReduced]);

  // Cálculo da transformação inicial/reversa baseado na direção do scroll
  let transformHidden = 'none';

  if (!isReduced) {
    if (scrollDir === 'down') {
      // Rolando para baixo: entra pela direção padrão
      switch (effectiveDirection) {
        case 'left':
          transformHidden = `translate3d(-${resolvedDistance}px, 0, 0)`;
          break;
        case 'right':
          transformHidden = `translate3d(${resolvedDistance}px, 0, 0)`;
          break;
        case 'up':
          transformHidden = `translate3d(0, ${resolvedDistance}px, 0)`;
          break;
        case 'down':
          transformHidden = `translate3d(0, -${resolvedDistance}px, 0)`;
          break;
        default:
          transformHidden = `translate3d(-${resolvedDistance}px, 0, 0)`;
      }
    } else {
      // Rolando para CIMA: movimentos invertidos ao contrário conforme solicitado
      switch (effectiveDirection) {
        case 'left':
          transformHidden = `translate3d(${resolvedDistance}px, 0, 0)`;
          break;
        case 'right':
          transformHidden = `translate3d(-${resolvedDistance}px, 0, 0)`;
          break;
        case 'up':
          transformHidden = `translate3d(0, -${resolvedDistance}px, 0)`;
          break;
        case 'down':
          transformHidden = `translate3d(0, ${resolvedDistance}px, 0)`;
          break;
        default:
          transformHidden = `translate3d(${resolvedDistance}px, 0, 0)`;
      }
    }
  }

  const Tag = Component as any;

  return (
    <Tag
      ref={elementRef}
      id={id}
      className={`${className} scroll-fade-in`}
      style={{
        ...style,
        opacity: isInView || isReduced ? 1 : 0,
        transform: isInView || isReduced ? 'translate3d(0, 0, 0)' : transformHidden,
        filter: isReduced ? 'none' : isInView ? 'blur(0px)' : 'blur(2px)',
        willChange: !isInView && !isReduced ? 'transform, opacity, filter' : 'auto',
        transition: isReduced
          ? 'opacity 0.2s ease-out'
          : `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
};
