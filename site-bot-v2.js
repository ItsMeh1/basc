(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const pages = cfg.pages || {};
  const bot = cfg.bot || {};
  const candidates = Array.isArray(cfg.election?.candidates) ? cfg.election.candidates : [];
  const events = Array.isArray(cfg.events) ? cfg.events : [];
  let currentBanner = cfg.banner?.enabled !== false ? cfg.banner : null;
  let tourRunning = false;

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const clean = value => String(value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const style = document.createElement('style');
  style.textContent = `
    .basi-wrap{position:fixed;right:22px;bottom:22px;z-index:115;font-family:'DM Sans',system-ui,sans-serif}.basi-button{width:58px;height:58px;border:1px solid var(--line);border-radius:20px;background:var(--yellow);color:#19180f;box-shadow:0 18px 50px rgba(0,0,0,.28);cursor:pointer;display:grid;place-items:center;transition:transform .2s ease}.basi-button:hover{transform:translateY(-4px) rotate(-3deg)}
    .basi-face{width:31px;height:25px;border-radius:11px;background:currentColor;position:relative}.basi-face:before{content:'•  •';position:absolute;left:6px;top:2px;font-size:10px;letter-spacing:4px;color:var(--yellow)}
    .basi-panel{position:absolute;right:0;bottom:70px;width:min(360px,calc(100vw - 32px));overflow:hidden;border:1px solid var(--line);border-radius:24px;background:var(--paper);box-shadow:0 30px 90px rgba(0,0,0,.38);animation:basiIn .22s ease}.basi-panel[hidden]{display:none}@keyframes basiIn{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
    .basi-head{display:flex;align-items:center;gap:11px;padding:16px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,rgba(244,214,94,.1),transparent)}.basi-head-face{width:39px;height:39px;border-radius:14px;background:var(--yellow-soft);display:grid;place-items:center}.basi-head-face .basi-face{transform:scale(.72)}.basi-head strong{font-family:'Space Grotesk';font-size:13px}.basi-head small{display:block;color:var(--muted);font-size:10px}.basi-close{margin-left:auto;border:0;background:transparent;color:var(--muted);font-size:20px;cursor:pointer}
    .basi-messages{max-height:330px;overflow:auto;padding:14px;display:grid;gap:9px}.basi-message{max-width:90%;padding:10px 12px;border-radius:15px;background:var(--surface);font-size:12px}.basi-message.user{justify-self:end;background:var(--yellow-soft)}.basi-buttons{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}.basi-choice{border:1px solid var(--line);border-radius:999px;padding:7px 10px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:800;cursor:pointer}.basi-choice.primary{background:var(--yellow);color:#19180f;border-color:var(--yellow)}
    .basi-input{display:flex;gap:8px;padding:11px;border-top:1px solid var(--line)}.basi-input input{min-width:0;flex:1;border:1px solid var(--line);border-radius:13px;background:var(--surface);color:var(--ink);padding:10px 12px;outline:0}.basi-input button{border:0;border-radius:13px;background:var(--yellow);color:#19180f;font-weight:800;padding:0 13px;cursor:pointer}
    .basi-tour-backdrop{position:fixed;inset:0;z-index:118;background:rgba(2,3,5,.42);pointer-events:none}.basi-tour-ring{position:fixed;z-index:119;pointer-events:none;border:2px solid var(--yellow);border-radius:22px;box-shadow:0 0 0 9999px rgba(2,3,5,.42),0 0 55px rgba(244,214,94,.4);transition:left .45s ease,top .45s ease,width .45s ease,height .45s ease}.basi-tour-card{position:fixed;z-index:120;width:min(340px,calc(100vw - 28px));padding:17px;border:1px solid var(--line);border-radius:20px;background:var(--paper);box-shadow:0 25px 70px rgba(0,0,0,.4);animation:basiIn .25s ease}.basi-tour-avatar{float:left;width:34px;height:34px;margin-right:10px;border-radius:12px;background:var(--yellow-soft);display:grid;place-items:center}.basi-tour-avatar .basi-face{transform:scale(.7)}.basi-tour-card strong{display:block;font-family:'Space Grotesk';font-size:14px;padding-top:5px}.basi-tour-card p{clear:both;margin:12px 0;color:var(--muted);font-size:11px;line-height:1.55}.basi-tour-progress{display:flex;gap:4px;margin-bottom:12px}.basi-tour-progress i{width:17px;height:3px;border-radius:99px;background:var(--line)}.basi-tour-progress i.on{background:var(--yellow)}.basi-tour-actions{display:flex;justify-content:flex-end;gap:7px}.basi-tour-actions button{border:1px solid var(--line);border-radius:11px;padding:8px 11px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:800;cursor:pointer}.basi-tour-actions .next{background:var(--yellow);color:#19180f;border-color:var(--yellow)}.basi-flight{position:fixed;z-index:121;pointer-events:none;opacity:0;transition:transform .55s cubic-bezier(.2,.8,.2,1),opacity .25s ease}.basi-flight .basi-face{width:38px;height:31px;animation:basiBob .6s ease-in-out infinite alternate}@keyframes basiBob{to{transform:translateY(-5px)}}@media(max-width:600px){.basi-wrap{right:14px;bottom:14px}}
  `;
  document.head.appendChild(style);

  function getKnowledge() {
    const items = [];
    for (const route of cfg.routes || []) {
      const page = route.page === 'content' ? pages[route.content] : pages[route.page];
      let text = [route.label, route.path, page?.eyebrow, page?.title, page?.body].filter(Boolean).join(' ');
      (page?.sections || []).forEach(section => { text += ` ${section.title || ''} ${section.body || ''} ${(section.items || []).join(' ')}`; });
      items.push({ text:clean(text), answer:page?.body || `The ${route.label} page has more information.`, actions:[{label:`Go to ${route.label}`,path:route.path,primary:true}] });
    }
    candidates.forEach(c => items.push({text:clean([c.name,c.role,c.grade,c.statement].join(' ')),answer:`${c.name} is running for ${c.role || 'Student Council'}${c.grade ? ` and is in ${c.grade}.` : '.'}${c.statement ? ` Their message: “${c.statement}”` : ''}`,actions:[{label:'See candidates',path:'/vote',primary:true}]}));
    events.forEach(e => items.push({text:clean([e.title,e.tag,e.date,e.time,e.place].join(' ')),answer:`${e.title} is ${e.date || 'scheduled'}${e.time ? ` at ${e.time}` : ''}${e.place ? ` in ${e.place}` : ''}.`,actions:[{label:'Open Events',path:'/events',primary:true}]}));
    if(currentBanner) items.push({text:clean(JSON.stringify(currentBanner)),answer:`The current announcement is “${currentBanner.title || ''}”${currentBanner.message ? ` — ${currentBanner.message}` : ''}`,actions:[]});
    (Array.isArray(bot.knowledge) ? bot.knowledge : []).forEach(item => items.push({text:clean([item.title,item.keywords,item.answer,item.body].flat().join(' ')),answer:item.answer || item.body || '',actions:Array.isArray(item.actions) ? item.actions : []}));
    return items;
  }

  function answer(question) {
    const q=clean(question);
    if(!q)return {text:'Ask me something! 💛'};
    if(/\b(tour|show me|guide me)\b/.test(q))return {text:'Absolutely! I can show you around. ✈️',actions:[{label:'Start the tour',tour:true,primary:true}]};
    if(/\b(hi|hello|hey|yo)\b/.test(q))return {text:'Hey! 👋 I’m Basi. Ask me about candidates, grades, positions, events, pages, or announcements.',actions:[{label:'Show me around',tour:true,primary:true},{label:'Who is running?',path:'/vote'}]};
    if(/who are you|what are you|your name/.test(q))return {text:'I’m Basi — your tiny Student Council guide. 💛'};
    if(/thank|thanks/.test(q))return {text:'Anytime! 💛'};
    let best=null,bestScore=0;
    for(const item of getKnowledge()){
      let score=item.text.includes(q)?8:0;
      q.split(' ').forEach(word=>{if(word&&item.text.includes(word))score+=word.length>4?2:1});
      if(score>bestScore){bestScore=score;best=item}
    }
    return best||{text:'I don’t know that yet. You can teach me in bot-config.js!',actions:[{label:'Meet candidates',path:'/vote'},{label:'Show me around',tour:true}]};
  }

  function go(path){
    const link=document.querySelector(`[data-route="${CSS.escape(path)}"]`);
    if(link){link.click();return;}
    history.pushState({},'',path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function waitFor(selector, callback, tries=0){
    if(tourRunning===false)return;
    const target=document.querySelector(selector);
    if(target){callback(target);return;}
    if(tries>=100){callback(null);return;}
    window.setTimeout(()=>waitFor(selector,callback,tries+1),60);
  }

  function getSteps(){
    const fallback=[
      {selector:'.brand',title:'Welcome to Bayside Academy',text:'This is your Student Council home base.'},
      {selector:'#mainNav',title:'Navigation',text:'These links take you around the site.'},
      {selector:'#searchButton',title:'Search everything',text:'Search pages, candidates, events, and more.'},
      {selector:'.hero-card',title:'Election dashboard',text:'Your quick look at the current election.'},
      {selector:'.candidate-grid',title:'Candidates',text:'Ask me about candidates by name, grade, or position.'},
      {route:'/events',selector:'.event-list',title:'Events',text:'Here is the complete Events page.'},
      {route:'/vote',selector:'.candidate-grid',title:'All candidates',text:'This page contains the full candidate list.'},
      {route:'/terms',selector:'.document-page',title:'Terms & Conditions',text:'Your site rules and election guidelines live here.'},
      {route:'/',selector:'#liveBanner',title:'Live announcements',text:'These announcements can update without a refresh.'},
      {selector:'.site-footer',title:'Every page',text:'All site links are collected here.'},
      {selector:'.basi-button',title:'That’s me!',text:'I can answer questions and guide you around the site.'}
    ];
    const custom=Array.isArray(bot.tour)?bot.tour.filter(step=>step&&typeof step==='object'&&typeof step.selector==='string'&&step.selector.trim()):[];
    return custom.length?custom:fallback;
  }

  function runTour(){
    if(tourRunning)return;
    const steps=getSteps();
    if(!steps.length)return;
    tourRunning=true;
    const backdrop=document.createElement('div');
    const ring=document.createElement('div');
    const card=document.createElement('div');
    const flight=document.createElement('div');
    backdrop.className='basi-tour-backdrop';
    ring.className='basi-tour-ring';
    card.className='basi-tour-card';
    flight.className='basi-flight';
    flight.innerHTML='<span class="basi-face"></span>';
    document.body.append(backdrop,ring,card,flight);
    let index=0;
    let token=0;

    function cleanup(){
      tourRunning=false;
      token+=1;
      backdrop.remove();ring.remove();card.remove();flight.remove();
      try{localStorage.setItem('basi-tour-seen','1')}catch{}
    }

    function next(){
      if(!tourRunning)return;
      if(index>=steps.length){cleanup();return;}
      const myToken=++token;
      const step=steps[index];
      if(!step||typeof step!=='object'||typeof step.selector!=='string'){index+=1;next();return;}
      if(step.route && location.pathname.replace(/\/$/,'')!==String(step.route).replace(/\/$/,'') && !(location.pathname==='/'&&step.route==='/'))go(step.route);
      waitFor(step.selector,target=>{
        if(!tourRunning||myToken!==token)return;
        if(!target){index+=1;next();return;}
        target.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
        window.setTimeout(()=>{
          if(!tourRunning||myToken!==token)return;
          const r=target.getBoundingClientRect(),pad=8;
          ring.style.left=`${Math.max(8,r.left-pad)}px`;
          ring.style.top=`${Math.max(8,r.top-pad)}px`;
          ring.style.width=`${Math.max(20,r.width+pad*2)}px`;
          ring.style.height=`${Math.max(20,r.height+pad*2)}px`;
          flight.style.left=`${innerWidth/2-19}px`;flight.style.top=`${innerHeight+30}px`;flight.style.opacity='1';flight.style.transform='translate(0,0)';flight.getBoundingClientRect();flight.style.transform=`translate(${r.left+r.width/2-innerWidth/2}px,${r.top+r.height/2-innerHeight}px)`;setTimeout(()=>{if(tourRunning)flight.style.opacity='0'},380);
          const width=Math.min(340,innerWidth-28),left=Math.max(14,Math.min(r.left,innerWidth-width-14)),top=r.bottom+18<innerHeight-175?r.bottom+18:Math.max(14,r.top-180);
          card.style.width=`${width}px`;card.style.left=`${left}px`;card.style.top=`${top}px`;
          card.innerHTML=`<span class="basi-tour-avatar"><span class="basi-face"></span></span><strong>${esc(step.title||'Here')}</strong><p>${esc(step.text||'')}</p><div class="basi-tour-progress">${steps.map((_,i)=>`<i class="${i<=index?'on':''}"></i>`).join('')}</div><div class="basi-tour-actions"><button type="button" data-skip>Skip</button><button type="button" class="next" data-next>${index===steps.length-1?'Finish':'Next'}</button></div>`;
          card.querySelector('[data-skip]').onclick=cleanup;
          card.querySelector('[data-next]').onclick=()=>{index+=1;next()};
        },430);
      });
    }
    next();
  }

  function build(){
    const wrap=document.createElement('div');
    wrap.className='basi-wrap';
    wrap.innerHTML='<div class="basi-panel" hidden><div class="basi-head"><span class="basi-head-face"><span class="basi-face"></span></span><div><strong>Basi</strong><small>Your little council guide</small></div><button class="basi-close" type="button" aria-label="Close">×</button></div><div class="basi-messages" aria-live="polite"></div><form class="basi-input"><input placeholder="Ask me something…" aria-label="Ask Basi" autocomplete="off"><button type="submit">Send</button></form></div><button class="basi-button" type="button" aria-label="Open Basi"><span class="basi-face"></span></button>';
    document.body.appendChild(wrap);
    const panel=wrap.querySelector('.basi-panel');
    const messages=wrap.querySelector('.basi-messages');
    const input=wrap.querySelector('input');
    const say=(text,user=false,actions=[])=>{
      const el=document.createElement('div');el.className=`basi-message${user?' user':''}`;el.textContent=text;
      if(actions.length){const box=document.createElement('div');box.className='basi-buttons';actions.forEach(a=>{const b=document.createElement('button');b.type='button';b.className=`basi-choice${a.primary?' primary':''}`;b.textContent=a.label||'Open';b.onclick=()=>{if(a.tour){panel.hidden=true;runTour()}else if(a.path){panel.hidden=true;go(a.path)}else if(a.url)window.open(a.url,'_blank','noopener,noreferrer')};box.appendChild(b)});el.appendChild(box)}
      messages.appendChild(el);messages.scrollTop=messages.scrollHeight;
    };
    wrap.querySelector('.basi-button').onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden&&!messages.children.length){const suggestions=Array.isArray(bot.suggestions)&&bot.suggestions.length?bot.suggestions:[{label:'Show me around',tour:true,primary:true},{label:'Who is running?',path:'/vote'}];say('Hi! I’m Basi. 💛 Ask me about candidates, grades, positions, events, pages, or announcements.',false,suggestions)}};
    wrap.querySelector('.basi-close').onclick=()=>{panel.hidden=true};
    wrap.querySelector('form').onsubmit=e=>{e.preventDefault();const q=input.value.trim();if(!q)return;say(q,true);input.value='';const result=answer(q);setTimeout(()=>say(result.text,false,result.actions||[]),220)};
  }

  build();
  window.BASI_BOT={refresh(){currentBanner=cfg.banner?.enabled!==false?cfg.banner:null},tour:runTour};
  window.addEventListener('load',()=>{try{if(!localStorage.getItem('basi-tour-seen'))setTimeout(runTour,1100)}catch{}},{once:true});
})();
