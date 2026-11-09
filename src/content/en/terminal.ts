import type { TerminalDict } from '@/i18n/types';

export const terminal: TerminalDict = {
  notFound: "command not found: {cmd}. Type 'help' to see what I understand.",
  copied: 'copied to clipboard ✓',
  copyFailed: 'select and copy it from here',
  opening: 'opening {target}...',
  cdHint: 'usage: cd <projects | experience | ai | skills | contact>',
  cdUnknown: 'cd: no such section',
  hire: [
    '> resolving dependencies... done',
    '> installing samara-caldas@pleno (full-stack)',
    '  + angular  + typescript  + node.js  + mongodb  + azure',
    '  + cares about how things feel to use',
    '> running tests... 100% passing',
    '✓ ready to ship. opening your email client...',
  ],
  hireSubject: "Let's work together",
  whoami: ['visitor', 'hopefully a future teammate.'],
  ls: ['projects/   experience/   ai/   skills/   readme.md'],
  readme: [
    '# Samara Caldas',
    'Mid-level Full Stack developer, 3 years of experience.',
    'TypeScript, Angular, Node.js, MongoDB and Azure. Generative AI with spec-driven development.',
    'I build things end-to-end and actually care about how they feel to use.',
  ],
  sudo: 'permission denied: nice try. she is already on it.',
  rm: "whoa. not on my portfolio. try 'hire samara' instead.",
  exit: "there's no escape. but there is 'contact'.",
  coffee: ['   ( (', '    ) )', '  ........', '  |      |]', '  \\      /', "   `----'   brewing... ☕ ready when you are."],
};
