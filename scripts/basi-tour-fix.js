(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const bot = cfg.bot || {};
  let running = false;

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = path => { try { path = new URL(path, location.origin).pathname; } catch {} const value = String(path || '/').replace(/\/+/g, '/').replace(/\/$/, ''); return value || '/'; };

  async function navigate(path) {
    const target = normalize(path);
    if (normalize(location.pathname) === target) return true;

    const link = [...document.querySelectorAll('a[data-route]')].find(a => normalize(a.getAttribute('data-route')) === target);
    if (link) link.click();

    for (let i = 0; i < 18; i++) {
      if (normalize(location.pathname) === target) return true;
      await new Promise(resolve => setTimeout(resolve, 60));
    }

    // Safari can occasionally swallow synthetic anchor clicks while an overlay is active.
    history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));

    for (let i = 0; i < 20; i++) {
      if (normalize(location.pathname) === target) return true;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return normalize(location.pathname) === target;
  }

  async function targetReady(selector, timeout = 6500) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      const target = document.querySelector(selector);
      if (target && !target.hidden && target.getClientRects().length) return target;
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    return null;
  }

  function styles() {
    if (document.getElementById('basi-tour-fix-styles')) return;
    const style = document.createElement('style');
    style.id = 'basi-tour-fix-styles';
    style.textContent = `
      .basi-tour-fix-backdrop{position:fixed;inset:0;z-index:140;background:rgba(2,3,5,.42);pointer-events:none}
      .basi-tour-fix-ring{position:fixed;z-index:141;pointer-events:none;border:2px solid var(--yellow);border-radius:20px;box-shadow:0 0 0 9999px rgba(2,3,5,.42),0 0 50px rgba(244,214,94,.35);transition:left .35s ease,top .35s ease,width .35s ease,height .35s ease}
      .basi-tour-fix-card{position:fixed;z-index:142;width:min(350px,calc(100vw - 28px));padding:17px;border:1px solid var(--line);border-radius:21px;background:var(--paper);box-shadow:0 25px 80px rgba(0,0,0,.42);font-family:'DM Sans',system-ui,sans-serif}
      .basi-tour-fix-card strong{display:block;font-family:'Space Grotesk';font-size:14px}.basi-tour-fix-card p{margin:9px 0 14px;color:var(--muted);font-size:11px;line-height:1.55}.basi-tour-fix-actions{display:flex;justify-content:flex-end;gap:7px}.basi-tour-fix-actions button{border:1px solid var(--line);border-radius:11px;padding:8px 11px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:800;cursor:pointer}.basi-tour-fix-actions .next{background:var(--yellow);color:#19180f;border-color:var(--yellow)}
    `;
    document.head.appendChild(style);
  }

  async function run() {
    if (running) return;
    running = true;
    styles();

    const fallback = [
      {route:'/', selector:'.brand', title:'Welcome', text:'This is the Student Council home base.'},
      {route:'/', selector:'#mainNav', title:'Navigation', text:'These links take you around the site.'},
      {route:'/', selector:'#searchButton', title:'Search', text:'Search the site from here.'},
      {route:'/', selector:'.hero-card', title:'Election dashboard', text:'A quick look at the current election.'},
      {route:'/vote', selector:'.candidate-grid', title:'Candidates', text:'The full candidate list is here.'},
      {route:'/events', selector:'.event-list', title:'Events', text:'The complete event schedule is here.'},
      {route:'/terms', selector:'.document-page', title:'Terms & Conditions', text:'The site rules and election guidelines live here.'},
      {route:'/', selector:'#liveBanner', title:'Announcements', text:'Live announcements can update without a refresh.'},
      {route:'/', selector:'.site-footer', title:'Every page', text:'All site links are collected here.'},
      {route:'/', selector:'.basi-button', title:'Basi', text:'Ask Basi about the site whenever you need help.'}
    ];
    const steps = Array.isArray(bot.tour) && bot.tour.length ? bot.tour : fallback;
    const backdrop=document.createElement('div'), ring=document.createElement('div'), card=document.createElement('div');
    backdrop.className='basi-tour-fix-backdrop';ring.className='basi-tour-fix-ring';card.className='basi-tour-fix-card';document.body.append(backdrop,ring,card);

    const cleanup=()=>{running=false;backdrop.remove();ring.remove();card.remove()};
    try {
      for(let i=0;i<steps.length;i++){
        const step=steps[i];
        if(!step || typeof step.selector!=='string') continue;
        if(step.route) await navigate(step.route);
        const target=await targetReady(step.selector);
        if(!target) continue;
        target.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
        await new Promise(resolve=>setTimeout(resolve,350));
        const rect=target.getBoundingClientRect(),pad=8;
        ring.style.left=`${Math.max(7,rect.left-pad)}px`;ring.style.top=`${Math.max(7,rect.top-pad)}px`;ring.style.width=`${Math.max(20,rect.width+pad*2)}px`;ring.style.height=`${Math.max(20,rect.height+pad*2)}px`;
        const width=Math.min(350,innerWidth-28);const left=Math.max(14,Math.min(rect.left,innerWidth-width-14));const top=rect.bottom+18<innerHeight-170?rect.bottom+18:Math.max(14,rect.top-175);
        card.style.left=`${left}px`;card.style.top=`${top}px`;card.innerHTML=`<strong>${esc(step.title||'Here')}</strong><p>${esc(step.text||'')}</p><div class="basi-tour-fix-actions"><button type="button" data-skip>Skip</button><button type="button" class="next" data-next>${i===steps.length-1?'Finish':'Next'}</button></div>`;
        await new Promise(resolve=>{card.querySelector('[data-skip]').onclick=()=>{cleanup();resolve()};card.querySelector('[data-next]').onclick=()=>resolve()});
      }
    } catch {}
    cleanup();
  }

  window.BASI_BOT = window.BASI_BOT || {};
  window.BASI_BOT.tour = run;
})();
