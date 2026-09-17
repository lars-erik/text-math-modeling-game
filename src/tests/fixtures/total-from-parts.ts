import type { Relation } from '../../domain/expression';

export const totalFromParts: Relation = {
  kind: 'equation',
  left: { kind: 'quantity', id: 'total' },
  right: {
    kind: 'add',
    left: { kind: 'quantity', id: 'base' },
    right: {
      kind: 'multiply',
      left: { kind: 'quantity', id: 'count' },
      right: { kind: 'quantity', id: 'unitValue' },
    },
  },
};
