const CACHE_NAME = 'offline-llm-v1';

// Every asset the page needs to run must be listed here
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://esm.run/@mlc-ai/web-llm'
];

// 1. Install & Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate & Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 3. Intercept requests: Check device cache FIRST, then try internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Load instantly from iPad storage
      }
      return fetch(event.request); // Fall back to network if online
    })
  );
});
