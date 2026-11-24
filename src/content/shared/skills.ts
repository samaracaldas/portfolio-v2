import type { ExperienceId } from './experience';
import type { ProjectId } from './projects';

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'tools';

export interface Skill {
  id: string;
  label: string;
  category: SkillCategory;
  /** Projects and experiences highlighted when this skill is hovered. */
  usedIn: (ProjectId | ExperienceId)[];
}

const BNP: ExperienceId[] = ['bnp-pleno', 'bnp-junior'];

export const SKILLS: readonly Skill[] = [
  // Frontend
  { id: 'angular', label: 'Angular', category: 'frontend', usedIn: [...BNP, 'portefrio', 'the-dive'] },
  { id: 'typescript', label: 'TypeScript', category: 'frontend', usedIn: [...BNP, 'portefrio', 'caramelo', 'bendita', 'the-dive'] },
  { id: 'rxjs', label: 'RxJS', category: 'frontend', usedIn: BNP },
  { id: 'react', label: 'React', category: 'frontend', usedIn: ['caramelo'] },
  { id: 'nextjs', label: 'Next.js', category: 'frontend', usedIn: ['caramelo'] },
  { id: 'html-css', label: 'HTML/CSS', category: 'frontend', usedIn: ['bendita', 'the-dive', 'caramelo', 'portefrio'] },
  { id: 'astro', label: 'Astro', category: 'frontend', usedIn: ['bendita'] },
  // Backend
  { id: 'nodejs', label: 'Node.js', category: 'backend', usedIn: [...BNP, 'caramelo'] },
  { id: 'express', label: 'Express', category: 'backend', usedIn: BNP },
  { id: 'rest', label: 'REST APIs', category: 'backend', usedIn: [...BNP, 'caramelo'] },
  { id: 'rbac', label: 'CASL · RBAC', category: 'backend', usedIn: ['bnp-pleno'] },
  { id: 'jest', label: 'Jest', category: 'backend', usedIn: BNP },
  // Database
  { id: 'mongodb', label: 'MongoDB', category: 'database', usedIn: BNP },
  { id: 'mongoose', label: 'Mongoose', category: 'database', usedIn: BNP },
  { id: 'firebase', label: 'Firebase', category: 'database', usedIn: ['portefrio'] },
  { id: 'postgres', label: 'PostgreSQL · Supabase · Neon', category: 'database', usedIn: ['bendita', 'caramelo'] },
  // Tools, cloud and AI
  { id: 'azure', label: 'Azure', category: 'tools', usedIn: BNP },
  { id: 'cicd', label: 'CI/CD', category: 'tools', usedIn: [...BNP, 'bendita'] },
  { id: 'playwright', label: 'Playwright', category: 'tools', usedIn: ['bendita'] },
  { id: 'git', label: 'Git', category: 'tools', usedIn: [...BNP, 'portefrio', 'caramelo', 'bendita', 'the-dive'] },
  { id: 'claude-code', label: 'Claude Code', category: 'tools', usedIn: BNP },
  { id: 'cursor', label: 'Cursor', category: 'tools', usedIn: BNP },
];
