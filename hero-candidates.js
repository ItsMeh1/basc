(() => {
  'use strict';
  const MAX = 9;

  function upgrade() {
    document.querySelectorAll('.candidate-showcase').forEach(showcase => {
      const compact = [...showcase.querySelectorAll('.hero-candidate-mini')].slice(0, MAX);
      const count = compact.length;
      showcase.className = `candidate-showcase candidate-count-${Math.max(1, count)}`;
      if (!count) { showcase.hidden = true; return; }
      showcase.hidden = false;
      const cards = compact.map((source, index) => {
        const avatar = source.querySelector('.avatar');
        const name = source.querySelector('b')?.textContent || `Candidate ${index + 1}`;
        const role = source.querySelector('small')?.textContent || '';
        const card = document.createElement('article');
        card.className = 'hero-candidate-card';
        card.innerHTML = `<div class="hero-candidate-avatar">${avatar?.innerHTML || '—'}</div><div class="hero-candidate-info"><strong>${name}</strong><span>${role}</span></div>`;
        return card;
      });
      showcase.replaceChildren(...cards);
    });
  }

  function start() {
    upgrade();
    const app = document.getElementById('app');
    if (app) new MutationObserver(upgrade).observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
