// Add or edit routes here. The key becomes the URL path: /apply, /vote, /events, etc.
// `anchor` is the internal page target. The browser URL stays clean (e.g. /apply).
window.SITE_CONFIG = {
  schoolName: "Bayside Acadmeny",
  tagline: "Student Council",
  branding: {
    logo: "./assets/favicon.ico",
    logoAlt: "Campus Council logo",
    fallbackMark: "BA"
  },
  googleForms: {
    enabled: true,
    apply: {
      mode: "embed",
      formUrl: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform",
      embedUrl: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true",
      buttonLabel: "Open application form ↗"
    },
    vote: {
      mode: "embed",
      formUrl: "https://docs.google.com/forms/d/e/YOUR_VOTE_FORM_ID/viewform",
      embedUrl: "https://docs.google.com/forms/d/e/YOUR_VOTE_FORM_ID/viewform?embedded=true",
      buttonLabel: "Open official ballot ↗"
    }
  },
  routes: [
    { path: "/", anchor: "home", label: "Home", nav: true, page: "home" },
    { path: "/v", anchor: "vote", label: "Vote", nav: true, page: "vote" },
    { path: "/a", anchor: "apply", label: "Apply", nav: true, page: "apply" },
    { path: "/e", anchor: "events", label: "Events", nav: true, page: "events" },
    { path: "/abt", anchor: "about", label: "About", nav: true, page: "about" },
    { path: "/faq", anchor: "faq", label: "FAQ", nav: false, page: "faq" }
  ],
  hero: {
    eyebrow: "Your school. Your voice.",
    title: "Make campus better,\none idea at a time.",
    body: "Student Council is where ideas become action. Vote in elections, apply for a role, and help shape what happens on campus.",
    primaryRoute: "/v",
    secondaryRoute: "/a"
  },
  stats: [
    ["idk how many", "students represented"],
    ["idk", "student-led initiatives"],
    ["lets just say 100%", "student voice"]
  ],
  election: {
    title: "2026–27 Student Council Election",
    deadline: "No idea, mock: Friday, September 18 · 4:00 PM",
    candidates: [
      { id: "maya-chen", name: "Maya Chen", role: "President", grade: "11th", statement: "I want a council that listens first and follows through." },
      { id: "jordan-lee", name: "Jordan Lee", role: "President", grade: "12th", statement: "More events, clearer communication, and a campus that feels connected." },
      { id: "samira-patel", name: "Samira Patel", role: "President", grade: "11th", statement: "Let’s turn student ideas into visible, measurable improvements." }
    ]
  },
  events: [
    { date: "SEP 05", title: "Welcome Back Assembly", time: "10:15 AM", place: "Main Hall", tag: "Campus" },
    { date: "SEP 11", title: "Clubs Fair", time: "3:30 PM", place: "Quad", tag: "Community" },
    { date: "SEP 18", title: "Election Day", time: "All day", place: "Online", tag: "Elections" },
    { date: "SEP 24", title: "Open Council Meeting", time: "4:00 PM", place: "Room 204", tag: "Council" }
  ],
  committees: [
    { title: "Student Life", body: "Improves campus culture, spirit, inclusion, and everyday experience or whatever blah blah blahhhh.", icon: "✦" },
    { title: "Events", body: "Plan assemblies, fundraisers, and the moments students and staff remember.", icon: "🗓️" },
    { title: "Advocacy", body: "Brings student feedback to administration and turns concerns into proposals and new ideas.", icon: "↗" }
  ],
  application: {
    title: "Apply to Student Council",
    intro: "You don't need to have everything figured out (actually, you kinda do!!!! so chop chop, make up your mind...). Tell us what you care about and where you'd like to help.",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "grade", label: "Grade", type: "select", required: true, options: ["9th", "10th", "11th", "12th"] },
      { name: "email", label: "School email", type: "email", required: true },
      { name: "role", label: "Role or area", type: "select", required: true, options: ["Executive Council", "Committee Member", "Events", "Advocacy", "Student Life", "Open to anything"] },
      { name: "why", label: "Why do you want to join?", type: "textarea", required: true },
      { name: "idea", label: "One thing you'd improve on campus", type: "textarea", required: true }
    ]
  }
};
