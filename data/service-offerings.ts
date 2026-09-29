import type { LucideIcon } from "lucide-react"
import { Bot, Code2, Cloud, ScanEye, TrendingUp, Palette } from "lucide-react"

export type ServiceIconName =
  | "bot"
  | "code2"
  | "cloud"
  | "scanEye"
  | "trendingUp"
  | "palette"

export interface ServiceOffering {
  slug: string
  title: string
  /** Single short line on the /services grid */
  summary: string
  /** Sections shown on the detail page */
  body: string[]
  highlights: string[]
  accent: string
  iconClass: string
  iconName: ServiceIconName
}

export const SERVICE_ICON_MAP: Record<ServiceIconName, LucideIcon> = {
  bot: Bot,
  code2: Code2,
  cloud: Cloud,
  scanEye: ScanEye,
  trendingUp: TrendingUp,
  palette: Palette,
}

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    slug: "ai-and-automation",
    title: "AI and automation",
    summary:
      "Smarter predictions, chatbots, and less manual work using ML and automation.",
    body: [
      "Many teams know they should use AI, but stall on where to start. We focus on practical wins: models and rules that plug into tools you already use, so people see value quickly without a full platform rebuild.",
      "That can mean forecasting, document triage, customer self-service bots, or automating repeat steps in CRM and ops. We keep scope clear, measure before and after, and hand off runbooks so your team can own what ships.",
      "If you only need advice or a phased roadmap first, we can do that too—then help you implement when you are ready.",
    ],
    highlights: [
      "ML and forecasting",
      "Chatbots & workflows",
      "Integration with existing tools",
      "ROI-focused pilots",
    ],
    accent: "from-cyan-500/20 to-blue-500/10",
    iconClass: "text-cyan-400",
    iconName: "bot",
  },
  {
    slug: "custom-apps-and-websites",
    title: "Custom apps and websites",
    summary:
      "Web and mobile apps and internal tools shaped around how your team actually works.",
    body: [
      "Off-the-shelf products often force you to change process. We build software around your workflows—customer portals, admin dashboards, mobile companions, and internal line-of-business apps—with maintainable code and sensible architecture.",
      "You get clear milestones, regular demos, and documentation so future developers are not starting from zero. Security, accessibility, and performance stay on the checklist from day one, not as an afterthought.",
      "Whether you are replacing spreadsheets, scaling a prototype, or launching a new product surface, we align engineering with your priorities and timeline.",
    ],
    highlights: [
      "Web & mobile apps",
      "Internal tools & dashboards",
      "APIs and integrations",
      "Maintainable delivery",
    ],
    accent: "from-blue-500/20 to-purple-500/10",
    iconClass: "text-blue-400",
    iconName: "code2",
  },
  {
    slug: "cloud-and-devops",
    title: "Cloud and DevOps",
    summary:
      "Cloud moves, reliable hosting, and deploy pipelines so releases stay smooth.",
    body: [
      "Moving to the cloud—or cleaning up a messy old migration—needs more than lifting VMs. We design accounts, networks, and access so teams can ship safely, with cost and compliance in view.",
      "DevOps for us means repeatable builds, tests, and deploys: less “works on my machine,” more confidence every release. We favour automation and observability so incidents are rare and fast to debug.",
      "We can work alongside your engineers or operate as the primary implementer, with knowledge transfer built into the project.",
    ],
    highlights: [
      "Cloud migration & architecture",
      "CI/CD and releases",
      "Monitoring & reliability",
      "Security baselines",
    ],
    accent: "from-purple-500/20 to-pink-500/10",
    iconClass: "text-purple-400",
    iconName: "cloud",
  },
  {
    slug: "computer-vision-and-new-tech",
    title: "Computer vision and new tech",
    summary:
      "Image and video understanding plus AR/VR, IoT, and blockchain when the project fits.",
    body: [
      "When your product needs to see—quality checks, document capture, safety monitoring—we design and train vision pipelines that fit real lighting, devices, and latency needs, not just demo accuracy.",
      "We also support adjacent “new tech” where it is justified: immersive experiences, connected hardware, or distributed ledgers when they solve a concrete problem rather than checklist buzzwords.",
      "Engagements usually start with a technical spike or proof of concept so you can validate feasibility before a large build.",
    ],
    highlights: [
      "Computer vision & video",
      "Edge & device integration",
      "AR/VR prototypes",
      "Practical emerging tech",
    ],
    accent: "from-emerald-500/20 to-cyan-500/10",
    iconClass: "text-emerald-400",
    iconName: "scanEye",
  },
  {
    slug: "digital-marketing",
    title: "Digital marketing",
    summary:
      "Social, ads, and content with clear goals and reports tied to leads and sales.",
    body: [
      "Marketing works best when channels, messaging, and measurement line up. We help define audiences and offers, then run structured experiments so you learn what actually converts—not just what gets clicks.",
      "Reporting stays simple: dashboards and summaries your leadership can understand, tied to leads, pipeline, or revenue where possible.",
      "We can plug into your existing agency or in-house team, or own execution end to end for focused campaigns.",
    ],
    highlights: [
      "Paid social & search",
      "Content & funnel alignment",
      "Experimentation",
      "Clear reporting",
    ],
    accent: "from-amber-500/20 to-orange-500/10",
    iconClass: "text-amber-400",
    iconName: "trendingUp",
  },
  {
    slug: "design-and-branding",
    title: "Design and branding",
    summary:
      "Logo, visual system, and interfaces so your product looks professional and feels easy.",
    body: [
      "Brand is more than a logo: it is tone, color, type, and patterns that repeat everywhere customers meet you. We define a compact system your team can extend without diluting the story.",
      "Product design focuses on clarity—fewer confusing flows, consistent components, and accessible contrast and sizing. Deliverables can include Figma libraries, specs for engineering, and content guidance.",
      "We often pair with engineering or marketing so the brand and UI are implemented faithfully on web and mobile.",
    ],
    highlights: [
      "Brand & visual identity",
      "UI/UX & design systems",
      "Design–dev handoff",
      "Accessible, consistent UI",
    ],
    accent: "from-pink-500/20 to-rose-500/10",
    iconClass: "text-pink-400",
    iconName: "palette",
  },
]

export function getServiceBySlug(slug: string): ServiceOffering | undefined {
  return SERVICE_OFFERINGS.find((s) => s.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return SERVICE_OFFERINGS.map((s) => s.slug)
}
