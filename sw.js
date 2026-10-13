const CACHE = 'countdown-v2';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './vendor/gsap.min.js',
  './vendor/fonts.css',
  './vendor/fonts/BricolageGrotesque-400.ttf',
  './vendor/fonts/BricolageGrotesque-500.ttf',
  './vendor/fonts/BricolageGrotesque-600.ttf',
  './vendor/fonts/BricolageGrotesque-700.ttf',
  './vendor/fonts/BricolageGrotesque-800.ttf',
  './vendor/fonts/JetBrainsMono-400.ttf',
  './vendor/fonts/JetBrainsMono-600.ttf',
  './vendor/fonts/JetBrainsMono-800.ttf',
  './assets/favicon.ico',
  './assets/favicon-16x16.png',
  './assets/favicon-32x32.png',
  './assets/apple-touch-icon.png',
  './assets/android-chrome-192x192.png',
  './assets/android-chrome-512x512.png',
  './icons/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)));
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
  if (url.origin !== self.location.origin) return;

  // Vendored files never change under the same cache version: cache-first
  if (url.pathname.includes('/vendor/')) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
    return;
  }

  // App shell: network-first so updates show up, cache as the offline fallback
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
