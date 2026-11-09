import type { ContactDict } from '@/i18n/types';

export const contact: ContactDict = {
  kicker: 'Vamos conversar',
  title: 'Fale comigo',
  intro: 'Estou sempre aberta a novos projetos, ideias criativas ou à chance de fazer parte do seu time.',
  terminal: {
    label: 'Terminal de contato',
    prompt: 'visitante@samara:~$',
    welcome: ['samara.sh v2.0.0', "Digite um comando, ou 'help' para ver o que eu entendo."],
    helpTitle: 'Comandos disponíveis',
    commands: [
      { cmd: 'contact', description: 'mostra meu email' },
      { cmd: 'github', description: 'abre meu GitHub' },
      { cmd: 'linkedin', description: 'abre meu LinkedIn' },
      { cmd: 'hire samara', description: 'você sabe o que isso faz' },
      { cmd: 'clear', description: 'limpa a tela' },
    ],
    inputLabel: 'Comando do terminal',
  },
  links: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' },
};
