export type Project = {
  slug: string; title: string; subtitle: string; context: string;
  status: 'built' | 'learning' | 'planned'; statusLabel: string;
  featured: boolean; category: 'web' | 'mobile' | 'desktop' | 'iot';
  summary: string; problem: string; technologies: string[]; contributions: string[];
  repoUrl: string | null; demoUrl: string | null;
  image: { src: string; alt: string; kind: 'screenshot' | 'illustration' } | null;
};
export const projects: Project[] = [
  {
    slug: 'myfinance', title: 'MyFinance', subtitle: 'Personal Finance Tracker', context: 'HackathonX: FinTech Forward 2026',
    status: 'built', statusLabel: 'Built · Hackathon project', featured: true, category: 'web',
    summary: 'A personal finance web application for Malaysian working adults, covering cashflow, budgeting, retirement savings, EPF three-account tracking, and ASNB/ASB investment tracking.',
    problem: 'Bringing day-to-day budgeting and Malaysian savings and investment tracking into one personal finance application.',
    technologies: ['Laravel 11', 'Sanctum API', 'Next.js', 'Tailwind CSS', 'Docker'],
    contributions: ['Application development', 'Database schema and REST API architecture', 'Recurring-transaction automation', 'Containerization'],
    repoUrl: null, demoUrl: null, image: null,
  },
  {
    slug: 'chirper', title: 'Chirper', subtitle: 'Twitter-Style Social App', context: 'Personal project',
    status: 'built', statusLabel: 'Built · Personal project', featured: true, category: 'web',
    summary: 'A full-stack social application built with Laravel and Next.js, with Docker supporting the development environment.',
    problem: 'Building a Twitter-style social application while working through the integration challenges of a full-stack development environment.',
    technologies: ['Laravel', 'Next.js', 'Docker'], contributions: ['Application development', 'Troubleshooting CORS and CSRF', 'Resolving Docker volume configuration in Windows'],
    repoUrl: null, demoUrl: null, image: null,
  },
  {
    slug: 'edusdg', title: 'EduSDG', subtitle: 'Quality Education Quiz Platform', context: 'Course group project · SDG 4',
    status: 'built', statusLabel: 'Built · Group coursework', featured: true, category: 'desktop',
    summary: 'A Java Swing desktop quiz platform with 30 multiple-format questions, conditional timers, user profiles, score tracking, and a leaderboard.',
    problem: 'Supporting learning through a quiz platform aligned with SDG 4: Quality Education. The desktop application uses a mobile-first layout.',
    technologies: ['Java', 'Swing'], contributions: ['Team leadership', 'Codebase structure', 'Contribution workflow', 'Platform development'],
    repoUrl: null, demoUrl: null, image: null,
  },
  {
    slug: 'chripy', title: 'Chripy', subtitle: 'Social-app exploration', context: 'Personal learning',
    status: 'learning', statusLabel: 'Learning project', featured: false, category: 'mobile',
    summary: 'Exploring a Flutter and Supabase social app: authentication, posts, comments, likes, and profiles. Feature completion is not verified.',
    problem: 'Learning mobile social-app development. This is separate from the Laravel and Next.js Chirper project.',
    technologies: ['Flutter', 'Supabase', 'Docker', 'Mailpit'], contributions: ['Exploration of local development and iPhone testing'],
    repoUrl: null, demoUrl: null, image: null,
  },
  {
    slug: 'booking-assistant', title: 'Nail salon booking assistant', subtitle: 'Booking-flow exploration', context: 'Planning & prototyping',
    status: 'planned', statusLabel: 'Planned / prototype exploration', featured: false, category: 'mobile',
    summary: 'Exploring an owner app and a customer WhatsApp booking flow, with a catalogue, owner-created slots, approvals, and manual payment records.',
    problem: 'Exploring ways to coordinate customer bookings and owner approvals. Backend options remain under consideration; no completed backend is claimed.',
    technologies: ['Flutter', 'PostgreSQL', 'Riverpod', 'Gemini API', 'WhatsApp Cloud API'], contributions: ['Workflow and technology exploration'],
    repoUrl: null, demoUrl: null, image: null,
  },
  {
    slug: 'irrigation', title: 'Automated outdoor irrigation', subtitle: 'Growing with technology', context: 'Final-project planning',
    status: 'planned', statusLabel: 'Concept / final-project planning', featured: false, category: 'iot',
    summary: 'A concept for weather and soil monitoring, irrigation and liquid-fertilizer scheduling, manual controls, and AI-assisted suggestions.',
    problem: 'Exploring how monitoring and automation could support growing things. Hardware integration and results are unverified.',
    technologies: ['IoT automation'], contributions: ['Concept and final-project planning'],
    repoUrl: null, demoUrl: null, image: null,
  },
];
