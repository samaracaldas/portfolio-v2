export const PROJECT_IDS = ['financeflow', 'bendita', 'the-dive'] as const;
export type ProjectId = (typeof PROJECT_IDS)[number];

export interface Project {
  id: ProjectId;
  name: string;
  stack: string[];
  live: string;
  repo: string;
  /** Extra area worth opening on its own, e.g. a dashboard with a visitor login. */
  demo?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'financeflow',
    name: 'FinanceFlow',
    stack: ['Next.js', 'Node.js', 'TypeScript', 'MongoDB'],
    live: 'https://financesflow.vercel.app/',
    repo: 'https://github.com/samaracaldas/financeflow',
  },
  {
    id: 'bendita',
    name: 'Bendita',
    stack: ['Astro', 'TypeScript', 'Supabase', 'PostgreSQL', 'Playwright'],
    live: 'https://bendita-samaracaldas.vercel.app/',
    repo: 'https://github.com/samaracaldas/bendita',
    demo: 'https://bendita-samaracaldas.vercel.app/balcao',
  },
  {
    id: 'the-dive',
    name: 'The Dive',
    stack: ['Angular', 'TypeScript', 'SCSS'],
    live: 'https://divers-angular.vercel.app/',
    repo: 'https://github.com/samaracaldas/divers-angular',
  },
];
