/**
 * Fictional code sample reviewed by the "agents" in the AI section.
 * Line numbers in the locale review comments refer to this array (1-based).
 */
export const AI_CODE = {
  filename: 'proposals.service.ts',
  lines: [
    'export async function getPending(userId) {',
    '  const res = await fetch(`/api/proposals?user=${userId}`);',
    '  const data = await res.json();',
    "  return data.filter((p) => p.status == 'pending');",
    '}',
  ],
  /** The single line the agents rewrite. */
  fix: {
    line: 4,
    after: "  return data.filter((p: Proposal) => p.status === 'pending');",
  },
} as const;
