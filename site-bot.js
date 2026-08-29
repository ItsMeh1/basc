(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const bot = cfg.bot || {};
  const candidates = Array.isArray(cfg.election?.candidates) ? cfg.election.candidates : [];
  const events = Array.isArray(cfg.events) ? cfg.events : [];
  const pages = cfg.pages || {};
  let banner = cfg.banner && cfg.banner.enabled !== false ? cfg.banner : null;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean = s => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  function styles() {
    const s = document.createElement('style');
    s.textContent = `
      .basi-wrap{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:system-ui,sans-serif}.basi-button{width:64px;height:64px;border:1px solid #ffffff33;border-radius:22px;background:linear-gradient(145deg,#fff0a2,#f4d65e,#d3b73f);box-shadow:0 18px 55px #0005;cursor:pointer;display:grid;place-items:center}.basi-avatar-3d{position:relative;width:36px;height:32px;border-radius:13px;background:linear-gradient(145deg,#fff7c8,#f6df6e,#d2af2e);box-shadow:inset 3px 3px 8px #fff8,5px 6px 0 #87681222}.basi-avatar-3d:before{content:'•  •';position:absolute;left:7px;top:4px;color:#222;font-size:12px;letter-spacing:4px}.basi-avatar-3d:after{content:'';position:absolute;left:13px;top:20px;width:10px;height:4px;border-bottom:2px solid #222;border-radius:50%}.basi-panel{position:absolute;right:0;bottom:76px;width:min(390px,calc(100vw - 28px));border:1px solid var(--line);border-radius:25px;background:var(--paper);box-shadow:0 30px 100px #0007;overflow:hidden}.basi-panel[hidden]{display:none}.basi-head{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid var(--line)}.basi-head-avatar{width:40px;height:40px;border-radius:13px;background:var(--yellow-soft);display:grid;place-items:center}.basi-head-avatar .basi-avatar-3d{transform:scale(.7);box-shadow:none}.basi-head strong{display:block}.basi-head small{color:var(--muted);font-size:10px}.basi-close{margin-left:auto;border:0;background:none;color:var(--muted);font-size:20px;cursor:pointer}.basi-messages{max-height:350px;overflow:auto;padding:14px;display:grid;gap:9px}.basi-message{max-width:90%;padding:10px 12px;border-radius:16px;background:var(--surface);font-size:12px;line-height:1.5}.basi-message.user{justify-self:end;background:var(--yellow-soft)}.basi-buttons{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.basi-choice{border:1px solid var(--line);border-radius:99px;padding:7px 10px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:700;cursor:pointer}.basi-choice.primary{background:var(--yellow);color:#19180f}.basi-input{display:flex;gap:7px;padding:10px;border-top:1px solid var(--line)}.basi-input input{min-width:0;flex:1;border:1px solid var(--line);border-radius:13px;background:var(--surface);color:var(--ink);padding:10px}.basi-input button{border:0;border-radius:13px;background:var(--yellow);font-weight:800;padding:0 13px}.basi-tour-ring{position:fixed;z-index:10000;pointer-events:none;border:2px solid var(--yellow);border-radius:22px;box-shadow:0 0 0 9999px #02030570,0 0 60px #f4d65e66;transition:all .45s ease}.basi-tour-card{position:fixed;z-index:10001;width:min(350px,calc(100vw - 28px));padding:16px;border:1px solid var(--line);border-radius:20px;background:var(--paper);box-shadow:0 25px 80px #0007}.basi-tour-card strong{font-size:14px}.basi-tour-card p{margin:10px 0;color:var(--muted);font-size:11px;line-height:1.5}.basi-tour-actions{display:flex;justify-content:flex-end;gap:7px}.basi-tour-actions button{border:1px solid var(--line);border-radius:10px;padding:8px 11px;background:var(--surface);color:var(--ink);font-weight:700}.basi-tour-actions .next{background:var(--yellow);color:#19180f}.basi-flight{position:fixed;z-index:10002;pointer-events:none;transition:transform .6s ease,opacity .3s}.basi-flight .basi-avatar-3d{width:44px;height:39px}@media(max-width:600px){.basi-wrap{right:14px;bottom:14px}.basi-button{width:58px;height:58px}}
    `;
    document.head.appendChild(s);
  }

  function knowledge() {
    const out = [];
    for (const r of cfg.routes || []) {
      const p = r.page === 'content' ? pages[r.content] : pages[r.page];
      out.push({text:clean([r.label,r.path,p?.title,p?.body].join(' ')),answer:p?.body || `The ${r.label} page has more information.`,actions:[{label:`Go to ${r.label}`,path:r.path,primary:true}]});
    }
    for (const c of candidates) out.push({text:clean([c.name,c.role,c.grade,c.statement].join(' ')),answer:`${c.name} is running for ${c.role || 'Student Council'}${c.grade ? ` and is in ${c.grade}.` : '.'}${c.statement ? ` Their message: “${c.statement}”` : ''}`,actions:[{label:'See candidates',path:'/vote',primary:true}]});
    for (const e of events) out.push({text:clean([e.title,e.tag,e.date,e.time,e.place].join(' ')),answer:`${e.title} is ${e.date || 'scheduled'}${e.time ? ` at ${e.time}` : ''}${e.place ? ` in ${e.place}` : ''}.`,actions:[{label:'Open Events',path:'/events',primary:true}]});
    if (banner) out.push({text:clean(JSON.stringify(banner)),answer:`The current announcement is “${banner.title || ''}”${banner.message ? ` — ${banner.message}` : ''}`,actions:[]});
    for (const x of Array.isArray(bot.knowledge) ? bot.knowledge : []) out.push({text:clean([x.title,x.keywords,x.answer,x.body].flat().join(' ')),answer:x.answer || x.body || '',actions:Array.isArray(x.actions) ? x.actions : []});
    return out;
  }

  function answer(q) {
    const text=clean(q); if(!text)return {text:'Ask me something! 💛'};
    if(/\b(tour|show me|guide me)\b/.test(text))return {text:'Absolutely! I can show you around. ✈️',actions:[{label:'Start the tour',tour:true,primary:true}]};
    if(/\b(hi|hello|hey|yo)\b/.test(text))return {text:'Hey! 👋 I’m Basi. Ask me about candidates, grades, positions, events, pages, or announcements.',actions:[{label:'Show me around',tour:true,primary:true},{label:'Who is running?',path:'/vote'}]};
    if(/who are you|what are you|your name/.test(text))return {text:'I’m Basi — your tiny Student Council guide. 💛'};
    let best=null,score=0; for(const x of knowledge()){let n=x.text.includes(text)?8:0;for(const w of text.split(' '))if(w&&x.text.includes(w))n+=w.length>4?2:1;if(n>score){score=n;best=x}} return best || {text:'I don’t know that one yet. You can teach me in bot-config.js.',actions:[{label:'Meet candidates',path:'/vote'},{label:'Show me around',tour:true}]};
  }

  function go(path){const a=document.querySelector(`[data-route="${CSS.escape(path)}"]`);if(a)return a.click();history.pushState({},'',path);window.dispatchEvent(new PopStateEvent('popstate'));}

  function waitFor(selector,ms=5000){return new Promise(resolve=>{const now=document.querySelector(selector);if(now)return resolve(now);let done=false;const finish=x=>{if(done)return;done=true;observer.disconnect();clearTimeout(timer);resolve(x)};const observer=new MutationObserver(()=>{const x=document.querySelector(selector);if(x)finish(x)});const timer=setTimeout(()=>finish(document.querySelector(selector)),ms);observer.observe(document.body,{childList:true,subtree:true})})}

  // IMPORTANT: this is intentionally synchronous. The previous version made this async,
  // then treated the Promise as an array, causing "step.route" to crash.
  function getTourSteps(){
    const defaults=[
      {selector:'.brand',title:'Welcome to Bayside Academy',text:'This is your Student Council home base. Let me show you around.'},
      {selector:'#mainNav',title:'Navigation',text:'Use these links to move around the site.'},
      {selector:'#searchButton',title:'Search everything',text:'Search pages, candidates, events, and information.'},
      {selector:'.hero-card',title:'Election dashboard',text:'Here is the current election overview.'},
      {selector:'.candidate-grid',title:'Candidates',text:'You can ask me about candidates by name, grade, or position.'},
      {route:'/events',selector:'.event-list',title:'Events',text:'Here is the full events area.'},
      {route:'/vote',selector:'.candidate-grid',title:'All candidates',text:'This is where the complete candidate list lives.'},
      {route:'/terms',selector:'.document-page',title:'Terms & Conditions',text:'Your election rules and terms live here.'},
      {route:'/',selector:'#liveBanner',title:'Live announcements',text:'Announcements can change without refreshing the page.'},
      {selector:'.site-footer',title:'All pages',text:'The footer gives you the site-wide page links.'},
      {selector:'.basi-button',title:'That’s me!',text:'Ask me anything about the Student Council site.'}
    ];
    const configured=Array.isArray(bot.tour)&&bot.tour.length?bot.tour:defaults;
    return configured.filter(x=>x&&typeof x==='object'&&typeof x.selector==='string'&&x.selector.trim());
  }

  function tour(){
    if(document.querySelector('.basi-tour-card'))return;
    const steps=getTourSteps();if(!steps.length)return;
    const ring=document.createElement('div'),card=document.createElement('div'),flight=document.createElement('div');ring.className='basi-tour-ring';card.className='basi-tour-card';flight.className='basi-flight';flight.innerHTML='<span class="basi-avatar-3d"></span>';document.body.append(ring,card,flight);
    let i=0,active=true,token=0;
    const stop=()=>{active=false;token++;ring.remove();card.remove();flight.remove();try{localStorage.setItem('basi-tour-seen','1')}catch{}};
    async function draw(){
      const t=++token;if(!active)return;if(i>=steps.length)return stop();
      const step=steps[i];if(!step||!step.selector){i++;return draw()}
      if(step.route){const want=new URL(step.route,location.origin).pathname.replace(/\/+$/,'')||'/';const have=location.pathname.replace(/\/+$/,'')||'/';if(want!==have)go(step.route)}
      const target=await waitFor(step.selector);if(!active||t!==token)return;if(!target){i++;return draw()}
      target.scrollIntoView({behavior:'smooth',block:'center'});await new Promise(r=>setTimeout(r,450));if(!active||t!==token)return;
      const r=target.getBoundingClientRect(),p=8;ring.style.left=`${Math.max(8,r.left-p)}px`;ring.style.top=`${Math.max(8,r.top-p)}px`;ring.style.width=`${Math.max(20,r.width+p*2)}px`;ring.style.height=`${Math.max(20,r.height+p*2)}px`;
      flight.style.left=`${innerWidth/2-22}px`;flight.style.top=`${innerHeight+30}px`;flight.style.opacity='1';flight.style.transform='translate(0,0)';flight.getBoundingClientRect();flight.style.transform=`translate(${r.left+r.width/2-innerWidth/2}px,${r.top+r.height/2-innerHeight}px)`;setTimeout(()=>{if(active&&t===token)flight.style.opacity='0'},400);
      const w=Math.min(350,innerWidth-28),left=Math.max(14,Math.min(r.left,innerWidth-w-14)),top=r.bottom+175<innerHeight?r.bottom+18:Math.max(14,r.top-180);card.style.width=`${w}px`;card.style.left=`${left}px`;card.style.top=`${top}px`;card.innerHTML=`<strong>${esc(step.title||'Here')}</strong><p>${esc(step.text||'')}</p><div class="basi-tour-actions"><button type="button" data-skip>Skip</button><button type="button" class="next" data-next>${i===steps.length-1?'Finish':'Next'}</button></div>`;card.querySelector('[data-skip]').onclick=stop;card.querySelector('[data-next]').onclick=()=>{i++;draw()};
    }
    draw().catch(stop);
  }

  function build(){
    const wrap=document.createElement('div');wrap.className='basi-wrap';wrap.innerHTML='<div class="basi-panel" hidden><div class="basi-head"><span class="basi-head-avatar"><span class="basi-avatar-3d"></span></span><div><strong>Basi</strong><small>Your little council guide</small></div><button class="basi-close">×</button></div><div class="basi-messages"></div><form class="basi-input"><input placeholder="Ask me something…"><button>Send</button></form></div><button class="basi-button" aria-label="Open Basi"><span class="basi-avatar-3d"></span></button>';document.body.appendChild(wrap);
    const panel=wrap.querySelector('.basi-panel'),msgs=wrap.querySelector('.basi-messages'),input=wrap.querySelector('input');
    function say(text,user=false,actions=[]){const el=document.createElement('div');el.className='basi-message'+(user?' user':'');el.textContent=text;if(actions.length){const box=document.createElement('div');box.className='basi-buttons';actions.forEach(a=>{const b=document.createElement('button');b.className='basi-choice'+(a.primary?' primary':'');b.type='button';b.textContent=a.label||'Open';b.onclick=()=>a.tour?(panel.hidden=true,tour()):a.path?(panel.hidden=true,go(a.path)):a.url&&window.open(a.url,'_blank','noopener,noreferrer');box.appendChild(b)});el.appendChild(box)}msgs.appendChild(el);msgs.scrollTop=msgs.scrollHeight}
    wrap.querySelector('.basi-button').onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden&&!msgs.children.length)say('Hi! I’m Basi. 💛 Ask me about candidates, grades, positions, events, pages, or announcements.',false,bot.suggestions||[{label:'Show me around',tour:true,primary:true},{label:'Who is running?',path:'/vote'}])};
    wrap.querySelector('.basi-close').onclick=()=>panel.hidden=true;wrap.querySelector('form').onsubmit=e=>{e.preventDefault();const q=input.value.trim();if(!q)return;say(q,true);input.value='';const a=answer(q);setTimeout(()=>say(a.text,false,a.actions||[]),180)};
  }

  styles();build();window.BASI_BOT={tour,refresh:()=>{banner=cfg.banner&&cfg.banner.enabled!==false?cfg.banner:null}};
  window.addEventListener('load',()=>{try{if(!localStorage.getItem('basi-tour-seen'))setTimeout(tour,1100)}catch{}},{once:true});
})();
