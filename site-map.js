/* Single source of truth for navigable URLs. Keep this file dependency-free so the service worker can import it. */
(function (root) {
  root.BASC_SITE_MAP = {
    home: '/',
    vote: '/vote',
    apply: '/apply',
    events: '/events',
    about: '/about',
    faq: '/faq',
    aliases: {
      '/v': '/vote',
      '/a': '/apply',
      '/e': '/events',
      '/abt': '/about'
    }
  };
})(typeof self !== 'undefined' ? self : window);
