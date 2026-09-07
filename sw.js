const VERSION='basc-v2.7.0-root-assets';
const CORE=[
  '/',
  '/index.html',
  '/404.html',
  '/styles.css?v=20260907-routefix',
  '/content-pages.css?v=20260907-routefix',
  '/banner.css?v=20260907-routefix',
  '/candidate-hero.css?v=20260907-routefix',
  '/ui-fixes.css?v=20260907-routefix',
  '/site-map.js?v=20260907-routefix',
  '/config.js?v=20260907-routefix',
  '/bot-config.js?v=20260907-routefix',
  '/app.js?v=20260907-routefix',
  '/scripts/ballot-candidates.js?v=20260907-routefix',
  '/scripts/apply-static.js?v=20260907-routefix',
  '/banner.js?v=20260907-routefix',
  '/search.js?v=20260907-routefix',
  '/scripts/basi.js?v=20260907-routefix',
  '/scripts/basi-embeds.js?v=20260907-routefix',
  '/scripts/basi-tour-fix.js?v=20260907-routefix',
  '/footer.js?v=20260907-routefix',
  '/scripts/results.js?v=20260907-routefix'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(VERSION);
    // Never let one optional asset stop the new worker from installing.
    await Promise.all(CORE.map(async url=>{
      try{const res=await fetch(url,{cache:'reload'});if(res.ok)await cache.put(url,res.clone())}catch{}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    await Promise.all((await caches.keys()).filter(k=>k.startsWith('basc-')&&k!==VERSION).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

function pathname(url){const p=new URL(url).pathname;return p.length>1?p.replace(/\/+$/,''):'/';}
function sameOrigin(url){return new URL(url).origin===self.location.origin;}
function routeKnown(path){
  const map=self.BASC_SITE_MAP||{};
  const aliases=map.aliases||{};
  const clean=aliases[path]||path;
  if(clean==='/'||clean===map.home)return true;
  return Object.entries(map).some(([key,value])=>key!=='aliases'&&value===clean);
}

async function cachedShell(url,status){
  const cache=await caches.open(VERSION);
  const cached=await cache.match(url)||await caches.match(url);
  if(!cached)return Response.error();
  const headers=new Headers(cached.headers);
  headers.set('Content-Type','text/html; charset=utf-8');
  return new Response(await cached.blob(),{status,status,statusText:status===200?'OK':'Not Found',headers});
}

async function navigation(request){
  const path=pathname(request.url);
  const known=routeKnown(path);
  const target=known?'/index.html':'/404.html';
  try{
    const res=await fetch(target,{cache:'no-store'});
    if(!res.ok)throw new Error('shell failed');
    const cache=await caches.open(VERSION);
    await cache.put(target,res.clone());
    return new Response(await res.blob(),{
      status:known?200:404,
      statusText:known?'OK':'Not Found',
      headers:res.headers
    });
  }catch{
    return cachedShell(target,known?200:404);
  }
}

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||!sameOrigin(request.url))return;

  if(request.mode==='navigate'){
    event.respondWith(navigation(request));
    return;
  }

  event.respondWith((async()=>{
    try{
      const fresh=await fetch(request,{cache:'no-store'});
      if(fresh.ok){
        const cache=await caches.open(VERSION);
        await cache.put(request,fresh.clone());
      }
      return fresh;
    }catch{
      return (await caches.match(request))||Response.error();
    }
  })());
});
