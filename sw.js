/**
 * Service Worker for Om Prasad Sahoo's Developer Portfolio
 * Version: ops-portfolio-v2
 * Strategy: Network-First with Cache Fallback for instant updates and reliable offline access
 */

const CACHE_NAME = 'ops-portfolio-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './style.css?v=2.0',
  './script.js',
  './script.js?v=2.0',
  './manifest.json',
  './assets/om-profile.png'
];

// 1. Install Event: Cache core static assets and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. Activate Event: Delete all old caches (including ops-portfolio-v1) and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting obsolete cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First for HTML navigation and static assets with offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isHtmlNavigation = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  if (isHtmlNavigation) {
    // Network-First for HTML: Always serve fresh content when online
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
              // Also update canonical fallbacks
              cache.put('./index.html', networkResponse.clone());
              cache.put('./', networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed (offline): Fallback to cached index.html
          return caches.match(event.request, { ignoreSearch: true }).then((cached) => {
            return cached || caches.match('./index.html') || caches.match('./');
          });
        })
    );
    return;
  }

  // Network-First for local assets (CSS, JS, images, fonts) with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.origin === self.location.origin || url.protocol.startsWith('http'))
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});
