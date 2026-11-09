import type { TerminalDict } from '@/i18n/types';

/** Everything the terminal needs at runtime (serialized by Terminal.astro). */
export interface TerminalData extends TerminalDict {
  prompt: string;
  helpTitle: string;
  commands: { cmd: string; description: string }[];
}

export interface PersonLinks {
  email: string;
  github: string;
  linkedin: string;
}

export type Tone = 'muted' | 'error' | 'ok' | 'accent';
export type Line = { text: string; tone?: Tone } | { help: { cmd: string; description: string } };

export type Effect =
  | { type: 'open'; url: string }
  | { type: 'navigate'; url: string }
  | { type: 'copy'; text: string }
  | { type: 'scroll'; target: string }
  | { type: 'clear' };

export interface CommandResult {
  lines: Line[];
  effects: Effect[];
  /** Print line by line, like a build log. */
  slow?: boolean;
}

export const SECTIONS = ['projects', 'experience', 'ai', 'skills', 'contact'] as const;

/** Public commands (completion + help) and hidden easter eggs (completion only). */
export const COMPLETIONS = [
  'help',
  'contact',
  'github',
  'linkedin',
  'hire samara',
  'clear',
  'whoami',
  'ls',
  'cat readme.md',
  'coffee',
  'date',
  'history',
  ...SECTIONS.map((s) => `cd ${s}`),
];

const text = (value: string, tone?: Tone): Line => (tone ? { text: value, tone } : { text: value });
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

export function complete(input: string): string | null {
  const value = input.trimStart().toLowerCase();
  if (!value) return null;
  const match = COMPLETIONS.find((c) => c.startsWith(value) && c !== value);
  return match ?? null;
}

export function runCommand(raw: string, data: TerminalData, person: PersonLinks, history: string[]): CommandResult {
  const input = raw.trim();
  const lower = input.toLowerCase().replace(/\s+/g, ' ');
  const [name = '', ...args] = lower.split(' ');
  const none: CommandResult = { lines: [], effects: [] };

  if (!input) return none;

  if (lower.startsWith('sudo')) return { lines: [text(data.sudo, 'error')], effects: [] };
  if (lower.startsWith('rm -rf')) return { lines: [text(data.rm, 'error')], effects: [] };

  switch (name) {
    case 'help':
    case '?':
      return {
        lines: [text(`${data.helpTitle}:`), ...data.commands.map((help) => ({ help }))],
        effects: [],
      };

    case 'contact':
    case 'email':
      return {
        lines: [text(`email   ${person.email}`), text(data.copied, 'ok')],
        effects: [{ type: 'copy', text: person.email }],
      };

    case 'github':
      return {
        lines: [text(fill(data.opening, { target: 'GitHub' }), 'muted')],
        effects: [{ type: 'open', url: person.github }],
      };

    case 'linkedin':
      return {
        lines: [text(fill(data.opening, { target: 'LinkedIn' }), 'muted')],
        effects: [{ type: 'open', url: person.linkedin }],
      };

    case 'hire':
      if (args.join(' ') === 'samara') {
        const subject = encodeURIComponent(data.hireSubject);
        return {
          lines: data.hire.map((line, i, all) => text(line, i === all.length - 1 ? 'ok' : undefined)),
          effects: [{ type: 'navigate', url: `mailto:${person.email}?subject=${subject}` }],
          slow: true,
        };
      }
      return { lines: [text(fill(data.notFound, { cmd: input }), 'error')], effects: [] };

    case 'clear':
    case 'cls':
      return { lines: [], effects: [{ type: 'clear' }] };

    case 'whoami':
      return { lines: data.whoami.map((l) => text(l)), effects: [] };

    case 'ls':
      return { lines: data.ls.map((l) => text(l, 'accent')), effects: [] };

    case 'cat':
      if (args[0] === 'readme.md') return { lines: data.readme.map((l) => text(l)), effects: [] };
      return { lines: [text(fill(data.notFound, { cmd: input }), 'error')], effects: [] };

    case 'cd': {
      const target = args[0]?.replace(/\/$/, '');
      if (!target) return { lines: [text(data.cdHint, 'muted')], effects: [] };
      if ((SECTIONS as readonly string[]).includes(target)) {
        return { lines: [], effects: [{ type: 'scroll', target: `#${target}` }] };
      }
      return { lines: [text(`${data.cdUnknown}: ${target}`, 'error')], effects: [] };
    }

    case 'echo':
      return { lines: [text(input.slice(5))], effects: [] };

    case 'date':
      return { lines: [text(new Date().toString())], effects: [] };

    case 'history':
      return { lines: history.map((h, i) => text(`${String(i + 1).padStart(3, ' ')}  ${h}`, 'muted')), effects: [] };

    case 'coffee':
      return { lines: data.coffee.map((l) => text(l, 'accent')), effects: [], slow: true };

    case 'exit':
    case 'quit':
      return { lines: [text(data.exit, 'muted')], effects: [] };

    default:
      return { lines: [text(fill(data.notFound, { cmd: input }), 'error')], effects: [] };
  }
}
