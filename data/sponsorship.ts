export const SPONSORSHIP_HERO = {
  badge: "Sponsorship Proposal 2026",
  title: "AI Sparks 2026",
  subtitle: "Partner with CodeNeuraX",
  dates: "7th & 8th August 2026",
  venue: "Marwadi University, Rajkot",
}

export const FEATURED_EVENTS = [
  {
    title: "Career Advice By IITIAN (2nd Year + GATE)",
    description:
      "Sonu shares his roadmap—how he cracked GATE, explored AI & ML, built impactful projects, and landed a prestigious role.",
    image: "/images/Sonu yadav Poster.webp",
  },
  {
    title: "Data Science & AI Roadmap",
    description:
      "From Resume to Research: a step-by-step guide to crafting your career in Data Science & AI with Abhinav Kumar, Data Scientist at LTIMindtree.",
    image: "/images/Abhinav Kumar - CodeNeuraX - 11 - Final.webp",
  },
  {
    title: "From Tier-3 to Flipkart",
    description:
      "An inspiring session with Mansi Somani, Software Developer at Flipkart, sharing her journey from a Tier-3 college to a top product-based company.",
    image: "/images/Mansi Somani - 1.webp",
  },
  {
    title: "A Journey into Data Science",
    description:
      "Career-focused session featuring Nivedita Gupta, Data Scientist at Flipkart—roadmap, skills, and real-world applications.",
    image: "/images/7.png",
  },
  {
    title: "Crack Amazon Internship in 2nd & 3rd Year",
    description:
      "Practical insights and strategies for landing top product-based internships early in your degree.",
    image: "/images/6.jpg",
  },
  {
    title: "Journey to Microsoft & Google Internships",
    description:
      "Real-world journeys from Divanshi Jain and Parth Thakrar—strategies and roadmaps from students who made it to top tech companies.",
    image: "/images/CodeNeuraX (1080 x 1080 px) - Parth.png",
  },
  {
    title: "How to Win Smart India Hackathon 2025",
    description:
      "Expert guidance on problem selection, pitch decks, and what judges look for in SIH.",
    image: "/images/Arkja Gaur - SIH Winner 2024.webp",
  },
  {
    title: "Crack the Google Interview",
    description:
      "Divanshi Jain shares DSA roadmap, interview strategy, resume building, and preparation for top product companies.",
    image: "/images/8.png",
  },
]

export const AI_SPARK_OVERVIEW = {
  description:
    "AI Sparks 2026 is a two-day technology event taking place on 7th and 8th August 2026, bringing together students, developers, and technology enthusiasts for an immersive learning experience. The event will feature expert-led hands-on workshops, practical training sessions, and insights from industry professionals, enabling participants to explore emerging technologies and develop industry-relevant skills.",
  value:
    "With a strong student community reach and extensive promotional outreach, AI Sparks 2026 provides organizations with a valuable platform to enhance brand visibility, engage directly with future talent, and establish meaningful connections within the technology ecosystem.",
  image: "/images/A.png",
  highlights: [
    "Expert-led hands-on workshops",
    "2-day immersive experience",
    "4000+ student community reach",
    "Industry networking & talent engagement",
  ],
}

export type SponsorshipPerson = {
  name: string
  role: string
  department?: string
  image?: string
  tagline?: string
  highlights?: string[]
  linkedin?: string
  instagram?: string
}

export const AI_SPARK_SPEAKERS: SponsorshipPerson[] = [
  {
    name: "Dev Anand",
    role: "AI Sparks 2026 Speaker",
    image: "/images/speakers/dev-anand.jpeg",
    tagline: "200K+ Followers on Instagram (@heydevanand)",
    linkedin: "https://www.linkedin.com/in/dev-anand-81559017b/",
    instagram: "https://www.instagram.com/heydevanand/",
    highlights: [
      "Pre-Doctoral Researcher at IIT Bombay",
      "Works in AI, Large Language Models (LLMs), and Machine Learning",
      "Technology Educator & Content Creator in AI, ML, and Emerging Technologies",
      "Shares insights on AI, Software Development, Career Growth, and Technology Trends",
      "Creates educational content simplifying complex technical concepts for students and developers",
    ],
  },
  {
    name: "Parth Singh",
    role: "AI Sparks 2026 Speaker",
    image: "/images/speakers/parth-singh.jpeg",
    tagline: "Decision & AI Analyst at Accenture",
    linkedin: "https://www.linkedin.com/in/parth-singh-7866511a0/",
    highlights: [
      "Former Associate Data Scientist at Celebal Technologies",
      "Specialist in Agentic AI, Generative AI & Enterprise AI Systems",
      "Built and deployed production-grade AI solutions across finance, healthcare, and customer analytics",
      "Hands-on expertise with OpenAI, Azure AI, RAG Architectures, Semantic Kernel, and Cloud AI Platforms",
    ],
  },
  {
    name: "Varun Poladiya",
    role: "AI Sparks 2026 Speaker",
    image: "/images/speakers/varun-poladiya-headshot.jpg",
    tagline: "AI Marketer | Evangelist | Community Builder",
    linkedin: "https://www.linkedin.com/in/varun-poladiya/",
    highlights: [
      "Head of Marketing at Navan.AI",
      "AI & Agentic Engineering Evangelist",
      "Community Builder & Startup Ecosystem Contributor",
      "Specialist in Agentic AI and Gen AI ecosystems",
    ],
  },
  {
    name: "Akshay Ranpariya",
    role: "AI Sparks 2026 Speaker",
    image: "/images/speakers/akshay-ranpariya-headshot.jpg",
    tagline: "AI Expert | Researcher | Mentor",
    linkedin: "https://www.linkedin.com/in/akshay-ranpariya/",
    highlights: [
      "AI & Robotics Expert at Marwadi University",
      "Recognized as a LinkedIn Top Voice in Data Science",
      "Research-Driven Innovator & Mentor",
      "Published work in Deep Learning, Computer Vision, and AI applications",
    ],
  },
]

/** Past session speakers from top product companies */
export const SPEAKER_ALUMNI_COMPANIES = [
  { name: "Google", image: "/images/logos/google.svg" },
  { name: "Amazon", image: "/images/logos/amazon.svg" },
  { name: "Microsoft", image: "/images/logos/microsoft.svg" },
  { name: "Flipkart", image: "/images/logos/flipkart2.svg" },
]

export const VISIBILITY_OPPORTUNITIES = [
  "University-wide promotions",
  "Social media marketing",
  "WhatsApp communities (4000+ students)",
  "Posters, banners, and standees",
  "Guest speaker promotion (200K+ followers)",
  "Sponsor logo placement according to sponsorship tier",
]

export const SPONSORSHIP_TIERS = [
  { id: "silver", name: "Silver", price: "₹10,000", accent: "from-slate-400 to-slate-600" },
  { id: "gold", name: "Gold", price: "₹20,000", accent: "from-amber-400 to-yellow-600" },
  { id: "platinum", name: "Platinum", price: "₹30,000", accent: "from-cyan-400 to-purple-500" },
] as const

export type TierId = (typeof SPONSORSHIP_TIERS)[number]["id"]

export const BRANDING_BENEFITS: { label: string; silver: boolean | string; gold: boolean | string; platinum: boolean | string }[] = [
  { label: "Logo on Event Brochure", silver: true, gold: true, platinum: true },
  { label: "Logo on Event Website / Registration Page", silver: true, gold: true, platinum: true },
  { label: "Social Media Promotion", silver: true, gold: true, platinum: true },
  { label: "Logo on Event Posters & Creatives", silver: true, gold: "Priority Placement", platinum: "Premium Placement" },
  { label: "Logo on Event Banners & Standees", silver: true, gold: "Priority Placement", platinum: "Premium Placement" },
  { label: "Logo on Participant Certificates", silver: "—", gold: true, platinum: true },
  { label: "Co-Powered By Recognition", silver: "—", gold: "—", platinum: true },
  { label: "Exclusive Stage Branding", silver: "—", gold: "—", platinum: true },
  { label: "Thank You Recognition & Memento", silver: true, gold: true, platinum: true },
]

export const ENGAGEMENT_BENEFITS: { label: string; silver: boolean | string; gold: boolean | string; platinum: boolean | string }[] = [
  { label: "WhatsApp Community Promotion (3500+ Students)", silver: true, gold: true, platinum: true },
  { label: "Event-Day Sponsor Mention", silver: true, gold: true, platinum: true },
  { label: "Standee Placement at Venue", silver: "1 Standee", gold: "2 Standees", platinum: "3 Standees" },
  { label: "Product/Flyer Distribution", silver: "—", gold: true, platinum: true },
  { label: "Opportunity to Address Participants During Event", silver: "—", gold: "2 Minutes", platinum: "5 Minutes" },
]

export const COMMUNITY_PARTNERS = [
  { name: "Marwadi University Rajkot", image: "/images/Marwadi university.png" },
  { name: "DataXEscape-2K26", image: "/images/1.png" },
  { name: "PEC Hacks", image: "/images/pec.png" },
  { name: "InnovXus", image: "/images/CodeNeuraX.webp" },
  { name: "Intellify", image: "/images/intellify.png" },
  { name: "Paranox 2.0", image: "/images/paranox2.png" },
  { name: "HackInverse", image: "/images/CodeNeuraX.webp" },
  { name: "DUHacks", image: "/images/CodeNeuraX.webp" },
  { name: "TechxNinjas", image: "/images/techxninja.jpg" },
]

export type TeamMember = { name: string; role: string }

export const TEAM_GROUPS: { title: string; members: TeamMember[] }[] = [
  {
    title: "Leadership",
    members: [
      { name: "Dinesh Yadav", role: "Founder" },
      { name: "Rayan Ishani", role: "Convener" },
    ],
  },
  {
    title: "Event Management & Coordination",
    members: [
      { name: "Yashrajsinh Jadeja", role: "Event Organiser Head" },
      { name: "Dev Tanna", role: "Co Event Organiser" },
      { name: "Jay Kaneriya", role: "Event Organising Team" },
    ],
  },
  {
    title: "Technical & Development Team",
    members: [
      { name: "Jayrajsinh Gohil", role: "Technical Lead" },
      { name: "Meet Parsana", role: "Technical Team Member" },
      { name: "Bhakti Gajera", role: "Technical Team Member" },
      { name: "Hetshree Vyas", role: "AI/ML Lead" },
      { name: "Manvendra Kumar", role: "Web Development Lead" },
      { name: "Suman Mandal", role: "Cyber Security Lead" },
    ],
  },
  {
    title: "Sponsorship & Partnerships",
    members: [
      { name: "Vinayak Shrivastava", role: "Sponsorship & Management Lead" },
      { name: "Ashwanth Babburi", role: "Sponsorship & Partnership Team" },
    ],
  },
  {
    title: "Creative & Media Team",
    members: [
      { name: "Hirali Bharadia", role: "Design Lead" },
      { name: "Divya Thakur", role: "Video Editor Lead" },
      { name: "Jashwant Buddaraju", role: "Social Media Manager" },
    ],
  },
  {
    title: "Operations & Community",
    members: [
      { name: "Ajin Aji", role: "Logistics & Campus Manager Lead" },
      { name: "Samreet Kaur", role: "Community Manager" },
    ],
  },
]

export const SPONSORSHIP_CONTACTS = [
  {
    name: "Yashrajsinh Jadeja",
    role: "Event Organizer Head",
    phone: "+91 7698987650",
    email: "Yashrajjadeja765@gmail.com",
  },
  {
    name: "Madhav Joshi",
    role: "Event Coordinator",
    phone: "+91 78028 37538",
    email: "madhav.joshi7373@gmail.com",
  },
]

export const SPONSORSHIP_EMAIL = "codeneurax@gmail.com"
