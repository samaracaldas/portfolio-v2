import type { TerminalDict } from '@/i18n/types';

export const terminal: TerminalDict = {
  notFound: "comando não encontrado: {cmd}. Digite 'help' para ver o que eu entendo.",
  copied: 'copiado para a área de transferência ✓',
  copyFailed: 'selecione e copie daqui',
  opening: 'abrindo {target}...',
  cdHint: 'uso: cd <projects | experience | ai | skills | contact>',
  cdUnknown: 'cd: seção não encontrada',
  hire: [
    '> resolvendo dependências... ok',
    '> instalando samara-caldas@pleno (full-stack)',
    '  + angular  + typescript  + node.js  + mongodb  + azure',
    '  + se importa com a experiência de quem usa',
    '> rodando testes... 100% passando',
    '✓ pronta para produção. abrindo seu cliente de email...',
  ],
  hireSubject: 'Vamos trabalhar juntos',
  whoami: ['visitante', 'quem sabe um futuro colega de time.'],
  ls: ['projects/   experience/   ai/   skills/   readme.md'],
  readme: [
    '# Samara Caldas',
    'Desenvolvedora Full Stack Pleno, 3 anos de experiência.',
    'TypeScript, Angular, Node.js, MongoDB e Azure. IA generativa com spec-driven development.',
    'Construo produtos de ponta a ponta e me importo de verdade com a sensação de usá-los.',
  ],
  sudo: 'permissão negada: boa tentativa. ela já está cuidando disso.',
  rm: "opa. no meu portfolio não. tente 'hire samara'.",
  exit: "não tem saída. mas tem 'contact'.",
  coffee: ['   ( (', '    ) )', '  ........', '  |      |]', '  \\      /', "   `----'   passando um café... ☕ pronta quando você estiver."],
};
