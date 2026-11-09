import type { SiteDict } from '@/i18n/types';

export const site: SiteDict = {
  htmlLang: 'pt-BR',
  ogLocale: 'pt_BR',
  meta: {
    title: 'Samara Caldas · Desenvolvedora Full Stack',
    description:
      'Samara Caldas é desenvolvedora Full Stack Pleno com 3 anos de experiência em TypeScript, Angular, Node.js, MongoDB e Azure, e usa IA generativa com spec-driven development.',
  },
  nav: {
    label: 'Principal',
    items: [
      { id: 'projects', label: 'projetos' },
      { id: 'experience', label: 'experiência' },
      { id: 'ai', label: 'ia' },
      { id: 'skills', label: 'skills' },
      { id: 'contact', label: 'contato' },
    ],
  },
  a11y: {
    skipToContent: 'Pular para o conteúdo',
    home: 'Samara Caldas, início',
    switchLanguage: 'Read in English',
    otherLanguageShort: 'EN',
    otherLanguageName: 'English',
  },
  footer: {
    builtWith: 'Feito com Astro, Three.js e GSAP',
    sourceLabel: 'código-fonte',
  },
  preloader: {
    lines: ['> astro build', 'resolvendo dependências', 'compilando componentes', 'empacotando shaders', 'otimizando assets'],
    done: 'build concluído',
  },
};
