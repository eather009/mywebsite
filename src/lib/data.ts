export const siteConfig = {
  name: "Iftekhar Ahmed Eather",
  shortName: "Eather Ahmed",
  title: "Senior System Engineer · SRE & Cloud · Technical Lead",
  domain: "https://eatherahmed.com",
  email: "eather.ahmed@gmail.com",
  location: "Saitama, Japan",
  linkedin: "https://www.linkedin.com/in/iftekhareather/",
  github: "https://github.com/eather009",
  twitter: "https://twitter.com/IftekharEather",
  tagline:
    "14+ years delivering scalable web platforms, leading engineering teams, and driving agile delivery for enterprise and tourism clients.",
  summary:
    "Senior System Engineer and Technical Lead with 14+ years building high-traffic platforms, practicing SRE on AWS and Alibaba Cloud, and shipping full-stack SaaS products with Laravel, Python, and Node.js — including RAG-based AI chatbots, community management hubs, and real-time multiplayer apps.",
};

export const stats = [
  { label: "Years Experience", value: "14+" },
  { label: "Teams Led", value: "10+" },
  { label: "Certifications", value: "4" },
  { label: "Projects Delivered", value: "20+" },
];

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

export const skills = [
  {
    category: "Technical Leadership",
    items: [
      "Technical Lead",
      "Team Leadership",
      "Agile / Scrum",
      "Project Management",
      "Stakeholder Management",
    ],
  },
  {
    category: "SRE & Cloud",
    items: [
      "Site Reliability Engineering",
      "Systems Engineering",
      "AWS",
      "Alibaba Cloud",
      "Linux",
      "CI/CD",
      "System Architecture",
    ],
  },
  {
    category: "Full-Stack Development",
    items: ["Laravel", "Python", "FastAPI", "Node.js", "PHP", "Vue.js", "WordPress", "MySQL"],
  },
  {
    category: "AI & SaaS",
    items: [
      "RAG Architecture",
      "Vector Databases",
      "Agentic AI",
      "SaaS / Multi-tenant",
      "Docker",
      "WebSockets",
      "OCR Workflows",
    ],
  },
];

export const experience = [
  {
    company: "Export Japan Inc.",
    role: "Team Lead Manager & System Engineer",
    period: "Apr 2019 – Present",
    location: "Tokyo, Japan",
    url: "https://www.linkedin.com/company/export-japan-inc-/",
    highlights: [
      "Lead project scoping, budget estimation, and delivery for large-scale tourism digital platforms including Kyoto.travel.",
      "Built EXJ AI Chatbot — a RAG-powered SaaS with vector search, FastAPI backend, and Docker deployment for 24/7 customer Q&A.",
      "Manage system engineers and developers; conduct code reviews, sprint planning, and agile ceremonies.",
      "Design secure, scalable architectures across AWS and Alibaba Cloud environments.",
      "Drive backend API development and system integration for high-traffic international web applications.",
    ],
  },
  {
    company: "Tappware Solutions Limited",
    role: "Project Manager, R&D Department",
    period: "Sep 2015 – Jan 2019",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Led government and international projects for A2i, Ministry of Finance, and e-learning initiatives.",
      "Managed development teams using Scrum; delivered E-File, SEIP, TMS, SCS, HSS, PHR, Finman, and Niyog.",
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
      "Built scalable backend systems with PHP, jQuery, and MySQL.",
      "Contributed to CakePHP 3.5.0 as an official open-source contributor.",
    ],
  },
  {
    company: "Bangladesh University of Business & Technology",
    role: "Assistant Programmer",
    period: "Sep 2009 – Feb 2010",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Developed examination management software for the Controller of Examinations.",
    ],
  },
];

export const projects = [
  {
    name: "EXJ AI Chatbot",
    description:
      "AI-powered customer support SaaS for Export Japan Inc. Indexes website content into a vector database and answers visitor questions with RAG — multi-language Q&A, embeddable widget, usage analytics, and secure origin validation. Built with FastAPI and Docker.",
    tags: ["RAG", "Vector DB", "FastAPI", "Docker", "Python", "SaaS", "AI"],
    url: "https://chatbot.export-japan.com/",
  },
  {
    name: "DonateSync Community Hub",
    description:
      "Multi-tenant SaaS for nonprofits, clubs, and member organizations — memberships, donations and dues, event RSVPs, OCR receipt workflows, email and in-app notifications, and an optional member portal with financial transparency.",
    tags: ["SaaS", "Multi-tenant", "OCR", "Member Portal", "Community Platform"],
    url: "https://donatesync.com/",
  },
  {
    name: "BINGO",
    description:
      "Real-time multiplayer bingo for parties and events. Hosts share a QR code or link; up to 200 players join from any browser with live WebSocket sync, auto winner detection, and host controls — no app download required.",
    tags: ["WebSockets", "Real-time", "Node.js", "SaaS", "Multiplayer"],
    url: "https://bingo.eatherahmed.com/",
  },
  {
    name: "Kyoto.travel",
    description:
      "Major tourism information platform serving international visitors. Led system restructuring, backend architecture, and agile delivery for high-traffic multilingual content.",
    tags: ["PHP", "AWS", "Tourism", "Team Lead"],
    url: "https://www.kyoto.travel/",
  },
  {
    name: "Government Digital Platforms",
    description:
      "Suite of e-governance and e-learning systems including E-File, SEIP, TMS, and Finman for Bangladesh Government and international clients.",
    tags: ["Project Management", "Scrum", "E-Governance"],
    url: "https://www.linkedin.com/in/iftekhareather/",
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
      "Large-scale digital platforms for international tourism clients at Export Japan Inc., including multilingual content systems and high-traffic web applications.",
    tags: ["Team Lead", "AWS", "Alibaba Cloud", "Agile"],
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
  "DonateSync Community Hub",
  "Tourism & Travel Platforms",
  "Government Digital Platforms",
  "E-Learning & HR Systems",
];

export const featuredProjects = featuredProjectNames
  .map((name) => projects.find((project) => project.name === name))
  .filter((project): project is (typeof projects)[number] => project !== undefined);

export const recommendations = [
  {
    name: "Mirza S. Reza",
    title: "Peer Colleague",
    quote:
      "He is a true expert in PHP and NodeJS and brings a wealth of experience to any project. Particularly impressive in his ability to quickly code and deliver results on challenging tasks.",
    linkedin: "https://www.linkedin.com/in/mirzasreza",
  },
  {
    name: "Raiful Hasan",
    title: "Colleague (4+ years)",
    quote:
      "An energetic and passionate software engineer and a very good coder with deep algorithm skills. Successfully completed miscellaneous projects as project manager. I would strongly recommend him.",
    linkedin: "https://www.linkedin.com/in/hasanraiful",
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
