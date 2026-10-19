import { flushSync } from 'react-dom';
import { getMotionTier } from './mediaPrefs';

type DocumentWithVT = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> };
};

export function supportsViewTransitions(): boolean {
  if (typeof document === 'undefined') return false;
  return typeof (document as DocumentWithVT).startViewTransition === 'function';
}

/**
 * Executa `update` dentro de uma View Transition (crossfade) quando o navegador
 * suporta e o tier de movimento não é 'none'. Caso contrário, executa direto.
 * A troca de DOM acontece de forma síncrona (flushSync) para que o snapshot
 * "novo" já contenha a tela atualizada.
 */
export function withViewTransition(update: () => void): void {
  const doc = document as DocumentWithVT;
  if (!supportsViewTransitions() || getMotionTier() === 'none' || !doc.startViewTransition) {
    update();
    return;
  }

  let ran = false;
  const run = () => {
    if (ran) return;
    ran = true;
    flushSync(update);
  };

  try {
    doc.startViewTransition(run);
  } catch {
    if (!ran) update();
  }
}
