const CACHE = 'huyen-cac-v5.1-static-v1';
const CORE = [
  "/",
  "/index.html",
  "/assets/css/tokens.css",
  "/assets/css/components.css",
  "/assets/css/layout.css",
  "/assets/css/features/home.css",
  "/assets/css/features/shared.css",
  "/assets/css/features/tarot.css",
  "/assets/css/features/numerology.css",
  "/assets/css/features/horoscope.css",
  "/assets/css/features/dates.css",
  "/assets/css/motion.css",
  "/assets/css/responsive.css",
  "/assets/js/app.js",
  "/assets/js/data/mystical-data.js",
  "/assets/js/utils/format.js",
  "/assets/js/models/storage-model.js",
  "/assets/js/models/numerology-calculator.js",
  "/assets/js/models/lunar-converter.js",
  "/assets/js/models/astrology-calculator.js",
  "/assets/js/models/tarot-engine.js",
  "/assets/js/models/date-scorer.js",
  "/assets/js/state/app-state.js",
  "/assets/js/config/feature-config.js",
  "/assets/js/views/ui-manager.js",
  "/assets/js/controllers/app-controller.js",
  "/assets/js/services/service-worker-client.js"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('/index.html')))
  );
});
