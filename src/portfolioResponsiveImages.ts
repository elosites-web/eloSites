export interface ResponsiveImageSource {
  avifSrcSet: string;
  webpSrcSet: string;
  fallbackSrc: string;
  width: number;
  height: number;
  defaultSizes: string;
}

export const PORTFOLIO_IMAGE_SOURCES: Record<string, ResponsiveImageSource> = {
  // JV Salvaia - Desktop (1440x780)
  '/portifolio-jvsalvaia-desktop.webp': {
    avifSrcSet: [
      '/portifolio-jvsalvaia-desktop-480w.avif 480w',
      '/portifolio-jvsalvaia-desktop-720w.avif 720w',
      '/portifolio-jvsalvaia-desktop-1080w.avif 1080w',
      '/portifolio-jvsalvaia-desktop-1440w.avif 1440w',
    ].join(', '),
    webpSrcSet: [
      '/portifolio-jvsalvaia-desktop-480w.webp 480w',
      '/portifolio-jvsalvaia-desktop-720w.webp 720w',
      '/portifolio-jvsalvaia-desktop-1080w.webp 1080w',
      '/portifolio-jvsalvaia-desktop-1440w.webp 1440w',
    ].join(', '),
    fallbackSrc: '/portifolio-jvsalvaia-desktop.webp',
    width: 1440,
    height: 780,
    defaultSizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px',
  },
  // JV Salvaia - Mobile (1080x1945)
  '/portifolio-jvsalvaia-mobile.webp': {
    avifSrcSet: [
      '/portifolio-jvsalvaia-mobile-360w.avif 360w',
      '/portifolio-jvsalvaia-mobile-540w.avif 540w',
      '/portifolio-jvsalvaia-mobile-720w.avif 720w',
      '/portifolio-jvsalvaia-mobile-1080w.avif 1080w',
    ].join(', '),
    webpSrcSet: [
      '/portifolio-jvsalvaia-mobile-360w.webp 360w',
      '/portifolio-jvsalvaia-mobile-540w.webp 540w',
      '/portifolio-jvsalvaia-mobile-720w.webp 720w',
      '/portifolio-jvsalvaia-mobile-1080w.webp 1080w',
    ].join(', '),
    fallbackSrc: '/portifolio-jvsalvaia-mobile.webp',
    width: 1080,
    height: 1945,
    defaultSizes: '(max-width: 640px) 160px, 200px',
  },

  // Toledo Segurança - Desktop (1440x778)
  '/portifolio-toledoseguranca-desktop.webp': {
    avifSrcSet: [
      '/portifolio-toledoseguranca-desktop-480w.avif 480w',
      '/portifolio-toledoseguranca-desktop-720w.avif 720w',
      '/portifolio-toledoseguranca-desktop-1080w.avif 1080w',
      '/portifolio-toledoseguranca-desktop-1440w.avif 1440w',
    ].join(', '),
    webpSrcSet: [
      '/portifolio-toledoseguranca-desktop-480w.webp 480w',
      '/portifolio-toledoseguranca-desktop-720w.webp 720w',
      '/portifolio-toledoseguranca-desktop-1080w.webp 1080w',
      '/portifolio-toledoseguranca-desktop-1440w.webp 1440w',
    ].join(', '),
    fallbackSrc: '/portifolio-toledoseguranca-desktop.webp',
    width: 1440,
    height: 778,
    defaultSizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px',
  },
  // Toledo Segurança - Mobile (1080x1978)
  '/portifolio-toledoseguranca-mobile.webp': {
    avifSrcSet: [
      '/portifolio-toledoseguranca-mobile-360w.avif 360w',
      '/portifolio-toledoseguranca-mobile-540w.avif 540w',
      '/portifolio-toledoseguranca-mobile-720w.avif 720w',
      '/portifolio-toledoseguranca-mobile-1080w.avif 1080w',
    ].join(', '),
    webpSrcSet: [
      '/portifolio-toledoseguranca-mobile-360w.webp 360w',
      '/portifolio-toledoseguranca-mobile-540w.webp 540w',
      '/portifolio-toledoseguranca-mobile-720w.webp 720w',
      '/portifolio-toledoseguranca-mobile-1080w.webp 1080w',
    ].join(', '),
    fallbackSrc: '/portifolio-toledoseguranca-mobile.webp',
    width: 1080,
    height: 1978,
    defaultSizes: '(max-width: 640px) 160px, 200px',
  },

  // Duelo de Fim de Ano - Desktop (1440x778)
  '/portifolio-jogodefimdeano-desktop.webp': {
    avifSrcSet: [
      '/portifolio-jogodefimdeano-desktop-480w.avif 480w',
      '/portifolio-jogodefimdeano-desktop-720w.avif 720w',
      '/portifolio-jogodefimdeano-desktop-1080w.avif 1080w',
      '/portifolio-jogodefimdeano-desktop-1440w.avif 1440w',
    ].join(', '),
    webpSrcSet: [
      '/portifolio-jogodefimdeano-desktop-480w.webp 480w',
      '/portifolio-jogodefimdeano-desktop-720w.webp 720w',
      '/portifolio-jogodefimdeano-desktop-1080w.webp 1080w',
      '/portifolio-jogodefimdeano-desktop-1440w.webp 1440w',
    ].join(', '),
    fallbackSrc: '/portifolio-jogodefimdeano-desktop.webp',
    width: 1440,
    height: 778,
    defaultSizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px',
  },
  // Duelo de Fim de Ano - Mobile (1080x1967)
  '/portifolio-jogodefimdeano-mobile.webp': {
    avifSrcSet: [
      '/portifolio-jogodefimdeano-mobile-360w.avif 360w',
      '/portifolio-jogodefimdeano-mobile-540w.avif 540w',
      '/portifolio-jogodefimdeano-mobile-720w.avif 720w',
      '/portifolio-jogodefimdeano-mobile-1080w.avif 1080w',
    ].join(', '),
    webpSrcSet: [
      '/portifolio-jogodefimdeano-mobile-360w.webp 360w',
      '/portifolio-jogodefimdeano-mobile-540w.webp 540w',
      '/portifolio-jogodefimdeano-mobile-720w.webp 720w',
      '/portifolio-jogodefimdeano-mobile-1080w.webp 1080w',
    ].join(', '),
    fallbackSrc: '/portifolio-jogodefimdeano-mobile.webp',
    width: 1080,
    height: 1967,
    defaultSizes: '(max-width: 640px) 160px, 200px',
  },
};

export function getPortfolioImageSource(src: string): ResponsiveImageSource | null {
  if (!src) return null;
  const normalized = src.startsWith('/') ? src : `/${src}`;
  return PORTFOLIO_IMAGE_SOURCES[normalized] || null;
}
