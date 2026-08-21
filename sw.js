const CACHE='huyen-cac-v5.9-static-v1';
const CORE=[
  './','./index.html','./manifest.webmanifest',
  './assets/css/tokens.css','./assets/css/components.css','./assets/css/layout.css',
  './assets/css/features/home.css','./assets/css/features/shared.css','./assets/css/features/tarot.css',
  './assets/css/features/numerology.css','./assets/css/features/horoscope.css','./assets/css/features/compatibility.css','./assets/css/features/dates.css',
  './assets/css/motion.css','./assets/css/responsive.css','./assets/css/expert.css','./assets/css/ux-v55.css','./assets/css/easy-read.css','./assets/js/app.bundle.js'
];
const scopedUrl=path=>new URL(path,self.registration.scope).href;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(scopedUrl))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;if(req.mode==='navigate'){event.respondWith(fetch(req).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(scopedUrl('./index.html'),copy));return response}).catch(()=>caches.match(scopedUrl('./index.html'))));return}event.respondWith(caches.match(req).then(cached=>{const refresh=fetch(req).then(response=>{if(response?.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return response}).catch(()=>cached);return cached||refresh}))});
