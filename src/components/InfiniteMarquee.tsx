import React from 'react';
import { useReducedMotion } from 'motion/react';
import { shouldReduceMedia } from '../mediaPrefs';

interface InfiniteMarqueeProps {
  items: { text: string; icon?: React.ReactNode; badge?: string }[];
  speed?: number; // seconds for full cycle (default: 32)
  reverse?: boolean;
  className?: string;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  items,
  speed = 32,
  reverse = false,
  className = '',
}) => {
  const systemPrefersReduced = useReducedMotion();
  const isReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  if (isReduced) {
    return (
      <div className={`overflow-x-auto py-3 no-scrollbar flex items-center gap-4 ${className}`}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/08 whitespace-nowrap text-xs font-medium text-slate-300"
          >
            {item.icon}
            <span>{item.text}</span>
            {item.badge && (
              <span className="text-[10px] text-cyan-400 font-mono-code">{item.badge}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden select-none py-3 group ${className}`}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div
        className="flex items-center gap-6 whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{
          animation: `marqueeScroll ${speed}s linear infinite ${reverse ? 'reverse' : 'normal'}`,
          width: 'max-content',
        }}
      >
        {/* Duplicar para loop contínuo sem cortes visuais */}
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0B101D]/80 border border-white/08 hover:border-cyan-500/40 hover:bg-[#0E1527] transition-all duration-300 text-xs font-medium text-slate-300 backdrop-blur-md shadow-sm"
          >
            {item.icon && <span className="text-cyan-400">{item.icon}</span>}
            <span className="tracking-wide text-slate-200">{item.text}</span>
            {item.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 font-mono-code">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
