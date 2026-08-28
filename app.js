(() => {
  'use strict';
  const cfg = window.SITE_CONFIG || {};
  const map = window.BASC_SITE_MAP || { home: '/', aliases: {} };
  const app = document.getElementById('app');
  if (!app) return;

  const routes = Array.isArray(cfg.routes) ? cfg.routes : [];
  const routeByPath = new Map(routes.map(route => [normalize(route.path), route]));
  const pageById = cfg.pages || {};
  const is404Shell = document.documentElement.dataset.fallback404 === 'true';
  const aliases = map.aliases || {};

  function normalize(path) {
    try { path = new URL(path, window.location.origin).pathname; } catch {}
    const clean = String(path || '/').split('?')[0].split('#')[0].replace(/\/+/g, '/');
    return clean.length > 1 ? clean.replace(/\/$/, '') : '/';
  }

  function routeFor(path = window.location.pathname) {
    const clean = normalize(path);
    const canonical = aliases[clean] || clean;
    return routeByPath.get(canonical) || null;
  }

  function href(path) {
    return normalize(path) === '/' ? '/' : normalize(path);
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
  }

  function icon(name, size = 17) {
    const paths = {
      'arrow-up-right': `<path d="M7 17 17 7M8 7h9v9"/>`,
      'arrow-right': `<path d="M5 12h13M13 6l6 6-6 6"/>`,
      'arrow-left': `<path d="M19 12H5M11 18l-6-6 6-6"/>`,
      sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>`,
      moon: `<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>`,
      menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
      close: `<path d="m6 6 12 12M18 6 6 18"/>`,
      check: `<path d="m5 12 4 4L19 6"/>`,
      sparkle: `<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/>`
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
  }

  function setupBranding() {
    document.querySelectorAll('[data-school-name]').forEach(el => el.textContent = cfg.schoolName || 'Bayside Academy');
    document.querySelectorAll('[data-school-tagline]').forEach(el => el.textContent = cfg.tagline || 'Student Council');
    document.querySelectorAll('[data-brand-fallback]').forEach(el => el.textContent = cfg.branding?.fallbackMark || 'BA');
    document.querySelectorAll('[data-brand-logo]').forEach(img => {
      if (!cfg.branding?.logo) return;
      img.src = cfg.branding.logo;
      img.alt = cfg.branding.logoAlt || `${cfg.schoolName || 'Bayside Academy'} logo`;
      img.addEventListener('load', () => { img.hidden = false; img.closest('.brand-media')?.querySelector('[data-brand-fallback]')?.setAttribute('hidden', ''); }, { once: true });
      img.addEventListener('error', () => { img.hidden = true; }, { once: true });
    });
  }

  function routeLink(path, label, cls = '') {
    const route = routeFor(path);
    const target = route ? route.path : path;
    return `<a class="${cls}" href="${href(target)}" data-route="${esc(target)}">${label}</a>`;
  }

  function eventCard(event, expanded = false) {
    const [month, day] = String(event.date || '').split(/\s+/);
    return `<article class="event-card ${expanded ? 'event-card-large' : ''}">
      <div class="event-date"><span>${esc(month)}</span><strong>${esc(day)}</strong></div>
      <div class="event-content"><span class="event-tag">${esc(event.tag)}</span><h3>${esc(event.title)}</h3><p>${esc(event.time)} <i>·</i> ${esc(event.place)}</p></div>
      <span class="event-arrow">${icon('arrow-up-right', 16)}</span>
    </article>`;
  }

  function candidateCard(candidate) {
    const initials = String(candidate.name || '').split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();
    return `<article class="candidate-card"><div class="candidate-top"><span class="avatar">${esc(initials)}</span><span class="candidate-grade">${esc(candidate.grade)}</span></div><h3>${esc(candidate.name)}</h3><div class="candidate-role">${esc(candidate.role)}</div><p>“${esc(candidate.statement)}”</p></article>`;
  }

  function shell(page, content) {
    const data = pageById[page] || {};
    return `<section class="page-shell section-pad" data-page="${esc(page)}"><div class="page-kicker"><span class="eyebrow">${esc(data.eyebrow || '')}</span>${data.meta ? `<span class="deadline">${esc(data.meta)}</span>` : ''}</div>${content}</section>`;
  }

  function homePage() {
    const p = pageById.home || {};
    const stats = (cfg.stats || []).map(([value, label]) => `<div class="stat"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('');
    const committees = (cfg.committees || []).map(c => `<article class="glass-card feature-card"><div class="feature-icon">${esc(c.icon || '✦')}</div><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p></article>`).join('');
    const candidates = (cfg.election?.candidates || []).map(candidateCard).join('');
    const events = (cfg.events || []).slice(0, 3).map(eventCard).join('');
    return `<section class="hero section-pad"><div class="hero-copy"><div class="eyebrow">${esc(p.eyebrow)}</div><h1>${esc(p.title)}</h1><p>${esc(p.body)}</p><div class="button-row">${routeLink('/vote', 'Vote in the election', 'btn btn-primary')}${routeLink('/apply', 'Get involved', 'btn btn-secondary')}</div><div class="hero-note"><span class="status-dot"></span><span>Student Council · 2026–27</span></div></div><div class="hero-visual"><div class="hero-card glass-card"><div class="card-top"><span>2026–27 election</span><span class="live-pill"><i></i> Open</span></div><div class="hero-card-title">Choose your next<br><em>student leaders.</em></div><div class="candidate-stack">${(cfg.election?.candidates || []).slice(0,3).map(c => `<div class="candidate-chip"><span class="avatar small">${esc(String(c.name).split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase())}</span><span><b>${esc(c.name)}</b><small>${esc(c.role)}</small></span>${icon('arrow-up-right', 15)}</div>`).join('')}</div>${routeLink('/vote', 'View candidates', 'card-link')}</div><div class="floating-badge"><span>${icon('sparkle', 14)}</span><b>Student-led</b><small>Ideas → action</small></div></div></section><section class="stats section-pad">${stats}</section><section class="section-pad section-intro"><div><div class="eyebrow">What we do</div><h2>Student-led,<br>school-wide.</h2></div><p>Student Council is a place to turn good ideas into real campus experiences — from events and community building to advocacy and everyday improvements.</p></section><section class="grid-3 section-pad">${committees}</section><section class="section-pad spotlight"><div class="section-heading"><div><div class="eyebrow">Meet the candidates</div><h2>Your voice matters.</h2></div>${routeLink('/vote', 'See all candidates', 'text-link')}</div><div class="candidate-grid">${candidates}</div></section><section class="section-pad events-preview"><div class="section-heading"><div><div class="eyebrow">Coming up</div><h2>Don't miss these.</h2></div>${routeLink('/events', 'See all events', 'text-link')}</div><div class="event-grid">${events}</div></section>`;
  }

  function votePage() {
    const p = pageById.vote || {};
    const form = cfg.googleForms?.enabled ? cfg.googleForms.vote : null;
    const ready = form?.embedUrl && !form.embedUrl.includes('YOUR_');
    return shell('vote', `<h1>${esc(p.title || 'Cast your vote.')}</h1><p class="lede">${esc(p.body || '')}</p>${ready ? `<div class="google-embed-card"><div class="embed-heading"><div><span class="eyebrow">Official ballot</span><h3>Student Council Election</h3></div><span class="secure-badge">School form</span></div><iframe title="Official Student Council Ballot" src="${esc(form.embedUrl)}" loading="lazy"></iframe></div>` : `<div class="notice-card"><div class="notice-icon">${icon('check', 18)}</div><div><b>Ballot connection is ready to configure.</b><p>Add the real Google Forms URL in <code>config.js</code> when the ballot is published.</p>${form?.formUrl ? `<a class="btn btn-primary btn-small" href="${esc(form.formUrl)}" target="_blank" rel="noopener">Open form ${icon('arrow-up-right', 14)}</a>` : ''}</div></div>`}<div class="section-heading inner-heading"><div><div class="eyebrow">Candidates</div><h2>Meet the people running.</h2></div></div><div class="candidate-grid">${(cfg.election?.candidates || []).map(candidateCard).join('')}</div>`);
  }

  function applyPage() {
    const p = pageById.apply || {};
    const form = cfg.googleForms?.enabled ? cfg.googleForms.apply : null;
    const ready = form?.embedUrl && !form.embedUrl.includes('YOUR_');
    return shell('apply', `<div class="apply-layout"><div class="apply-copy"><h1>${esc(p.title || 'Bring an idea. Make an impact.')}</h1><p class="lede">${esc(p.body || '')}</p><div class="apply-points"><div><span>${icon('sparkle', 16)}</span><b>No experience required.</b><small>Bring curiosity and a willingness to help.</small></div><div><span>${icon('arrow-right', 16)}</span><b>Tell us what matters.</b><small>We want your ideas, perspective, and energy.</small></div></div></div>${ready ? `<div class="google-embed-card apply-form"><div class="embed-heading"><div><span class="eyebrow">Application</span><h3>Join Student Council</h3></div></div><iframe title="Student Council Application" src="${esc(form.embedUrl)}" loading="lazy"></iframe></div>` : `<div class="notice-card"><div class="notice-icon">${icon('arrow-up-right', 18)}</div><div><b>Application form</b><p>Connect the official Google Form in <code>config.js</code> to show it here.</p>${form?.formUrl ? `<a class="btn btn-primary btn-small" href="${esc(form.formUrl)}" target="_blank" rel="noopener">Open application ${icon('arrow-up-right', 14)}</a>` : ''}</div></div>`}</div>`);
  }

  function eventsPage() {
    const p = pageById.events || {};
    return shell('events', `<h1>${esc(p.title || "What's happening on campus.")}</h1><p class="lede">${esc(p.body || '')}</p><div class="event-list">${(cfg.events || []).map(e => eventCard(e, true)).join('')}</div>`);
  }

  function aboutPage() {
    const p = pageById.about || {};
    return shell('about', `<h1>${esc(p.title || 'About Student Council')}</h1><p class="lede">${esc(p.body || '')}</p><div class="about-grid">${(cfg.committees || []).map(c => `<article class="glass-card about-card"><div class="feature-icon">${esc(c.icon || '✦')}</div><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p></article>`).join('')}</div><div class="quote-card"><span class="eyebrow">The goal</span><blockquote>“A good council doesn't speak for students. It makes it easier for students to speak for themselves.”</blockquote><small>— Student Council</small></div></section>`);
  }

  function faqPage() {
    const p = pageById.faq || {};
    return shell('faq', `<h1>${esc(p.title || 'Frequently asked questions.')}</h1><div class="faq-list">${(cfg.faq || []).map(([q, a]) => `<details><summary>${esc(q)}<span>+</span></summary><p>${esc(a)}</p></details>`).join('')}</div>`);
  }

  function notFoundPage() {
    const attempted = esc(normalize(window.location.pathname));
    return `<section class="not-found"><div class="not-found-orbit"><span>404</span></div><span class="eyebrow">Page not found</span><h1>That page took<br>a wrong turn.</h1><p>We couldn't find anything at <code>${attempted}</code>. The good news: the rest of the council site is still right here.</p><div class="button-row">${routeLink('/', 'Back to home', 'btn btn-primary')}${routeLink('/events', 'Explore events', 'btn btn-secondary')}</div></section>`;
  }

  const renderers = { home: homePage, vote: votePage, apply: applyPage, events: eventsPage, about: aboutPage, faq: faqPage };

  function render(route = routeFor()) {
    if (!route) {
      if (!is404Shell && normalize(window.location.pathname) !== '/') {
        app.innerHTML = notFoundPage();
      } else {
        app.innerHTML = notFoundPage();
      }
      document.title = `404 · ${cfg.schoolName || 'Bayside Academy'}`;
      bindRoutes();
      return;
    }
    const renderer = renderers[route.page] || homePage;
    document.title = `${route.label} · ${cfg.schoolName || 'Bayside Academy'}`;
    if (nav) nav.innerHTML = routes.filter(r => r.nav).map(r => `<a href="${href(r.path)}" data-route="${esc(r.path)}" class="${normalize(r.path) === normalize(route.path) ? 'active' : ''}">${esc(r.label)}</a>`).join('');
    if (footerLinks) footerLinks.innerHTML = routes.filter(r => r.nav).map(r => `<a href="${href(r.path)}" data-route="${esc(r.path)}">${esc(r.label)}</a>`).join('');
    app.innerHTML = renderer();
    bindRoutes();
    bindDynamicUI();
    app.focus({ preventScroll: true });
  }

  function bindRoutes() {
    document.querySelectorAll('[data-route]').forEach(link => {
      link.addEventListener('click', event => {
        const target = normalize(link.getAttribute('data-route'));
        const route = routeFor(target);
        if (!route) return;
        event.preventDefault();
        navigate(route.path);
      });
    });
  }

  function navigate(path, replace = false) {
    const route = routeFor(path);
    if (!route) return;
    const target = href(route.path);
    if (normalize(window.location.pathname) === normalize(target)) { render(route); return; }
    history[replace ? 'replaceState' : 'pushState']({ route: route.page }, '', target);
    render(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.main-nav')?.classList.remove('open');
    document.getElementById('mobileMenu')?.setAttribute('aria-expanded', 'false');
  }

  function bindDynamicUI() {
    const menu = document.getElementById('mobileMenu');
    const nav = document.getElementById('mainNav');
    menu?.addEventListener('click', () => { const open = nav?.classList.toggle('open'); menu.setAttribute('aria-expanded', String(Boolean(open))); });
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    updateThemeButton();
    document.querySelectorAll('.faq-list details').forEach(detail => detail.addEventListener('toggle', () => detail.open && detail.parentElement?.querySelectorAll('details[open]').forEach(other => { if (other !== detail) other.removeAttribute('open'); })));
  }

  function theme() { return localStorage.getItem('basc-theme') || 'dark'; }
  function applyTheme(value) { document.documentElement.dataset.theme = value; localStorage.setItem('basc-theme', value); }
  function toggleTheme() { applyTheme(theme() === 'dark' ? 'light' : 'dark'); updateThemeButton(); }
  function updateThemeButton() { const button = document.getElementById('themeToggle'); if (button) { button.innerHTML = icon(theme() === 'dark' ? 'sun' : 'moon', 17); button.setAttribute('aria-label', theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); } }

  if (!is404Shell) {
    document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
    setupBranding();
    applyTheme(theme());
  }
  const swURL = new URL('./sw.js', document.baseURI);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(swURL).catch(() => {});

  let initial = routeFor();
  if (!initial && aliases[normalize(window.location.pathname)]) {
    initial = routeFor(aliases[normalize(window.location.pathname)]);
    if (initial) history.replaceState({ route: initial.page }, '', href(initial.path));
  }
  render(initial);
  window.addEventListener('popstate', () => render(routeFor()));
})();
