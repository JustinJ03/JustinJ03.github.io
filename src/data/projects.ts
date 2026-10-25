export type Project = {
  id: string;
  name: string;
  subtitle: string;
  category: 'Hackathon' | 'Personal Project' | 'Course Project';
  context?: string;
  lifecycle?: 'Built' | 'Learning' | 'Planned';
  summary: string;
  features: string[];
  toolIds: string[];
  toolLabels?: Record<string, string>;
  additionalTechnologyLinks?: { name: string; url: string }[];
  contribution?: string;
  repoUrl: string | null;
  visible: boolean;
};

export const projects: Project[] = [
  {
    id: 'myfinance', name: 'MyFinance', subtitle: 'Personal Finance Tracker', category: 'Hackathon',
    context: 'HackathonX: FinTech Forward 2026',
    summary: 'A personal finance web application for Malaysian working adults. It brings cashflow, budgeting, and retirement-savings tracking into one system.',
    features: ['Tracks cashflow and budgets.', 'Supports EPF three-account tracking and ASNB/ASB investment tracking.', 'Includes recurring-transaction automation.'],
    toolIds: ['laravel', 'nextjs', 'tailwindcss', 'docker'], toolLabels: { laravel: 'Laravel 11' },
    additionalTechnologyLinks: [{ name: 'Sanctum API', url: 'https://laravel.com/docs/11.x/sanctum' }],
    contribution: 'My contribution: database schema and REST API architecture.', repoUrl: 'https://github.com/JustinJ03/MyFinance_MAVERIX', visible: true,
  },
  {
    id: 'chirper', name: 'Chirper', subtitle: 'Twitter-Style Social App', category: 'Personal Project',
    summary: 'A Twitter-style social web application built with a Laravel backend and Next.js frontend. The project also provided hands-on experience connecting the frontend and backend in a Docker-based development environment.',
    features: ['Provides a Twitter-style social application experience.', 'Integrates the web frontend with backend authentication/API flows.'],
    toolIds: ['laravel', 'nextjs', 'docker'],
    contribution: 'Along the way: worked through CORS, CSRF, and Docker volume configuration issues on Windows.', repoUrl: null, visible: true,
  },
  {
    id: 'edusdg', name: 'EduSDG', subtitle: 'Quality Education Quiz Platform', category: 'Course Project',
    summary: 'A Java Swing desktop quiz platform themed around SDG 4: Quality Education. It combines timed questions with profiles and score tracking in a compact interface.',
    features: ['Provides 30 multiple-format quiz questions.', 'Applies conditional timers.', 'Tracks user profiles and scores.', 'Displays a competitive leaderboard.'],
    toolIds: ['java'], additionalTechnologyLinks: [{ name: 'Swing', url: 'https://docs.oracle.com/javase/tutorial/uiswing/' }],
    contribution: 'My contribution: led the team and organized the codebase and contribution workflow.', repoUrl: 'https://github.com/JustinJ03/Java-Project', visible: true,
  },
];
