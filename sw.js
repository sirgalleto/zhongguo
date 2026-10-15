/* Offline cache + fast updates.
   GitHub Pages sends Cache-Control: max-age=600, so a normal fetch can return a copy up to
   10 minutes old. Every same-origin request here uses cache:'no-cache', which makes the browser
   revalidate with the server (a cheap 304 when nothing changed), so a push shows up on the next
   open. Offline, the cached copy is used. Bump CACHE only to force a full re-download. */
const CACHE='china-trip-v4';
const SHELL=['./','./index.html','./styles.css','./trip-data.js','./ideas.js','./phrases.js','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const fresh=u=>new Request(u,{cache:'reload'});

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{
  await c.addAll(SHELL.map(fresh));
  // Pre-cache city photos so the Plan tab works offline (and behind the firewall)
  try{const r=await fetch('./img/credits.json',{cache:'no-cache'});if(r.ok){const list=await r.json();await c.put('./img/credits.json',new Response(JSON.stringify(list),{headers:{'Content-Type':'application/json'}}));await Promise.all(list.map(p=>c.add(fresh('./img/'+p.file)).catch(()=>{})))}}catch(err){}
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
  // Photos never change once fetched: cache first
  if(url.pathname.includes('/img/')&&!url.pathname.endsWith('.json')){
    e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r})));
    return;
  }
  // Everything else: network first, revalidated with the server, cache as offline fallback
  const net=req.mode==='navigate'?fetch(req.url,{cache:'no-cache'}):fetch(new Request(req,{cache:'no-cache'}));
  e.respondWith(net.then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));
});
