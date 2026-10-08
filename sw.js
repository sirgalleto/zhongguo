const CACHE='china-trip-v2'; // bump to force every phone to re-download everything
const SHELL=['./','./index.html','./styles.css','./trip-data.js','./phrases.js','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{
  await c.addAll(SHELL);
  // Pre-cache city photos so the Plan tab works offline (and behind the firewall)
  try{const r=await fetch('./img/credits.json',{cache:'no-cache'});if(r.ok){const list=await r.json();await c.put('./img/credits.json',new Response(JSON.stringify(list),{headers:{'Content-Type':'application/json'}}));await Promise.all(list.map(p=>c.add('./img/'+p.file).catch(()=>{})))}}catch(err){}
}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url);
  // Fonts: cache on first load so they work offline later (Google Fonts may be blocked in mainland China)
  if(/fonts\.(googleapis|gstatic)\.com$/.test(url.host)){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req).then(hit=>hit||fetch(req).then(r=>{c.put(req,r.clone());return r}).catch(()=>hit))));
    return;
  }
  if(url.origin!==location.origin)return;
  // App shell: network first (picks up updates), fall back to cache offline
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r}).catch(()=>caches.match(req).then(h=>h||caches.match('./index.html'))));
});
