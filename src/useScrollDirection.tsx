import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

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
  const [scrollY, setScrollY] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  const lastScrollYRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const diff = currentScrollY - lastScrollYRef.current;
          // Threshold of 3px to avoid jitter
          if (Math.abs(diff) > 3) {
            const newDirection: ScrollDirection = diff > 0 ? 'down' : 'up';
            setDirection(newDirection);
            setScrollY(currentScrollY);
          }
          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <ScrollDirectionContext.Provider value={{ direction, scrollY, isScrolling }}>
      {children}
    </ScrollDirectionContext.Provider>
  );
};

export const useScrollDirection = (): ScrollDirectionContextType => {
  return useContext(ScrollDirectionContext);
};
