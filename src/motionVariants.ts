import type { Variants } from 'motion/react';

/**
 * Variantes de transição de entrada dinâmica padrão (service-card)
 * Utiliza física de mola (spring: stiffness 105, damping 22), blur progressivo,
 * escala suave e deslocamento vertical com stagger por índice.
 * Respeita estritamente preferências de redução de movimento (prefers-reduced-motion).
 */
export const getDynamicCardVariants = (prefersReduced: boolean = false): Variants => ({
  hidden: {
    opacity: 0,
    scale: prefersReduced ? 1 : 0.93,
    y: prefersReduced ? 0 : 42,
    filter: prefersReduced ? 'none' : 'blur(8px)',
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      y: prefersReduced
        ? { duration: 0 }
        : { type: 'spring', damping: 22, stiffness: 105, mass: 0.85, delay: i * 0.12 },
      scale: prefersReduced
        ? { duration: 0 }
        : { type: 'spring', damping: 22, stiffness: 105, mass: 0.85, delay: i * 0.12 },
      opacity: prefersReduced
        ? { duration: 0 }
        : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
      filter: prefersReduced
        ? { duration: 0 }
        : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
    },
  }),
});
