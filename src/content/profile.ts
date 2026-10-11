/**
 * Centralised profile facts. Nothing here is invented; items that still need
 * Arati's confirmation are marked `unverified` so they can be surfaced for
 * review before being presented as established.
 *
 * The education figures below (CGPA, pre-university percentage) were confirmed
 * accurate by Arati and are published as-is.
 */
export type Education = {
  degree: string;
  institution: string;
  cgpa?: string;
  puPercentage?: string;
  /** True while the figures await confirmation. */
  unverified?: boolean;
};

export type Profile = {
  name: string;
  tagline: string;
  role: string;
  location: string;
  /** The three-movement concept that structures the site. */
  concept: readonly string[];
  intro: string;
  interests: readonly string[];
  /** Paragraphs for the About section; the first is the lead paragraph. */
  about: readonly string[];
  education: Education;
};

export const profile: Profile = {
  name: 'Arati Patil',
  tagline: 'B.Tech CSBS · VTU Belagavi',
  role: 'CSBS Student · Frontend Developer · Creative Technologist',
  location: 'Belagavi, Karnataka, India',
  concept: ['Build.', 'Lead.', 'Create.'],
  intro:
    'CSBS student building with Python and the web, leading communities at VTU, ' +
    'and keeping a space open for art, performance, and creative expression.',
  interests: [
    'Python',
    'AI & GenAI',
    'Frontend',
    'Quantum computing',
    'Communities',
    'Research',
    'Art & drawing',
    'Acting & street theatre',
  ],
  about: [
    // Only details supported by the rest of this file, the projects, and the
    // roles data. No invented stories, motivations, or expertise claims.
    'I study Computer Science and Business Systems at VTU Belagavi. Most of my ' +
      'project work sits on the web — interfaces built with HTML, CSS, and ' +
      'JavaScript — alongside Python.',
    'Along the way I built a veterinary disease-surveillance prototype ' +
      '(EPIVET) with a team, made an interactive RSA cryptography explainer on ' +
      'my own, and took part in student technical communities at VTU, including ' +
      'the Quantum Club and technical committees for events.',
    'Outside coursework I explore AI and generative AI tools, follow quantum ' +
      'computing, and keep up my drawing, acting, and street theatre.',
  ],
  education: {
    degree: 'B.Tech, Computer Science & Business Systems (CSBS)',
    institution: 'VTU Belagavi',
    cgpa: '8.05 / 10',
    puPercentage: '80%',
    unverified: false,
  },
};
