import type { ExperienceDict } from '@/i18n/types';

const BNP_CONTEXT = 'Multi-tenant SaaS platform that manages public cultural funding calls for the public sector.';

export const experience: ExperienceDict = {
  kicker: "Where I've worked",
  title: 'Experience',
  present: 'present',
  remote: 'Remote',
  promotion: 'merged into pleno',
  items: {
    'bnp-pleno': {
      role: 'Full Stack Developer · Mid-level',
      short: 'BNP (Mid-level)',
      context: BNP_CONTEXT,
      location: 'São Paulo, Brazil (remote)',
      bullets: [
        'Promoted from junior to mid-level in 21 months, after independently delivering the Reviewers module of the FASE project.',
        'Built the project execution module end to end (change requests and accountability reports), adding a new stage to the project lifecycle on the platform.',
        'Designed a generic engine for conditional validation rules (AND/OR) in dynamic forms, so managers can configure blocks per funding call without new code.',
        'Built the accreditation of cultural organizations with asynchronous PDF generation: an Azure Function renders the document, stores it in Blob Storage and publishes the result to an Azure Service Bus queue.',
        'Optimized MongoDB queries on high-volume collections (indexes for $lookup, parallel aggregations and on-demand search), eliminating HTTP 504 timeouts, and added server-side pagination and sorting.',
        'Strengthened protection of sensitive data and role-based access control (RBAC) with CASL and Passport.js, and investigate production incidents with Application Insights, measuring impact before fixing.',
        'I work with spec-driven development and generative AI with human review: about half of my commits since Mar 2026 were paired with Claude Code.',
      ],
      commits: [
        'feat: project execution module',
        'feat: conditional rules engine (AND/OR)',
        'perf: MongoDB indexes and aggregations, no more 504s',
        'feat: consent PDF via Azure Functions',
      ],
    },
    'bnp-junior': {
      role: 'Full Stack Developer · Junior',
      short: 'BNP (Junior)',
      context: BNP_CONTEXT,
      location: 'São Paulo, Brazil (remote)',
      bullets: [
        'Built the reviewer registration and management module: registration, tags, deletion and reactivation, enabled segments and Excel export.',
        'Implemented the appeals phase, validating pending appeals before each stage of a funding call closes.',
        'Stabilized the project review due-diligence flow (limits, deadlines and budget spreadsheet).',
        'Implemented applicant validation at sign-up, covering MEI, legal nature and yearly registration checks.',
        'Worked on a layered architecture (use cases and repositories) with automated tests (Jest), in Angular 18 and Node.js, with PRs and CI/CD pipelines on Azure DevOps.',
      ],
      commits: [
        'feat: appeals phase',
        'fix: stabilize due-diligence flow',
        'feat: applicant validation (MEI)',
        'test: use cases and repositories with Jest',
        'feat: Reviewers module (FASE)',
      ],
    },
    portefrio: {
      role: 'Software Development Intern',
      short: 'Portefrio (Intern)',
      location: 'Rio de Janeiro, Brazil',
      bullets: [
        'Built an internal CRM from scratch with Angular 16 and TypeScript, used in production by the sales team: authentication, customer management and Firebase (Firestore, Authentication and Hosting).',
      ],
      commits: ['init: internship', 'feat: CRM from scratch (Angular 16 + Firebase)'],
    },
  },
  certifications: {
    title: 'Certifications',
    items: [{ name: 'Microsoft Certified: Azure Fundamentals', code: 'AZ-900', year: '2024' }],
  },
  education: {
    title: 'Education',
    items: [
      {
        degree: 'Associate degree in Systems Analysis and Development',
        school: 'Universidade Veiga de Almeida',
        period: '2022 – 2024',
      },
    ],
  },
  languages: {
    title: 'Languages',
    items: ['Portuguese (native)', 'English (advanced, reading and writing)'],
  },
};
