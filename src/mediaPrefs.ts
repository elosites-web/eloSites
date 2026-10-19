// Preferências/limitações do aparelho usadas para decidir se animações pesadas devem rodar.

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function saveDataEnabled(): boolean {
  try {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    return Boolean(conn && conn.saveData);
  } catch {
    return false;
  }
}

export function lowEndDevice(): boolean {
  try {
    return typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  } catch {
    return false;
  }
}

export function webglSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function isInAppBrowser(): boolean {
  try {
    const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    return /FBAN|FBAV|FB_IAB|FBSS|Instagram|BytedanceWebview|TikTok|musical_ly|Line\/|Snapchat/i.test(ua);
  } catch {
    return false;
  }
}

export function getOptimalDpr(isMobile: boolean, inApp: boolean): number {
  if (inApp || isMobile) return 1.0;
  return Math.min(window.devicePixelRatio || 1, 1.35);
}

// true quando animações pesadas (scrub de frames, vídeo, 3D) NÃO devem rodar
export function shouldReduceMedia(): boolean {
  return prefersReducedMotion() || saveDataEnabled();
}

/**
 * Nível único de movimento usado por TODOS os efeitos visuais do site.
 * Não faça checagens próprias de pointer/reduced/saveData em componentes:
 * leia sempre getMotionTier().
 *
 *  - full: ponteiro fino + hover, sem redução de movimento, sem saveData e
 *          hardware capaz (hardwareConcurrency >= 6 ou deviceMemory >= 6).
 *  - lite: demais celulares/tablets modernos (reveals de linha/fade, transições
 *          de tela, feedback de pressão, glass estático, fundo atual).
 *  - none: prefers-reduced-motion, saveData ou aparelho fraco — apenas
 *          transições de opacidade/cor.
 */
export type MotionTier = 'full' | 'lite' | 'none';

function matchMediaSafe(query: string): boolean {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

export function hasFinePointer(): boolean {
  return matchMediaSafe('(hover: hover) and (pointer: fine)');
}

function deviceMemoryGB(): number | null {
  try {
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    return typeof mem === 'number' ? mem : null;
  } catch {
    return null;
  }
}

function cpuConcurrency(): number | null {
  try {
    return typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : null;
  } catch {
    return null;
  }
}

// Aparelho fraco demais para qualquer animação (só opacidade/cor).
function weakDevice(): boolean {
  const cores = cpuConcurrency();
  const mem = deviceMemoryGB();
  if (cores !== null && cores <= 2) return true;
  if (mem !== null && mem <= 2) return true;
  return false;
}

export function getMotionTier(): MotionTier {
  if (shouldReduceMedia() || weakDevice()) return 'none';

  // WebViews de redes sociais (Facebook, Instagram, TikTok, Line) são
  // historicamente mais lentos: ficam no tier leve, sem 3D/marquee/blur pesado.
  if (isInAppBrowser()) return 'lite';

  const cores = cpuConcurrency();
  const mem = deviceMemoryGB();
  const capable = (cores !== null && cores >= 6) || (mem !== null && mem >= 6);
  if (hasFinePointer() && capable) return 'full';

  return 'lite';
}
