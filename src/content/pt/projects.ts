import type { ProjectsDict } from '@/i18n/types';

export const projects: ProjectsDict = {
  kicker: 'Trabalhos selecionados',
  title: 'Projetos',
  labels: {
    live: 'site',
    code: 'código',
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
    'ice-land': {
      summary: 'Landing page de sorveteria.',
      description:
        'Landing page para uma sorveteria, com foco no apelo visual e numa experiência fluida. Um exercício divertido de transformar um produto simples em um espaço digital convidativo.',
      visualAlt: 'Cores pastel de sorvete sobre uma superfície congelada',
      caseStudy: {
        challenge: 'Transformar um produto simples, sorvete, numa página que dá vontade de pedir.',
        approach:
          'Landing page responsiva com hero, cardápio e depoimentos, menu mobile, header que ganha sombra no scroll e destaca a seção ativa, e animações de entrada com ScrollReveal.',
        decision:
          'HTML, CSS e JavaScript puros, com o CSS separado por seção (header, home, cardápio, depoimentos, rodapé) para manter o código organizado sem framework.',
        outcome: 'Página estática, leve e sem etapa de build, publicada na Vercel.',
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
    'the-bake': {
      summary: 'Landing page de padaria fictícia.',
      description:
        'Landing page para uma padaria fictícia: tons quentes, clima aconchegante e um layout que quase deixa sentir o cheiro do pão. Traduzir uma experiência física para o digital.',
      visualAlt: 'Tons dourados e quentes como pão saindo do forno',
      caseStudy: {
        challenge: 'Traduzir o aconchego de uma padaria artesanal para uma experiência digital.',
        approach:
          'Landing page em Angular 17 com oito seções (hero, nossa história, receitas, menu, como pedir, novidades, reservas e rodapé), menu hambúrguer no mobile e scroll suave.',
        decision: 'SCSS para os tons quentes e a tipografia (Google Fonts), FontAwesome nos ícones e ScrollReveal nas animações de entrada.',
        outcome: 'Layout responsivo para mobile e desktop, publicado na Vercel.',
      },
    },
  },
};
