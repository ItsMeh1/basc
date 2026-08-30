(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};

  function esc(value) {
    return String(value ?? '').replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function formFor(kind) {
    const forms = cfg.googleForms || {};
    if (kind === 'apply') return forms.apply || null;
    if (kind === 'vote') return forms.vote || null;
    return null;
  }

  function ensureViewer() {
    const panel = document.querySelector('.basi-panel');
    if (!panel) return null;

    let viewer = panel.querySelector('.basi-embed-view');
    if (viewer) return viewer;

    viewer = document.createElement('div');
    viewer.className = 'basi-embed-view';
    viewer.hidden = true;
    viewer.innerHTML = `
      <div class="basi-embed-head">
        <button type="button" class="basi-embed-back" aria-label="Back to chat">‹ <span>Back</span></button>
        <strong class="basi-embed-title">Form</strong>
        <button type="button" class="basi-embed-fullscreen" aria-label="Open form fullscreen">⤢</button>
      </div>
      <div class="basi-embed-body"></div>`;

    panel.insertBefore(viewer, panel.querySelector('.basi-input'));
    viewer.querySelector('.basi-embed-back').addEventListener('click', () => closeViewer());
    viewer.querySelector('.basi-embed-fullscreen').addEventListener('click', () => {
      const frame = viewer.querySelector('iframe');
      if (frame?.requestFullscreen) frame.requestFullscreen().catch(() => {});
      else window.open(frame?.src || '#', '_blank', 'noopener,noreferrer');
    });
    return viewer;
  }

  function setChatVisible(panel, viewer, visible) {
    const messages = panel.querySelector('.basi-messages');
    const input = panel.querySelector('.basi-input');
    viewer.hidden = !visible;
    if (messages) messages.hidden = visible;
    if (input) input.hidden = visible;
  }

  function openViewer(kind) {
    const panel = document.querySelector('.basi-panel');
    if (!panel) return false;

    const form = formFor(kind);
    if (!form) return false;

    const viewer = ensureViewer();
    if (!viewer) return false;

    const title = kind === 'apply' ? 'Student Council Application' : 'Official Ballot';
    const embedUrl = String(form.embedUrl || '').trim();
    const ready = embedUrl && !embedUrl.includes('YOUR_');
    const body = viewer.querySelector('.basi-embed-body');
    const titleNode = viewer.querySelector('.basi-embed-title');
    if (titleNode) titleNode.textContent = title;

    body.innerHTML = ready
      ? `<iframe title="${esc(title)}" src="${esc(embedUrl)}" loading="eager" allow="clipboard-write; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
      : `<div class="basi-embed-empty"><div class="basi-embed-empty-icon">⌁</div><strong>${esc(title)}</strong><p>The form is not connected yet. Add the real <code>${kind === 'apply' ? 'googleForms.apply' : 'googleForms.vote'}</code> URL in <code>config.js</code>.</p></div>`;

    panel.hidden = false;
    setChatVisible(panel, viewer, true);
    panel.classList.remove('expanded');
    return true;
  }

  function closeViewer() {
    const panel = document.querySelector('.basi-panel');
    const viewer = panel?.querySelector('.basi-embed-view');
    if (!panel || !viewer) return;
    setChatVisible(panel, viewer, false);
    viewer.querySelector('.basi-embed-body').replaceChildren();
  }

  function getActionText(button) {
    return String(button?.textContent || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.basi-choice');
    if (!button) return;
    const text = getActionText(button);

    const apply = /\b(open|go to|view)\b.*\b(application|apply)\b/.test(text) || text === 'apply';
    const vote = /\b(open|go to|view)\b.*\b(ballot|vote|voting)\b/.test(text);
    if (!apply && !vote) return;

    const handled = openViewer(apply ? 'apply' : 'vote');
    if (handled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  const style = document.createElement('style');
  style.textContent = `
    .basi-embed-view{position:absolute;inset:0;display:flex;flex-direction:column;background:var(--paper);z-index:3}.basi-embed-view[hidden]{display:none}.basi-embed-head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,rgba(244,214,94,.1),transparent);flex-shrink:0}.basi-embed-title{font-family:'Space Grotesk';font-size:13px;text-align:center}.basi-embed-back,.basi-embed-fullscreen{border:0;background:transparent;color:var(--muted);font-size:11px;font-weight:800;cursor:pointer;padding:7px}.basi-embed-fullscreen{justify-self:end;font-size:18px}.basi-embed-body{flex:1;min-height:0;background:#fff}.basi-embed-body iframe{width:100%;height:100%;min-height:0;border:0;display:block;background:#fff}.basi-embed-empty{height:100%;display:grid;place-items:center;text-align:center;padding:30px;background:var(--paper);color:var(--ink)}.basi-embed-empty p{max-width:280px;color:var(--muted);font-size:11px;line-height:1.6}.basi-embed-empty-icon{width:44px;height:44px;border-radius:15px;display:grid;place-items:center;background:var(--yellow-soft);color:var(--yellow);font-size:22px}.basi-embed-empty code{color:var(--yellow)}
  `;
  document.head.appendChild(style);
})();
