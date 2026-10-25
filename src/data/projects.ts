export type Project = {
  id: string;
  name: string;
  subtitle: string;
  category: 'Hackathon' | 'Personal Project' | 'Course Project';
  context?: string;
  lifecycle?: 'Built' | 'Learning' | 'Planned';
  summary: string;
  toolIds: string[];
  toolLabels?: Record<string, string>;
  additionalTechnologyLinks?: { name: string; url: string }[];
  repoUrl: string | null;
  visible: boolean;
};

export const projects: Project[] = [
  {
    id: 'myfinance', name: 'MyFinance', subtitle: 'Personal Finance Tracker', category: 'Hackathon',
    context: 'HackathonX: FinTech Forward 2026',
    summary: 'A personal finance web application for Malaysian working adults. It brings cashflow, budgeting, and retirement-savings tracking into one system.',
    toolIds: ['laravel', 'nextjs', 'tailwindcss', 'docker'], toolLabels: { laravel: 'Laravel 11' },
    additionalTechnologyLinks: [{ name: 'Sanctum API', url: 'https://laravel.com/docs/11.x/sanctum' }],
    repoUrl: 'https://github.com/JustinJ03/MyFinance_MAVERIX', visible: true,
  },
  {
    id: 'chirper', name: 'Chirper', subtitle: 'Twitter-Style Social App', category: 'Personal Project',
    summary: 'A Twitter-style social web application built with a Laravel backend and Next.js frontend. The project also provided hands-on experience connecting the frontend and backend in a Docker-based development environment.',
    toolIds: ['laravel', 'nextjs', 'docker'],
    repoUrl: null, visible: true,
  },
  {
    id: 'edusdg', name: 'EduSDG', subtitle: 'Quality Education Quiz Platform', category: 'Course Project',
    summary: 'A Java Swing desktop quiz platform themed around SDG 4: Quality Education. It combines timed questions with profiles and score tracking in a compact interface.',
    toolIds: ['java'], additionalTechnologyLinks: [{ name: 'Swing', url: 'https://docs.oracle.com/javase/tutorial/uiswing/' }],
    repoUrl: 'https://github.com/JustinJ03/Java-Project', visible: true,
  },
];
