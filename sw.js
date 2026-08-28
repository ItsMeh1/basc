importScripts('./site-map.js');

const VERSION = 'basc-v2.2';
const SHELL = ['./', './index.html', './styles.css', './app.js', './config.js', './site-map.js', './404.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

function pathOf(url) {
  return new URL(url).pathname.replace(/\/+$/, '') || '/';
}

function sameOrigin(url) {
  return new URL(url).origin === self.location.origin;
}

function isKnownPath(path) {
  const map = self.BASC_SITE_MAP || {};
  const aliases = map.aliases || {};
  const canonical = aliases[path] || path;
  return path === map.home || path === canonical || Object.values(map).includes(path) || Object.values(aliases).includes(canonical);
}

function cacheResponse(key, response) {
  caches.open(VERSION).then(cache => cache.put(key, response)).catch(() => {});
}

async function navigationResponse(url) {
  const path = pathOf(url);
  const known = isKnownPath(path);
  const shellUrl = known ? './index.html' : './404.html';
  const fallback = await caches.match(shellUrl);

  try {
    const response = await fetch(shellUrl, { cache: 'no-store' });
    if (!response.ok) return fallback || Response.error();

    // clone() must happen before either branch consumes the body.
    cacheResponse(shellUrl, response.clone());

    if (!known) {
      return new Response(await response.blob(), {
        status: 404,
        statusText: 'Not Found',
        headers: response.headers
      });
    }
    return response;
  } catch {
    if (!fallback) return Response.error();
    if (known) return fallback;
    return new Response(await fallback.clone().blob(), {
      status: 404,
      statusText: 'Not Found',
      headers: fallback.headers
    });
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request.url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(navigationResponse(request.url));
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    try {
      const fresh = await fetch(request);
      if (fresh.ok) cacheResponse(request, fresh.clone());
      return fresh;
    } catch {
      return cached || Response.error();
    }
  })());
});
