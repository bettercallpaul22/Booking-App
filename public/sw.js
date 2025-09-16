const CACHE_NAME = 'appointment-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg',
  '/manifest.json',
  // Add other static assets here (e.g., CSS, JS, images) after Vite builds
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Force the new service worker to activate immediately
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Clean up old caches
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of clients immediately
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if available, else fetch from network
        return response || fetch(event.request).catch(() => {
          // Optional: Fallback for offline page if network fails
          return caches.match('/index.html');
        });
      })
  );
});