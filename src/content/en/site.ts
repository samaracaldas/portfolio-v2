import type { SiteDict } from '@/i18n/types';

export const site: SiteDict = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  meta: {
    title: 'Samara Caldas · Full Stack Developer',
    description:
      'Samara Caldas is a mid-level Full Stack developer with 3 years of experience in TypeScript, Angular, Node.js, MongoDB and Azure, working with generative AI and spec-driven development.',
  },
  nav: {
    label: 'Main',
    items: [
      { id: 'projects', label: 'work' },
      { id: 'experience', label: 'experience' },
      { id: 'ai', label: 'ai' },
      { id: 'skills', label: 'skills' },
      { id: 'contact', label: 'contact' },
    ],
  },
  a11y: {
    skipToContent: 'Skip to content',
    home: 'Samara Caldas, home',
    switchLanguage: 'Ler em português',
    otherLanguageShort: 'PT',
    otherLanguageName: 'Português',
  },
  footer: {
    builtWith: 'Built with Astro, Three.js and GSAP',
    sourceLabel: 'source',
  },
};
