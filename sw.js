const CACHE = '4cus-v3-foki-silky';
const ASSETS = [
  './index.html','./templates.html','./styles.css','./app.js','./data.js','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png',
  './assets/foki-hero.webp','./assets/foki-wave.webp','./assets/foki-present.webp','./assets/foki-panel.webp',
  './assets/foki-hero.gif','./assets/foki-wave.gif','./assets/foki-present.gif','./assets/foki-panel.gif',
  './assets/foki-main.png','./assets/foki-front.png','./assets/foki-happy.png','./assets/foki-thinking.png','./assets/foki-box.png','./assets/foki-pointing.png'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const req = e.request;
  if (req.mode === 'navigate' || ['script','style','document'].includes(req.destination)) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy));
    return res;
  })));
});
