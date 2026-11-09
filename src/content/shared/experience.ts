export const EXPERIENCE_IDS = ['portefrio', 'bnp-junior', 'bnp-pleno'] as const;
export type ExperienceId = (typeof EXPERIENCE_IDS)[number];

export interface Experience {
  id: ExperienceId;
  company: string;
  /** ISO year-month, e.g. "2026-03". */
  start: string;
  /** null = current position. */
  end: string | null;
  remote: boolean;
  /** Git branch name used by the timeline graph. */
  branch: string;
  /** Column of the git graph this branch is drawn in (0 = left). */
  lane: 0 | 1;
  /** Fake short hashes for the graph, one per commit message (same order). */
  hashes: string[];
  /** Branch this one is checked out from. */
  branchesFrom?: ExperienceId;
  /** Branch this one merges into (the promotion). */
  mergesInto?: ExperienceId;
}

/**
 * Oldest first: the timeline reads like `git log --graph --reverse`, so the
 * graph draws forward in time as you scroll and ends on the promotion merge.
 */
export const EXPERIENCES: readonly Experience[] = [
  {
    id: 'portefrio',
    company: 'Portefrio Distribuidora de Gêneros Alimentícios',
    start: '2022-10',
    end: '2024-02',
    remote: false,
    branch: 'estagio/portefrio',
    lane: 0,
    hashes: ['c8a52f4', '71d0be3'],
  },
  {
    id: 'bnp-junior',
    company: 'BNP Soluções em TI',
    start: '2024-06',
    end: '2026-02',
    remote: true,
    branch: 'junior/bnp',
    lane: 1,
    hashes: ['5d2e8b1', 'a7f310c', '0b9d4e6', '6ac2d57', '3fe1a92'],
    branchesFrom: 'portefrio',
    mergesInto: 'bnp-pleno',
  },
  {
    id: 'bnp-pleno',
    company: 'BNP Soluções em TI',
    start: '2026-03',
    end: null,
    remote: true,
    branch: 'pleno/bnp',
    lane: 0,
    hashes: ['e41b7d0', '9c03fa2', 'b58c1e7', '2d7a4f9'],
  },
];
