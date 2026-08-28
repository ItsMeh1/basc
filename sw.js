importScripts('./site-map.js');

const VERSION = 'basc-v2';
const SHELL = ['./', './index.html', './styles.css', './app.js', './config.js', './site-map.js', './404.html'];
const known = new Set(Object.values(BASC_SITE_MAP).filter(Boolean).concat(Object.keys(BASC_SITE_MAP.aliases || {})));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function pathOf(url) {
  const path = new URL(url).pathname.replace(/\/+$/, '') || '/';
  return path;
}

function sameOrigin(url) { return new URL(url).origin === self.location.origin; }

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request.url)) return;

  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const path = pathOf(url);
      const canonical = BASC_SITE_MAP.aliases?.[path] || path;
      if (known.has(path) || known.has(canonical)) {
        const cached = await caches.match('./index.html');
        try { return await fetch('./index.html', { cache: 'no-store' }); } catch { return cached || Response.error(); }
      }
      const notFound = await caches.match('./404.html');
      try {
        const response = await fetch('./404.html', { cache: 'no-store' });
        return new Response(response.body, { status: 404, statusText: 'Not Found', headers: response.headers });
      } catch { return notFound || Response.error(); }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    try {
      const fresh = await fetch(request);
      if (fresh.ok) caches.open(VERSION).then(cache => cache.put(request, fresh.clone()));
      return fresh;
    } catch { return cached || Response.error(); }
  })());
});
