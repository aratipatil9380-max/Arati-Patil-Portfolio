/**
 * Project facts. Only projects with a verifiable public link or a clearly
 * labelled team context are listed. Collaborative projects owned by other
 * accounts (MPLADS Sentinel, Legacy Code Whisperer, CodexMatrix) are
 * intentionally excluded until ownership/contribution is confirmed.
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
