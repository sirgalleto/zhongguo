/* App logic. Data lives in trip-data.js and phrases.js (loaded first). */
(function(){
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const $=s=>document.querySelector(s);
const norm=it=>typeof it==='string'?{text:it}:it;
const STATUS={confirmed:'Confirmed',tobook:'To book'};
const badge=st=>STATUS[st]?`<span class="badge ${st}">${STATUS[st]}</span>`:'';
const meta=it=>(it.status||it.ref||it.time)?`<span class="meta">${badge(it.status)}${it.time?`<span class="mono">${esc(it.time)}</span>`:''}${it.ref?`<button class="copy" data-copy="${esc(it.ref)}" aria-label="Copy reference">${esc(it.ref)}</button>`:''}</span>`:'';
const hash=s=>{let h=0;for(const ch of s)h=(h*31+ch.charCodeAt(0))|0;return (h>>>0).toString(36)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));



const DAY=86400000;
const toUTC=s=>{const[y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)};
const keyOf=t=>new Date(t).toISOString().slice(0,10);
const localToday=()=>{const n=new Date();return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`};
const fmt=(s,o)=>new Date(toUTC(s)).toLocaleDateString('en-US',Object.assign({timeZone:'UTC'},o));
const short=s=>fmt(s,{month:'short',day:'numeric'});
const START='2026-10-11',END='2026-11-04';

const DAYS=[];
for(let t=toUTC(START);t<=toUTC(END);t+=DAY){
  const k=keyOf(t);
  const si=STAYS.findIndex(s=>k>=s.in&&k<s.out);
  const arriving=STAYS.findIndex(s=>s.in===k);
  let kind='stay',c=si>=0?STAYS[si].c:STAYS[STAYS.length-1].c,from=null;
  if(k===START)kind='arrive';
  else if(k===END)kind='depart';
  else if(arriving>0){kind='move';from=STAYS[arriving-1].c}
  DAYS.push({k,c,si,kind,from});
}

let sim=null;
const today=()=>sim||localToday();

function phase(){
  const t=today();
  if(t<START)return{when:'before',n:Math.round((toUTC(START)-toUTC(t))/DAY)};
  if(t>END)return{when:'after'};
  const idx=DAYS.findIndex(d=>d.k===t);
  return{when:'during',idx,day:DAYS[idx]};
}

function setStatus(){
  const p=phase(),s=$('#status');
  s.textContent=p.when==='before'?`Starts in ${p.n} day${p.n===1?'':'s'}`:p.when==='after'?'Trip complete':`Day ${p.idx+1} of ${DAYS.length}`;
}
/* Status for the city in view on the Itinerary: counts to its check-in, or says where you are */
function setStatusFor(i){
  const s=STAYS[i], t=today(), name=CITIES[s.c].en, el=$('#status');
  const days=Math.round((toUTC(s.in)-toUTC(t))/DAY);
  if(t>=s.in&&t<s.out||(t===s.out&&s.out===END)){const p=phase();el.textContent=`Here now · day ${p.idx+1} of ${DAYS.length}`}
  else if(days>0)el.textContent=days===1?`${name} tomorrow`:`${name} in ${days} days`;
  else el.textContent=`${name} · visited`;
}

/* ---------- Motion ---------- */
const REDUCED=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}})();
const FLAP_GLYPHS='上海北京西安成都重庆深圳广州东南中华城站';
const FLIP_TICKS=4, FLIP_STAGGER=2; // flips per tile; second tile settles a bit later
/* Touch devices get a real split-flap (two halves that fold), tuned on iPhone Safari:
   1 extra character before landing, 200 ms per flap. Desktop keeps the fast character swap. */
const SPLIT_FLAP=(()=>{try{return matchMedia('(hover: none) and (pointer: coarse)').matches}catch(e){return false}})();
const SF_EXTRA=1, SF_MS=200, SF_STAGGER=90;
const SF_HAS_WAAPI=typeof Element!=='undefined'&&typeof Element.prototype.animate==='function';
function setTile(el,ch){
  el.dataset.ch=ch; el.dataset.shown=ch;
  if(el._run)el._run=null;
  if(SPLIT_FLAP){el.classList.add('sf');el.innerHTML=`<span class="h t"><span>${ch}</span></span><span class="h b"><span>${ch}</span></span>`}
  else el.textContent=ch;
}
function sfHalf(cls,ch){const h=document.createElement('span');h.className='h '+cls;const i=document.createElement('span');i.textContent=ch;h.appendChild(i);return h}
async function sfFlipOnce(el,next){
  const cur=el.dataset.shown; if(cur===next)return;
  const top=el.querySelector('.h.t:not(.flap) > span'), bot=el.querySelector('.h.b:not(.flap) > span');
  if(!top||!bot){setTile(el,next);return}
  const fTop=sfHalf('t flap',cur), fBot=sfHalf('b flap',next);
  fBot.style.transform='perspective(300px) rotateX(90deg)';
  el.appendChild(fTop);el.appendChild(fBot);
  top.textContent=next;
  const sleep=t=>new Promise(r=>setTimeout(r,t));
  if(SF_HAS_WAAPI){
    await fTop.animate([{transform:'perspective(300px) rotateX(0deg)'},{transform:'perspective(300px) rotateX(-90deg)'}],{duration:SF_MS,easing:'ease-in',fill:'forwards'}).finished.catch(()=>{});
    await fBot.animate([{transform:'perspective(300px) rotateX(90deg)'},{transform:'perspective(300px) rotateX(0deg)'}],{duration:SF_MS,easing:'ease-out',fill:'forwards'}).finished.catch(()=>{});
  }else await sleep(SF_MS*2);
  bot.textContent=next; el.dataset.shown=next; fTop.remove(); fBot.remove();
}
async function sfSpin(el,extra){
  const target=el.dataset.ch, run={}; el._run=run;
  const seq=[];for(let k=0;k<extra;k++){let g;do{g=FLAP_GLYPHS[Math.floor(Math.random()*FLAP_GLYPHS.length)]}while(g===target||g===el.dataset.shown||g===seq[seq.length-1]);seq.push(g)}
  seq.push(target);
  for(const g of seq){if(el._run!==run)return;await sfFlipOnce(el,g)}
}
function flip(delay){
  if(SPLIT_FLAP){
    [...document.querySelectorAll('#flap .flapch')].forEach((el,k)=>setTimeout(()=>sfSpin(el,SF_EXTRA+k),delay+k*SF_STAGGER));
    return;
  }
  const tiles=[...document.querySelectorAll('#flap .flapch')];
  tiles.forEach((el,k)=>{
    if(el._flip)clearInterval(el._flip);
    const target=el.dataset.ch||(el.dataset.ch=el.textContent); let n=0;
    setTimeout(()=>{
      el.classList.add('spin');
      el._flip=setInterval(()=>{
        const done=++n>FLIP_TICKS+k*FLIP_STAGGER;
        el.textContent=done?target:FLAP_GLYPHS[Math.floor(Math.random()*FLAP_GLYPHS.length)];
        try{el.animate([{transform:'scaleY(.1)'},{transform:'scaleY(1)'}],{duration:70,easing:'ease-out'})}catch(e){}
        if(done){clearInterval(el._flip);el._flip=null;el.classList.remove('spin')}
      },80);
    },delay);
  });
}
function thump(){const el=document.querySelector('.stamp');if(!el||REDUCED)return;el.classList.remove('thump','now');void el.offsetWidth;el.classList.add('thump','now')}
const fontsReady=(document.fonts&&document.fonts.ready)?document.fonts.ready.catch(()=>{}):Promise.resolve();
function applyCityAccent(){
  const p=phase();
  const c=p.when==='before'?STAYS[0].c:p.when==='after'?STAYS[STAYS.length-1].c:p.day.c;
  document.documentElement.style.setProperty('--accent',`var(--c-${c})`);
}

/* ---------- Itinerary: scroll journey ----------
   A sticky departure board sits on top. Each city is a section below it.
   As a section reaches the board, the board flips to that city and the accent follows.
   The seal shows (and stamps) only while the board is on today's city. */
let viewIdx=-1, curIdx=-1, journeyScrolled=false;
const stopOf=d=>d.si>=0?d.si:STAYS.length-1;
const range=s=>`${short(s.in)} → ${short(s.out)}`;
const nightsOf=s=>(toUTC(s.out)-toUTC(s.in))/DAY;

function renderItinerary(){
  const p=phase(), t=today();
  curIdx=p.when==='during'?stopOf(p.day):-1;
  const startIdx=curIdx>=0?curIdx:p.when==='after'?STAYS.length-1:0;
  const prog=p.when==='before'?0:p.when==='after'?1:curIdx/(STAYS.length-1);

  const rail=STAYS.map((s,i)=>{
    const cls=(p.when==='after'||i<curIdx)?'past':i===curIdx?'now':'';
    return `<li class="${cls}${i%2?' low':''}" style="--cc:var(--c-${s.c});left:${RAIL_POS[i]}%"><button class="railbtn" data-go="${i}" aria-label="Go to ${CITIES[s.c].en}"><span class="dot"></span><span class="zh">${CITIES[s.c].zh}</span></button></li>`;
  }).join('');
  const hours=STAYS.slice(1).map((s,i)=>`<span class="hrs mono" style="left:${(RAIL_POS[i]+RAIL_POS[i+1])/2}%">${fmtHours(s.rail)}</span>`).join('');

  const stops=STAYS.map((s,i)=>{
    const c=CITIES[s.c], n=nightsOf(s);
    const days=DAYS.filter(d=>stopOf(d)===i).map(d=>{
      const isT=d.k===t, past=d.k<t;
      let what=`<b>${esc(PLAN[d.k]?PLAN[d.k].t:c.en)}</b>`, tag='';
      if(d.kind==='arrive')tag='<span class="tag move">Arrive</span>';
      else if(d.kind==='move')tag='<span class="tag move">Train</span>';
      else if(d.kind==='depart')tag='<span class="tag move">Depart</span>';
      if(isT)tag='<span class="tag">Today</span>';
      const nc=PLAN[d.k]?PLAN[d.k].i.map(norm).filter(x=>x.status==='confirmed').length:0;
      return `<div class="day${isT?' today':''}${past?' past':''}" style="--cc:var(--c-${d.c})">
        <div class="d mono">${fmt(d.k,{weekday:'short'})}<b>${fmt(d.k,{month:'short',day:'numeric'})}</b></div>
        <span class="bar"></span>
        <div class="what">${what}<span>Day ${DAYS.indexOf(d)+1}${nc?` · ${nc} confirmed`:''}</span></div>${tag}</div>`;
    }).join('');
    const bookedToday=(i===curIdx&&PLAN[t])?PLAN[t].i.map(norm).filter(x=>x.status):[];
    const next=STAYS[i+1], leg=next?TRANSIT[next.in]:TRANSIT[END];
    return `<section style="--n:${n}" class="stop${i===curIdx?' current':''}${(p.when==='after'||i<curIdx)?' done':''}" data-i="${i}" id="stop-${s.c}" style="--cc:var(--c-${s.c})">
      <div class="stop-head"><span class="n mono">${String(i+1).padStart(2,'0')}</span><span class="zh">${c.zh}</span><b>${c.en}</b></div>
      <div class="stop-meta mono">${range(s)} · ${n} night${n>1?'s':''}</div>
      <div class="stop-hotel">${esc(s.name.split(' (')[0])}<span class="mono">${esc(s.room)}</span></div>
      ${bookedToday.length?`<div class="note"><b>Bookings today</b>${bookedToday.map(x=>`<div style="margin-top:6px">${esc(x.text)}${meta(x)}</div>`).join('')}</div>`:''}
      <div class="days">${days}</div>
      ${leg?`<div class="leg"><span class="arrow" aria-hidden="true">↓</span><span>${esc(leg.text)}</span>${badge(leg.status)}</div>`:''}
    </section>`;
  }).join('');

  $('#p-itinerary').innerHTML=`
    <div class="board" id="board">
      <div class="board-top"><span class="eyebrow" id="b-label"></span><span class="mono b-idx" id="b-idx"></span></div>
      <div class="board-row">
        <div class="big-zh" id="flap"><span class="flapch"></span><span class="flapch"></span></div>
        <div class="stamp" id="seal" hidden><span class="zh">今天</span></div>
      </div>
      <div class="big-py" id="b-py"></div>
      <div class="route rail" style="--r0:${RAIL_POS[0]}%;--r6:${RAIL_POS[RAIL_POS.length-1]}%">
        <ol><span class="fill" id="rfill"></span>${hours}${rail}<span class="train" id="train" aria-hidden="true">${TRAIN_SVG}</span></ol>
      </div>
    </div>
    <div class="stops">${stops}</div>
    <div class="sim"><label for="simdate">Preview a date</label><input type="date" id="simdate" min="2026-10-01" max="2026-11-10" value="${sim||''}"><button class="btn" id="simreset">Use real today</button></div>`;

  /* initial board state, no animation */
  const tiles=[...document.querySelectorAll('#flap .flapch')];
  const sc=CITIES[STAYS[startIdx].c];
  tiles.forEach((el,k)=>setTile(el,[...sc.zh][k]||''));
  viewIdx=-1; setView(startIdx,false);
  if(!REDUCED)fontsReady.then(()=>{flip(300);if(startIdx===curIdx)setTimeout(thump,1250)});

  lastP=-1; requestAnimationFrame(moveTrain);

  $('#flap').onclick=()=>{if(!REDUCED)flip(0)};
  $('#seal').onclick=thump;
  document.querySelectorAll('.railbtn').forEach(b=>b.onclick=()=>scrollToStop(+b.dataset.go,true));
  $('#simdate').onchange=e=>{sim=e.target.value||null;journeyScrolled=false;renderAll();scrollToStop(curIdx>=0?curIdx:0,false)};
  $('#simreset').onclick=()=>{sim=null;journeyScrolled=false;renderAll();scrollToStop(curIdx>=0?curIdx:0,false)};
}

function setView(i,animate){
  if(i===viewIdx||i<0)return;
  viewIdx=i;
  const s=STAYS[i], c=CITIES[s.c], n=nightsOf(s), p=phase();
  document.documentElement.style.setProperty('--accent',`var(--c-${s.c})`);
  let label=`${range(s)} · ${n} nights`;
  if(i===curIdx&&p.day.kind!=='depart'){const k=(toUTC(p.day.k)-toUTC(s.in))/DAY+1;label=`Today · night ${k} of ${n}`}
  else if(i===curIdx)label='Today · departure';
  $('#b-label').textContent=label;
  setStatusFor(i);
  $('#b-idx').textContent=`${String(i+1).padStart(2,'0')} / ${String(STAYS.length).padStart(2,'0')}`;
  $('#b-py').textContent=`${c.py} · ${c.en}`;
  $('#flap').setAttribute('aria-label',c.zh);
  document.querySelectorAll('.route li').forEach((li,k)=>li.classList.toggle('view',k===i));
  [...document.querySelectorAll('#flap .flapch')].forEach((el,k)=>{el.dataset.ch=[...c.zh][k]||''});
  if(animate&&!REDUCED)flip(0);
  else document.querySelectorAll('#flap .flapch').forEach(el=>{if(!el._flip)setTile(el,el.dataset.ch)});
  const seal=$('#seal'), isCur=i===curIdx;
  seal.hidden=!isCur;
  if(isCur&&animate)thump();
}

function stopUnderBoard(){
  const board=$('#board'); if(!board)return -1;
  const line=board.getBoundingClientRect().bottom+Math.min(140,innerHeight*.18);
  let idx=0;
  document.querySelectorAll('.stop').forEach(sec=>{if(sec.getBoundingClientRect().top<=line)idx=+sec.dataset.i});
  return idx;
}
/* ---------- The train ----------
   Rail spacing follows rail hours (close cities sit close). Sections are taller for longer
   stays, so the train spends more scroll on cities where you stay longer. Scrolling through
   a city's section moves the train along the line toward the next city. */
const RAIL_POS=(()=>{
  const hrs=STAYS.slice(1).map(s=>s.rail||1), total=hrs.reduce((a,b)=>a+b,0);
  const start=5, span=90, minGap=11, free=span-minGap*hrs.length; // minGap keeps close cities (Shenzhen, Guangzhou) readable
  const pos=[start]; hrs.forEach(h=>pos.push(pos[pos.length-1]+minGap+free*h/total));
  return pos.map(x=>+x.toFixed(2));
})();
const fmtHours=h=>{const m=Math.round(h*60), hh=Math.floor(m/60), mm=m%60;return hh?`${hh}h${mm?String(mm).padStart(2,'0'):''}`:`${mm}m`};
const TRAIN_SVG='<svg viewBox="0 0 34 12"><path d="M2 2h20c5 0 9 2.2 11 4.5V9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path class="win" d="M5 4.5h3v2H5zM10 4.5h3v2h-3zM15 4.5h3v2h-3z"/><path class="nose" d="M23 4.2c3 .3 5.8 1.3 7.6 3H23z"/></svg>';
let lastP=-1;
function trainProgress(){
  const board=$('#board'); if(!board)return 0;
  const line=board.getBoundingClientRect().bottom+Math.min(140,innerHeight*.18);
  const secs=[...document.querySelectorAll('.stop')];
  let i=0; secs.forEach((sec,k)=>{if(sec.getBoundingClientRect().top<=line)i=k});
  const a=secs[i].getBoundingClientRect(), endTop=secs[i+1]?secs[i+1].getBoundingClientRect().top:a.bottom;
  const f=Math.min(1,Math.max(0,(line-a.top)/Math.max(1,endTop-a.top)));
  return Math.min(i+f,STAYS.length-1);
}
function moveTrain(){
  const tr=$('#train'), fill=$('#rfill'); if(!tr)return;
  const p=trainProgress(); if(Math.abs(p-lastP)<0.001)return;
  const i=Math.floor(p), f=p-i, a=RAIL_POS[i], b=RAIL_POS[Math.min(i+1,RAIL_POS.length-1)];
  const x=a+(b-a)*f;
  tr.classList.toggle('back',p<lastP);
  tr.classList.toggle('docked',f<0.04||i>=STAYS.length-1);
  tr.style.left=x+'%';
  fill.style.width=(x-RAIL_POS[0])+'%';
  const last=STAYS.length-1;
  if(lastP>=0&&lastP<last-0.001&&p>=last-0.001)lightsHome();
  lastP=p;
}
/* Arrival at the last stop: a light runs back along the rail and each stop pings, Guangzhou to Shanghai */
function lightsHome(){
  if(REDUCED)return;
  const ol=$('.route.rail ol'); if(!ol||!ol.animate)return;
  const sw=document.createElement('span'); sw.className='sweep'; ol.appendChild(sw);
  const r0=RAIL_POS[0]+'%', r6=RAIL_POS[RAIL_POS.length-1]+'%';
  const a=sw.animate([{left:r6,opacity:0},{opacity:.8,offset:.1},{opacity:.8,offset:.9},{left:r0,opacity:0}],{duration:1400,easing:'ease-in-out'});
  a.finished.then(()=>sw.remove(),()=>sw.remove());
  const dots=[...document.querySelectorAll('.route.rail li .dot')].reverse();
  dots.forEach((d,i)=>setTimeout(()=>{try{d.animate([{boxShadow:'0 0 0 0 color-mix(in srgb, var(--accent) 70%, transparent)'},{boxShadow:'0 0 0 8px color-mix(in srgb, var(--accent) 0%, transparent)'}],{duration:500,easing:'ease-out'})}catch(e){}},i*200));
}
let ticking=false;
window.addEventListener('scroll',()=>{
  if(ticking||$('#p-itinerary').hidden)return; ticking=true;
  requestAnimationFrame(()=>{ticking=false;setView(stopUnderBoard(),true);moveTrain()});
},{passive:true});
window.addEventListener('resize',()=>{lastP=-1;moveTrain()});

function scrollToStop(i,smooth){
  const sec=document.querySelector(`.stop[data-i="${i}"]`); if(!sec)return;
  if(i===0){window.scrollTo({top:0,behavior:smooth&&!REDUCED?'smooth':'auto'});return}
  const board=$('#board'), top=$('.top');
  const offset=(top?top.offsetHeight:0)+(board?board.offsetHeight:0)+8;
  window.scrollTo({top:sec.getBoundingClientRect().top+scrollY-offset,behavior:smooth&&!REDUCED?'smooth':'auto'});
}

/* ---------- Stays ---------- */
function renderStays(){
  const t=today();
  const cards=STAYS.map(s=>{
    const c=CITIES[s.c],n=(toUTC(s.out)-toUTC(s.in))/DAY,cur=t>=s.in&&t<s.out;
    const q=encodeURIComponent(s.name.split(' (')[0]+' '+c.en);
    return `<article class="ticket stay${cur?' current':''}" style="--cc:var(--c-${s.c})">
      <div class="ticket-main">
        <div class="city-zh">${c.zh}</div>
        <div style="min-width:0"><div class="when">${fmt(s.in,{weekday:'short',month:'short',day:'numeric'})} → ${fmt(s.out,{weekday:'short',month:'short',day:'numeric'})} · ${n} night${n>1?'s':''}${cur?' · <b style="color:var(--stamp)">Now</b>':''}</div>
        <h3>${esc(s.name)}</h3></div>
      </div>
      <div class="perf"></div>
      <div class="ticket-foot">
        <div class="kv"><div class="k">Room</div><div class="v">${esc(s.room)}</div></div>
        <div class="kv"><div class="k">Area</div><div class="v">${esc(s.area)}</div></div>
        <div class="kv"><div class="k">Status</div><div class="v">${badge('confirmed')}</div></div>
      </div>
      <div class="links">
        <a href="https://uri.amap.com/search?keyword=${q}&city=${encodeURIComponent(c.zh)}" target="_blank" rel="noopener">Amap</a>
        <a href="https://maps.apple.com/?q=${q}" target="_blank" rel="noopener">Apple Maps</a>
      </div>
    </article>`;
  }).join('');
  $('#p-stays').innerHTML=`
    <div class="summary">
      <div><b>7</b><span>hotels</span></div>
      <div><b>24</b><span>nights</span></div>
      <div><b>${DAYS.length}</b><span>days</span></div>
    </div>
    <div class="note">Check-in at every hotel needs your passport. For taxis, open the booking in the Trip.com app and use the Chinese address card, drivers read that faster than any map pin.</div>
    ${cards}`;
}

/* ---------- Plan ---------- */
let planFilter=store.get('cn-plan-filter','all');
function renderPlan(){
  const done=store.get('cn-plan-done',{});
  const t=today();
  const chips=['all',...STAYS.map(s=>s.c)].map(c=>`<button class="chip" data-f="${c}" aria-pressed="${planFilter===c}">${c==='all'?'All days':CITIES[c].en}</button>`).join('');
  let lastCity=null;
  const cards=DAYS.filter(d=>planFilter==='all'||d.c===planFilter||(d.from&&d.from===planFilter)).map((d,i)=>{
    const gal=d.c!==lastCity?`<div class="gallery" data-city="${d.c}" style="--cc:var(--c-${d.c})"></div>`:'';
    lastCity=d.c;
    const p=PLAN[d.k]||{t:'',i:[]};const c=CITIES[d.c];
    const n=DAYS.indexOf(d)+1;
    const items=p.i.map(norm).map(it=>{const id=`${d.k}-${hash(it.text)}`;return `<li><label><input type="checkbox" id="pc-${id}" data-id="${id}" ${done[id]?'checked':''}><span><span class="txt">${esc(it.text)}</span>${meta(it)}</span></label></li>`}).join('');
    return gal+`<article class="pday${d.k===t?' today':''}${d.k<t?' past':''}" style="--cc:var(--c-${d.c})" id="day-${d.k}">
      <header><span class="zh">${c.zh}</span><div><b>${esc(p.t)}</b><span>Day ${n} · ${fmt(d.k,{weekday:'long',month:'short',day:'numeric'})}</span></div>${d.k===t?'<span class="tag" style="background:var(--stamp);border-color:var(--stamp);color:var(--card)">Today</span>':''}</header>
      <ul>${items}</ul>
      ${TRANSIT[d.k]&&d.kind!=='arrive'?`<div class="transit"><span>${esc(TRANSIT[d.k].text)}</span>${badge(TRANSIT[d.k].status)}</div>`:''}
      ${p.tip?`<div class="tip"><b>Tip</b> ${esc(p.tip)}</div>`:''}
    </article>`;
  }).join('');
  $('#p-plan').innerHTML=`<div class="chips" role="group" aria-label="Filter by city">${chips}</div>${cards}`;
  fillGalleries();
  $('#p-plan').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{planFilter=b.dataset.f;store.set('cn-plan-filter',planFilter);renderPlan()});
  $('#p-plan').querySelectorAll('input[type=checkbox]').forEach(cb=>cb.onchange=()=>{const d=store.get('cn-plan-done',{});if(cb.checked)d[cb.dataset.id]=1;else delete d[cb.dataset.id];store.set('cn-plan-done',d)});
}

/* ---------- Photos (docs/img, fetched by the GitHub Action) ---------- */
let PHOTOS=null;
(typeof fetch==='function'?fetch('img/credits.json'):Promise.reject()).then(r=>r.ok?r.json():[]).then(list=>{PHOTOS=list;fillGalleries()}).catch(()=>{PHOTOS=[]});
function fillGalleries(){
  if(!PHOTOS||!PHOTOS.length)return;
  document.querySelectorAll('.gallery[data-city]').forEach(g=>{
    const c=g.dataset.city, list=PHOTOS.filter(p=>p.city===c);
    if(!list.length||g.childElementCount)return;
    g.innerHTML=`<div class="g-head"><span class="zh">${CITIES[c].zh}</span><span class="mono">${CITIES[c].en} · ${list.length} photos</span></div>
      <div class="g-strip">${list.map(p=>`<figure class="g-item"><img src="img/${esc(p.file)}" alt="${esc(p.label)}" loading="lazy" decoding="async" onload="this.classList.add('in')">
        <figcaption><b>${esc(p.label)}</b><a href="${esc(p.page)}" target="_blank" rel="noopener">${esc(p.author)} · ${esc(p.license)}</a></figcaption></figure>`).join('')}</div>`;
  });
}

/* ---------- Dictionary ---------- */
const ICON_SAY='<svg viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
const ICON_SHOW='<svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
let dq='';
function renderDict(){
  const q=dq.trim().toLowerCase();
  const strip=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  const html=DICT.map(c=>{
    const rows=c.p.filter(([en,hz,py])=>!q||en.toLowerCase().includes(q)||hz.includes(dq.trim())||strip(py).includes(strip(q)))
      .map(([en,hz,py,sp])=>`<div class="ph"><div class="en">${esc(en)}</div><div class="hz">${hz}</div><div class="py">${py}</div>
        <div class="acts"><button class="ico" data-say="${esc(sp||hz)}" aria-label="Play ${esc(en)}">${ICON_SAY}</button><button class="ico" data-show="${encodeURIComponent(JSON.stringify([en,hz,py,sp||hz]))}" aria-label="Show ${esc(en)} full screen">${ICON_SHOW}</button></div></div>`).join('');
    return rows?`<div class="cat"><h3>${c.cat}<span class="zh">${c.zh}</span></h3>${rows}</div>`:'';
  }).join('');
  $('#dict-list').innerHTML=html||'<div class="empty">No phrase matches. Try English or pinyin without tones.</div>';
}
function initDict(){
  $('#p-dictionary').innerHTML=`<input class="search" id="dsearch" type="search" placeholder="Search English, pinyin or 汉字" aria-label="Search phrases"><div id="dict-list" style="display:flex;flex-direction:column;gap:16px"></div>
  <div class="note">Tap the speaker to hear it. Tap the arrows to show the phrase full screen to a driver or waiter.<div class="mono" id="voice-name" style="margin-top:6px;font-size:11px"></div></div>`;
  pickVoice();
  $('#dsearch').oninput=e=>{dq=e.target.value;renderDict()};
  renderDict();
}
/* Mandarin voice: pick a real mainland zh-CN voice instead of the browser default.
   Cantonese (zh-HK) and Taiwanese Mandarin (zh-TW) voices are skipped on purpose. */
let ZH_VOICE=null;
const VOICE_PREF=[/xiaoxiao/i,/yunxi/i,/tingting|ting-ting/i,/普通话|mandarin.*(china|mainland)/i,/google.*(普通话|chinese)/i,/yaoyao|huihui|kangkang/i,/lili|meijia|sinji/i];
function pickVoice(){
  let vs=[];try{vs=speechSynthesis.getVoices()}catch(e){return null}
  const norm=v=>(v.lang||'').replace('_','-').toLowerCase();
  const cn=vs.filter(v=>norm(v)==='zh-cn'||norm(v)==='cmn-cn'||norm(v)==='cmn-hans-cn');
  const pool=cn.length?cn:vs.filter(v=>/^zh(-hans)?$/.test(norm(v)));
  const score=v=>{let s=0;VOICE_PREF.forEach((re,i)=>{if(re.test(v.name))s=Math.max(s,100-i*10)});if(/enhanced|premium|neural|natural|online/i.test(v.name))s+=15;if(v.localService)s+=3;return s};
  ZH_VOICE=pool.sort((a,b)=>score(b)-score(a))[0]||null;
  const lbl=document.getElementById('voice-name');
  if(lbl)lbl.textContent=ZH_VOICE?`Voice: ${ZH_VOICE.name} (${ZH_VOICE.lang})`:'No Mandarin voice found on this device';
  return ZH_VOICE;
}
try{pickVoice();speechSynthesis.addEventListener('voiceschanged',pickVoice)}catch(e){}
/* Make the text read naturally: separators become pauses, Latin bits are dropped */
const speakable=t=>t.replace(/\s*[\/·]\s*/g,'，').replace(/WiFi/gi,'无线网').trim().replace(/\s+/g,'，');
function say(t){
  try{
    const v=ZH_VOICE||pickVoice();
    if(!v){toast('Add a Chinese (China mainland) voice in your device settings');return}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(speakable(t));
    u.voice=v;u.lang=v.lang;u.rate=.82;u.pitch=1;
    setTimeout(()=>speechSynthesis.speak(u),60); // iOS drops a speak() called right after cancel()
  }catch(e){toast('Audio is not available here')}
}
let showing=null;
document.addEventListener('click',e=>{
  const s=e.target.closest('[data-say]');if(s){say(s.dataset.say);return}
  const sh=e.target.closest('[data-show]');
  if(sh){showing=JSON.parse(decodeURIComponent(sh.dataset.show));$('#show-en').textContent=showing[0];$('#show-hz').textContent=showing[1];$('#show-py').textContent=showing[2];$('#show').hidden=false;return}
  const cp=e.target.closest('[data-copy]');
  if(cp){e.preventDefault();const v=cp.dataset.copy;try{navigator.clipboard.writeText(v).then(()=>toast('Copied'),()=>selectText(cp))}catch(err){selectText(cp)}}
});
function selectText(el){try{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Selected, copy it from the menu')}catch(e){}}
$('#show-close').onclick=()=>{$('#show').hidden=true};
$('#show-say').onclick=()=>showing&&say(showing[3]||showing[1]);
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#show').hidden=true});
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

/* ---------- Tabs ---------- */
const TABS=['itinerary','stays','plan','dictionary'];
function go(tab,scroll){
  if(!TABS.includes(tab))tab='itinerary';
  const prev=store.get('cn-tab',null);
  TABS.forEach(t=>{$('#p-'+t).hidden=t!==tab;$('#t-'+t).setAttribute('aria-selected',t===tab)});
  if(scroll&&prev!==tab){const el=$('#p-'+tab);el.classList.remove('enter');void el.offsetWidth;el.classList.add('enter')}
  store.set('cn-tab',tab);
  window.scrollTo(0,0);
  if(scroll&&tab==='plan'){const el=document.getElementById('day-'+today());if(el)el.scrollIntoView({block:'start'})}
  if(tab==='itinerary'){
    if(viewIdx>=0)document.documentElement.style.setProperty('--accent',`var(--c-${STAYS[viewIdx].c})`);
    if(!journeyScrolled&&curIdx>0){journeyScrolled=true;requestAnimationFrame(()=>scrollToStop(curIdx,false))}
  }else{applyCityAccent();setStatus()}
}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>go(b.dataset.tab,true));

function setTopbar(){const t=$('.top');if(t)document.documentElement.style.setProperty('--topbar',t.offsetHeight+'px')}
setTopbar();window.addEventListener('resize',setTopbar);
function renderAll(){applyCityAccent();setStatus();renderItinerary();renderStays();renderPlan();if(!$('#p-itinerary').hidden&&viewIdx>=0)document.documentElement.style.setProperty('--accent',`var(--c-${STAYS[viewIdx].c})`)}
renderAll();initDict();
const h=(location.hash||'').slice(1);
go(TABS.includes(h)?h:store.get('cn-tab','itinerary'),false);

/* Re-check the date when the app comes back to the foreground (e.g. next morning) */
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!sim)renderAll()});

/* Offline support when installed from its own host (ignored inside the claude.ai viewer) */
try{if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&!/claude/.test(location.host)){navigator.serviceWorker.register('sw.js').catch(()=>{})}}catch(e){}
})();
