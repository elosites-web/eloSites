import { saveDataEnabled } from './mediaPrefs';
import type { ScreenId } from './types';

export type Loader = () => Promise<unknown>;

export const screenLoaders: Partial<Record<ScreenId, Loader>> = {
  servicos: () => import('./components/ServicesSection'),
  'solucoes-web': () => import('./components/ServicesSection'),
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
      import('./components/FounderCard'),
      import('./components/TechnicalSpecialtiesBanner'),
    ]),
};

export function isSlowConnection(): boolean {
  try {
    if (typeof navigator === 'undefined') return false;
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const type = conn?.effectiveType;
    return type === 'slow-2g' || type === '2g';
  } catch {
    return false;
  }
}

export function isPrefetchBlocked(): boolean {
  return saveDataEnabled() || isSlowConnection();
}

export interface ScreenPreloaderOptions {
  loaders: Partial<Record<string, Loader>>;
  isBlocked?: () => boolean;
}

export function createScreenPreloader({
  loaders,
  isBlocked = isPrefetchBlocked,
}: ScreenPreloaderOptions) {
  const loadedKeys = new Set<string>();
  const inFlightKeys = new Map<string, Promise<void>>();

  const preloadKey = (key: string): Promise<void> => {
    if (loadedKeys.has(key)) {
      return Promise.resolve();
    }

    const existing = inFlightKeys.get(key);
    if (existing) {
      return existing;
    }

    if (isBlocked()) {
      return Promise.resolve();
    }

    const loader = loaders[key];
    if (!loader) {
      return Promise.resolve();
    }

    const promise = Promise.resolve()
      .then(() => loader())
      .then(() => {
        loadedKeys.add(key);
      })
      .catch(() => {
        // Permite nova tentativa em interação futura se houve falha transitória de rede
      })
      .finally(() => {
        inFlightKeys.delete(key);
      });

    inFlightKeys.set(key, promise);
    return promise;
  };

  return {
    preload: preloadKey,
    hasLoaded: (key: string) => loadedKeys.has(key),
    isInFlight: (key: string) => inFlightKeys.has(key),
  };
}

const defaultScreenPreloader = createScreenPreloader({
  loaders: screenLoaders,
});

const chromePreloader = createScreenPreloader({
  loaders: {
    chrome: () =>
      Promise.all([
        import('./components/LegalModals'),
        import('./components/SitemapModal'),
      ]),
    caseDetail: () =>
      Promise.all([
        import('./components/CaseDetailPage'),
        import('./components/ProjectImageView'),
      ]),
  },
});

export function preloadScreen(screenId: ScreenId): void {
  void defaultScreenPreloader.preload(screenId);
}

export function preloadDeferredChrome(): void {
  void chromePreloader.preload('chrome');
}

export function preloadCaseViews(): void {
  void chromePreloader.preload('caseDetail');
}

