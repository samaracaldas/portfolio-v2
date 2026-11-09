import type { ApprovalDict } from '@/i18n/types';

export const approval: ApprovalDict = {
  kicker: 'Approval flow',
  title: 'From proposal to approved',
  intro:
    'An abstract take on the Reviewers module I delivered: a proposal moves through registration and review until it is approved, picking up tags along the way.',
  disclaimer: 'Illustrative demo with fictional data. The real system belongs to a client.',
  steps: [
    { id: 'register', label: 'register', description: 'The proposal and its reviewer are registered.' },
    { id: 'review', label: 'review', description: 'The reviewer evaluates it and tags are assigned.' },
    { id: 'approved', label: 'approved', description: 'The decision is recorded and the proposal moves on.' },
  ],
  card: {
    id: 'PRP-0427',
    title: 'Community library project',
    owner: 'Reviewer A.',
    status: 'approved',
    statuses: { register: 'registered', review: 'under review', approved: 'approved' },
  },
  tagsLabel: 'Tags',
  tags: ['culture', 'education', 'accessibility'],
};
