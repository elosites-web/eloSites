import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { getMotionTier, shouldReduceMedia } from '../mediaPrefs';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  strength?: number; // Quão forte é a atração magnética (padrão: 14)
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
  strength = 14,
  glowColor = 'rgba(6, 182, 212, 0.35)',
  ariaLabel,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());
  const canMagnetize = !isReduced && getMotionTier() === 'full';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canMagnetize || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const pullX = (distanceX / (rect.width / 2)) * strength;
    const pullY = (distanceY / (rect.height / 2)) * strength;

    setPosition({ x: pullX, y: pullY });

    // Posição percentual para o gradiente de brilho interno
    const gx = ((e.clientX - rect.left) / rect.width) * 100;
    const gy = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x: gx, y: gy });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const commonProps = {
    className: `relative flex items-center justify-center font-medium transition-all select-none overflow-hidden ${className}`,
    onClick,
    'aria-label': ariaLabel,
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: canMagnetize ? position.x : 0,
        y: canMagnetize ? position.y : 0,
      }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 180,
        mass: 0.2,
      }}
      className="inline-block"
    >
      {href ? (
        <a {...commonProps} href={href} target={target} rel={rel}>
          {/* Trilha de brilho que segue o ponteiro */}
          {isHovered && canMagnetize && (
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-inherit"
              style={{
                background: `radial-gradient(circle 90px at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 70%)`,
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </a>
      ) : (
        <button {...commonProps} type="button">
          {/* Trilha de brilho que segue o ponteiro */}
          {isHovered && canMagnetize && (
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-inherit"
              style={{
                background: `radial-gradient(circle 90px at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 70%)`,
              }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
      )}
    </motion.div>
  );
};
