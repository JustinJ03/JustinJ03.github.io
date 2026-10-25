import { brandAssets } from './brand-assets';

export type ToolCategory = 'language' | 'framework' | 'development' | 'exploring';
export type Tool = {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  url: string;
  iconPath: string | null;
  iconSourceUrl: string | null;
  iconKind: 'official' | 'community' | 'none';
};

export const categories: { id: ToolCategory; name: string; controlName: string; note?: string }[] = [
  { id: 'language', name: 'Languages', controlName: 'languages' },
  { id: 'framework', name: 'Frameworks & libraries', controlName: 'frameworks' },
  { id: 'development', name: 'Databases & development tools', controlName: 'development tools' },
  { id: 'exploring', name: 'Currently exploring', controlName: 'explorations', note: 'Learning as I go' },
];

const entries: [string, string, ToolCategory, string, string][] = [
  ['java', 'Java', 'language', 'Desktop & application development', 'https://www.java.com/'],
  ['python', 'Python', 'language', 'Scripting & problem-solving', 'https://www.python.org/'],
  ['cpp', 'C++', 'language', 'General-purpose language', 'https://isocpp.org/'],
  ['javascript', 'JavaScript', 'language', 'Interactivity for the web', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
  ['typescript', 'TypeScript', 'language', 'JavaScript with types', 'https://www.typescriptlang.org/'],
  ['dart', 'Dart', 'language', 'App development language', 'https://dart.dev/'],
  ['php', 'PHP', 'language', 'Server-side web language', 'https://www.php.net/'],
  ['laravel', 'Laravel', 'framework', 'PHP web framework', 'https://laravel.com/'],
  ['nextjs', 'Next.js', 'framework', 'React web framework', 'https://nextjs.org/'],
  ['flutter', 'Flutter', 'framework', 'Cross-platform UI toolkit', 'https://flutter.dev/'],
  ['bootstrap', 'Bootstrap', 'framework', 'Responsive UI toolkit', 'https://getbootstrap.com/'],
  ['tailwindcss', 'Tailwind CSS', 'framework', 'Utility-first CSS', 'https://tailwindcss.com/'],
  ['nativewind', 'NativeWind', 'framework', 'Styling for React Native', 'https://www.nativewind.dev/'],
  ['jquery', 'jQuery', 'framework', 'JavaScript DOM library', 'https://jquery.com/'],
  ['mysql', 'MySQL', 'development', 'Relational database', 'https://www.mysql.com/'],
  ['sqlite', 'SQLite', 'development', 'Embedded SQL database', 'https://www.sqlite.org/'],
  ['git', 'Git', 'development', 'Distributed version control', 'https://git-scm.com/'],
  ['github', 'GitHub', 'development', 'Code & collaboration', 'https://github.com/'],
  ['docker', 'Docker', 'development', 'Containerized development', 'https://www.docker.com/'],
  ['laragon', 'Laragon', 'development', 'Local development environment', 'https://laragon.org/'],
  ['xampp', 'XAMPP', 'development', 'Local web server stack', 'https://www.apachefriends.org/'],
  ['nginx', 'Nginx', 'development', 'Web server & reverse proxy', 'https://nginx.org/'],
  ['postgresql', 'PostgreSQL', 'exploring', 'Open-source SQL database', 'https://www.postgresql.org/'],
  ['supabase', 'Supabase', 'exploring', 'Postgres backend platform', 'https://supabase.com/'],
  ['riverpod', 'Riverpod', 'exploring', 'Reactive state management', 'https://riverpod.dev/'],
  ['reactnative', 'React Native', 'exploring', 'Native apps with React', 'https://reactnative.dev/'],
  ['shelf', 'Dart Shelf', 'exploring', 'Dart web server middleware', 'https://pub.dev/packages/shelf'],
  ['serverpod', 'Serverpod', 'exploring', 'Backend framework for Dart', 'https://serverpod.dev/'],
  ['gemini', 'Gemini API', 'exploring', 'AI models for applications', 'https://ai.google.dev/'],
  ['whatsapp', 'WhatsApp Cloud API', 'exploring', 'Business messaging API', 'https://developers.facebook.com/docs/whatsapp/cloud-api/'],
];

// Local, verified asset metadata is filled from the source register. A null icon
// deliberately renders a text tile, never another product's logo.
export const tools: Tool[] = entries.map(([id, name, category, description, url]) => ({
  id, name, category, description, url,
  iconPath: brandAssets[id] ? `icons/brands/${brandAssets[id].filename}` : null,
  iconSourceUrl: brandAssets[id]?.source ?? null,
  iconKind: brandAssets[id] ? 'official' : 'none',
}));

export function getTool(id: string): Tool {
  const tool = tools.find((entry) => entry.id === id);
  if (!tool) throw new Error(`Unknown tool ID: ${id}`);
  return tool;
}
