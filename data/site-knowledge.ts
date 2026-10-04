/**
 * Single source of truth for the public-site assistant. Update when pages change.
 * Retrieval scores this text against the user message and (optionally) sends it to an LLM.
 */
export type SiteKnowledgeChunk = {
  id: string
  title: string
  body: string
  /** Page or external URL to suggest */
  path?: string
  pathLabel?: string
  /** Extra terms for matching (lowercase) */
  tags: string[]
}

export const SITE_KNOWLEDGE_CHUNKS: SiteKnowledgeChunk[] = [
  {
    id: "overview",
    title: "What is CodeNeuraX?",
    body: `CodeNeuraX is a student-led tech community founded in 2025 by Dinesh Yadav. It connects computer science students and recent graduates. Tagline on the homepage: connect, inspire, and empower coders, developers, and innovators. The platform offers workshops, hackathons, research projects, industry partnerships, WhatsApp groups, events, learning content, internship support, and career guidance.`,
    path: "/",
    pathLabel: "Homepage",
    tags: [
      "codeneurax",
      "about",
      "community",
      "students",
      "who",
      "what",
      "intro",
      "mission",
    ],
  },
  {
    id: "stats",
    title: "Community size and activity",
    body: `The homepage highlights 4000+ active members, 2+ monthly events, and ongoing success stories. Another section mentions 50+ internship support and 20+ events per year. Numbers represent public marketing copy on the site.`,
    path: "/#about",
    pathLabel: "About section",
    tags: ["members", "how many", "size", "stats", "4000", "events", "internship"],
  },
  {
    id: "nav",
    title: "Main pages on this website",
    body: `The site header links to: Home (#home), About (#about), Events at /events, E-content library at /econtent, Work With Us at /work-with-us, Study at /study (requires sign-in), Services at /services, Contact (#contact). Use these routes to explore.`,
    tags: ["pages", "menu", "nav", "where", "routes", "sections", "url"],
  },
  {
    id: "whatsapp-main",
    title: "Main community WhatsApp",
    body: `Hero CTA "Join Our Community Now" uses this invite: primary main group for joining CodeNeuraX.`,
    path: "https://chat.whatsapp.com/KCycVh7WjLT3l9RiTItb7O",
    pathLabel: "Main WhatsApp invite",
    tags: ["whatsapp", "join", "community", "group", "chat", "invite", "main"],
  },
  {
    id: "feature-community",
    title: "Community Driven group",
    body: `Feature card "Community Driven": connect with like-minded students and professionals in an inclusive environment.`,
    path: "https://chat.whatsapp.com/KCycVh7WjLT3l9RiTItb7O",
    pathLabel: "Community WhatsApp",
    tags: ["community driven", "networking", "inclusive"],
  },
  {
    id: "feature-coding",
    title: "Coding Challenges group",
    body: `Feature card "Coding Challenges": weekly coding challenges to sharpen skills and prepare for interviews.`,
    path: "https://chat.whatsapp.com/KNMoq05gpmg2m5wMsqbRAa",
    pathLabel: "Coding challenges WhatsApp",
    tags: ["coding", "challenge", "dsa", "interview", "leetcode", "practice"],
  },
  {
    id: "feature-discussions",
    title: "Discussions & AMA group",
    body: `Feature card "Discussions": regular Ask Me Anything sessions with experienced industry professionals.`,
    path: "https://chat.whatsapp.com/GKCfjzZ80ooBdq3lJQu6xE",
    pathLabel: "Discussions WhatsApp",
    tags: ["ama", "discussion", "professionals", "qa", "sessions"],
  },
  {
    id: "feature-events",
    title: "Hackathons & Events group",
    body: `Feature card "Hackathons & Events": stay updated with hackathons and tech events worldwide.`,
    path: "https://chat.whatsapp.com/FKAngxCIAjq8QgjCwQIQJZ",
    pathLabel: "Events WhatsApp",
    tags: ["hackathon", "events", "workshop", "competition"],
  },
  {
    id: "feature-learning",
    title: "Learning Resources group",
    body: `Feature card "Learning Resources": curated tech news, insights, and learning materials for continuous growth.`,
    path: "https://chat.whatsapp.com/BbtjvzjJ4JJLK5SBmeGs7V",
    pathLabel: "Learning resources WhatsApp",
    tags: ["resources", "learning", "news", "study", "materials", "content"],
  },
  {
    id: "feature-career",
    title: "Career Opportunities group",
    body: `Feature card "Career Opportunities": access to internships and career guidance.`,
    path: "https://chat.whatsapp.com/HY3CoBGJjCVCWk9qZioP4E",
    pathLabel: "Careers WhatsApp",
    tags: ["career", "internship", "job", "placement", "opportunity"],
  },
  {
    id: "contact-main",
    title: "Contact & social links",
    body: `Contact section: email team@codeneurax.in for partnerships and inquiries. WhatsApp community link from contact cards: join the main community. LinkedIn company: linkedin.com/company/codeneurax. Instagram: @codeneurax. YouTube: @CodeNeuraX for tutorials and recordings.`,
    path: "/#contact",
    pathLabel: "Contact",
    tags: ["email", "contact", "reach", "linkedin", "instagram", "youtube", "social"],
  },
  {
    id: "contact-whatsapp-card",
    title: "Contact section WhatsApp",
    body: `One contact card links to the main community WhatsApp group for instant joining.`,
    path: "https://chat.whatsapp.com/LqYC0LCO02hGCRTMeQoFLQ",
    pathLabel: "Community WhatsApp (contact)",
    tags: ["whatsapp", "contact"],
  },
  {
    id: "events-page",
    title: "Events page",
    body: `Public events and webinars are listed at /events (titles, dates, registration when available). Example types: webinars, online workshops, career sessions. Users should open Events for the latest schedule and registration links.`,
    path: "/events",
    pathLabel: "Events",
    tags: ["events", "webinar", "register", "upcoming", "calendar", "luma"],
  },
  {
    id: "event-neuraknockout-2026",
    title: "CodeNeuraX : NeuraKnockout 2026 (Offline Web Dev Challenge)",
    body: `NeuraKnockout 2026 is an offline web development hackathon organized by CodeNeuraX and the Department of AI, ML & DS at Marwadi University on October 24, 2026 (9:00 AM - 4:00 PM). Problem statements release at 12:00 AM Midnight. Open to all college and university students. AI tools, frameworks, and dev resources are fully allowed. Prizes: 1st ₹2,100, 2nd ₹1,500, 3rd ₹1,100 + certificates for all. Registration deadline: 23 October 2026. Register at: https://unstop.com/hackathons/codeneurax-neuraknockout-2026-codeneurax-1765131`,
    path: "https://unstop.com/hackathons/codeneurax-neuraknockout-2026-codeneurax-1765131",
    pathLabel: "NeuraKnockout on Unstop",
    tags: ["neuraknockout", "hackathon", "web dev", "unstop", "competition", "marwadi", "challenge", "offline", "prize"],
  },
  {
    id: "econtent",
    title: "E-content library",
    body: `E-content at /econtent is the curated learning library for the community (resources, materials). Linked from the main navigation as "Econtent".`,
    path: "/econtent",
    pathLabel: "E-content",
    tags: ["econtent", "library", "resources", "books", "materials", "study"],
  },
  {
    id: "study",
    title: "Study section",
    body: `Path /study is the Study area; the site expects users to sign in (Supabase auth). If not logged in, users are redirected to sign in. Programming and academy-style content lives behind authentication.`,
    path: "/study",
    pathLabel: "Study",
    tags: ["study", "login", "sign in", "academy", "course", "authenticated"],
  },
  {
    id: "services",
    title: "Services (CodeNeuraX offerings)",
    body: `The /services page describes technology and creative services: AI and automation, custom apps and websites, cloud and DevOps, computer vision and new tech, digital marketing, design and branding. Each service has a detail page with more information. Enterprise-style positioning with consultation CTAs.`,
    path: "/services",
    pathLabel: "Services",
    tags: ["services", "business", "consulting", "agency", "hire", "project", "company"],
  },
  {
    id: "work-with-us",
    title: "Work With Us",
    body: `Work With Us page is at /work-with-us: view open positions such as Campus Ambassador or Convener of the Community, and apply to join.`,
    path: "/work-with-us",
    pathLabel: "Work With Us",
    tags: ["ambassador", "campus", "program", "leader", "volunteer"],
  },
  {
    id: "founder-team",
    title: "Founder and team",
    body: `Founder: Dinesh Yadav. The homepage Team CodeNeuraX section introduces the core team (founder, content manager, and other roles) with short bios and LinkedIn where provided. Mission section describes collective intelligence and peer support.`,
    path: "/#founder",
    pathLabel: "Team",
    tags: ["founder", "dinesh", "team", "who runs", "leaders"],
  },
  {
    id: "languages",
    title: "Programming languages",
    body: `The homepage showcases multiple programming languages with visuals (e.g. Python, JavaScript, Java, C++, Go, C) as part of the community identity — see the ProgrammingLanguages section on the home page.`,
    path: "/#home",
    pathLabel: "Home (languages strip)",
    tags: ["python", "javascript", "java", "cpp", "c++", "go", "languages", "coding"],
  },
  {
    id: "mission",
    title: "Mission",
    body: `Our Mission section (#about): growth through collective intelligence — exchange ideas, showcase work, seek mentorship, and support each other. Strong, supportive network for beginners and advanced projects alike.`,
    path: "/#about",
    pathLabel: "Mission",
    tags: ["mission", "values", "culture", "beliefs"],
  },
]
