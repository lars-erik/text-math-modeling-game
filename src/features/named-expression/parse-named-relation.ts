import type { Expression, Relation } from '../problem-model/expression';
import { namedExpressionGrammar } from './named-expression-grammar';

export type ParseNamedRelationResult =
  | { kind: 'success'; relation: Relation }
  | { kind: 'syntax-error'; message: string };

type ParsedNode = Expression | Relation;

const semantics = namedExpressionGrammar.createSemantics().addOperation<ParsedNode>(
  'toAst',
  {
    Relation(left, _equals, right) {
      return {
        kind: 'equation',
        left: left.toAst(),
        right: right.toAst(),
      };
    },
    AddExpression_add(left, _plus, right) {
      return {
        kind: 'add',
        left: left.toAst(),
        right: right.toAst(),
      };
    },
    AddExpression(expression) {
      return expression.toAst();
    },
    MultiplyExpression_multiply(left, _times, right) {
      return {
        kind: 'multiply',
        left: left.toAst(),
        right: right.toAst(),
      };
    },
    MultiplyExpression(expression) {
      return expression.toAst();
    },
    Primary(identifier) {
      return identifier.toAst();
    },
    identifier(_firstCharacter, _remainingCharacters) {
      return { kind: 'quantity', id: this.sourceString };
    },
  },
);

export function parseNamedRelation(input: string): ParseNamedRelationResult {
  const match = namedExpressionGrammar.match(input);
  if (match.failed()) {
    return { kind: 'syntax-error', message: match.message };
  }

  const node = semantics(match).toAst();
  if (node.kind !== 'equation') {
    return {
      kind: 'syntax-error',
      message: 'Expected an equation.',
    };
  }

  return { kind: 'success', relation: node };
}
