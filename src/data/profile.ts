type Profile = {
  name: string;
  fullName: string;
  eyebrow: string;
  heading: string;
  role: string;
  welcome: string;
  background: string;
  strengths: string;
  languages: string;
  contact: { heading: string; description: string; linkedin: string; github: string;};
};

export const profile: Profile = {
  name: 'Justin Joel',
  fullName: 'Justin Joel Anak Juni',
  eyebrow: 'LEARNING • BUILDING • EXPLORING',
  heading: "Hey, I'm Justin.",
  role: 'Software Engineering student at UNIMAS',
  welcome: "I enjoy learning by building—turning ideas into web and mobile applications, working through bugs, and exploring what technology can do. This is a little space for my projects, the tools I use, and the things I'm curious about.",
  background: "I've worked with Laravel, Next.js, and Flutter through projects and learning. My experience includes a systems development internship at Karuna Sarawak and work with REKA web applications at UNIMAS's Centre for Undergraduate Studies. I'm also exploring AI-assisted applications, self-hosting, and smart irrigation.",
  strengths: 'I enjoy problem-solving, learning new tools, collaborating, and paying attention to the details.',
  languages: 'Bidayuh (native) · English and Malay (proficient) · Japanese (novice)',
  contact: {
    heading: 'Say hello.',
    description: 'Want to talk about a project, share an idea, or just connect? Find me here.',
    linkedin: 'https://www.linkedin.com/in/justin-joel-juni-925819247/',
    github: 'https://github.com/JustinJ03',
  },
};
