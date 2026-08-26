(() => {
  const cfg = window.SITE_CONFIG;
  const app = document.getElementById('app');
  const nav = document.getElementById('mainNav');
  const footerLinks = document.getElementById('footerLinks');
  const mobileMenu = document.getElementById('mobileMenu');
  const toast = document.getElementById('toast');

  const routeByPath = Object.fromEntries(cfg.routes.map(r => [normalizePath(r.path), r]));
  const BASE_PATH = getBasePath();

  document.querySelectorAll('[data-school-name]').forEach(el => el.textContent = cfg.schoolName);
  document.querySelectorAll('[data-school-tagline]').forEach(el => el.textContent = cfg.tagline);
  setupBranding();
  document.getElementById('year').textContent = new Date().getFullYear();

  function normalizePath(path) {
    if (!path) return '/';
    const clean = path.split('?')[0].split('#')[0].replace(/\/+/g, '/');
    return clean.length > 1 ? clean.replace(/\/$/, '') : '/';
  }

  function normalizeBasePath(path) {
    if (!path || path === '/') return '';
    const clean = normalizePath(path);
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  function getBasePath() {
    // Optional explicit basePath in config.js takes priority.
    // Example: basePath: '/bsac'
    if (Object.prototype.hasOwnProperty.call(cfg, 'basePath')) {
      return normalizeBasePath(cfg.basePath);
    }

    const pathname = normalizePath(window.location.pathname);

    // Site is hosted at the domain root.
    if (pathname === '/') return '';

    // If the current URL directly matches a configured route,
    // the site is probably hosted at the domain root.
    if (cfg.routes.some(r => normalizePath(r.path) === pathname)) {
      return '';
    }

    // Try to detect a subdirectory from the current route.
    const routePaths = cfg.routes
      .map(r => normalizePath(r.path))
      .filter(path => path !== '/')
      .sort((a, b) => b.length - a.length);

    for (const routePath of routePaths) {
      if (pathname.endsWith(routePath)) {
        const possibleBase = pathname.slice(0, -routePath.length);
        if (possibleBase === '' || possibleBase === '/') return '';
        if (possibleBase.endsWith('/')) return normalizeBasePath(possibleBase);
      }
    }

    // If we're at /bsac, /student-council, etc., treat that as the base.
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) return `/${segments[0]}`;

    // Fallback for deeper paths.
    return segments.length ? `/${segments[0]}` : '';
  }

  function stripBasePath(path) {
    const clean = normalizePath(path);

    if (!BASE_PATH) return clean;
    if (clean === BASE_PATH || clean === `${BASE_PATH}/`) return '/';
    if (clean.startsWith(`${BASE_PATH}/`)) return clean.slice(BASE_PATH.length) || '/';

    return clean;
  }

  function withBasePath(path) {
    const clean = normalizePath(path);

    if (!BASE_PATH) return clean;
    if (clean === '/') return `${BASE_PATH}/`;

    return `${BASE_PATH}${clean}`;
  }

  function setupBranding(){
    const branding = cfg.branding || {};
    document.querySelectorAll('[data-brand-logo]').forEach(img => {
      if(!branding.logo) return;
      img.src = branding.logo;
      img.alt = branding.logoAlt || `${cfg.schoolName} logo`;
      img.onload = () => { img.hidden = false; img.closest('.brand-media')?.querySelector('[data-brand-fallback]')?.setAttribute('hidden','hidden'); };
      img.onerror = () => { img.hidden = true; img.closest('.brand-media')?.querySelector('[data-brand-fallback]')?.removeAttribute('hidden'); };
    });
    document.querySelectorAll('[data-brand-fallback]').forEach(el => el.textContent = branding.fallbackMark || 'SC');
  }

  function routeForCurrentPath() {
    const appPath = stripBasePath(window.location.pathname);
    return routeByPath[normalizePath(appPath)] || routeByPath['/'] || cfg.routes[0];
  }

  function navigate(path, replace = false) {
    const clean = normalizePath(path);
    const route = routeByPath[clean] || routeByPath['/'];
    const url = withBasePath(route.path);
    const method = replace ? 'replaceState' : 'pushState';
    history[method]({ route: route.anchor }, '', url);
    render(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render(route = routeForCurrentPath()) {
    document.title = `${route.label} · ${cfg.schoolName}`;
    nav.innerHTML = cfg.routes.filter(r => r.nav).map(r => `<a href="${withBasePath(r.path)}" data-route="${r.path}" class="${normalizePath(r.path) === normalizePath(route.path) ? 'active' : ''}">${r.label}</a>`).join('');
    footerLinks.innerHTML = cfg.routes.filter(r => r.nav).slice(0, 5).map(r => `<a href="${withBasePath(r.path)}" data-route="${r.path}">${r.label}</a>`).join('');
    app.innerHTML = pageMarkup(route.page);
    attachRouteLinks();
    attachPageHandlers(route.page);
    app.focus({ preventScroll: true });
  }

  function pageMarkup(page) {
    switch (page) {
      case 'vote': return votePage();
      case 'apply': return applyPage();
      case 'events': return eventsPage();
      case 'about': return aboutPage();
      case 'faq': return faqPage();
      default: return homePage();
    }
  }

  function link(routePath, text, cls='btn') {
    return `<a href="${withBasePath(routePath)}" data-route="${routePath}" class="${cls}">${text}</a>`;
  }

  function homePage() {
    const stats = cfg.stats.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
    const cards = cfg.committees.map(c => `<article class="mini-card"><div class="mini-icon">${c.icon}</div><h3>${c.title}</h3><p>${c.body}</p></article>`).join('');
    const events = cfg.events.slice(0, 3).map(e => eventCard(e)).join('');
    return `
      <section class="hero section-pad" data-anchor="home">
        <div class="hero-copy">
          <div class="eyebrow">${cfg.hero.eyebrow}</div>
          <h1>${cfg.hero.title.replace('\n','<br>')}</h1>
          <p>${cfg.hero.body}</p>
          <div class="button-row">
            ${link(cfg.hero.primaryRoute, 'Vote in the election <span>→</span>', 'btn btn-primary')}
            ${link(cfg.hero.secondaryRoute, 'Apply to join', 'btn btn-secondary')}
          </div>
        </div>
        <div class="hero-panel">
          <div class="hero-panel-top"><span class="live-dot"></span><span>Election open</span><span class="pill">2026–27</span></div>
          <div class="countdown-title">Choose your next<br><strong>student leaders.</strong></div>
          <div class="hero-candidate-list">
            ${cfg.election.candidates.map((c, i) => `<div class="candidate-chip"><span class="avatar avatar-${i}">${initials(c.name)}</span><span><strong>${c.name}</strong><small>${c.role}</small></span><span class="chip-arrow">↗</span></div>`).join('')}
          </div>
          ${link('/vote', 'View candidates & vote', 'text-link')}
        </div>
      </section>
      <section class="stats section-pad">${stats}</section>
      <section class="section-pad section-intro">
        <div><div class="eyebrow">What we do</div><h2>Student-led, school-wide.</h2></div>
        <p>From events to advocacy, council is a place to build and changethings that make school feel more like yours.</p>
      </section>
      <section class="grid-3 section-pad compact-top">${cards}</section>
      <section class="section-pad events-preview">
        <div class="section-heading"><div><div class="eyebrow">Coming up</div><h2>Don't miss these.</h2></div>${link('/events', 'See all events →', 'text-link')}</div>
        <div class="event-grid">${events}</div>
      </section>`;
  }

  function votePage() {
    const google = cfg.googleForms?.enabled ? cfg.googleForms.vote : null;
    const useGoogle = google?.mode === 'embed' && google.embedUrl && !google.embedUrl.includes('YOUR_');
    return `<section class="page-shell section-pad" data-anchor="vote">
      <div class="page-kicker"><span class="eyebrow">Election 2026–27</span><span class="deadline">Voting closes ${cfg.election.deadline}</span></div>
      <h1>Cast your vote.</h1>
      <p class="lede">Use the official school ballot below. The Google Form handles submissions and response collection, while this site provides the surrounding candidate information and election experience.</p>
      ${useGoogle ? googleEmbed(google, 'Official Student Council Ballot', 'vote') : `<div class="google-form-note"><span class="eyebrow">Google Forms ballot</span><p>Set <code>googleForms.vote.mode</code> to <code>embed</code> and add your real <code>embedUrl</code> in <code>config.js</code>.</p>${googleButton(google)}</div>`}
      <div class="candidate-grid">${cfg.election.candidates.map((c, i) => candidateCard(c, i)).join('')}</div>
    </section>`;
  }

  function candidateCard(c, i) {
    return `<article class="candidate-card">
      <div class="candidate-top"><span class="avatar avatar-${i}">${initials(c.name)}</span><span class="candidate-grade">${c.grade}</span></div>
      <h3>${c.name}</h3><div class="candidate-role">${c.role}</div>
      <p>“${c.statement}”</p>
    </article>`;
  }

  function applyPage() {
    const google = cfg.googleForms?.enabled ? cfg.googleForms.apply : null;
    const useGoogle = google?.mode === 'embed' && google.embedUrl && !google.embedUrl.includes('YOUR_');
    return `<section class="page-shell section-pad" data-anchor="apply">
      <div class="page-kicker"><span class="eyebrow">Get involved</span><span class="deadline">Applications are reviewed weekly</span></div>
      <div class="split-apply">
        <div><h1>${cfg.application.title}</h1><p class="lede">${cfg.application.intro}</p>
          <div class="apply-note"><span>✦</span><div><strong>No experience required.</strong><p>Bring a point of view, a little curiosity, and a willingness to help.</p></div></div>
          ${google && !useGoogle ? `<div class="google-form-note"><span class="eyebrow">Google Forms</span><p>Connect your official application form in <code>config.js</code>.</p>${googleButton(google)}</div>` : ''}
        </div>
        ${useGoogle ? googleEmbed(google, 'Student Council Application', 'apply') : `<div class="google-form-note"><span class="eyebrow">Application form not connected yet</span><p>Add your Google Forms <code>embedUrl</code> to <code>config.js</code> and this page will show it here.</p></div>`}
      </div>
    </section>`;
  }

  function googleButton(form){
    return form?.formUrl ? `<a class="btn btn-primary" href="${form.formUrl}" target="_blank" rel="noopener">${form.buttonLabel || 'Open Google Form ↗'}</a>` : '';
  }

  function googleEmbed(form, title='Google Form', kind='default'){
    return `<div class="google-embed-card google-embed-${kind}"><div class="google-embed-heading"><span class="eyebrow">Google Forms</span><h3>${title}</h3></div><iframe title="${title}" src="${form.embedUrl}" loading="lazy" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe></div>`;
  }

  function fieldMarkup(f) {
    if (f.type === 'textarea') return `<label><span>${f.label}</span><textarea name="${f.name}" rows="4" ${f.required?'required':''}></textarea></label>`;
    if (f.type === 'select') return `<label><span>${f.label}</span><select name="${f.name}" ${f.required?'required':''}><option value="">Select…</option>${f.options.map(o=>`<option>${o}</option>`).join('')}</select></label>`;
    return `<label><span>${f.label}</span><input type="${f.type}" name="${f.name}" ${f.required?'required':''} /></label>`;
  }

  function eventsPage() {
    return `<section class="page-shell section-pad" data-anchor="events"><div class="page-kicker"><span class="eyebrow">Calendar</span><span class="deadline">${cfg.events.length} upcoming events</span></div><h1>What's happening on campus.</h1><p class="lede">Meet people, join in, and show up for the parts of school you want to shape.</p><div class="event-list">${cfg.events.map(e=>eventCard(e,true)).join('')}</div></section>`;
  }

  function eventCard(e, expanded=false) {
    return `<article class="event-card ${expanded ? 'expanded':''}"><div class="event-date">${e.date.split(' ')[0]}<strong>${e.date.split(' ')[1]}</strong></div><div><div class="event-tag">${e.tag}</div><h3>${e.title}</h3><p>${e.time} · ${e.place}</p></div><span class="event-arrow">↗</span></article>`;
  }

  function aboutPage() {
    return `<section class="page-shell section-pad" data-anchor="about"><span class="eyebrow">About council</span><h1>A small team with a big job.</h1><p class="lede">Student Council connects student ideas with real school decisions. We organize events, represent student feedback, and create projects that improve daily campus life.</p><div class="about-grid">${cfg.committees.map(c=>`<article class="about-card"><div class="mini-icon">${c.icon}</div><h3>${c.title}</h3><p>${c.body}</p></article>`).join('')}</div><div class="quote-card">“some random inspiring quote that makes people raise their eyebrows is meant to go here”<span>— omar abuelphotograph, 2026</span></div></section>`;
  }

  function faqPage() {
    const qs = [
      ['How do I vote?', 'Open /vote and complete the official Google Form embedded on the page.'],
      ['How do I apply?', 'Open /apply and complete the official Google Form embedded on the page.'],
      ['Can I add another page?', 'Yes. Add one route object to SITE_CONFIG.routes and add its page name to the pageMarkup switch in app.js.'],
      ['Can I change the site content?', 'Yes. Most copy, candidates, events, committees, and form fields live in config.js so you can edit them without touching the layout.']
    ];
    return `<section class="page-shell section-pad" data-anchor="faq"><span class="eyebrow">Help</span><h1>Frequently asked questions.</h1><div class="faq-list">${qs.map(([q,a])=>`<details><summary>${q}<span>+</span></summary><p>${a}</p></details>`).join('')}</div></section>`;
  }

  function initials(name){ return name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase(); }
  function showToast(msg){ toast.textContent=msg; toast.classList.add('show'); clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove('show'),3000); }

  function attachRouteLinks(){
    document.querySelectorAll('[data-route]').forEach(a => {
      a.addEventListener('click', e => {
        const routePath = a.getAttribute('data-route');
        if (routePath && routeByPath[normalizePath(routePath)]) {
          e.preventDefault();
          navigate(routePath);
          mobileMenu?.classList.remove('open');
          nav?.classList.remove('open');
        }
      });
    });
  }

  function attachPageHandlers(){
    // Google Forms handles ballot and application submission. No response data is stored here.
  }

  mobileMenu?.addEventListener('click',()=>{nav.classList.toggle('open'); mobileMenu.classList.toggle('open');});
  window.addEventListener('popstate',()=>render(routeForCurrentPath()));

  const currentAppPath = stripBasePath(window.location.pathname);
  const currentRoute = routeByPath[normalizePath(currentAppPath)];

  if (!currentRoute && normalizePath(currentAppPath) !== '/') {
    history.replaceState({}, '', withBasePath('/'));
  }

  render();
})();
