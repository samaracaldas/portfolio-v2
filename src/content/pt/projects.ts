import type { ProjectsDict } from '@/i18n/types';

export const projects: ProjectsDict = {
  kicker: 'Trabalhos selecionados',
  title: 'Projetos',
  labels: {
    live: 'site',
    code: 'código',
    demo: 'painel (entre como visitante)',
    stack: 'Stack',
    expand: 'Mais sobre',
    close: 'Fechar',
    status: 'no ar ✓',
    caseStudy: { challenge: 'desafio', approach: 'o que fiz', decision: 'decisão técnica', outcome: 'resultado' },
    opensInNewTab: 'abre em nova aba',
  },
  items: {
    financeflow: {
      summary: 'Gestão financeira para pequenas empresas.',
      description:
        'Aplicação full-stack de gestão financeira para pequenas empresas. Inclui autenticação, controle de despesas, gestão de orçamento e dashboards interativos com gráficos e exportação de dados.',
      visualAlt: 'Tela de login do FinanceFlow: gestão financeira simples para pequenas empresas',
      caseStudy: {
        challenge: 'Pequenas empresas precisam controlar entradas, saídas e fluxo de caixa sem a complexidade de um ERP.',
        approach:
          'API REST em Node.js, Express e Mongoose, e front em Next.js (App Router) com dashboard de KPIs, gráfico de fluxo de caixa (Recharts), transações com filtros, contas, categorias e relatórios com exportação CSV.',
        decision:
          'JWT em cookie httpOnly em vez de localStorage, para proteger contra XSS, com CORS com credenciais entre Vercel e Render. Validação com Zod em todos os endpoints e populate do Mongoose para evitar consultas N+1.',
        outcome: 'Aplicação no ar ponta a ponta: front na Vercel, API no Render e banco no MongoDB Atlas, com layout mobile-first.',
      },
    },
    bendita: {
      summary: 'Loja de doceria com pedidos de verdade.',
      description:
        'Loja de uma doceria e padaria fictícia da Vila Madalena: vitrine com estoque do dia, montador de sonho, combo sonho + café, encomendas de festa e acompanhamento do pedido. Cada pedido chega ao painel do balcão em tempo real.',
      visualAlt: 'Página inicial da Bendita: “Sonho recheado na hora, do jeito que você pedir”, com fotos de sonho, bolo de pote e pão de queijo',
      caseStudy: {
        challenge:
          'Ir além de uma landing page: uma loja em que o pedido chega de verdade ao balcão, sem vender o que já acabou e sem confiar no preço que vem do navegador.',
        approach:
          'Astro e TypeScript sem framework de UI, Supabase (Postgres, Auth e Realtime) e um painel do balcão com pedidos, encomendas e estoque ao vivo. Um botão de visitante abre o painel em modo somente leitura.',
        decision:
          'As regras ficam no banco: funções em PL/pgSQL recalculam preço e desconto e reservam o estoque numa transação com trava, com RLS em todas as tabelas, limites contra abuso e link de acompanhamento com token aleatório. A loja fala com o banco por fetch, e o supabase-js só carrega no painel.',
        outcome:
          '86 testes unitários e do banco (PGlite) e 29 cenários ponta a ponta em desktop e celular com Playwright, CI no GitHub Actions, cabeçalhos de segurança testados e deploy na Vercel.',
      },
    },
    'the-dive': {
      summary: 'Landing page de blog de mergulho.',
      description:
        'Landing page para um blog de mergulho, pensada para transmitir a calma e a profundidade do mundo subaquático. Layout limpo, tipografia forte e uma atmosfera que puxa você para dentro.',
      visualAlt: 'Água azul profunda com luz ondulando através dela',
      caseStudy: {
        challenge: 'Passar a calma e a profundidade do mergulho logo na primeira dobra de um blog.',
        approach:
          'Landing page em Angular 17 com standalone components (header, navegação, sobre e rodapé), ícones Remix Icon e tipografia forte sobre fotos subaquáticas.',
        decision:
          'Criei uma diretiva Angular própria de scroll reveal para as animações de entrada, reaproveitada entre os componentes em vez de um script externo.',
        outcome: 'Estrutura componentizada e responsiva, pronta para crescer para um blog completo, publicada na Vercel.',
      },
    },
  },
};
