/*
 * BASI KNOWLEDGE
 * Add your own facts here. No bot code needs to change.
 * keywords can be a string or an array. actions can take you to a route,
 * open a URL, or start the tour.
 */
window.BASI_CONFIG = {
  knowledge: [
    {
      title: 'How voting works',
      keywords: ['vote', 'voting', 'ballot', 'election'],
      answer: 'Voting will use the official ballot on the Vote page. I can take you there whenever you are ready.',
      actions: [{ label: 'Go to Vote', path: '/vote', primary: true }]
    },
    {
      title: 'How to apply',
      keywords: ['apply', 'application', 'join', 'running'],
      answer: 'Want to get involved? The Apply page has the official application and the information you need before submitting it.',
      actions: [{ label: 'Go to Apply', path: '/apply', primary: true }]
    }
  ],
  suggestions: [
    { label: 'Meet candidates', path: '/vote' },
    { label: 'See events', path: '/events' }
  ],
  tour: [
    { selector: '.brand', title: 'Welcome to Bayside Academy', text: 'This is your Student Council home base. Let me show you around.' },
    { selector: '#mainNav', title: 'Navigation', text: 'Use these links to move between the main sections.' },
    { selector: '#searchButton', title: 'Search everything', text: 'Search pages, candidates, events, and the information you add to Basi.' },
    { selector: '.hero-card', title: 'Election dashboard', text: 'The home page gives you a quick look at the current election and candidates.' },
    { selector: '.candidate-grid', title: 'Candidate information', text: 'You can ask Basi about candidates by name, grade, or position.' },
    { selector: '.events-preview', title: 'Events', text: 'This is where upcoming campus events are surfaced.' },
    { selector: '#liveBanner', title: 'Live announcements', text: 'Banners can change while you are on the site, and Basi can use their information too.' },
    { selector: '.site-footer', title: 'Every page', text: 'The footer gives you a complete list of the site pages.' },
    { selector: '.basi-button', title: 'Your little guide', text: 'Ask me questions or teach me new things in this file.' }
  ]
};
window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.bot = window.BASI_CONFIG;
