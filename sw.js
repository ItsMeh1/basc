importScripts('./site-map.js');

const VERSION = 'basc-v2.4.1-features';
const SHELL = ['./','./index.html','./styles.css','./content-pages.css','./banner.css','./candidate-hero.css','./ui-fixes.css','./app.js','./config.js','./site-map.js','./banner.js','./search.js','./site-bot.js','./footer.js','./404.html'];

self.addEventListener('install', event => event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
function pathOf(url){return new URL(url).pathname.replace(/\/+$/,'')||'/';}
function sameOrigin(url){return new URL(url).origin===self.location.origin;}
function isKnownPath(path){const map=self.BASC_SITE_MAP||{};const aliases=map.aliases||{};const canonical=aliases[path]||path;return path===map.home||Object.keys(map).some(k=>k!=='aliases'&&map[k]===path)||Object.values(aliases).includes(path)||canonical===map.home||Object.keys(map).some(k=>k!=='aliases'&&map[k]===canonical);}
async function navigationResponse(url){const known=isKnownPath(pathOf(url));const shell=known?'./index.html':'./404.html';try{const response=await fetch(`${shell}?v=${VERSION}`,{cache:'no-store'});if(!response.ok)throw new Error('navigation failed');const body=await response.blob();const headers=new Headers(response.headers);caches.open(VERSION).then(c=>c.put(shell,new Response(body.slice(0,body.size),{headers}))).catch(()=>{});return new Response(body,{status:known?200:404,statusText:known?'OK':'Not Found',headers});}catch{const fallback=await caches.match(shell);if(!fallback)return Response.error();const body=await fallback.blob();return new Response(body,{status:known?200:404,statusText:known?'OK':'Not Found',headers:fallback.headers});}}
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET'||!sameOrigin(request.url))return;if(request.mode==='navigate'){event.respondWith(navigationResponse(request.url));return;}event.respondWith((async()=>{try{const fresh=await fetch(request,{cache:'no-store'});if(fresh.ok)caches.open(VERSION).then(c=>c.put(request,fresh.clone())).catch(()=>{});return fresh;}catch{return (await caches.match(request))||Response.error();}})());});
