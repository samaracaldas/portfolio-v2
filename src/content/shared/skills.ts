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
  { id: 'typescript', label: 'TypeScript', category: 'frontend', usedIn: [...BNP, 'portefrio', 'financeflow', 'bendita', 'the-dive'] },
  { id: 'rxjs', label: 'RxJS', category: 'frontend', usedIn: BNP },
  { id: 'react', label: 'React', category: 'frontend', usedIn: ['financeflow'] },
  { id: 'nextjs', label: 'Next.js', category: 'frontend', usedIn: ['financeflow'] },
  { id: 'html-css', label: 'HTML/CSS', category: 'frontend', usedIn: ['bendita', 'the-dive', 'financeflow', 'portefrio'] },
  { id: 'astro', label: 'Astro', category: 'frontend', usedIn: ['bendita'] },
  // Backend
  { id: 'nodejs', label: 'Node.js', category: 'backend', usedIn: [...BNP, 'financeflow'] },
  { id: 'express', label: 'Express', category: 'backend', usedIn: [...BNP, 'financeflow'] },
  { id: 'rest', label: 'REST APIs', category: 'backend', usedIn: [...BNP, 'financeflow'] },
  { id: 'rbac', label: 'CASL · RBAC', category: 'backend', usedIn: ['bnp-pleno'] },
  { id: 'jest', label: 'Jest', category: 'backend', usedIn: BNP },
  // Database
  { id: 'mongodb', label: 'MongoDB', category: 'database', usedIn: [...BNP, 'financeflow'] },
  { id: 'mongoose', label: 'Mongoose', category: 'database', usedIn: [...BNP, 'financeflow'] },
  { id: 'firebase', label: 'Firebase', category: 'database', usedIn: ['portefrio'] },
  { id: 'postgres', label: 'PostgreSQL · Supabase', category: 'database', usedIn: ['bendita'] },
  // Tools, cloud and AI
  { id: 'azure', label: 'Azure', category: 'tools', usedIn: BNP },
  { id: 'cicd', label: 'CI/CD', category: 'tools', usedIn: [...BNP, 'bendita'] },
  { id: 'playwright', label: 'Playwright', category: 'tools', usedIn: ['bendita'] },
  { id: 'git', label: 'Git', category: 'tools', usedIn: [...BNP, 'portefrio', 'financeflow', 'bendita', 'the-dive'] },
  { id: 'claude-code', label: 'Claude Code', category: 'tools', usedIn: BNP },
  { id: 'cursor', label: 'Cursor', category: 'tools', usedIn: BNP },
];
