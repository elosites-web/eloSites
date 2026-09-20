import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProcessSection } from './components/ProcessSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { DifferentialsSection } from './components/DifferentialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactCtaSection } from './components/ContactCtaSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { LegalModals } from './components/LegalModals';

export default function App() {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const syncVisualViewport = () => {
      const vv = window.visualViewport;
      if (!vv) {
        root.style.setProperty('--vv-bottom', '0px');
        return;
      }
      const bottom = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      root.style.setProperty('--vv-bottom', `${Math.round(bottom)}px`);
    };

    syncVisualViewport();
    window.visualViewport?.addEventListener('resize', syncVisualViewport);
    window.visualViewport?.addEventListener('scroll', syncVisualViewport);
    window.addEventListener('resize', syncVisualViewport);

    return () => {
      window.visualViewport?.removeEventListener('resize', syncVisualViewport);
      window.visualViewport?.removeEventListener('scroll', syncVisualViewport);
      window.removeEventListener('resize', syncVisualViewport);
    };
  }, []);

  return (
    <div className="min-h-dvh min-w-0 w-full overflow-x-clip bg-[#090D16] text-slate-100 flex flex-col selection:bg-indigo-500/80 selection:text-white">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo-principal" className="flex-1">
        <Hero />
        <PortfolioSection />
        <ProcessSection />
        <ServicesSection />
        <DifferentialsSection />
        <FaqSection />
        <ContactCtaSection />
      </main>

      <Footer
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onOpenCookies={() => setLegalModal('cookies')}
      />

      <FloatingWhatsApp />

      <CookieConsentBanner />

      <LegalModals
        isOpen={legalModal !== null}
        type={legalModal}
        onClose={() => setLegalModal(null)}
      />
    </div>
  );
}
