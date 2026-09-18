import React, { useState, useEffect, useRef } from 'react';
import { EloLogo } from './EloLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { NAVIGATION_ITEMS, SITE_CONFIG, whatsappUrl, scrollToHash } from '../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const MENU_FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('');
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  useEffect(() => {
    const sections = NAVIGATION_ITEMS.map((item) =>
      document.querySelector(item.href)
    ).filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        setActiveHref(`#${visible[0].target.id}`);
      },
      {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      if (restoreFocusRef.current) {
        restoreFocusRef.current = false;
        menuToggleRef.current?.focus();
      }
      return;
    }

    restoreFocusRef.current = true;
    const scrollY = window.scrollY;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalOverflow = document.body.style.overflow;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      firstMobileLinkRef.current?.focus();
    }, 0);

    const getFocusable = (): HTMLElement[] => {
      const root = headerRef.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll(MENU_FOCUSABLE)).filter(
        (el): el is HTMLElement =>
          el instanceof HTMLElement && el.getClientRects().length > 0
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && headerRef.current?.contains(active);

      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.overflow = originalOverflow;
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [isMobileMenuOpen]);

  const desktopWhatsappUrl = whatsappUrl(SITE_CONFIG.headerWhatsappMessage);
  const mobileMenuWhatsappUrl = whatsappUrl(SITE_CONFIG.mobileMenuWhatsappMessage);

  const handleNavClick = (href: string) => {
    setActiveHref(href);
    setIsMobileMenuOpen(false);
    window.setTimeout(() => {
      scrollToHash(href);
    }, 50);
  };

  const navItemClass = (href: string, variant: 'desktop' | 'mobile') => {
    const isActive = activeHref === href;
    if (variant === 'desktop') {
      return `px-3.5 py-2 rounded-lg transition-all duration-200 min-h-11 inline-flex items-center whitespace-nowrap border ${
        isActive
          ? 'text-white bg-indigo-500/18 border-indigo-400/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
          : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border-transparent'
      }`;
    }
    return `relative flex items-center justify-start gap-3 px-3 min-[360px]:px-3.5 py-3.5 rounded-xl text-base font-medium transition-all duration-200 min-h-11 min-w-0 border ${
      isActive
        ? 'text-white bg-indigo-500/18 border-indigo-400/35'
        : 'text-slate-200 hover:text-white hover:bg-white/[0.05] border-transparent'
    }`;
  };

  return (
    <>
      <header
        ref={headerRef}
        id="header-nav"
        className={`fixed top-0 left-0 right-0 z-50 w-full max-w-[100%] overflow-x-clip transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pt-[max(0.75rem,env(safe-area-inset-top))] ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#090D16]/90 backdrop-blur-xl border-b border-white/[0.06] pb-3 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.7)]'
            : 'bg-[#090D16]/70 backdrop-blur-md border-b border-white/[0.04] pb-3.5 sm:pb-4'
        }`}
      >
        <div className="page-shell page-x">
          <div className={`flex items-center justify-between gap-2 min-w-0 ${isMobileMenuOpen ? 'h-11' : ''}`}>
            {isMobileMenuOpen ? (
              <>
                <div className="w-11 h-11 shrink-0 lg:hidden" aria-hidden="true" />
                <div className="flex-1 min-w-0 flex items-center justify-center lg:flex-initial lg:justify-start h-11">
                  <a
                    href="#inicio"
                    id="brand-logo-link"
                    className="flex items-center justify-center h-11 min-w-0 max-w-full leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg transition-opacity hover:opacity-90"
                    aria-label="ēloSites — Página inicial"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <EloLogo size="md" />
                  </a>
                </div>
              </>
            ) : (
              <a
                href="#inicio"
                id="brand-logo-link"
                className="group flex items-center min-w-0 max-w-[calc(100%-3.25rem)] lg:max-w-none leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90"
                aria-label="ēloSites — Página inicial"
              >
                <EloLogo size="md" />
              </a>
            )}

            <nav
              aria-label="Navegação principal"
              className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-300"
            >
              {NAVIGATION_ITEMS.map((item) => (
                <a
                  key={item.id}
                  id={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={navItemClass(item.href, 'desktop')}
                  aria-current={activeHref === item.href ? 'location' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <a
                id="header-cta-whatsapp"
                href={desktopWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white min-h-11"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>

            <button
              ref={menuToggleRef}
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              className="lg:hidden flex items-center justify-center w-11 h-11 shrink-0 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-indigo-400" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            id="mobile-menu-drawer"
            className="mobile-menu-panel lg:hidden page-x border-t border-white/[0.06] bg-[#0B101D]/95 pt-3 sm:pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] transition-all duration-200 overflow-y-auto overflow-x-clip overscroll-contain min-w-0"
          >
            <nav aria-label="Navegação mobile" className="flex flex-col space-y-1">
              {NAVIGATION_ITEMS.map((item, index) => (
                <a
                  key={`mobile-${item.id}`}
                  id={`mobile-${item.id}`}
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                    className={navItemClass(item.href, 'mobile')}
                    aria-current={activeHref === item.href ? 'location' : undefined}
                >
                  <span className="flex-1 text-left">{item.label}</span>
                  <ArrowUpRight
                    className="absolute right-3 min-[360px]:right-3.5 w-4 h-4 text-slate-500"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-white/[0.06]">
              <a
                id="mobile-cta-whatsapp"
                href={mobileMenuWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="cta-primary flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl text-base font-semibold text-white min-h-12"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu-backdrop"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-[45] bg-black/80 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
        />
      )}
    </>
  );
};
