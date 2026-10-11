/**
 * Skill groups. Deliberately contains NO proficiency percentages, bars, or
 * rankings. Every entry is evidenced by the projects, roles, or interests in
 * this repo; groups still being learned are marked `stage: 'learning'`.
 */
export type SkillStage = 'using' | 'learning';

export type SkillGroup = {
  id: string;
  label: string;
  items: readonly string[];
  /** 'using' = evidenced in projects/work; 'learning' = still exploring. */
  stage: SkillStage;
  note?: string;
};

export const skills: readonly SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['Python', 'JavaScript'],
    stage: 'using',
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: ['HTML', 'CSS'],
    stage: 'using',
    note: 'Used to build EPIVET and the RSA cryptography explainer.',
  },
  {
    id: 'tools',
    label: 'Tools & platforms',
    items: ['Git', 'GitHub'],
    stage: 'using',
  },
  {
    id: 'ai',
    label: 'AI & generative AI',
    items: ['AI-assisted development'],
    stage: 'learning',
    note: 'Through workshops and self-directed use.',
  },
  {
    id: 'quantum',
    label: 'Quantum computing',
    items: ['Qiskit'],
    stage: 'learning',
    note: 'Through VTU Quantum Club sessions.',
  },
];
