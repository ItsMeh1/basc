(() => {
  'use strict';
  const cfg = window.SITE_CONFIG || {};
  const routes = Array.isArray(cfg.routes) ? cfg.routes : [];
  const pages = cfg.pages || {};
  const normalize = v => String(v || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const collect = () => {
    const items = [];
    for (const route of routes) {
      const page = route.page === 'content' ? pages[route.content] : pages[route.page];
      const pieces = [route.label, route.path, page?.title, page?.eyebrow, page?.body];
      if (Array.isArray(page?.sections)) page.sections.forEach(s => pieces.push(s.title, s.body, ...(s.items || [])));
      items.push({ route, text: normalize(pieces.filter(Boolean).join(' ')), title: page?.title || route.label, description: page?.body || `Open ${route.label}.` });
    }
    (cfg.events || []).forEach(e => items.push({ route: { path: '/events', label: 'Events' }, text: normalize([e.title,e.place,e.tag,e.time,e.date].join(' ')), title: e.title, description: `${e.date || ''} · ${e.time || ''} · ${e.place || ''}` }));
    (cfg.election?.candidates || []).forEach(c => items.push({ route: { path: '/vote', label: 'Vote' }, text: normalize([c.name,c.role,c.grade,c.statement].join(' ')), title: c.name, description: `${c.role || 'Candidate'}${c.grade ? ` · ${c.grade}` : ''}` }));
    return items;
  };
  const items = collect();
  const score = (q, text) => {
    const words = normalize(q).split(' ').filter(Boolean);
    return words.reduce((n,w) => n + (text.includes(w) ? (text.startsWith(w) ? 4 : 1) : 0), 0);
  };
  const style = document.createElement('style');
  style.textContent = `.site-search-overlay{position:fixed;inset:0;z-index:120;background:rgba(4,5,7,.62);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);display:grid;place-items:start center;padding:8vh 20px}.site-search-overlay[hidden]{display:none}.site-search{width:min(720px,100%);overflow:hidden;border:1px solid var(--line);border-radius:26px;background:var(--paper);box-shadow:0 35px 110px rgba(0,0,0,.4)}.site-search-head{display:flex;align-items:center;gap:12px;padding:17px 20px;border-bottom:1px solid var(--line)}.site-search-head input{width:100%;border:0;outline:0;background:transparent;color:var(--ink);font-size:17px}.site-search-kbd{font-size:9px;color:var(--faint);border:1px solid var(--line);border-radius:7px;padding:4px 7px}.site-search-results{max-height:62vh;overflow:auto;padding:8px}.site-search-result{display:grid;grid-template-columns:1fr auto;gap:14px;padding:14px 15px;border-radius:16px;cursor:pointer}.site-search-result:hover,.site-search-result.active{background:var(--surface-strong)}.site-search-result strong{font-family:'Space Grotesk';font-size:13px}.site-search-result p{margin:4px 0 0;color:var(--muted);font-size:11px}.site-search-result small{color:var(--yellow);font-size:9px}.site-search-empty{padding:38px 20px;text-align:center;color:var(--muted);font-size:13px}@media(max-width:600px){.site-search-overlay{padding:20px}.site-search{border-radius:22px}.site-search-head input{font-size:16px}}`;
  document.head.appendChild(style);

  function open() {
    let overlay = document.getElementById('siteSearch');
    if (!overlay) {
      overlay = document.createElement('div'); overlay.id = 'siteSearch'; overlay.className = 'site-search-overlay'; overlay.hidden = true;
      overlay.innerHTML = `<div class="site-search" role="dialog" aria-modal="true" aria-label="Search the site"><div class="site-search-head"><span data-icon-search>⌕</span><input aria-label="Search entire site" placeholder="Search the entire site…" autocomplete="off"><span class="site-search-kbd">ESC</span></div><div class="site-search-results"></div></div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    }
    overlay.hidden = false;
    const input = overlay.querySelector('input');
    input.value = '';
    renderResults('', overlay);
    input.focus();
    input.oninput = () => renderResults(input.value, overlay);
  }
  function renderResults(query, overlay) {
    const results = query.trim() ? items.map(x => ({...x, n: score(query, x.text)})).filter(x => x.n > 0).sort((a,b) => b.n-a.n).slice(0,12) : items.slice(0,8);
    overlay.querySelector('.site-search-results').innerHTML = results.length ? results.map((r,i)=>`<div class="site-search-result ${i===0?'active':''}" data-search-path="${encodeURIComponent(r.route.path)}"><div><strong>${r.title}</strong><p>${r.description}</p></div><small>${r.route.label}</small></div>`).join('') : '<div class="site-search-empty">No results found. Try a name, event, page, or keyword.</div>';
    overlay.querySelectorAll('[data-search-path]').forEach(el => el.addEventListener('click', () => { const path = decodeURIComponent(el.dataset.searchPath); close(); document.querySelector(`[data-route="${CSS.escape(path)}"]`)?.click() || (history.pushState({},'',path), window.dispatchEvent(new PopStateEvent('popstate'))); }));
  }
  function close(){ const el=document.getElementById('siteSearch'); if(el) el.hidden=true; }
  function bindButton(){
    document.getElementById('searchButton')?.addEventListener('click', open);
    document.addEventListener('keydown', e => { if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();} if(e.key==='Escape')close(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bindButton, {once:true}); else bindButton();
})();
