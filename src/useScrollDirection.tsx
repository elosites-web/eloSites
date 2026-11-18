import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';

export type ScrollDirection = 'down' | 'up';

interface ScrollDirectionContextType {
  direction: ScrollDirection;
  scrollY: number;
  isScrolling: boolean;
}

const ScrollDirectionContext = createContext<ScrollDirectionContextType>({
  direction: 'down',
  scrollY: 0,
  isScrolling: false,
});

export const ScrollDirectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [direction, setDirection] = useState<ScrollDirection>('down');

  const directionRef = useRef<ScrollDirection>('down');
  const lastScrollYRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastScrollYRef.current = window.scrollY || window.pageYOffset || 0;

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        const diff = currentScrollY - lastScrollYRef.current;

        if (Math.abs(diff) > 3) {
          const newDirection: ScrollDirection = diff > 0 ? 'down' : 'up';
          if (newDirection !== directionRef.current) {
            directionRef.current = newDirection;
            setDirection(newDirection);
          }
          lastScrollYRef.current = currentScrollY;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const contextValue = useMemo<ScrollDirectionContextType>(
    () => ({ direction, scrollY: 0, isScrolling: false }),
    [direction]
  );

  return (
    <ScrollDirectionContext.Provider value={contextValue}>
      {children}
    </ScrollDirectionContext.Provider>
  );
};

export const useScrollDirection = (): ScrollDirectionContextType => {
  return useContext(ScrollDirectionContext);
};
