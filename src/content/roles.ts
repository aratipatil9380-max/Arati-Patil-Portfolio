/**
 * Leadership and community roles. Only role wording that is actually supported
 * is shown.
 *
 * The GDG on Campus role below is published with the confirmed title and term
 * supplied by Arati ("GDG on Campus Lead — Marketing & PR", 2026–27). No event
 * metrics, outcomes or achievements are asserted for any role.
 */
export type Role = {
  id: string;
  /** Role held, e.g. "Member" or "Technical Committee". */
  role: string;
  /** Organisation or programme the role belongs to. */
  org: string;
  /** Short category used to give the entry a hierarchy, e.g. "Community leadership". */
  kind?: string;
  period?: string;
  detail?: string;
  /** True for roles that are currently held ("present" / current academic year). */
  current?: boolean;
};

export const roles: readonly Role[] = [
  {
    id: 'gdg-on-campus',
    role: 'GDG on Campus Lead — Marketing & PR',
    org: 'GDG on Campus, VTU Belagavi',
    kind: 'Community leadership',
    period: '2026–27',
    current: true,
  },
  {
    id: 'quantum-club',
    role: 'Member',
    org: 'VTU Quantum Club',
    kind: 'Club membership',
    period: 'Oct 2025 – Present',
    current: true,
    detail: 'Qiskit-based sessions and technical community work.',
  },
  {
    id: 'national-quantum-summit',
    role: 'Technical Committee',
    org: 'National Quantum Summit',
    kind: 'Technical committee',
    period: 'April 2026',
  },
  {
    id: 'sih-2025-committee',
    role: 'Technical Committee',
    org: 'Smart India Hackathon 2025',
    kind: 'Technical committee',
    period: '2025',
  },
];
