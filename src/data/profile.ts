type Experience = { role: string; organization: string; dates: string; description: string; };
type Education = { qualification: string; institution: string; dates: string; };
type Profile = {
  name: string; fullName: string; role: string; eyebrow: string; intro: string;
  biography: string[]; experience: Experience[]; education: Education[];
  contacts: { label: string; value: string; href: string }[];
  languages: { name: string; level: string }[]; credentials: string[];
};

export const profile: Profile = {
  name: 'Justin Joel', fullName: 'Justin Joel Anak Juni',
  role: 'Software Engineering Student · Web & Mobile Development',
  eyebrow: "HELLO, WORLD. LET’S BUILD SOMETHING USEFUL.",
  intro: "I'm a Software Engineering student at UNIMAS with experience in full-stack web development. I enjoy turning practical problems into useful applications while exploring mobile development, AI-assisted workflows, and sustainable technology.",
  biography: [
    "My background combines software development, hands-on IT support, and collaborative project work. During my internship at Karuna Sarawak, I worked with Laravel, Blade, JavaScript, and Bootstrap, contributing to website development and troubleshooting. At UNIMAS's Centre for Undergraduate Studies, my work with REKA includes maintaining web applications, resolving JavaScript issues, and helping improve everyday workflows.",
    "I enjoy learning by building—from finance and social applications to exploring booking assistants and smart irrigation. I'm especially interested in software that connects technical ideas with practical, human needs.",
  ],
  experience: [
    { role: 'Assistant Systems Developer', organization: 'UNIMAS Centre for Undergraduate Studies (PPPs)', dates: 'Sep–Dec 2026 · Scheduled term', description: 'Maintain REKA applications, troubleshoot JavaScript frontend issues, collaborate on features, and assist testing and debugging. Part-time student employment under the MOHE MySISWA@JoC programme.' },
    { role: 'IT Support Technician Volunteer', organization: 'SAINS / SUKMA', dates: 'Aug 2024', description: 'Supported computers and hardware troubleshooting with technical teams and event officials during four days of gymnastics competitions.' },
    { role: 'Systems Developer Intern', organization: 'Karuna Sarawak', dates: 'Sep 2023–Mar 2024', description: 'Contributed to an ongoing project using PHP, Blade, JavaScript, jQuery, Laravel, Bootstrap, and GitHub. Supported troubleshooting, bug fixes, and website development.' },
  ],
  education: [
    { qualification: "Bachelor’s Degree in Software Engineering with Honours", institution: 'Universiti Malaysia Sarawak (UNIMAS)', dates: 'Oct 2024–Oct 2028 · Expected' },
    { qualification: 'Diploma in Computer Science', institution: 'Universiti Teknologi MARA (UiTM)', dates: 'Aug 2021–Jan 2024' },
  ],
  credentials: ['MUET', 'AWS Educate Getting Started with Networking'],
  contacts: [
    { label: 'Email', value: 'justin03joel@gmail.com', href: 'mailto:justin03joel@gmail.com' },
    { label: 'LinkedIn', value: 'Justin Joel', href: 'https://www.linkedin.com/in/justin-joel-925819247' },
    { label: 'GitHub', value: 'JustinJ03', href: 'https://github.com/JustinJ03' },
  ],
  languages: [{ name: 'Bidayuh', level: 'Native' }, { name: 'English', level: 'Proficient' }, { name: 'Malay', level: 'Proficient' }, { name: 'Japanese', level: 'Novice' }],
};
