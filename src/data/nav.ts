/**
 * Primary navigation. The `id` values are the real anchor targets of the
 * section elements, so navigation and content share one source of truth.
 */
export type NavItem = {
  id: string;
  label: string;
};

export const navItems: readonly NavItem[] = [
  { id: 'work', label: 'Work' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'beyond', label: 'Beyond Tech' },
  { id: 'contact', label: 'Contact' },
];
