/**
 * Single source of truth for external links. Components must read URLs from
 * here rather than hard-coding them, so a change happens in exactly one place.
 */
export const links = {
  email: 'mailto:aratipatil9380@gmail.com',
  emailAddress: 'aratipatil9380@gmail.com',
  github: 'https://github.com/aratipatil9380-max',
  linkedin: 'https://www.linkedin.com/in/arati-patil-3a580b389',
} as const;

export type Links = typeof links;
