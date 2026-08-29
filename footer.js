(() => {
  'use strict';
  function renderFooterLinks() {
    const host = document.getElementById('footerLinks');
    const cfg = window.SITE_CONFIG;
    if (!host || !cfg || !Array.isArray(cfg.routes)) return;
    const unique = new Map();
    cfg.routes.forEach(route => { if (route?.path && route?.label) unique.set(route.path, route); });
    host.innerHTML = [...unique.values()].map(route => `<a href="${route.path}" data-route="${route.path}">${route.label}</a>`).join('');
    host.querySelectorAll('[data-route]').forEach(link => link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const target = document.querySelector(`[data-route="${CSS.escape(link.dataset.route)}"]`);
      if (target && target !== link) { e.preventDefault(); target.click(); }
    }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderFooterLinks, { once: true }); else renderFooterLinks();
  window.addEventListener('popstate', renderFooterLinks);
})();
