/*
 * CONTENT + ROUTES
 *
 * New informational page:
 *   1. Add a page object inside `pages`.
 *   2. Add one route with `page: 'content'` and `content: 'yourPageId'`.
 *
 * Content pages support: eyebrow, title, body, updated, showContents,
 * and sections with title, body, items, note, and emphasis ('note'|'accent').
 * No HTML is needed.
 */
window.SITE_CONFIG = {
  schoolName: 'Bayside Academy',
  tagline: 'Student Council',
  branding: { logo: './assets/favicon.ico', logoAlt: 'Bayside Academy logo', fallbackMark: 'BA' },
  googleForms: {
    enabled: true,
    apply: { mode: 'embed', formUrl: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform', embedUrl: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true', buttonLabel: 'Open application form' },
    vote: { mode: 'embed', formUrl: 'https://docs.google.com/forms/d/e/YOUR_VOTE_FORM_ID/viewform', embedUrl: 'https://docs.google.com/forms/d/e/YOUR_VOTE_FORM_ID/viewform?embedded=true', buttonLabel: 'Open official ballot' }
  },
  routes: [
    { path: '/', label: 'Home', nav: true, page: 'home' },
    { path: '/vote', label: 'Vote', nav: true, page: 'vote' },
    { path: '/apply', label: 'Apply', nav: true, page: 'apply' },
    { path: '/events', label: 'Events', nav: true, page: 'events' },
    { path: '/about', label: 'About', nav: true, page: 'about' },
    { path: '/faq', label: 'FAQ', nav: false, page: 'faq' },
    { path: '/terms', label: 'Terms & Conditions', nav: false, page: 'content', content: 'terms' }
  ],
  pages: {
    home: { eyebrow: 'Your school. Your voice.', title: 'Make campus better, one idea at a time.', body: 'Student Council is where ideas become action. Vote in elections, apply for a role, and help shape what happens on campus.' },
    vote: { eyebrow: 'Election 2026–27', title: 'Cast your vote.', body: 'Meet the candidates, then use the official school ballot to make your voice count.' },
    apply: { eyebrow: 'Get involved', title: 'Bring an idea. Make an impact.', body: 'Tell us what you care about and where you would like to help. You do not need experience to get involved.' },
    events: { eyebrow: 'Calendar', title: "What's happening on campus.", body: 'Meet people, join in, and show up for the parts of school you want to shape.' },
    about: { eyebrow: 'About council', title: 'A student voice with a real seat at the table.', body: 'Student Council connects student ideas with real school decisions through events, advocacy, and student-led projects.' },
    faq: { eyebrow: 'Help', title: 'Frequently asked questions.' },
    terms: {
      type: 'content', eyebrow: 'Legal', title: 'Terms & Conditions',
      body: 'A simple guide to using the Bayside Academy Student Council website.',
      updated: 'Last updated · August 28, 2026', showContents: true,
      sections: [
        { title: 'Using this site', body: 'This website is provided for student council information, applications, elections, events, and related school communications. Please use it respectfully and only for its intended purposes.', emphasis: 'accent' },
        { title: 'What you can expect', body: 'We aim to keep the site useful, clear, and current. Some information can change as school plans change.', items: ['Current election and candidate information when available.', 'Event information intended to help students participate.', 'Links to official forms and school resources.'] },
        { title: 'Accuracy & official information', body: 'We work to keep information accurate, but schedules, forms, candidates, and other details can change. Official school communications take priority when there is a conflict.', note: 'If something on this site disagrees with an official school announcement, follow the official announcement.' },
        { title: 'External services', body: 'Some features may use third-party services such as Google Forms. Those services may have their own terms, privacy practices, and availability.', emphasis: 'note' },
        { title: 'User submissions', body: 'When you submit information through an official form, provide accurate information and do not submit content that is unlawful, harmful, abusive, or intended to disrupt the service.' },
        { title: 'Changes to these terms', body: 'These terms may be updated when the site or its services change. The current version will always be posted on this page.' }
      ]
    }
  },
  stats: [['Student-led', 'initiatives'], ['Open', 'student voice'], ['One', 'school community']],
  election: {
    title: '2026–27 Student Council Election', deadline: 'Friday, September 18 · 4:00 PM',
    candidates: [
      { id: 'maya-chen', name: 'Maya Chen', role: 'President', grade: '11th', statement: 'I want a council that listens first and follows through.' },
      { id: 'jordan-lee', name: 'Jordan Lee', role: 'President', grade: '12th', statement: 'More events, clearer communication, and a campus that feels connected.' },
      { id: 'samira-patel', name: 'Samira Patel', role: 'President', grade: '11th', statement: 'Let’s turn student ideas into visible, measurable improvements.' }
    ]
  },
  events: [
    { date: 'SEP 05', title: 'Welcome Back Assembly', time: '10:15 AM', place: 'Main Hall', tag: 'Campus' },
    { date: 'SEP 11', title: 'Clubs Fair', time: '3:30 PM', place: 'Quad', tag: 'Community' },
    { date: 'SEP 18', title: 'Election Day', time: 'All day', place: 'Online', tag: 'Elections' },
    { date: 'SEP 24', title: 'Open Council Meeting', time: '4:00 PM', place: 'Room 204', tag: 'Council' }
  ],
  committees: [
    { title: 'Student Life', body: 'Improve campus culture, spirit, inclusion, and the everyday student experience.', icon: '✦' },
    { title: 'Events', body: 'Plan assemblies, fundraisers, and the moments students remember.', icon: '◫' },
    { title: 'Advocacy', body: 'Bring student feedback to administration and turn concerns into useful proposals.', icon: '↗' }
  ],
  application: { title: 'Apply to Student Council', intro: 'Tell us what you care about and where you would like to help.' },
  faq: [
    ['How do I vote?', 'Open the Vote page, review the candidates, and complete the official ballot.'],
    ['How do I apply?', 'Open Apply and use the official application form.'],
    ['What positions are there?', 'Available positions are listed in the official application and election materials.'],
    ['What does council do?', 'Council organizes student activities, represents student feedback, and works on projects that improve campus life.']
  ]
};
