/**
 * Service Worker for Om Prasad Sahoo's Developer Portfolio
 * Caches core assets for offline viewing and ultra-fast loading
 */

const CACHE_NAME = 'ops-portfolio-v1';
const ALLOWED_ORIGINS = [
  self.location.origin,
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.tailwindcss.com',
  'https://ghchart.rshah.org',
  'https://ui-avatars.com'
];
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/om-profile.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation & static asset caching strategy: Cache first, fallback to network
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache external fonts/styles dynamically if valid
        let isAllowedOrigin = false;
        try {
          const url = new URL(event.request.url);
          isAllowedOrigin = ALLOWED_ORIGINS.includes(url.origin);
        } catch (e) {
          // Ignore invalid URLs
        }

        if (
          networkResponse &&
          networkResponse.status === 200 &&
          isAllowedOrigin
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
