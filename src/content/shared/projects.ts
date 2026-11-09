export const PROJECT_IDS = ['financeflow', 'ice-land', 'the-dive', 'the-bake'] as const;
export type ProjectId = (typeof PROJECT_IDS)[number];

export interface Project {
  id: ProjectId;
  name: string;
  stack: string[];
  live: string;
  repo: string;
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
    id: 'ice-land',
    name: 'Ice Land',
    stack: ['HTML', 'CSS', 'JavaScript'],
    live: 'https://ice-land.vercel.app/',
    repo: 'https://github.com/samaracaldas/ice-land',
  },
  {
    id: 'the-dive',
    name: 'The Dive',
    stack: ['Angular', 'TypeScript', 'SCSS'],
    live: 'https://divers-angular.vercel.app/',
    repo: 'https://github.com/samaracaldas/divers-angular',
  },
  {
    id: 'the-bake',
    name: 'The Bake',
    stack: ['Angular', 'TypeScript', 'SCSS'],
    live: 'https://the-bake-angular.vercel.app/',
    repo: 'https://github.com/samaracaldas/the-bake-angular',
  },
];
