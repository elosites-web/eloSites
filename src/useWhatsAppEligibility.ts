import { useLayoutEffect, useState } from 'react';

// O wrapper contém apenas a Hero e acompanha inclusive sua animação de saída.
export function useWhatsAppEligibility() {
  const [hero, heroRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [tabActive, setTabActive] = useState(() => !document.hidden);

  useLayoutEffect(() => {
    const update = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', update);
    update();
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useLayoutEffect(() => {
    if (!hero) {
      setVisible(false);
      return;
    }
    const measure = () => {
      const rect = hero.getBoundingClientRect();
      setVisible(rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth);
    };
    measure();
    if (typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver(entries => {
        setVisible(entries[entries.length - 1].isIntersecting);
      });
      observer.observe(hero);
      return () => {
        observer.disconnect();
        observer.takeRecords();
      };
    }
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [hero]);

  return { heroRef, eligible: tabActive && !visible };
}
