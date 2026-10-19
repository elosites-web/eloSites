import { saveDataEnabled } from './mediaPrefs';
import type { ScreenId } from './types';

type Loader = () => Promise<unknown>;

const screenLoaders: Partial<Record<ScreenId, Loader>> = {
  portfolio: () =>
    Promise.all([
      import('./components/PortfolioSection'),
      import('./components/TestimonialsSection'),
    ]),
  servicos: () => import('./components/ServicesSection'),
  processo: () =>
    Promise.all([
      import('./components/ProcessSection'),
      import('./components/DifferentialsSection'),
    ]),
  orcamento: () => import('./components/ProjectBriefBookingSection'),
  faq: () =>
    Promise.all([
      import('./components/FaqSection'),
      import('./components/ContactCtaSection'),
    ]),
  'parceria-trafego': () => import('./components/PaidTrafficPartnershipSection'),
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
