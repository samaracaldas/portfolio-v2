import type { ExperienceDict } from '@/i18n/types';

const BNP_CONTEXT = 'Plataforma SaaS multi-tenant de gestão de editais de fomento à cultura do setor público.';

export const experience: ExperienceDict = {
  kicker: 'Onde trabalhei',
  title: 'Experiência',
  present: 'atual',
  remote: 'Remoto',
  promotion: 'merge em pleno',
  items: {
    'bnp-pleno': {
      role: 'Desenvolvedora Full Stack · Pleno',
      short: 'BNP (Pleno)',
      context: BNP_CONTEXT,
      location: 'São Paulo, SP (remoto)',
      bullets: [
        'Promovida de júnior a pleno em 21 meses, após entregar de forma independente o módulo de Pareceristas do projeto FASE.',
        'Desenvolvi de ponta a ponta o módulo de execução de projetos (pedidos de alteração e prestação de contas), criando uma nova etapa do ciclo de vida dos projetos na plataforma.',
        'Projetei um motor genérico de regras de validação condicional (E/OU) para formulários dinâmicos, que permite aos gestores configurar bloqueios por edital sem código novo.',
        'Construí o credenciamento de entidades culturais com geração assíncrona do termo de anuência em PDF: uma Azure Function gera o documento, salva no Blob Storage e publica o resultado numa fila do Azure Service Bus.',
        'Otimizei consultas no MongoDB em coleções de alto volume (índices para $lookup, agregações em paralelo e busca sob demanda), eliminando timeouts HTTP 504, e implementei paginação e ordenação no servidor.',
        'Reforcei a proteção de dados sensíveis e o controle de acesso por papéis (RBAC) com CASL e Passport.js, e investigo incidentes de produção com Application Insights, medindo o impacto antes de corrigir.',
        'Trabalho com spec-driven development e IA generativa com revisão humana: cerca de metade dos meus commits desde mar/2026 foi feita em par com o Claude Code.',
      ],
      commits: [
        'feat: módulo de execução de projetos',
        'feat: motor de regras condicionais (E/OU)',
        'perf: índices e agregações no MongoDB, fim dos 504',
        'feat: termo de anuência em PDF via Azure Functions',
      ],
    },
    'bnp-junior': {
      role: 'Desenvolvedora Full Stack · Júnior',
      short: 'BNP (Júnior)',
      context: BNP_CONTEXT,
      location: 'São Paulo, SP (remoto)',
      bullets: [
        'Construí o módulo de cadastro e gestão de pareceristas: cadastro, tags, exclusão e reativação, segmentos habilitados e exportação em Excel.',
        'Implementei a fase de recursos, com validação de recursos pendentes antes do encerramento de cada etapa do edital.',
        'Estabilizei o fluxo de diligências da avaliação de projetos (limites, prazos e planilha orçamentária).',
        'Implementei a validação de proponentes na inscrição, cobrindo MEI, natureza jurídica e verificação anual de cadastro.',
        'Trabalhei em arquitetura em camadas (use cases e repositórios) com testes automatizados (Jest), em Angular 18 e Node.js, com PRs e pipelines de CI/CD no Azure DevOps.',
      ],
      commits: [
        'feat: fase de recursos',
        'fix: estabiliza o fluxo de diligências',
        'feat: validação de proponentes (MEI)',
        'test: use cases e repositórios com Jest',
        'feat: módulo Pareceristas (FASE)',
      ],
    },
    portefrio: {
      role: 'Estagiária de Desenvolvimento',
      short: 'Portefrio (Estágio)',
      location: 'Rio de Janeiro, RJ',
      bullets: [
        'Desenvolvi do zero um CRM em Angular 16 e TypeScript, usado em produção pela equipe de vendas: autenticação, cadastro de clientes e Firebase (Firestore, Authentication e Hosting).',
      ],
      commits: ['init: estágio', 'feat: CRM do zero (Angular 16 + Firebase)'],
    },
  },
  certifications: {
    title: 'Certificações',
    items: [{ name: 'Microsoft Certified: Azure Fundamentals', code: 'AZ-900', year: '2024' }],
  },
  education: {
    title: 'Formação',
    items: [
      {
        degree: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
        school: 'Universidade Veiga de Almeida',
        period: '2022 – 2024',
      },
    ],
  },
  languages: {
    title: 'Idiomas',
    items: ['Português (nativo)', 'Inglês (avançado, leitura e escrita)'],
  },
};
