/// <reference types="vite/client" />
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ToastProvider } from './components/Toast';
import { ScrollDirectionProvider } from './useScrollDirection';
import { getMotionTier, isInAppBrowser } from './mediaPrefs';
import './index.css';

// Expõe o tier de movimento ao CSS sem sniffing de navegador espalhado pelo código.
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  root.dataset.motionTier = getMotionTier();
  root.dataset.inApp = isInAppBrowser() ? 'true' : 'false';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScrollDirectionProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ScrollDirectionProvider>
  </StrictMode>,
);

// Registro do Service Worker apenas em ambiente de produção para suporte offline.
// Em ambiente de desenvolvimento, desregistra qualquer SW ativo e limpa caches para evitar
// que módulos do Vite fiquem descompassados na memória do navegador.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {})
        .catch(() => {});
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    if (typeof caches !== 'undefined') {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key);
        }
      });
    }
  }
}

