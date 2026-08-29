/*
 * BASI KNOWLEDGE
 *
 * Add or edit knowledge here. You should never need to edit site-bot.js.
 *
 * Each knowledge item can contain:
 *   title    - what the topic is called
 *   keywords - words/phrases Basi should match
 *   answer   - what Basi should say
 *   actions  - optional buttons: { label, path | url | tour, primary }
 *
 * Site data such as pages, candidates, grades, positions, events, and the
 * live announcement are added automatically by Basi.
 */
window.BASI_CONFIG = {
  knowledge: [
    {
      title: 'How voting works',
      keywords: ['vote', 'voting', 'ballot', 'election'],
      answer: 'Voting will use the official ballot on the Vote page. I can take you there whenever you are ready!',
      actions: [
        { label: 'Go to Vote', path: '/vote', primary: true }
      ]
    },
    {
      title: 'How to apply',
      keywords: ['apply', 'application', 'join', 'running'],
      answer: 'Want to get involved? The Apply page has the official application and the information you need before submitting it. You can also read the election rules at the Terms & Conditions.',
      actions: [
        { label: 'Go to Apply', path: '/apply', primary: true },
        { label: 'Read the Terms', path: '/terms' }
      ]
    },
    {
      title: 'Terms & Conditions',
      keywords: ['terms', 'conditions', 'rules', 'guidelines'],
      answer: 'All of the big and fancy words go here! The Terms & Conditions page also contains the election rules.',
      actions: [
        { label: 'Read the Terms', path: '/terms', primary: true }
      ]
    },
    {
      title: 'Events',
      keywords: ['events', 'event', 'meetings', 'occasion', 'assemblies', 'dances', 'calendar'],
      answer: 'The Events page has everything currently scheduled. I can take you there!',
      actions: [
        { label: 'View all events', path: '/events', primary: true }
      ]
    },
    {
      title: 'About',
      keywords: ['about', 'student council', 'council'],
      answer: 'The About page explains what the Student Council does and how it helps the school community.',
      actions: [
        { label: 'About Us', path: '/about', primary: true }
      ]
    },
    {
      title: 'Who made this?',
      keywords: ['who made this', 'made this', 'creator', 'developer'],
      answer: 'Omar made this.... of course... who else would have made this thing? 😭',
      actions: []
    },
    {
      title: 'Frequently Asked Questions',
      keywords: ['faq', 'frequently asked questions', 'how to vote', 'how do I vote', 'how to apply', 'how do I apply', 'what positions are there', 'positions', 'grade positions', 'what does council do', 'what do you do'],
      answer: 'The answers to all your questions! (or most of them)',
      actions: [
        { label: 'Go to FAQ', path: '/faq', primary: true },
        { label: 'Go to About', path: '/about' }
      ]
    },
    {
      title: 'Who am I?',
      keywords: ['who are you', 'your name', 'whats your name', 'what is your name', 'you are who', 'who you', 'whom are you'],
      answer: "I'm Basi, a bot. You ask questions and I answer them. I can navigate you to pages and use the latest information from this site.",
      actions: []
    }
  ],

  suggestions: [
    { label: 'Meet candidates', path: '/vote' },
    { label: 'See events', path: '/events' },
    { label: 'Show me around', tour: true }
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
    { selector: '.basi-button', title: 'Your little guide', text: 'Ask me questions about anything in the site!' },
    { selector: '.footer-bottom', title: 'The end!', text: 'Made by Omar!!!!!!!!! ok bye bye!' }
  ]
};

window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.bot = window.BASI_CONFIG;
