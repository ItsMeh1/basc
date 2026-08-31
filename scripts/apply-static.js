(() => {
  'use strict';

  // The Apply page is informational only. Forms are opened from Basi when needed.
  function cleanApplyPage() {
    const page = document.querySelector('[data-page="apply"]');
    if (!page) return;
    page.querySelectorAll('.apply-form, .apply-layout > .google-embed-card, .apply-layout > .notice-card').forEach(el => el.remove());
    const layout = page.querySelector('.apply-layout');
    if (layout) layout.classList.add('apply-text-only');
  }

  cleanApplyPage();
  new MutationObserver(cleanApplyPage).observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
})();
