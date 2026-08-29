(() => {
  'use strict';

  const POLL_MS = 15000;
  const CONFIG_URL = './config.js';
  const BANNER_ID = 'liveBanner';
  const OVERLAY_ID = 'liveBannerOverlay';

  let activeSignature = '';
  let latestBanner = null;
  let pollHandle = null;
  let requestInFlight = false;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[c]));
  }

  function signature(value) {
    try { return JSON.stringify(value || null); } catch { return ''; }
  }

  function getConfigBanner(config) {
    const banner = config?.banner;
    if (!banner || banner.enabled === false) return null;
    return banner;
  }

  function getInitialBanner() {
    return getConfigBanner(window.SITE_CONFIG);
  }

  function createBannerRoot() {
    let root = document.getElementById(BANNER_ID);
    if (!root) {
      root = document.createElement('section');
      root.id = BANNER_ID;
      root.className = 'live-banner-host';
      root.hidden = true;
      const header = document.querySelector('.site-header');
      document.body.insertBefore(root, header || document.body.firstChild);
    }
    return root;
  }

  function linkMarkup(action) {
    const href = escapeHtml(action.href || '#');
    const target = action.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
    const style = action.style === 'secondary' ? ' secondary' : action.style === 'ghost' ? ' ghost' : '';
    return `<a class="live-banner-action${style}" href="${href}"${target}>${escapeHtml(action.label || 'Open')}</a>`;
  }

  function contentMarkup(content) {
    if (!Array.isArray(content)) return '';
    return content.map(block => {
      if (!block || typeof block !== 'object') return '';
      if (block.type === 'link' && block.href) {
        return `<a class="live-banner-inline-link" href="${escapeHtml(block.href)}"${block.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(block.label || block.href)}</a>`;
      }
      if (block.type === 'badge') return `<span class="live-banner-badge">${escapeHtml(block.text || '')}</span>`;
      if (block.type === 'heading') return `<h3>${escapeHtml(block.text || '')}</h3>`;
      return `<p>${escapeHtml(block.text || '')}</p>`;
    }).join('');
  }

  function render(banner) {
    const root = createBannerRoot();
    latestBanner = banner || null;
    activeSignature = signature(banner);

    if (!banner) {
      root.hidden = true;
      root.innerHTML = '';
      closeOverlay();
      document.documentElement.classList.remove('has-live-banner');
      return;
    }

    const tone = escapeHtml(banner.tone || 'default');
    const actions = Array.isArray(banner.actions) ? banner.actions.filter(a => a && a.href && a.label) : [];
    const expandable = banner.expandable && banner.expandable.enabled !== false;
    const expanded = banner.expandable || {};
    const dismissible = banner.dismissible !== false;

    root.innerHTML = `<div class="live-banner tone-${tone}" role="region" aria-label="Site announcement">
      <div class="live-banner-inner">
        <div class="live-banner-copy">
          ${banner.eyebrow ? `<span class="live-banner-eyebrow">${escapeHtml(banner.eyebrow)}</span>` : ''}
          <div class="live-banner-message"><strong>${escapeHtml(banner.title || '')}</strong>${banner.message ? `<span>${escapeHtml(banner.message)}</span>` : ''}${contentMarkup(banner.content)}</div>
        </div>
        <div class="live-banner-actions">
          ${actions.map(linkMarkup).join('')}
          ${expandable ? `<button class="live-banner-expand" type="button" data-banner-expand="true" aria-haspopup="dialog"><span>${escapeHtml(expanded.label || 'Learn more')}</span><span aria-hidden="true">↗</span></button>` : ''}
          ${dismissible ? '<button class="live-banner-close" type="button" aria-label="Dismiss announcement">×</button>' : ''}
        </div>
      </div>
    </div>`;

    root.hidden = false;
    document.documentElement.classList.add('has-live-banner');

    root.querySelector('.live-banner-close')?.addEventListener('click', () => {
      root.hidden = true;
      document.documentElement.classList.remove('has-live-banner');
    });

    root.querySelector('[data-banner-expand]')?.addEventListener('click', openOverlay);
  }

  function openOverlay() {
    const banner = latestBanner;
    const data = banner?.expandable;
    if (!data) return;

    let overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      overlay.className = 'live-banner-overlay';
      overlay.hidden = true;
      document.body.appendChild(overlay);
    }

    const sections = Array.isArray(data.sections) ? data.sections : [];
    overlay.innerHTML = `<div class="live-banner-backdrop" data-banner-close="true"></div><div class="live-banner-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(data.title || banner.title || 'Announcement')}">
      <div class="live-banner-dialog-top"><span>${escapeHtml(data.eyebrow || banner.eyebrow || 'Announcement')}</span><button type="button" class="live-banner-dialog-close" data-banner-close="true" aria-label="Close">×</button></div>
      <div class="live-banner-dialog-body"><h2>${escapeHtml(data.title || banner.title || '')}</h2>${data.body ? `<p class="live-banner-dialog-lede">${escapeHtml(data.body)}</p>` : ''}${sections.map(section => `<section><h3>${escapeHtml(section.title || '')}</h3><p>${escapeHtml(section.body || '')}</p>${Array.isArray(section.items) ? `<ul>${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}</section>`).join('')}</div>
      ${Array.isArray(data.actions) && data.actions.length ? `<div class="live-banner-dialog-actions">${data.actions.filter(a => a && a.href && a.label).map(linkMarkup).join('')}</div>` : ''}
    </div>`;
    overlay.hidden = false;
    document.documentElement.classList.add('banner-dialog-open');
    overlay.querySelectorAll('[data-banner-close]').forEach(el => el.addEventListener('click', closeOverlay));
    overlay.querySelector('.live-banner-dialog-close')?.focus();
  }

  function closeOverlay() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;
    overlay.hidden = true;
    overlay.innerHTML = '';
    document.documentElement.classList.remove('banner-dialog-open');
  }

  async function fetchLatestConfig() {
    if (requestInFlight) return;
    requestInFlight = true;
    try {
      const separator = CONFIG_URL.includes('?') ? '&' : '?';
      const response = await fetch(`${CONFIG_URL}${separator}live=${Date.now()}`, {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) return;
      const source = await response.text();
      const sandboxWindow = {};
      const loadConfig = new Function('window', `${source}\n;return window.SITE_CONFIG;`);
      const config = loadConfig(sandboxWindow);
      const banner = getConfigBanner(config);
      const nextSignature = signature(banner);
      if (nextSignature !== activeSignature) render(banner);
    } catch (error) {
      // A failed refresh should never disturb the banner currently on screen.
    } finally {
      requestInFlight = false;
    }
  }

  function start() {
    const initial = getInitialBanner();
    render(initial);
    fetchLatestConfig();
    pollHandle = window.setInterval(fetchLatestConfig, POLL_MS);
    window.addEventListener('pagehide', () => pollHandle && clearInterval(pollHandle), { once: true });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeOverlay();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
