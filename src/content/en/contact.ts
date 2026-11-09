import type { ContactDict } from '@/i18n/types';

export const contact: ContactDict = {
  kicker: "Let's connect",
  title: 'Get in touch',
  intro: "I'm always open to new projects, creative ideas or a chance to be part of your team.",
  terminal: {
    label: 'Contact terminal',
    prompt: 'visitor@samara:~$',
    welcome: ['samara.sh v2.0.0', "Type a command, or 'help' to see what I understand."],
    helpTitle: 'Available commands',
    commands: [
      { cmd: 'contact', description: 'show my email' },
      { cmd: 'github', description: 'open my GitHub' },
      { cmd: 'linkedin', description: 'open my LinkedIn' },
      { cmd: 'hire samara', description: 'you know what this does' },
      { cmd: 'clear', description: 'clear the screen' },
    ],
    inputLabel: 'Terminal command',
  },
  links: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' },
};
