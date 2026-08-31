(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const bot = cfg.bot || {};
  const pages = cfg.pages || {};
  const candidates = Array.isArray(cfg.election?.candidates) ? cfg.election.candidates : [];
  const events = Array.isArray(cfg.events) ? cfg.events : [];
  let expanded = false;
  let tourRunning = false;

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const clean = value => String(value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const style = document.createElement('style');
  style.textContent = `
    .basi-wrap{position:fixed;right:22px;bottom:22px;z-index:115;font-family:'DM Sans',system-ui,sans-serif}.basi-button{width:60px;height:60px;border:1px solid var(--line);border-radius:21px;background:var(--yellow);color:#19180f;box-shadow:0 18px 50px rgba(0,0,0,.28);cursor:pointer;display:grid;place-items:center;transition:transform .2s ease,box-shadow .2s ease}.basi-button:hover{transform:translateY(-4px) rotate(-3deg);box-shadow:0 25px 65px rgba(0,0,0,.35)}
    .basi-face{width:32px;height:26px;border-radius:11px;background:currentColor;position:relative}.basi-face:before{content:'•  •';position:absolute;left:6px;top:2px;font-size:10px;letter-spacing:4px;color:var(--yellow)}.basi-face:after{content:'';position:absolute;left:12px;top:17px;width:8px;height:3px;border-bottom:2px solid var(--yellow);border-radius:50%}
    .basi-panel{position:absolute;right:0;bottom:72px;width:min(410px,calc(100vw - 28px));height:540px;max-height:calc(100vh - 105px);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:28px;background:var(--paper);box-shadow:0 30px 100px rgba(0,0,0,.4);animation:basiIn .22s ease}.basi-panel.expanded{width:min(800px,calc(100vw - 28px));height:min(780px,calc(100vh - 105px))}.basi-panel[hidden]{display:none}@keyframes basiIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
    .basi-head{display:flex;align-items:center;gap:11px;padding:15px 17px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,rgba(244,214,94,.11),transparent);flex-shrink:0}.basi-head-face{width:40px;height:40px;border-radius:14px;background:var(--yellow-soft);display:grid;place-items:center}.basi-head-face .basi-face{transform:scale(.72)}.basi-head strong{display:block;font-family:'Space Grotesk';font-size:14px}.basi-head small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.basi-head button{width:32px;height:32px;border:0;border-radius:9px;background:transparent;color:var(--muted);cursor:pointer;font-size:18px}.basi-head button:hover{background:var(--surface);color:var(--ink)}.basi-expand{margin-left:auto}
    .basi-messages{flex:1;min-height:0;overflow:auto;padding:16px;display:grid;align-content:start;gap:12px}.basi-message{max-width:94%;padding:11px 13px;border-radius:17px;background:var(--surface);font-size:12px;line-height:1.52}.basi-message.user{justify-self:end;background:var(--yellow-soft)}.basi-label{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:var(--faint);margin-bottom:5px;font-weight:800}.basi-buttons{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.basi-choice{border:1px solid var(--line);border-radius:999px;padding:7px 11px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:800;cursor:pointer}.basi-choice.primary{background:var(--yellow);color:#19180f;border-color:var(--yellow)}
    .basi-input{display:flex;gap:8px;padding:11px;border-top:1px solid var(--line);flex-shrink:0}.basi-input input{min-width:0;flex:1;border:1px solid var(--line);border-radius:14px;background:var(--surface);color:var(--ink);padding:11px 12px;outline:0}.basi-input input:focus{border-color:rgba(244,214,94,.4);box-shadow:0 0 0 3px rgba(244,214,94,.1)}.basi-input button{border:0;border-radius:14px;background:var(--yellow);color:#19180f;font-weight:800;padding:0 15px;cursor:pointer}
    .basi-card{margin-top:10px;border:1px solid var(--line);border-radius:19px;background:linear-gradient(145deg,var(--surface-strong),var(--surface));overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,.12)}.basi-card-head{padding:14px 15px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:11px}.basi-card-avatar{width:44px;height:44px;border-radius:13px;background:var(--yellow-soft);display:grid;place-items:center;color:var(--yellow);font-size:11px;font-weight:800;flex:0 0 44px}.basi-card-title{min-width:0}.basi-card-title strong{display:block;font-family:'Space Grotesk';font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.basi-card-title span{display:block;color:var(--yellow);font-size:9px;text-transform:uppercase;letter-spacing:.1em;font-weight:800;margin-top:2px}.basi-card-body{padding:13px 15px}.basi-card-body p{margin:0;color:var(--muted);font-size:11px;line-height:1.55}.basi-card-meta{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:11px}.basi-meta{padding:8px 9px;border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.025)}.basi-meta small{display:block;color:var(--faint);font-size:8px;text-transform:uppercase;letter-spacing:.09em}.basi-meta strong{display:block;margin-top:2px;font-size:10px}.basi-card-actions{display:flex;flex-wrap:wrap;gap:7px;padding:0 15px 14px}
    .basi-tour-backdrop{position:fixed;inset:0;z-index:118;background:rgba(2,3,5,.42)}.basi-tour-ring{position:fixed;z-index:119;pointer-events:none;border:2px solid var(--yellow);border-radius:22px;box-shadow:0 0 0 9999px rgba(2,3,5,.42),0 0 55px rgba(244,214,94,.38);transition:left .45s ease,top .45s ease,width .45s ease,height .45s ease}.basi-tour-card{position:fixed;z-index:120;width:min(340px,calc(100vw - 28px));padding:17px;border:1px solid var(--line);border-radius:20px;background:var(--paper);box-shadow:0 25px 70px rgba(0,0,0,.4)}.basi-tour-avatar{float:left;width:34px;height:34px;margin-right:10px;border-radius:12px;background:var(--yellow-soft);display:grid;place-items:center}.basi-tour-avatar .basi-face{transform:scale(.7)}.basi-tour-card strong{display:block;font-family:'Space Grotesk';font-size:14px;padding-top:5px}.basi-tour-card p{clear:both;margin:12px 0;color:var(--muted);font-size:11px;line-height:1.55}.basi-tour-actions{display:flex;justify-content:flex-end;gap:7px}.basi-tour-actions button{border:1px solid var(--line);border-radius:11px;padding:8px 11px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:800;cursor:pointer}.basi-tour-actions .next{background:var(--yellow);color:#19180f;border-color:var(--yellow)}
    @media(max-width:600px){.basi-wrap{right:14px;bottom:14px}.basi-panel,.basi-panel.expanded{position:fixed;right:14px;bottom:14px;width:calc(100vw - 28px);height:calc(100vh - 88px);max-height:none}.basi-card-meta{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);

  function navigate(path){
    const wanted = String(path || '/').replace(/\/+$/, '') || '/';
    const link = [...document.querySelectorAll('[data-route]')].find(el => ((String(el.getAttribute('data-route')).replace(/\/+$/, '') || '/')) === wanted);
    if (link) { link.click(); return; }
    history.pushState({}, '', wanted);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function avatar(name){
    return String(name || '').split(/\s+/).map(part => part[0] || '').join('').slice(0,2).toUpperCase();
  }

  function actionButtons(actions){
    if (!Array.isArray(actions) || !actions.length) return '';
    return `<div class="basi-card-actions basi-buttons">${actions.map((a,i) => `<button type="button" class="basi-choice ${a.primary ? 'primary' : ''}" data-action="${i}">${esc(a.label || 'Open')}</button>`).join('')}</div>`;
  }

  function findCandidate(query){
    const q=clean(query);
    return candidates.find(c => clean([c.name,c.role,c.grade].join(' ')).includes(q) || q.split(' ').every(word => clean([c.name,c.role,c.grade,c.statement].join(' ')).includes(word))) || null;
  }

  function findEvent(query){
    const q=clean(query);
    return events.find(e => q.split(' ').filter(Boolean).some(word => clean([e.title,e.tag,e.date,e.time,e.place].join(' ')).includes(word))) || null;
  }

  function findPage(query){
    const q=clean(query);
    let best=null,score=0;
    for(const r of cfg.routes || []){
      const p=r.page==='content'?pages[r.content]:pages[r.page];
      const text=clean([r.label,r.path,p?.title,p?.eyebrow].join(' '));
      let s=text.includes(q)?12:0;
      q.split(' ').filter(Boolean).forEach(word=>{if(text.includes(word))s+=word.length>3?2:1});
      if(s>score){score=s;best={route:r,page:p}}
    }
    return score>=2?best:null;
  }

  function customKnowledge(query){
    const q=clean(query);
    const list=Array.isArray(bot.knowledge) ? bot.knowledge : [];
    let best=null,score=0;
    for(const item of list){
      if(!item || typeof item!=='object') continue;
      const text=clean([item.title,item.topic,item.keywords].flat().join(' '));
      let s=text.includes(q)?15:0;
      q.split(' ').filter(Boolean).forEach(word=>{if(text.includes(word))s+=word.length>3?2:1});
      if(s>score){score=s;best=item}
    }
    return score>=2?best:null;
  }

  function response(query){
    const q=clean(query);
    if(/^(hi|hello|hey|yo)$/.test(q)) return {text:'Hi! I’m Basi. What should we look at?',actions:[{label:'Meet candidates',run:()=>showCandidateList()},{label:'See events',run:()=>showEventList()},{label:'Show me around',run:runTour}]};
    if(/who are you|your name/.test(q)) return {text:'I’m Basi, the little guide built into this site.'};
    if(/tour|show me around|guide me/.test(q)) return {text:'Sure. I’ll walk you through the actual pages.',actions:[{label:'Start the tour',run:runTour,primary:true}]};
    if(/apply|application|where.*apply|how.*apply|sign up|run for/.test(q)) return {text:'Here’s the application.',card:{type:'form',kind:'apply'},actions:[{label:'Open application',embed:'apply',primary:true},{label:'Go to Apply',path:'/apply'}]};
    if(/vote|voting|ballot/.test(q)) return {text:'Here’s the voting area.',card:{type:'form',kind:'vote'},actions:[{label:'Open ballot',embed:'vote',primary:true},{label:'Go to Vote',path:'/vote'}]};
    const candidate=findCandidate(q);
    if(candidate) return {text:`Here’s ${candidate.name}.`,card:{type:'candidate',data:candidate},actions:[{label:'View all candidates',path:'/vote',primary:true}]};
    const event=findEvent(q);
    if(event) return {text:`Here’s the event information.`,card:{type:'event',data:event},actions:[{label:'Open Events',path:'/events',primary:true}]};
    const page=findPage(q);
    if(page) return {text:`Here’s the ${page.route.label} page.`,card:{type:'page',route:page.route,page:page.page},actions:[{label:`Open ${page.route.label}`,path:page.route.path,primary:true}]};
    const custom=customKnowledge(q);
    if(custom) return {text:custom.answer || custom.body || 'Here is what I found.',actions:Array.isArray(custom.actions)?custom.actions:[]};
    return {text:'I don’t have a specific answer for that yet. Try a candidate name, grade, position, event, or page.'};
  }

  function cardMarkup(card){
    if(!card) return '';
    if(card.type==='candidate'){
      const c=card.data;
      return `<article class="basi-card"><div class="basi-card-head"><div class="basi-card-avatar">${esc(avatar(c.name))}</div><div class="basi-card-title"><strong>${esc(c.name)}</strong><span>${esc(c.role || 'Candidate')}</span></div></div><div class="basi-card-body"><p>${esc(c.statement || 'No candidate statement has been added.')}</p><div class="basi-card-meta"><div class="basi-meta"><small>Grade</small><strong>${esc(c.grade || '—')}</strong></div><div class="basi-meta"><small>Position</small><strong>${esc(c.role || '—')}</strong></div></div></div>${actionButtons([{label:'View candidates',path:'/vote',primary:true}])}</article>`;
    }
    if(card.type==='event'){
      const e=card.data;
      return `<article class="basi-card"><div class="basi-card-head"><div class="basi-card-avatar">${esc((String(e.date||'').match(/[A-Z]+/)||['EV'])[0].slice(0,2))}</div><div class="basi-card-title"><strong>${esc(e.title)}</strong><span>${esc(e.tag || 'Event')}</span></div></div><div class="basi-card-body"><div class="basi-card-meta"><div class="basi-meta"><small>Date</small><strong>${esc(e.date || '—')}</strong></div><div class="basi-meta"><small>Time</small><strong>${esc(e.time || '—')}</strong></div><div class="basi-meta"><small>Place</small><strong>${esc(e.place || '—')}</strong></div></div></div>${actionButtons([{label:'Open Events',path:'/events',primary:true}])}</article>`;
    }
    if(card.type==='page'){
      const p=card.page || {};
      return `<article class="basi-card"><div class="basi-card-head"><div class="basi-card-avatar">↗</div><div class="basi-card-title"><strong>${esc(card.route.label)}</strong><span>${esc(p?.eyebrow || 'Site page')}</span></div></div><div class="basi-card-body"><p>${esc(p?.body || p?.title || 'More information is available on this page.')}</p></div>${actionButtons([{label:`Open ${card.route.label}`,path:card.route.path,primary:true}])}</article>`;
    }
    if(card.type==='form'){
      const f=cfg.googleForms?.[card.kind];
      const name=card.kind==='apply'?'Student Council Application':'Student Council Ballot';
      return `<article class="basi-card"><div class="basi-card-head"><div class="basi-card-avatar">↗</div><div class="basi-card-title"><strong>${name}</strong><span>Official form</span></div></div><div class="basi-card-body"><p>${f?.embedUrl&&!String(f.embedUrl).includes('YOUR_')?'The official form is ready to open here.':'The form is not connected yet. Please contact the owner.'}</p></div>${actionButtons([{label:card.kind==='apply'?'Open application':'Open ballot',embed:card.kind,primary:true},{label:card.kind==='apply'?'Go to Apply':'Go to Vote',path:card.kind==='apply'?'/apply':'/vote'}])}</article>`;
    }
    return '';
  }

  function showCandidateList(){
    const sample=candidates.slice(0,3);
    emit('Here are the first candidates. Open the Vote page for everyone.',false,null);
    sample.forEach(c=>emit(`Candidate: ${c.name}`,false,{type:'candidate',data:c}));
  }
  function showEventList(){
    const sample=events.slice(0,3);
    emit('Here are the upcoming events.',false,null);
    sample.forEach(e=>emit(`Event: ${e.title}`,false,{type:'event',data:e}));
  }

  let emitToMessages=null;
  function emit(text,user,card,actions=[]){if(emitToMessages)emitToMessages(text,user,card,actions)}

  function build(){
    const wrap=document.createElement('div');wrap.className='basi-wrap';
    wrap.innerHTML=`<div class="basi-panel" hidden><div class="basi-head"><span class="basi-head-face"><span class="basi-face"></span></span><div><strong>Basi</strong><small>Your little council guide</small></div><button class="basi-expand" type="button" aria-label="Expand chat">⤢</button><button class="basi-close" type="button" aria-label="Close Basi">×</button></div><div class="basi-messages"></div><form class="basi-input"><input placeholder="Ask me something…" autocomplete="off" aria-label="Ask Basi"><button type="submit">Send</button></form></div><button class="basi-button" type="button" aria-label="Open Basi"><span class="basi-face"></span></button>`;
    document.body.appendChild(wrap);
    const panel=wrap.querySelector('.basi-panel'),messages=wrap.querySelector('.basi-messages'),input=wrap.querySelector('input');

    emitToMessages=(text,user=false,card=null,actions=[])=>{
      const el=document.createElement('div');el.className=`basi-message${user?' user':''}`;
      const label=user?'You':'Basi';el.innerHTML=`<div class="basi-label">${label}</div><div>${esc(text)}</div>${card?cardMarkup(card):''}`;
      const cardActions=card?.type ? (card.type==='candidate'?[{label:'View candidates',path:'/vote',primary:true}]:card.type==='event'?[{label:'Open Events',path:'/events',primary:true}]:card.type==='page'?[{label:`Open ${card.route.label}`,path:card.route.path,primary:true}]:card.type==='form'?[{label:card.kind==='apply'?'Open application':'Open ballot',embed:card.kind,primary:true},{label:card.kind==='apply'?'Go to Apply':'Go to Vote',path:card.kind==='apply'?'/apply':'/vote'}]:[]) : [];
      const allActions=[...actions,...cardActions];
      if(allActions.length){const box=document.createElement('div');box.className='basi-buttons';allActions.forEach(a=>{const b=document.createElement('button');b.type='button';b.className=`basi-choice${a.primary?' primary':''}`;b.textContent=a.label||'Open';b.onclick=()=>{if(a.run)a.run();else if(a.tour)runTour();else if(a.embed)window.BASI_EMBEDS?.open?.(a.embed);else if(a.path){panel.hidden=true;navigate(a.path)}else if(a.question){const r=response(a.question);setTimeout(()=>emitToMessages(r.text,false,r.card,r.actions||[]),100)}};box.appendChild(b)});el.appendChild(box)}
      messages.appendChild(el);messages.scrollTop=messages.scrollHeight;
    };

    wrap.querySelector('.basi-button').onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden&&!messages.children.length)emit('Hi! I’m Basi. Ask me about candidates, grades, positions, events, pages, or applying.',false,null,[{label:'Show me around',run:runTour,primary:true},{label:'How do I apply?',question:'how do I apply?'}])};
    wrap.querySelector('.basi-close').onclick=()=>{panel.hidden=true};
    wrap.querySelector('.basi-expand').onclick=()=>setExpanded(!expanded);
    wrap.querySelector('form').onsubmit=e=>{e.preventDefault();const q=input.value.trim();if(!q)return;emit(q,true);input.value='';const r=response(q);setTimeout(()=>emit(r.text,false,r.card,r.actions||[]),140)};
  }

  function setExpanded(value){expanded=Boolean(value);document.querySelector('.basi-panel')?.classList.toggle('expanded',expanded)}

  async function waitFor(selector,timeout=5500){const start=Date.now();while(Date.now()-start<timeout){const el=document.querySelector(selector);if(el)return el;await new Promise(resolve=>setTimeout(resolve,70))}return null}

  async function runTour(){
    if(tourRunning)return;
    const fallback=[
      {route:'/',selector:'.brand',title:'Welcome',text:'This is the Student Council home base.'},
      {route:'/',selector:'#mainNav',title:'Navigation',text:'These links take you around the site.'},
      {route:'/',selector:'#searchButton',title:'Search',text:'Search the entire site from here.'},
      {route:'/',selector:'.hero-card',title:'Election dashboard',text:'A quick look at the current election.'},
      {route:'/vote',selector:'.candidate-grid',title:'Candidates',text:'Here you can see all the candidates.'},
      {route:'/events',selector:'.event-list',title:'Events',text:'Here you can see the complete event schedule.'},
      {route:'/terms',selector:'.document-page',title:'Terms & Conditions',text:'The site rules and election guidelines live here.'},
      {route:'/',selector:'#liveBanner',title:'Announcements',text:'Live announcements can update without a refresh.'},
      {route:'/',selector:'.site-footer',title:'Every page',text:'All site links are collected here.'},
      {route:'/',selector:'.basi-button',title:'Basi',text:'And I’m always here to help.'}
    ];
    const steps=(Array.isArray(bot.tour)&&bot.tour.length?bot.tour:fallback).filter(s=>s&&typeof s.selector==='string');
    tourRunning=true;
    const backdrop=document.createElement('div');backdrop.className='basi-tour-backdrop';
    const ring=document.createElement('div');ring.className='basi-tour-ring';
    const card=document.createElement('div');card.className='basi-tour-card';
    document.body.append(backdrop,ring,card);
    let index=0;
    const cleanup=()=>{tourRunning=false;backdrop.remove();ring.remove();card.remove()};
    try{
      while(index<steps.length){
        const step=steps[index];
        if(step.route)navigate(step.route);
        const target=await waitFor(step.selector);
        if(!target){index++;continue}
        target.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
        await new Promise(resolve=>setTimeout(resolve,450));
        const r=target.getBoundingClientRect(),pad=8;
        ring.style.left=`${Math.max(8,r.left-pad)}px`;ring.style.top=`${Math.max(8,r.top-pad)}px`;ring.style.width=`${Math.max(20,r.width+pad*2)}px`;ring.style.height=`${Math.max(20,r.height+pad*2)}px`;
        const width=Math.min(340,innerWidth-28),left=Math.max(14,Math.min(r.left,innerWidth-width-14)),top=r.bottom+20<innerHeight-175?r.bottom+20:Math.max(14,r.top-180);
        card.style.width=`${width}px`;card.style.left=`${left}px`;card.style.top=`${top}px`;
        card.innerHTML=`<span class="basi-tour-avatar"><span class="basi-face"></span></span><strong>${esc(step.title||'Here')}</strong><p>${esc(step.text||'')}</p><div class="basi-tour-actions"><button type="button" data-skip>Skip</button><button type="button" class="next" data-next>${index===steps.length-1?'Finish':'Next'}</button></div>`;
        await new Promise(resolve=>{card.querySelector('[data-skip]').onclick=()=>{cleanup();resolve()};card.querySelector('[data-next]').onclick=()=>{index++;resolve()}});
      }
    }catch{}
    cleanup();
  }

  build();
  window.BASI_BOT={tour:runTour,expand:()=>setExpanded(true)};
})();
