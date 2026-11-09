import type { ProjectsDict } from '@/i18n/types';

export const projects: ProjectsDict = {
  kicker: 'Selected work',
  title: 'Projects',
  labels: {
    live: 'live',
    code: 'code',
    stack: 'Stack',
    expand: 'More about',
    close: 'Close',
    status: 'live ✓',
    caseStudy: { challenge: 'challenge', approach: 'what I did', decision: 'technical decision', outcome: 'outcome' },
    opensInNewTab: 'opens in a new tab',
  },
  items: {
    financeflow: {
      summary: 'Financial management for small businesses.',
      description:
        'Full-stack financial management app for small businesses. Covers authentication, expense tracking, budget management and interactive dashboards with charts and data export.',
      visualAlt: 'FinanceFlow sign-in screen: simple financial management for small businesses',
      caseStudy: {
        challenge: 'Small businesses need to track income, expenses and cash flow without the weight of an ERP.',
        approach:
          'A REST API in Node.js, Express and Mongoose, and a Next.js (App Router) front end with a KPI dashboard, cash-flow chart (Recharts), filterable transactions, accounts, categories and reports with CSV export.',
        decision:
          'JWT in an httpOnly cookie instead of localStorage, to guard against XSS, with credentialed CORS between Vercel and Render. Zod validation on every endpoint and Mongoose populate to avoid N+1 queries.',
        outcome: 'Live end to end: front end on Vercel, API on Render and database on MongoDB Atlas, with a mobile-first layout.',
      },
    },
    'ice-land': {
      summary: 'Landing page for an ice cream shop.',
      description:
        'A landing page built for an ice cream shop, focused on visual appeal and a smooth experience. A fun exercise in turning a simple product into an inviting digital space.',
      visualAlt: 'Pastel ice cream colours on a frosted surface',
      caseStudy: {
        challenge: 'Turn a simple product, ice cream, into a page that makes you want to order.',
        approach:
          'A responsive landing page with hero, menu and testimonials, a mobile menu, a header that gains a shadow on scroll and highlights the active section, and entrance animations with ScrollReveal.',
        decision:
          'Plain HTML, CSS and JavaScript, with CSS split per section (header, home, menu, testimonials, footer) to keep the code organised without a framework.',
        outcome: 'A light static page with no build step, deployed on Vercel.',
      },
    },
    'the-dive': {
      summary: 'Landing page for a diving blog.',
      description:
        'A landing page for a diving blog, designed to capture the calm and depth of the underwater world. Clean layout, strong typography and an atmosphere that pulls you in.',
      visualAlt: 'Deep blue water with light rippling through it',
      caseStudy: {
        challenge: 'Convey the calm and depth of diving right above the fold of a blog.',
        approach:
          'An Angular 17 landing page with standalone components (header, navigation, about and footer), Remix Icon and strong typography over underwater photos.',
        decision:
          'I wrote my own Angular scroll-reveal directive for the entrance animations, reused across components instead of an external script.',
        outcome: 'A componentised, responsive structure ready to grow into a full blog, deployed on Vercel.',
      },
    },
    'the-bake': {
      summary: 'Landing page for a fictional bakery.',
      description:
        'A landing page for a fictional bakery: warm tones, a cozy feel and a layout that makes you almost smell the bread. Translating a physical experience into a digital one.',
      visualAlt: 'Warm golden tones like bread fresh out of the oven',
      caseStudy: {
        challenge: 'Translate the warmth of an artisan bakery into a digital experience.',
        approach:
          'An Angular 17 landing page with eight sections (hero, our story, recipes, menu, how to order, news, reservations and footer), a hamburger menu on mobile and smooth scrolling.',
        decision: 'SCSS for the warm tones and typography (Google Fonts), FontAwesome for icons and ScrollReveal for entrance animations.',
        outcome: 'A responsive layout for mobile and desktop, deployed on Vercel.',
      },
    },
  },
};
