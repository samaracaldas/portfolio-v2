import type { ProjectsDict } from '@/i18n/types';

export const projects: ProjectsDict = {
  kicker: 'Selected work',
  title: 'Projects',
  labels: {
    live: 'live',
    code: 'code',
    demo: 'dashboard (sign in as visitor)',
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
    bendita: {
      summary: 'A bakery shop with real orders.',
      description:
        'An online shop for a fictional bakery in Vila Madalena, São Paulo: a showcase with live daily stock, a build-your-own doughnut, a doughnut + coffee combo, party orders and order tracking. Every order reaches the counter dashboard in real time.',
      visualAlt: 'Bendita home page: “Sonho recheado na hora, do jeito que você pedir”, with photos of doughnuts, cake jars and cheese bread',
      caseStudy: {
        challenge:
          'Go beyond a landing page: a shop where the order really reaches the counter, never sells what has run out and never trusts a price sent by the browser.',
        approach:
          'Astro and TypeScript with no UI framework, Supabase (Postgres, Auth and Realtime) and a counter dashboard with live orders, party orders and stock. A visitor button opens the dashboard in read-only mode.',
        decision:
          'The rules live in the database: PL/pgSQL functions recalculate prices and discounts and reserve stock in a locked transaction, with RLS on every table, abuse limits and tracking links with random tokens. The shop talks to the database with plain fetch, and supabase-js only loads on the dashboard.',
        outcome:
          '86 unit and database tests (PGlite) and 29 end-to-end scenarios on desktop and mobile with Playwright, CI on GitHub Actions, tested security headers and deployment on Vercel.',
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
  },
};
