import { linkedInGenerated } from "./linkedin-generated";

const li = linkedInGenerated;

export const siteConfig = {
  name: "Iftekhar Ahmed Eather",
  shortName: "Iftekhar Eather",
  title: li.siteConfig.title,
  domain: "https://www.eatherahmed.com",
  email: "eather.ahmed@gmail.com",
  location: li.siteConfig.location,
  linkedin: "https://www.linkedin.com/in/iftekhareather/",
  github: "https://github.com/eather009",
  twitter: "https://twitter.com/IftekharEather",
  tagline: li.siteConfig.tagline,
  summary: li.siteConfig.summary,
};

export const focusAreas = [...li.focusAreas];

export const stats = li.stats.map((s) => ({ label: s.label, value: s.value }));

export const certifications = [
  {
    name: "Certified Scrum Product Owner (CSPO)",
    issuer: "Scrum Alliance",
    year: "2022",
    url: "https://bcert.me/slvcakygx",
  },
  {
    name: "Advanced Certified Scrum Developer (A-CSD)",
    issuer: "Scrum Alliance",
    year: "2020",
    url: "https://bcert.me/slqkejwon",
  },
  {
    name: "Certified Scrum Developer (CSD)",
    issuer: "Scrum Alliance",
    year: "2020",
    url: "https://bcert.me/sepovspyp",
  },
  {
    name: "Certified ScrumMaster (CSM)",
    issuer: "Scrum Alliance",
    year: "2020",
    url: "https://bcert.me/sinexfffz",
  },
];

export const skills = li.skills.map((group) => ({
  category: group.category,
  items: [...group.items],
}));

export const experience = [
  {
    company: "Export Japan Inc.",
    role: "Team Lead/Manager",
    period: "Jul 2023 – Present",
    location: "Tokyo, Japan",
    url: "https://www.linkedin.com/company/export-japan-inc-/",
    highlights: [
      "Lead cross-functional Scrum teams (~10 engineers, designers, QA, and stakeholders) delivering enterprise SaaS, AI, and multilingual tourism platforms.",
      "Drive project scoping, budget estimation, and delivery for enterprise SaaS, AI, and multilingual tourism platforms.",
      "Design secure, scalable architectures across AWS and Alibaba Cloud (dev, staging, production).",
      "Facilitate agile ceremonies; conduct code reviews; mentor system engineers and developers.",
      "Contribute backend architecture, API development, and system integration for high-traffic applications.",
    ],
  },
  {
    company: "Export Japan Inc.",
    role: "System Engineer",
    period: "Feb 2019 – Present",
    location: "Tokyo, Japan",
    url: "https://www.linkedin.com/company/export-japan-inc-/",
    highlights: [
      "Led architecture for high-traffic platforms including Toyox, Nikon, and Tokyo SME.",
      "Designed cloud infrastructure on AWS and Aliyun; built monitoring and reporting (BIMAN V1).",
      "Introduced agile workflow practices that improved delivery efficiency and cross-functional collaboration.",
    ],
  },
  {
    company: "Tappware Solutions Limited",
    role: "Project Manager, R&D Department",
    period: "Sep 2015 – Jan 2019",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Led government and international projects for A2I, Ministry of Finance, and e-learning initiatives.",
      "Managed Scrum delivery for major e-governance programs including D-Nothi / E-File, SEIP, TMS, SCS, HSS, PHR, Finman, and Niyog.",
      "Oversaw system design, technical planning, and developer mentoring for Bangladesh Government clients.",
    ],
  },
  {
    company: "Divine IT Limited",
    role: "Senior Software Engineer",
    period: "Aug 2012 – Aug 2015",
    location: "Dhaka, Bangladesh",
    url: "https://www.linkedin.com/company/divineitlimited",
    highlights: [
      "Core developer on enterprise products: Core4VoIP Billing, Core4Switch, and AccounticaXL.",
      "Built scalable backend systems with PHP, jQuery, and MySQL; optimized large-scale CDR processing.",
      "Contributed to CakePHP 3.5.0 as an official open-source contributor.",
    ],
  },
  {
    company: "Freelance / Self-employed",
    role: "Software Developer",
    period: "Jan 2010 – Jul 2012",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Delivered e-commerce, mess management, and campus social platforms end-to-end with PHP and MySQL.",
      "Supported Controller of Examinations software for BUBT.",
    ],
  },
];

export const projects = [
  {
    name: "EXJ AI Chatbot",
    description:
      "AI-powered customer support SaaS for Export Japan Inc. Indexes website content into a vector database and answers visitor questions with RAG: multi-language Q&A, embeddable widget, usage analytics, and secure origin validation. Built with FastAPI and Docker.",
    tags: ["RAG", "Vector DB", "FastAPI", "Docker", "Python", "SaaS", "AI"],
    url: "https://chatbot.export-japan.com/",
  },
  {
    name: "DonateSync Community Hub",
    description:
      "Multi-tenant SaaS for nonprofits, clubs, and member organizations: memberships, donations and dues, event RSVPs, OCR receipt workflows, email and in-app notifications, and an optional member portal with financial transparency.",
    tags: ["SaaS", "Multi-tenant", "OCR", "Member Portal", "Architecture"],
    url: "https://donatesync.com/",
  },
  {
    name: "BINGO",
    description:
      "Real-time multiplayer bingo for parties and events. Hosts share a QR code or link; up to 200 players join from any browser with live WebSocket sync, auto winner detection, and host controls. No app download required.",
    tags: ["WebSockets", "Real-time", "Node.js", "SaaS", "Multiplayer"],
    url: "https://bingo.eatherahmed.com/",
  },
  {
    name: "D-Nothi / E-File & Government Platforms",
    description:
      "Nationwide digital filing platform (D-Nothi; v1 as E-File) for a2i / ICT Division, plus related Bangladesh Government e-governance and e-learning programs including SEIP, TMS, and Finman. Secure, transparent document workflows at national scale (17K+ govt. offices, 2.5 lac+ users, 300M+ decisions).",
    tags: ["E-Governance", "Project Management", "Agile", "A2I", "Scrum"],
    url: "https://portal.nothi.gov.bd/Highlights.html",
  },
  {
    name: "Core4VoIP & AccounticaXL",
    description:
      "Enterprise billing and accounting platforms with performance-optimized backend architecture and reliable financial workflows.",
    tags: ["PHP", "MySQL", "Enterprise"],
    url: "https://www.linkedin.com/company/divineitlimited",
  },
  {
    name: "Tourism & Travel Platforms",
    description:
      "Large-scale digital platforms for international tourism clients at Export Japan Inc., including multilingual content systems and high-traffic web applications on AWS and Alibaba Cloud.",
    tags: ["Engineering Manager", "AWS", "Alibaba Cloud", "Agile"],
    url: "https://www.linkedin.com/company/export-japan-inc-/",
  },
  {
    name: "E-Learning & HR Systems",
    description:
      "National e-learning and human resource management systems delivered for government and enterprise clients under agile project management.",
    tags: ["Scrum", "PHP", "Government"],
    url: "https://www.linkedin.com/in/iftekhareather/",
  },
];

export const featuredProjectNames = [
  "D-Nothi / E-File & Government Platforms",
  "EXJ AI Chatbot",
  "DonateSync Community Hub",
  "Tourism & Travel Platforms",
];

export const featuredProjects = featuredProjectNames
  .map((name) => projects.find((project) => project.name === name))
  .filter((project): project is (typeof projects)[number] => project !== undefined);

export const recommendations = li.recommendations.map((rec) => ({
  name: rec.name,
  title: rec.title,
  quote: rec.quote,
  linkedin: rec.linkedin,
}));

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
