const CACHE = 'countdown-v1';
const PRECACHE = ['./', './index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

  if (isFont) {
    // Cache-first: fonts are stable
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached || fetch(event.request).then(res => {
          caches.open(CACHE).then(c => c.put(event.request, res.clone()));
          return res;
        })
      )
    );
  } else {
    // Network-first with cache fallback: always serve fresh app when online
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
