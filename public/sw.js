// Service Worker básico para ēloSites — Caching e Suporte Offline
const CACHE_NAME = 'elosites-cache-v8';
const CARD_PAGE_PATH = '/cartao/index.html';

// Recursos estáticos essenciais do shell
const STATIC_ASSETS = [
  '/',
  '/index.html',
  CARD_PAGE_PATH,
  '/cartao/eu.webp',
  '/cartao/logo.webp',
  '/cartao/og-cartao.png',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/logo-elosites-1360.png',
];

function isCardPage(url) {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  return path === '/cartao' || path === CARD_PAGE_PATH;
}

// Instalação do Service Worker e pré-cache do shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de Fetch:
// 1. Navegações (HTML): Network-first com fallback para cache
// 2. Recursos estáticos (CSS, JS, WebP, Imagens, Fontes): Cache-first / Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorar requisições não-GET, extensões, ou dependências do Vite em desenvolvimento
  if (
    request.method !== 'GET' ||
    !request.url.startsWith('http') ||
    request.url.includes('/node_modules/') ||
    request.url.includes('/@vite/') ||
    request.url.includes('/@fs/') ||
    request.url.includes('/src/') ||
    request.url.includes('?v=')
  ) {
    return;
  }

  // Navegações de página
  if (request.mode === 'navigate') {
    const isCard = isCardPage(new URL(request.url));

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            const cacheKey = isCard ? CARD_PAGE_PATH : request;
            caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, clone));
          }
          return response;
        })
        .catch(async () => {
          if (isCard) {
            const cachedCard = await caches.match(CARD_PAGE_PATH);
            if (cachedCard) return cachedCard;
            return new Response('Cartão digital indisponível sem conexão.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
          }

          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Ativos estáticos e fontes
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Atualiza o cache em segundo plano (stale-while-revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Se não estiver em cache, busca na rede e guarda em cache
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
