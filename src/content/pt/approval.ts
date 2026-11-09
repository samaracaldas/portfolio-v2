import type { ApprovalDict } from '@/i18n/types';

export const approval: ApprovalDict = {
  kicker: 'Fluxo de aprovação',
  title: 'Da proposta ao aprovado',
  intro:
    'Uma versão abstrata do módulo de Pareceristas que entreguei: a proposta passa por cadastro e análise até ser aprovada, ganhando tags pelo caminho.',
  disclaimer: 'Demo ilustrativa com dados fictícios. O sistema real pertence a um cliente.',
  steps: [
    { id: 'register', label: 'cadastro', description: 'A proposta e seu parecerista são cadastrados.' },
    { id: 'review', label: 'análise', description: 'O parecerista avalia e as tags são atribuídas.' },
    { id: 'approved', label: 'aprovado', description: 'A decisão é registrada e a proposta segue adiante.' },
  ],
  card: {
    id: 'PRP-0427',
    title: 'Projeto de biblioteca comunitária',
    owner: 'Parecerista A.',
    status: 'aprovado',
    statuses: { register: 'cadastrada', review: 'em análise', approved: 'aprovado' },
  },
  tagsLabel: 'Tags',
  tags: ['cultura', 'educação', 'acessibilidade'],
};
