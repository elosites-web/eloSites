import { saveDataEnabled } from './mediaPrefs';
import type { ScreenId } from './types';

type Loader = () => Promise<unknown>;

const screenLoaders: Partial<Record<ScreenId, Loader>> = {
  inicio: () => import('./components/SpecialtiesSection'),
  servicos: () => import('./components/ServicesSection'),
  'solucoes-web': () => import('./components/SpecialtiesSection'),
  portfolio: () => import('./components/PortfolioSection'),
  avaliacoes: () => import('./components/TestimonialsSection'),
  processo: () =>
    Promise.all([
      import('./components/ProcessSection'),
      import('./components/DifferentialsSection'),
    ]),
  orcamento: () => import('./components/ProjectBriefBookingSection'),
  'parceria-trafego': () => import('./components/PaidTrafficPartnershipSection'),
  'trafego-pago': () => import('./components/PaidTrafficPartnershipSection'),
  faq: () =>
    Promise.all([
      import('./components/FaqSection'),
      import('./components/ContactCtaSection'),
      import('./components/DigitalCardSection'),
    ]),
};

function slowConnection(): boolean {
  try {
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const type = conn?.effectiveType;
    return type === 'slow-2g' || type === '2g';
  } catch {
    return false;
  }
}

function prefetchBlocked(): boolean {
  return saveDataEnabled() || slowConnection();
}

function ignoreFailure(promise: Promise<unknown>): void {
  promise.catch(() => {});
}

export function preloadScreen(screenId: ScreenId): void {
  if (prefetchBlocked()) return;
  const loader = screenLoaders[screenId];
  if (loader) ignoreFailure(loader());
}

export function preloadDeferredChrome(): void {
  if (prefetchBlocked()) return;
  ignoreFailure(
    Promise.all([
      import('./components/LegalModals'),
      import('./components/SitemapModal'),
    ])
  );
}

export function preloadAllScreens(): void {
  if (prefetchBlocked()) return;
  preloadDeferredChrome();
  Object.values(screenLoaders).forEach((loader) => ignoreFailure(loader()));
}
