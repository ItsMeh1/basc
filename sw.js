importScripts('./site-map.js');

const VERSION = 'basc-v2.1';
const SHELL = ['./', './index.html', './styles.css', './app.js', './config.js', './site-map.js', './404.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function pathOf(url) {
  return new URL(url).pathname.replace(/\/+$/, '') || '/';
}

function sameOrigin(url) {
  return new URL(url).origin === self.location.origin;
}

function isKnownPath(path) {
  const routes = Array.isArray(self.BASC_SITE_MAP?.routes) ? self.BASC_SITE_MAP.routes : [];
  const aliases = self.BASC_SITE_MAP?.aliases || {};
  const canonical = aliases[path] || path;
  return routes.includes(path) || routes.includes(canonical) || path === self.BASC_SITE_MAP?.home;
}

async function navigationResponse(url) {
  const path = pathOf(url);
  const known = isKnownPath(path);
  const shellUrl = known ? './index.html' : './404.html';
  const fallback = await caches.match(shellUrl);

  try {
    const response = await fetch(shellUrl, { cache: 'no-store' });
    if (!response.ok) return fallback || Response.error();

    // Clone BEFORE the body is consumed/returned so the cache can safely use it.
    const cacheCopy = response.clone();
    eventCache(shellUrl, cacheCopy);

    if (!known) {
      return new Response(await response.blob(), {
        status: 404,
        statusText: 'Not Found',
        headers: response.headers
      });
    }
    return response;
  } catch {
    if (fallback) {
      if (!known) {
        return new Response(await fallback.clone().blob(), {
          status: 404,
          statusText: 'Not Found',
          headers: fallback.headers
        });
      }
      return fallback;
    }
    return Response.error();
  }
}

function eventCache(url, response) {
  caches.open(VERSION).then(cache => cache.put(url, response)).catch(() => {});
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
      if (fresh.ok) {
        // Clone immediately; fetch responses have a one-shot body.
        const cacheCopy = fresh.clone();
        eventCache(request, cacheCopy);
      }
      return fresh;
    } catch {
      return cached || Response.error();
    }
  })());
});
