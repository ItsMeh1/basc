/*
 * BASI KNOWLEDGE
 *
 * Add custom facts here. Site data such as candidates, grades, positions,
 * events, pages, and live announcements are already picked up automatically.
 */
window.BASI_CONFIG = {
  knowledge: [
    {
      title: 'How voting works',
      keywords: ['vote', 'voting', 'ballot', 'election'],
      answer: 'Voting uses the official ballot on the Vote page.',
      actions: [{ label: 'Go to Vote', path: '/vote', primary: true }]
    },
    {
      title: 'How to apply',
      keywords: ['apply', 'application', 'join', 'running'],
      answer: 'The Apply page has the information you need to get involved.',
      actions: [{ label: 'Go to Apply', path: '/apply', primary: true }]
    },
    {
      title: 'Terms & Conditions',
      keywords: ['terms', 'conditions', 'rules', 'guidelines'],
      answer: 'The Terms & Conditions page contains the site rules and election guidelines.',
      actions: [{ label: 'Read the Terms', path: '/terms', primary: true }]
    },
    {
      title: 'Events',
      keywords: ['events', 'event', 'meetings', 'assemblies', 'dances', 'calendar'],
      answer: 'The Events page has the current schedule.',
      actions: [{ label: 'View events', path: '/events', primary: true }]
    },
    {
      title: 'About',
      keywords: ['about', 'student council', 'council'],
      answer: 'The About page explains what Student Council does and how it helps the school community.',
      actions: [{ label: 'About Us', path: '/about', primary: true }]
    },
    {
      title: 'Who made this?',
      keywords: ['who made this', 'made this', 'creator', 'developer'],
      answer: 'Omar made this. Who else would have made it?',
      actions: []
    },
    {
      title: 'Frequently Asked Questions',
      keywords: ['faq', 'frequently asked questions', 'questions'],
      answer: 'The FAQ page has answers to the most common questions.',
      actions: [
        { label: 'Go to FAQ', path: '/faq', primary: true },
        { label: 'Go to About', path: '/about' }
      ]
    },
    {
      title: 'Who am I?',
      keywords: ['who are you', 'your name', 'whats your name', 'what is your name'],
      answer: 'I’m Basi, the little guide for this site.',
      actions: []
    },
    {
      title: 'Something is wrong',
      keywords: ['bug', 'broken', 'error', 'problem', 'does not work', 'doesnt work'],
      answer: 'Something looks wrong? Please contact the owner so it can be fixed.',
      actions: []
    }
  ],

  suggestions: [
    { label: 'Meet candidates', path: '/vote' },
    { label: 'See events', path: '/events' },
    { label: 'Show me around', tour: true }
  ],

  tour: [
    { route: '/', selector: '.brand', title: 'Welcome to Bayside Academy', text: 'This is your Student Council home base. Let me show you around.' },
    { route: '/', selector: '#mainNav', title: 'Navigation', text: 'Use these links to move between the main sections.' },
    { route: '/', selector: '#searchButton', title: 'Search everything', text: 'Search pages, candidates, events, and more.' },
    { route: '/', selector: '.hero-card', title: 'Election dashboard', text: 'The home page gives you a quick look at the current election and candidates.' },
    { route: '/vote', selector: '.candidate-grid', title: 'Candidate information', text: 'This is the full candidate list. Ask me about a candidate by name, grade, or position.' },
    { route: '/events', selector: '.event-list', title: 'Events', text: 'This page has the complete event schedule.' },
    { route: '/terms', selector: '.document-page', title: 'Terms & Conditions', text: 'Your site rules and election guidelines live here.' },
    { route: '/', selector: '#liveBanner', title: 'Live announcements', text: 'Announcements can update without a refresh.' },
    { route: '/', selector: '.site-footer', title: 'Every page', text: 'The footer gives you the complete list of site pages.' },
    { route: '/', selector: '.basi-button', title: 'Your little guide', text: 'Ask me questions about anything on the site.' }
  ]
};

window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.bot = window.BASI_CONFIG;
