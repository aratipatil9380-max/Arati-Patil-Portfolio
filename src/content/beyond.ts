/**
 * Creative-expression facts, kept separate from technical skills so the
 * "Create" movement reads distinctly. No metrics or invented achievements —
 * only the areas evidenced by supplied information and the existing site.
 * Venues, performance titles, dates, and photographs are intentionally
 * omitted because none exist in the current content.
 */
export type BeyondItem = {
  id: string;
  label: string;
  note: string;
};

export const beyondItems: readonly BeyondItem[] = [
  { id: 'art', label: 'Art & drawing', note: 'Sketching and visual work.' },
  { id: 'acting', label: 'Acting & drama', note: 'Performance and stage work.' },
  {
    id: 'street-theatre',
    label: 'Street theatre',
    note: 'Nukkad Natak — performing for live audiences.',
  },
];
