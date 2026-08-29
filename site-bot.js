(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const pages = cfg.pages || {};
  const candidates = Array.isArray(cfg.election?.candidates) ? cfg.election.candidates : [];
  const events = Array.isArray(cfg.events) ? cfg.events : [];
  const bot = cfg.bot || {};
  let currentBanner = cfg.banner && cfg.banner.enabled !== false ? cfg.banner : null;

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const clean = value => String(value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  function makeStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .basi-wrap{position:fixed;right:22px;bottom:22px;z-index:115;font-family:'DM Sans',system-ui,sans-serif}.basi-button{width:66px;height:66px;border:1px solid rgba(255,255,255,.18);border-radius:23px;background:linear-gradient(145deg,#fff0a2,#f4d65e 60%,#d3b73f);color:#1b1a12;box-shadow:0 20px 60px rgba(0,0,0,.3);cursor:pointer;display:grid;place-items:center;transition:transform .22s ease,box-shadow .22s ease}.basi-button:hover{transform:translateY(-5px) rotate(-3deg);box-shadow:0 26px 70px rgba(0,0,0,.38)}.basi-avatar-3d{position:relative;width:37px;height:33px;border-radius:13px 13px 16px 16px;background:linear-gradient(145deg,#fff7c8,#f6df6e 60%,#d2af2e);box-shadow:inset -5px -6px 10px rgba(122,91,0,.12),inset 3px 3px 8px rgba(255,255,255,.55),5px 7px 0 rgba(137,104,18,.14)}.basi-avatar-3d:before{content:'•  •';position:absolute;left:7px;top:5px;color:#222;font-size:12px;letter-spacing:4px}.basi-avatar-3d:after{content:'';position:absolute;left:14px;top:21px;width:9px;height:4px;border-bottom:2px solid #222;border-radius:50%}.basi-panel{position:absolute;right:0;bottom:78px;width:min(390px,calc(100vw - 28px));overflow:hidden;border:1px solid var(--line);border-radius:27px;background:var(--paper);box-shadow:0 35px 110px rgba(0,0,0,.44);animation:basiIn .24s ease}.basi-panel[hidden]{display:none}@keyframes basiIn{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}.basi-head{display:flex;align-items:center;gap:12px;padding:16px 17px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,rgba(244,214,94,.12),transparent)}.basi-head-avatar{width:42px;height:42px;border-radius:14px;background:var(--yellow-soft);display:grid;place-items:center}.basi-head-avatar .basi-avatar-3d{transform:scale(.72);box-shadow:none}.basi-head strong{display:block;font-family:'Space Grotesk';font-size:14px}.basi-head small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.basi-close{margin-left:auto;border:0;background:transparent;color:var(--muted);font-size:21px;cursor:pointer}.basi-messages{max-height:360px;overflow:auto;padding:15px;display:grid;gap:10px}.basi-message{max-width:90%;padding:11px 13px;border-radius:17px;background:var(--surface);font-size:12px;line-height:1.52}.basi-message.user{justify-self:end;background:var(--yellow-soft)}.basi-buttons{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.basi-choice{border:1px solid var(--line);border-radius:999px;padding:7px 10px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:800;cursor:pointer}.basi-choice.primary{background:var(--yellow);color:#19180f;border-color:var(--yellow)}.basi-input{display:flex;gap:8px;padding:11px;border-top:1px solid var(--line)}.basi-input input{min-width:0;flex:1;border:1px solid var(--line);border-radius:14px;background:var(--surface);color:var(--ink);padding:10px 12px;outline:none}.basi-input input:focus{border-color:rgba(244,214,94,.35);box-shadow:0 0 0 3px rgba(244,214,94,.1)}.basi-input button{border:0;border-radius:14px;background:var(--yellow);color:#19180f;font-weight:800;padding:0 14px;cursor:pointer}
      .basi-tour-backdrop{position:fixed;inset:0;z-index:118;background:rgba(2,3,5,.42);pointer-events:none}.basi-tour-ring{position:fixed;z-index:119;pointer-events:none;border:2px solid var(--yellow);border-radius:24px;box-shadow:0 0 0 9999px rgba(2,3,5,.42),0 0 65px rgba(244,214,94,.42);transition:left .48s cubic-bezier(.2,.8,.2,1),top .48s cubic-bezier(.2,.8,.2,1),width .48s cubic-bezier(.2,.8,.2,1),height .48s cubic-bezier(.2,.8,.2,1)}.basi-tour-card{position:fixed;z-index:120;width:min(360px,calc(100vw - 28px));padding:17px;border:1px solid var(--line);border-radius:21px;background:var(--paper);box-shadow:0 28px 90px rgba(0,0,0,.4);animation:basiIn .3s ease}.tour-avatar{float:left;width:34px;height:34px;margin-right:10px;border-radius:12px;background:var(--yellow-soft);display:grid;place-items:center;overflow:hidden}.tour-avatar .basi-avatar-3d{transform:scale(.6);box-shadow:none}.basi-tour-card strong{display:block;font-family:'Space Grotesk';font-size:14px;padding-top:5px}.basi-tour-card p{clear:both;padding-top:10px;margin:0 0 12px;color:var(--muted);font-size:11px;line-height:1.55}.basi-tour-progress{display:flex;gap:4px;margin-bottom:12px}.basi-tour-progress i{width:18px;height:3px;border-radius:99px;background:var(--line)}.basi-tour-progress i.on{background:var(--yellow)}.basi-tour-actions{display:flex;justify-content:flex-end;gap:7px}.basi-tour-actions button{border:1px solid var(--line);border-radius:11px;padding:8px 11px;background:var(--surface);color:var(--ink);font-size:11px;font-weight:800;cursor:pointer}.basi-tour-actions .next{background:var(--yellow);color:#19180f;border-color:var(--yellow)}.basi-flight{position:fixed;z-index:121;pointer-events:none;transition:transform .62s cubic-bezier(.2,.8,.2,1),opacity .3s ease}.basi-flight .basi-avatar-3d{width:45px;height:40px;animation:basiBob .6s ease-in-out infinite alternate}@keyframes basiBob{to{transform:translateY(-5px) rotate(5deg)}}@media(max-width:600px){.basi-wrap{right:14px;bottom:14px}.basi-button{width:60px;height:60px}.basi-panel{bottom:71px}}@media(prefers-reduced-motion:reduce){.basi-button,.basi-tour-ring,.basi-flight{transition:none}.basi-avatar-3d,.basi-flight .basi-avatar-3d{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function pageKnowledge() {
    return (cfg.routes || []).map(route => {
      const page = route.page === 'content' ? pages[route.content] : pages[route.page];
      let text = [route.label, route.path, page?.eyebrow, page?.title, page?.body].filter(Boolean).join(' ');
      if (Array.isArray(page?.sections)) {
        for (const section of page.sections) text += ` ${section.title || ''} ${section.body || ''} ${(section.items || []).join(' ')}`;
      }
      return { text: clean(text), answer: page?.body || `The ${route.label} page has more information.`, actions: [{ label: `Go to ${route.label}`, path: route.path, primary: true }] };
    });
  }

  function buildKnowledge() {
    const knowledge = pageKnowledge();
    for (const c of candidates) knowledge.push({ text: clean([c.name,c.role,c.grade,c.statement].join(' ')), answer: `${c.name} is running for ${c.role || 'Student Council'}${c.grade ? ` and is in ${c.grade}.` : '.'}${c.statement ? ` Their message: “${c.statement}”` : ''}`, actions: [{ label: 'See all candidates', path: '/vote', primary: true }] });
    for (const e of events) knowledge.push({ text: clean([e.title,e.tag,e.date,e.time,e.place].join(' ')), answer: `${e.title} is ${e.date || 'scheduled'}${e.time ? ` at ${e.time}` : ''}${e.place ? ` in ${e.place}` : ''}.`, actions: [{ label: 'Open Events', path: '/events', primary: true }] });
    if (currentBanner) knowledge.push({ text: clean(JSON.stringify(currentBanner)), answer: `The current announcement is “${currentBanner.title || ''}”${currentBanner.message ? ` — ${currentBanner.message}` : ''}`, actions: [] });
    const custom = Array.isArray(bot.knowledge) ? bot.knowledge : [];
    for (const item of custom) knowledge.push({ text: clean([item.title,item.keywords,item.answer,item.body].flat().join(' ')), answer: item.answer || item.body || '', actions: Array.isArray(item.actions) ? item.actions : [] });
    return knowledge;
  }

  function answer(question) {
    const query = clean(question);
    if (!query) return { text: 'Ask me something! 💛' };
    if (/\b(tour|show me|guide me)\b/.test(query)) return { text: 'Absolutely! I can fly around the site and show you the useful bits. ✈️', actions: [{ label: 'Start the tour', tour: true, primary: true }] };
    if (/\b(hi|hello|hey|yo)\b/.test(query)) return { text: 'Hey! 👋 I’m Basi. I can answer questions about the site, candidates, grades, positions, events, announcements, and more.', actions: [{ label: 'Show me around', tour: true, primary: true }, { label: 'Who is running?', path: '/vote' }] };
    if (/who are you|what are you|your name|what is your name/.test(query)) return { text: 'I’m Basi — your tiny Student Council guide. 💛 I use the site’s configuration instead of making up information.' };
    if (/thank|thanks/.test(query)) return { text: 'Anytime! 💛' };
    let best = null; let bestScore = 0;
    for (const item of buildKnowledge()) {
      let score = query && item.text.includes(query) ? 8 : 0;
      for (const word of query.split(' ')) if (word && item.text.includes(word)) score += word.length > 4 ? 2 : 1;
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return best || { text: 'I don’t know that one yet, but you can teach me! Add it to the knowledge section in bot-config.js. Try a candidate name, grade, position, event, page, or announcement.', actions: [{ label: 'Meet candidates', path: '/vote' }, { label: 'Show me around', tour: true }] };
  }

  function navigate(path) {
    const link = document.querySelector(`[data-route="${CSS.escape(path)}"]`);
    if (link) { link.click(); return; }
    history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function waitForTarget(selector, timeout = 5000) {
    return new Promise(resolve => {
      const existing = document.querySelector(selector);
      if (existing) return resolve(existing);
      const start = Date.now();
      const observer = new MutationObserver(() => {
        const target = document.querySelector(selector);
        if (target) { observer.disconnect(); resolve(target); }
        else if (Date.now() - start > timeout) { observer.disconnect(); resolve(null); }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(() => { observer.disconnect(); resolve(document.querySelector(selector)); }, timeout);
    });
  }

  async function getTourSteps() {
    const defaults = [
      { selector: '.brand', title: 'Welcome to Bayside Academy', text: 'This is your Student Council home base. Let me show you around.' },
      { selector: '#mainNav', title: 'Navigation', text: 'Use these links to move between the main sections.' },
      { selector: '#searchButton', title: 'Search everything', text: 'Search pages, candidates, events, and information.' },
      { selector: '.hero-card', title: 'Election dashboard', text: 'The home page gives you a quick look at the current election.' },
      { selector: '.candidate-grid', title: 'Candidate information', text: 'You can ask Basi about candidates by name, grade, or position.' },
      { route: '/events', selector: '.event-list', title: 'The Events page', text: 'Here you can find the complete schedule, not just the events preview.' },
      { route: '/vote', selector: '.candidate-grid', title: 'The full candidate list', text: 'This page contains every candidate, while the Home page only features the first few.' },
      { route: '/terms', selector: '.document-page', title: 'Terms & Conditions', text: 'Your site rules live here, including the election guidelines.' },
      { route: '/', selector: '#liveBanner', title: 'Live announcements', text: 'Announcements can update while you are on the site without a refresh.' },
      { selector: '.site-footer', title: 'Every page', text: 'The footer gives you the complete page list.' },
      { selector: '.basi-button', title: 'That’s me!', text: 'Ask me questions, or teach me something new through bot-config.js.' }
    ];
    return Array.isArray(bot.tour) && bot.tour.length ? bot.tour : defaults;
  }

  function runTour() {
    if (document.querySelector('.basi-tour-card')) return;

    const all = getTourSteps();
    const ring = document.createElement('div');
    const backdrop = document.createElement('div');
    const card = document.createElement('div');
    const flight = document.createElement('div');
    ring.className = 'basi-tour-ring';
    backdrop.className = 'basi-tour-backdrop';
    card.className = 'basi-tour-card';
    flight.className = 'basi-flight';
    flight.innerHTML = '<span class="basi-avatar-3d"></span>';
    document.body.append(backdrop, ring, card, flight);

    let index = 0;
    let stopped = false;

    function cleanup() {
      stopped = true;
      backdrop.remove(); ring.remove(); card.remove(); flight.remove();
      try { localStorage.setItem('basi-tour-seen', '1'); } catch {}
    }

    async function draw() {
      if (stopped) return;
      if (index >= all.length) { cleanup(); return; }

      const step = all[index];
      if (step.route && location.pathname !== step.route) navigate(step.route);

      const target = await waitForTarget(step.selector, 5500);
      if (stopped) return;
      if (!target) { index += 1; return draw(); }

      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      await new Promise(resolve => window.setTimeout(resolve, 500));
      if (stopped) return;

      const rect = target.getBoundingClientRect();
      const pad = 8;
      const left = Math.max(8, Math.min(rect.left - pad, window.innerWidth - rect.width - pad * 2 - 8));
      const top = Math.max(8, Math.min(rect.top - pad, window.innerHeight - rect.height - pad * 2 - 8));

      ring.style.left = `${left}px`;
      ring.style.top = `${top}px`;
      ring.style.width = `${Math.max(20, rect.width + pad * 2)}px`;
      ring.style.height = `${Math.max(20, rect.height + pad * 2)}px`;

      flight.style.left = `${window.innerWidth / 2 - 22}px`;
      flight.style.top = `${window.innerHeight + 35}px`;
      flight.style.opacity = '1';
      flight.style.transform = 'translate(0,0)';
      flight.getBoundingClientRect();
      flight.style.transform = `translate(${rect.left + rect.width / 2 - window.innerWidth / 2}px, ${rect.top + rect.height / 2 - window.innerHeight}px)`;
      window.setTimeout(() => { flight.style.opacity = '0'; }, 430);

      const cardWidth = Math.min(360, window.innerWidth - 28);
      const cardLeft = Math.max(14, Math.min(rect.left, window.innerWidth - cardWidth - 14));
      const below = rect.bottom + 18;
      const cardTop = below + 170 < window.innerHeight ? below : Math.max(14, rect.top - 185);
      card.style.width = `${cardWidth}px`;
      card.style.left = `${cardLeft}px`;
      card.style.top = `${cardTop}px`;
      card.innerHTML = `<span class="tour-avatar"><span class="basi-avatar-3d"></span></span><strong>${esc(step.title || 'Here')}</strong><p>${esc(step.text || '')}</p><div class="basi-tour-progress">${all.map((_,i) => `<i class="${i <= index ? 'on' : ''}"></i>`).join('')}</div><div class="basi-tour-actions"><button type="button" data-tour-skip>Skip</button><button type="button" class="next" data-tour-next>${index === all.length - 1 ? 'Finish' : 'Next'}</button></div>`;
      card.querySelector('[data-tour-skip]').onclick = cleanup;
      card.querySelector('[data-tour-next]').onclick = () => { index += 1; draw(); };
    }

    draw();
  }

  function buildBot() {
    const wrap = document.createElement('div');
    wrap.className = 'basi-wrap';
    wrap.innerHTML = `<div class="basi-panel" hidden><div class="basi-head"><span class="basi-head-avatar"><span class="basi-avatar-3d"></span></span><div><strong>Basi</strong><small>Your little council guide</small></div><button class="basi-close" type="button" aria-label="Close">×</button></div><div class="basi-messages" aria-live="polite"></div><form class="basi-input"><input placeholder="Ask me something…" aria-label="Ask Basi" autocomplete="off"><button type="submit">Send</button></form></div><button class="basi-button" type="button" aria-label="Open Basi"><span class="basi-avatar-3d"></span></button>`;
    document.body.appendChild(wrap);
    const panel = wrap.querySelector('.basi-panel');
    const messages = wrap.querySelector('.basi-messages');
    const input = wrap.querySelector('input');

    function say(text, user, actions) {
      const element = document.createElement('div');
      element.className = `basi-message${user ? ' user' : ''}`;
      element.textContent = text;
      if (actions && actions.length) {
        const buttons = document.createElement('div');
        buttons.className = 'basi-buttons';
        for (const action of actions) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `basi-choice${action.primary ? ' primary' : ''}`;
          button.textContent = action.label || 'Open';
          button.addEventListener('click', () => {
            if (action.tour) { panel.hidden = true; runTour(); }
            else if (action.path) { panel.hidden = true; navigate(action.path); }
            else if (action.url) window.open(action.url, '_blank', 'noopener,noreferrer');
          });
          buttons.appendChild(button);
        }
        element.appendChild(buttons);
      }
      messages.appendChild(element);
      messages.scrollTop = messages.scrollHeight;
    }

    wrap.querySelector('.basi-button').addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden && !messages.children.length) {
        const suggestions = Array.isArray(bot.suggestions) && bot.suggestions.length ? bot.suggestions : [{ label: 'Show me around', tour: true, primary: true }, { label: 'Who is running?', path: '/vote' }];
        say('Hi! I’m Basi. 💛 Ask me about candidates, grades, positions, events, pages, or announcements.', false, suggestions);
      }
    });
    wrap.querySelector('.basi-close').addEventListener('click', () => { panel.hidden = true; });
    wrap.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      say(question, true);
      input.value = '';
      const result = answer(question);
      window.setTimeout(() => say(result.text, false, result.actions || []), 220);
    });
  }

  makeStyle();
  buildBot();
  window.BASI_BOT = { refresh() { currentBanner = cfg.banner && cfg.banner.enabled !== false ? cfg.banner : null; }, tour: runTour };
  window.addEventListener('load', () => { try { if (!localStorage.getItem('basi-tour-seen')) window.setTimeout(runTour, 1100); } catch {} }, { once: true });
})();
