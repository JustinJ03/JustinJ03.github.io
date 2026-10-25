export type Interest = { name: string; description: string; icon: 'training' | 'matcha' | 'server' | 'leaf' };

export const interests: Interest[] = [
  { name: 'Strength training', description: 'Enjoying consistency and personal progress.', icon: 'training' },
  { name: 'Matcha & café ideas', description: 'Exploring drinks and small-business concepts.', icon: 'matcha' },
  { name: 'Home labs', description: 'Curious about self-hosting, media servers, and personal storage.', icon: 'server' },
  { name: 'Growing things', description: 'Interested in agriculture and smart irrigation.', icon: 'leaf' },
];
