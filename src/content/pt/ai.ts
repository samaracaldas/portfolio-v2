import type { AiDict } from '@/i18n/types';

export const ai: AiDict = {
  kicker: 'Como trabalho com IA',
  title: 'Agentes no fluxo',
  intro:
    'Cerca de metade dos meus commits desde mar/2026 foi feita em par com o Claude Code. Mas a IA não decide sozinha: tudo parte de uma especificação, roda dentro de regras do projeto e passa por revisão humana.',
  practices: [
    {
      title: 'Spec-driven development',
      text: 'As maiores features de 2026 começaram por um tech doc mapeado contra o código real (escopo, modelo de dados, casos de uso e API) e validado com o PO. Ele vira o contexto da IA e o guia da implementação e do review.',
    },
    {
      title: 'Skills e rules por camada',
      text: 'Criei a gestão de contexto da IA do time no Claude Code: skills para regras de negócio, API e UI com as convenções do projeto, e rules compartilhadas.',
    },
    {
      title: 'Subagents no planejamento e no review',
      text: 'Subagents fazem análise de viabilidade técnica antes de construir e code review automatizado antes de cada PR.',
    },
    {
      title: 'Desvio vira regra',
      text: 'Quando o código gerado foge do padrão (por exemplo, if/else onde o projeto usa guard clause), transformo a correção em skill, para o desvio ser barrado antes do review.',
    },
  ],
  codeLabel: 'Trecho de código fictício em revisão',
  reviewsTitle: 'Comentários de review',
  reviews: [
    { line: 1, agent: 'review:types', comment: 'userId está implicitamente como any. Tipe o parâmetro e o retorno.' },
    { line: 2, agent: 'review:errors', comment: 'res.ok nunca é verificado, então uma requisição com erro chega no res.json().' },
    { line: 4, agent: 'review:style', comment: 'Use igualdade estrita (===) e tipe o callback.' },
  ],
  replayLabel: 'rever review',
  fixLabel: 'Correção sugerida aplicada',
};
