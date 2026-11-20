export interface ResponsiveImageSource {
  avifSrcSet: string;
  webpSrcSet: string;
  fallbackSrc: string;
  width: number;
  height: number;
  defaultSizes: string;
}

const desktopWidths = [320, 480, 720, 1080, 1440];
const mobileWidths = [160, 240, 360, 540, 720, 1080];

function screenshot(src: string, width: number, height: number, widths: number[]): ResponsiveImageSource {
  const base = src.slice(0, src.lastIndexOf('.'));
  const sources = (format: string) => widths.map(w => `${base}-${w}w.${format} ${w}w`).join(', ');
  return {
    avifSrcSet: sources('avif'),
    webpSrcSet: sources('webp'),
    fallbackSrc: src,
    width,
    height,
    defaultSizes: width > height ? '(max-width: 767px) 90vw, (max-width: 1280px) 43vw, 520px' : '160px',
  };
}

const screenshots = [
  screenshot('/portifolio-jvsalvaia-desktop.webp', 1440, 780, desktopWidths),
  screenshot('/portifolio-jvsalvaia-mobile.webp', 1080, 1945, mobileWidths),
  screenshot('/portifolio-toledoseguranca-desktop.webp', 1440, 778, desktopWidths),
  screenshot('/portifolio-toledoseguranca-mobile.webp', 1080, 1978, mobileWidths),
  screenshot('/portifolio-jogodefimdeano-desktop.webp', 1440, 778, desktopWidths),
  screenshot('/portifolio-jogodefimdeano-mobile.webp', 1080, 1967, mobileWidths),
  screenshot('/garagem-mailasque-desktop.webp', 1920, 1042, [...desktopWidths, 1920]),
  screenshot('/garagem-mailasque-mobile.jpg', 1080, 1956, mobileWidths),
];

export const PORTFOLIO_IMAGE_SOURCES: Record<string, ResponsiveImageSource> =
  Object.fromEntries(screenshots.map(source => [source.fallbackSrc, source]));

export function getPortfolioImageSource(src: string): ResponsiveImageSource | null {
  if (!src) return null;
  const normalized = src.startsWith('/') ? src : `/${src}`;
  return PORTFOLIO_IMAGE_SOURCES[normalized] || null;
}
