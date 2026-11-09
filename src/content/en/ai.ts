import type { AiDict } from '@/i18n/types';

export const ai: AiDict = {
  kicker: 'How I work with AI',
  title: 'Agents in the loop',
  intro:
    'About half of my commits since Mar 2026 were paired with Claude Code. But the AI never decides alone: everything starts from a spec, runs inside project rules and goes through human review.',
  practices: [
    {
      title: 'Spec-driven development',
      text: "2026's biggest features started from a tech doc mapped against the real code (scope, data model, use cases and API) and validated with the PO. It becomes the AI's context and the guide for implementation and review.",
    },
    {
      title: 'Skills and rules per layer',
      text: "I built the team's AI context layer in Claude Code: skills for business rules, API and UI with the project's conventions, plus shared rules.",
    },
    {
      title: 'Subagents for planning and review',
      text: 'Subagents run a technical feasibility analysis before building and an automated code review before every PR.',
    },
    {
      title: 'Every deviation becomes a rule',
      text: 'When generated code drifts from the standard (say, if/else where the project uses guard clauses), I turn the fix into a skill so the drift is stopped before review.',
    },
  ],
  codeLabel: 'Fictional code sample under review',
  reviewsTitle: 'Review comments',
  reviews: [
    { line: 1, agent: 'review:types', comment: 'userId is implicitly any. Type the parameter and the return value.' },
    { line: 2, agent: 'review:errors', comment: 'res.ok is never checked, so a failed request reaches res.json().' },
    { line: 4, agent: 'review:style', comment: 'Use strict equality (===) and type the callback.' },
  ],
  replayLabel: 'replay review',
  fixLabel: 'Suggested fix applied',
};
