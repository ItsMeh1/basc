importScripts('./site-map.js');

const VERSION = 'basc-v2.3-candidates';
const SHELL = ['./', './index.html', './styles.css', './content-pages.css', './banner.css', './candidate-hero.css', './app.js', './config.js', './site-map.js', './404.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

function pathOf(url) { return new URL(url).pathname.replace(/\/+$/, '') || '/'; }
function sameOrigin(url) { return new URL(url).origin === self.location.origin; }
function isKnownPath(path) {
  const map = self.BASC_SITE_MAP || {};
  const aliases = map.aliases || {};
  const canonical = aliases[path] || path;
  return path === map.home || Object.values(map).includes(path) || Object.values(aliases).includes(path) || canonical === map.home || Object.values(map).includes(canonical);
}

async function navigationResponse(url) {
  const known = isKnownPath(pathOf(url));
  const shellUrl = known ? './index.html' : './404.html';
  try {
    const response = await fetch(`${shellUrl}?v=${encodeURIComponent(VERSION)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('navigation fetch failed');
    const copy = response.clone();
    caches.open(VERSION).then(cache => cache.put(shellUrl, copy)).catch(() => {});
    if (known) return response;
    const body = await response.blob();
    return new Response(body, { status:404, statusText:'Not Found', headers:response.headers });
  } catch {
    const fallback = await caches.match(shellUrl);
    if (!fallback) return Response.error();
    if (known) return fallback;
    return new Response(await fallback.clone().blob(), { status:404, statusText:'Not Found', headers:fallback.headers });
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request.url)) return;
  if (request.mode === 'navigate') { event.respondWith(navigationResponse(request.url)); return; }
  event.respondWith((async () => {
    try {
      const fresh = await fetch(request, { cache:'no-store' });
      if (fresh.ok) caches.open(VERSION).then(cache => cache.put(request, fresh.clone())).catch(() => {});
      return fresh;
    } catch {
      return (await caches.match(request)) || Response.error();
    }
  })());
});
