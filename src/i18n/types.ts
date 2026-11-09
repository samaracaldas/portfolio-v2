import type { ExperienceId } from '@/content/shared/experience';
import type { ProjectId } from '@/content/shared/projects';
import type { SkillCategory } from '@/content/shared/skills';

export const LOCALES = ['en', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type SectionId = 'hero' | 'projects' | 'experience' | 'ai' | 'approval' | 'skills' | 'contact';

/** Small "// kicker" + big title pair used by every section heading. */
export interface SectionHeading {
  kicker: string;
  title: string;
  intro?: string;
}

export interface SiteDict {
  /** Value for <html lang>. */
  htmlLang: string;
  /** Value for og:locale. */
  ogLocale: string;
  meta: { title: string; description: string };
  nav: { label: string; items: { id: Exclude<SectionId, 'hero'>; label: string }[] };
  a11y: {
    skipToContent: string;
    home: string;
    switchLanguage: string;
    /** Short label of the *other* language, shown in the toggle. */
    otherLanguageShort: string;
    otherLanguageName: string;
  };
  footer: { builtWith: string; sourceLabel: string };
}

export interface HeroDict {
  kicker: string;
  name: string;
  role: string;
  tagline: string;
  certification: { label: string; code: string };
  ctas: { work: string; contact: string };
}

export interface CaseStudy {
  challenge: string;
  approach: string;
  decision: string;
  outcome: string;
}

export interface ProjectText {
  summary: string;
  description: string;
  /** Mini case study shown when the card is expanded. */
  caseStudy: CaseStudy;
  /** Text alternative for the visual/preview area. */
  visualAlt: string;
}

export interface ProjectsDict extends SectionHeading {
  labels: {
    live: string;
    code: string;
    stack: string;
    expand: string;
    close: string;
    opensInNewTab: string;
    /** Shown in the card's terminal overlay, e.g. "live ✓". */
    status: string;
    /** Headings of the four case study blocks. */
    caseStudy: CaseStudy;
  };
  items: Record<ProjectId, ProjectText>;
}

export interface ExperienceText {
  role: string;
  /** One line about the product/team, shown under the company. */
  context?: string;
  /** Short label, e.g. "BNP (Pleno)", used by the skills highlight. */
  short: string;
  location: string;
  bullets: string[];
  /** Commit messages for this branch, oldest first. */
  commits: string[];
}

export interface ExperienceDict extends SectionHeading {
  present: string;
  remote: string;
  promotion: string;
  items: Record<ExperienceId, ExperienceText>;
  certifications: { title: string; items: { name: string; code: string; year: string }[] };
  education: { title: string; items: { degree: string; school: string; period: string }[] };
  languages: { title: string; items: string[] };
}

export interface AiReview {
  /** 1-based line number in the shared code sample. */
  line: number;
  agent: string;
  comment: string;
}

export interface AiDict extends SectionHeading {
  practices: { title: string; text: string }[];
  codeLabel: string;
  reviewsTitle: string;
  reviews: AiReview[];
  fixLabel: string;
  replayLabel: string;
}

export interface ApprovalDict extends SectionHeading {
  disclaimer: string;
  steps: { id: 'register' | 'review' | 'approved'; label: string; description: string }[];
  card: {
    id: string;
    title: string;
    owner: string;
    status: string;
    /** Status shown while the demo card sits in each column. */
    statuses: Record<'register' | 'review' | 'approved', string>;
  };
  tagsLabel: string;
  tags: string[];
}

export interface SkillsDict extends SectionHeading {
  hint: string;
  usedInLabel: string;
  /** Shown for skills not tied to any project/experience yet. */
  notUsedYet: string;
  categories: Record<SkillCategory, string>;
}

export interface ContactDict extends SectionHeading {
  terminal: {
    label: string;
    prompt: string;
    welcome: string[];
    helpTitle: string;
    commands: { cmd: string; description: string }[];
    inputLabel: string;
  };
  links: { email: string; github: string; linkedin: string };
}

export interface TerminalDict {
  /** "{cmd}" is replaced by what the visitor typed. */
  notFound: string;
  copied: string;
  copyFailed: string;
  /** "{target}" is replaced by the destination name. */
  opening: string;
  /** Section names accepted by `cd`, e.g. ["projects", "experience"]. */
  cdHint: string;
  cdUnknown: string;
  hire: string[];
  hireSubject: string;
  whoami: string[];
  ls: string[];
  readme: string[];
  sudo: string;
  rm: string;
  exit: string;
  coffee: string[];
}

export interface Dictionary {
  site: SiteDict;
  hero: HeroDict;
  projects: ProjectsDict;
  experience: ExperienceDict;
  ai: AiDict;
  approval: ApprovalDict;
  skills: SkillsDict;
  contact: ContactDict;
  terminal: TerminalDict;
}
