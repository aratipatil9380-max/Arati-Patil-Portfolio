/**
 * Project facts. Only projects with a verifiable public link or a clearly
 * labelled team context are listed. Collaborative projects list their shared
 * repo and name the team; each entry's `contribution` states Arati's role.
 */
export type Project = {
  id: string;
  name: string;
  /** 'solo' = Arati's own work; 'team' = built with a team. */
  ownership: 'solo' | 'team';
  context?: string;
  /** Short editorial category shown in the project meta line. */
  category: string;
  summary: string;
  contribution?: string;
  tags: readonly string[];
  live?: string;
  repo?: string;
  /** Authentic screenshot of the live interface (served from /public). */
  image?: string;
  imageAlt?: string;
  /** Gets the large featured treatment rather than a compact index row. */
  featured?: boolean;
  /** True while details still need confirmation. */
  unverified?: boolean;
  note?: string;
};

export const projects: readonly Project[] = [
  {
    id: 'epivet',
    name: 'EPIVET',
    ownership: 'team',
    context: 'Veterinary epidemiology / disease surveillance',
    category: 'Veterinary health · Web prototype',
    summary:
      'A prototype for tracking and surfacing animal disease signals in a veterinary ' +
      'epidemiology context.',
    contribution:
      'Prototype development, testing, user-flow validation, issue identification, ' +
      'and integration support.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    live: 'https://aratipatil9380-max.github.io/Epivet/',
    repo: 'https://github.com/aratipatil9380-max/Epivet',
    image: '/projects/epivet.webp',
    imageAlt:
      'EPIVET interface — an animal-disease surveillance dashboard with a regional map ' +
      'and case data.',
    featured: true,
  },
  {
    id: 'rsa-cryptography',
    name: 'RSA Cryptography',
    ownership: 'solo',
    context: 'Interactive educational site',
    category: 'Education · Cryptography',
    summary:
      'An interactive explainer for cryptography: primes, modular arithmetic, GCD, ' +
      "Euler's totient, RSA key generation, encryption/decryption, and the Hill Cipher.",
    tags: ['JavaScript', 'Cryptography', 'Education'],
    live: 'https://cryptography-rsa.vercel.app/',
    repo: 'https://github.com/aratipatil9380-max/cryptography-rsa',
    image: '/projects/rsa-cryptography.webp',
    imageAlt:
      'RSA Cryptography site — an interactive explainer interface for cryptography ' +
      'concepts.',
    featured: true,
  },
  {
    id: 'legacy-code-whisperer',
    name: 'Legacy Code Whisperer',
    ownership: 'team',
    context: 'IBM Bob 2.0 Hackathon · Team Codexmatrix',
    category: 'AI Developer Tool',
    summary:
      'An AI-assisted developer tool that helps teams understand and modernize ' +
      'legacy codebases with poor documentation — explaining code and pointing at ' +
      'modernization paths.',
    contribution: 'Team lead / builder.',
    tags: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'AI/LLM Integration'],
    live: 'https://legacy-code-whisperer-mu.vercel.app/',
    repo: 'https://github.com/the-nidhi-bhat/Codexmatrix-IBM-Bob-Hackathon',
    image: '/projects/legacy-code-whisperer.webp',
    imageAlt:
      'Legacy Code Whisperer web app — a code-analysis workspace with the headline ' +
      '“Modernize legacy code without breaking what works”, built by Team Codexmatrix ' +
      'for the IBM Bob 2.0 Hackathon.',
    featured: true,
  },
  {
    id: 'mplads-sentinel',
    name: 'MPLADS Sentinel',
    ownership: 'team',
    context: 'Smart India Hackathon 2026 · Team Phantom Syndicate',
    category: 'Explainable audit platform',
    summary:
      'An explainable ML platform that helps audit agencies prioritise which MPLADS ' +
      'projects warrant human review, combining anomaly signals into a transparent ' +
      'audit-priority score.',
    contribution: 'Presenter — Team Phantom Syndicate.',
    tags: [
      'Python',
      'FastAPI',
      'pandas',
      'scikit-learn',
      'PostgreSQL',
      'SQLAlchemy',
      'Next.js',
      'TypeScript',
    ],
    repo: 'https://github.com/the-nidhi-bhat/mplads-sentinel',
    image: '/projects/mplads-sentinel.webp',
    imageAlt:
      'MPLADS Sentinel audit dashboard — KPI summary cards, risk and anomaly charts, ' +
      'filters, and a prioritised queue of public-works projects for human review.',
    featured: true,
  },
  {
    id: 'your-home-in-space',
    name: 'Your Home in Space',
    ownership: 'team',
    context: 'NASA Space Apps Challenge 2025',
    category: 'Team project · Space Apps',
    summary:
      'A team-built, game-based simulation for laying out a spacecraft / space-station ' +
      'habitat.',
    contribution:
      'Team achievement associated with the NASA Space Apps Challenge 2025 result.',
    tags: ['Game concept', 'Simulation', 'Team'],
    unverified: true,
    note: 'Team composition and Arati’s individual contribution pending confirmation.',
  },
];
