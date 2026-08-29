/*
 * CONTENT + ROUTES
 *
 * Add normal informational pages inside `pages`, then add a route with
 * page: 'content'. No HTML is needed in app.js.
 *
 * LIVE BANNER
 * Change only `banner` to publish an announcement. Browsers check this
 * file every 15 seconds and update the banner without refreshing the page.
 */
window.SITE_CONFIG = {
  schoolName: 'Bayside Academy',
  tagline: 'Student Council',
  branding: { logo: './assets/favicon.ico', logoAlt: 'Bayside Academy logo', fallbackMark: 'BA' },

  banner: {
    enabled: true,
    tone: 'default',
    eyebrow: '00af35d',
    title: 'READ ME, NOW! New update, terms, and candidates!',
    message: `New Update, 00af35d Changelog`,
    dismissible: false,
    actions: [
      // { label: 'Learn more', href: '/events', style: 'primary' }
    ],
    expandable: {
      enabled: true,
      label: 'About 00af35d',
      eyebrow: 'new update!',
      title: 'Whats New?',
      body: 'Lots of new stuff in this one update. Check it out!',
      sections: [
        { title: 'Updated Pages', body: 'Updates to all the main pages, being these:', items: [
            'Home - Mainly just a dashboard',
            'Voting - A place to vote!',
            'Apply - A place to apply',
            'Terms - All those fancy rules with the fancy words... do you understand any of them? Bet you do.',
            'Events - Currently everything there is fake, but I find it to be useful later on.',
            'About - Everything about the council!'
          ] },
        { title: 'Terms', body: 'Terms have been updated! By using this site, you acknowledge you have read the terms and abide by them. If you did not read them, go do it NOW.' },
        { title: `Candidates`, body: `Are you wanting to apply? Read the Terms to understand all of the guidelines, and hit that apply button to apply! For both buttons, scroll down! As more candidates apply, you'll start seeing them in the vote section. Or just on the home page. Your pick. However, the vote section does have every single applied candidate. Just saying. No stress. I'll stop here I'm getting carried away.`},
        { title: `Voting & Applying`, body: `You have two choices: Either apply on this website (way easier) or open it in a new tab via the provided button on the page. You won't be able to vote yet, but you can apply right now for the council. Scroll down & click the apply button! Be sure to read the terms as well.`},
        { title: `Events`, body: `With the start of the Student Council, there will be a CRAZY amount of actually somewhat fun events. Use the events page to save it all! You'll be the first one to know, this is for the best.` },
        { title: `Voting`, body: `As said above, be sure to check the events page to know when the voting is open & applications are closed. PLEASE don't miss the deadlines!`},
        { title: `Commit 00af35d`, body: `Commit 00af35d brings lots of new changes to BASC (news flash, this is the original name of this page....).`, items: [`New banner with automatic refreshing, so you don't need to refresh your page for the latest data. Refetches every 15 seconds so you won't miss anything`, `New Registered SW for routing & 404s`, `TLS Certificate & HTTPS Encryption for secure data!`, `Fixed a bug where the events page would always return a 404 for whatever reason`, `Fixed a bug where some buttons would successfully redirect and others wouldn't altho they have the same target.....`, `Fixed a bug where some redirects on certain elements wouldn't want to work just because....`]}
      ],
      actions: [
        { label: 'Terms & Conditions', href: '/terms', style: 'primary' },
        { label: `Home`, href: `/home`, style: `primary`}
      ]
    }
  },

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
        { title: 'Using this site', body: "This website is provided for Bayside Academy's student council information, applications, elections, events, and related school communications. Please use it respectfully and only for its intended purposes. The site aims to be useful, clear, and up-to-date. However, any date, timing, etc may be changed without notice. Some of the events covered on here will be the following:", items: ['Current election and candidate information when available.', 'Student council voting & applications', 'Links to forms and school resources'], emphasis: 'accent' },
        { title: 'Accuracy & official information', body: 'We work to keep information accurate, but schedules, forms, candidates, and other details can change. Official school communications take priority when there is a conflict.', note: 'If something on this site disagrees with an official school announcement, follow the official announcement.' },
        { title: 'External services', body: 'Some features may use third-party services. We are not responsible for third-parties and they have their own terms that you must follow.', emphasis: 'note' },
        { title: 'User submissions', body: 'When you submit information through an official form, provide accurate information, and do not submit content that is:', items: ['unlawful', 'harmful', 'abusive', 'harassing', 'intended to disrupt'] },
        { title: 'Elections', body: "Yearly, the student council holds elections to decide who will be on the council. All candidates are expected to maintain a high standard of behavior and serve as positive role models for the student body. During elections, any of these actions are prohibited and will result in consequences up to the school's administrative team, plus removal from the election:", items: ['Bribing others with money, candy, stickers, or any other item', 'Teaming against candidates', 'Pulling down, removing, griefing, or sabotaging anyone else’s posters or other election items', 'Convincing anyone to vote for you', 'Convincing someone with a vote to change theirs', 'Handing out political literature, including flyers, posters, and banners if you are not a candidate', 'Wearing political apparel, if prohibited by the election rules', 'Tampering with election forms in any way', 'Using proxies, bots, or other services to vote multiple times', 'Hyper-competitivity during elections', 'Any harassment or threats related to the elections, before, during, or after the elections'] },
        { title: 'Changes to these terms', body: 'These terms may be updated when the site or its services change. The current version will always be posted on this page.' }
      ]
    }
  },

  stats: [['Student-led', 'initiatives'], ['Open', 'student voice'], ['One', 'school community']],
  election: { title: '2026–27 Student Council Election', deadline: 'Friday, September 18 · 4:00 PM', candidates: [
    { id: 'maya-chen', name: 'Maya Chen', role: 'President', grade: '11th', statement: 'I want a council that listens first and follows through.' },
    { id: 'jordan-lee', name: 'Jordan Lee', role: 'President', grade: '12th', statement: 'More events, clearer communication, and a campus that feels connected.' },
    { id: 'samira-patel', name: 'Samira Patel', role: 'President', grade: '11th', statement: 'Let’s turn student ideas into visible, measurable improvements.' }
  ] },
  events: [
    { date: 'SEP 05', title: 'Welcome Back Assembly', time: '10:15 AM', place: 'Main Hall', tag: 'Campus' },
    { date: 'SEP 11', title: 'Clubs Fair', time: '3:30 PM', place: 'Quad', tag: 'Community' },
    { date: 'SEP 18', title: 'Election Day', time: 'All day', place: 'Online', tag: 'Elections' },
    { date: 'SEP 24', title: 'Open Council Meeting', time: '4:00 PM', place: 'Room 204', tag: 'Council' }
  ],
  committees: [
    { title: 'Student Life', body: 'Improve campus culture, spirit, inclusion, and the everyday student experience.', icon: '✦' },
    { title: 'Events', body: 'Plan assemblies, fundraisers, and the moments students remember.', icon: '🗓️' },
    { title: 'Advocacy', body: 'Bring student feedback to administration and turn concerns into useful proposals.', icon: '↗' }
  ],
  application: { title: 'Apply to Student Council', intro: 'Tell us what you care about and where you would like to help.' },
  faq: [
    ['How do I vote?', 'Open the Vote page, review the candidates, and complete the official ballot.'],
    ['How do I apply?', 'Open Apply and use the official application form.'],
    ['What positions are there?', 'Available positions are listed in the application form.'],
    ['What does council do?', 'Council organizes student activities, represents student feedback, and works on projects that improve campus life. We manage most fun stuff at school.']
  ]
};
