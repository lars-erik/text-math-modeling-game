import type {
  Expression,
  QuantityId,
  Relation,
} from '../problem-model/expression';
import { namedExpressionGrammar } from './named-expression-grammar';

export type LearnerIdentifier = string;

export type LearnerNameMap = Readonly<
  Record<LearnerIdentifier, QuantityId | readonly QuantityId[]>
>;

export type LearnerIdentifierResolution =
  | { kind: 'resolved'; quantityId: QuantityId }
  | { kind: 'unknown' }
  | { kind: 'ambiguous'; candidateIds: readonly QuantityId[] };

export type LearnerNameResolver = {
  resolve: (
    identifier: LearnerIdentifier,
  ) => LearnerIdentifierResolution;
  availableIdentifiers?: readonly LearnerIdentifier[];
};

export type LearnerNameSource = LearnerNameMap | LearnerNameResolver;

export type SourcePosition = {
  offset: number;
  line: number;
  column: number;
};

export type SourceRange = {
  start: SourcePosition;
  end: SourcePosition;
};

export type NamedRelationDiagnostic =
  | {
      kind: 'syntax-error';
      message: string;
      expected: string;
      range: SourceRange;
    }
  | {
      kind: 'unknown-identifier';
      message: string;
      identifier: LearnerIdentifier;
      availableIdentifiers: readonly LearnerIdentifier[];
      range: SourceRange;
    }
  | {
      kind: 'ambiguous-identifier';
      message: string;
      identifier: LearnerIdentifier;
      candidateIds: readonly QuantityId[];
      range: SourceRange;
    }
  | {
      kind: 'invalid-integer-literal';
      message: string;
      literal: string;
      range: SourceRange;
    };

export type ParseNamedRelationResult =
  | { kind: 'success'; relation: Relation }
  | NamedRelationDiagnostic;

type ParsedIdentifier = {
  kind: 'identifier';
  identifier: LearnerIdentifier;
  range: SourceRange;
};

type ParsedInteger = {
  kind: 'integer';
  literal: string;
  range: SourceRange;
};

type ParsedExpression =
  | ParsedIdentifier
  | ParsedInteger
  | { kind: 'add'; left: ParsedExpression; right: ParsedExpression }
  | { kind: 'multiply'; left: ParsedExpression; right: ParsedExpression };

type ParsedRelation = {
  kind: 'equation';
  left: ParsedExpression;
  right: ParsedExpression;
};

type ParsedNode = ParsedExpression | ParsedRelation;

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
    MultiplyExpression_juxtapose(left, right) {
      return {
        kind: 'multiply',
        left: left.toAst(),
        right: right.toAst(),
      };
    },
    MultiplyExpression(expression) {
      return expression.toAst();
    },
    Primary_parenthesized(_open, expression, _close) {
      return expression.toAst();
    },
    Primary_integer(integer) {
      return integer.toAst();
    },
    Primary_identifier(identifier) {
      return identifier.toAst();
    },
    identifier(_firstCharacter, _remainingCharacters) {
      return {
        kind: 'identifier',
        identifier: this.sourceString,
        range: rangeFromOffsets(
          this.source.sourceString,
          this.source.startIdx,
          this.source.endIdx,
        ),
      };
    },
    integer(_digits) {
      return {
        kind: 'integer',
        literal: this.sourceString,
        range: rangeFromOffsets(
          this.source.sourceString,
          this.source.startIdx,
          this.source.endIdx,
        ),
      };
    },
  },
);

export function parseNamedRelation(
  input: string,
  names: LearnerNameSource,
): ParseNamedRelationResult {
  const match = namedExpressionGrammar.match(input);
  if (match.failed()) {
    const offset = match.getRightmostFailurePosition();
    const range = rangeFromOffsets(input, offset, offset);
    const expected = match.getExpectedText();

    return {
      kind: 'syntax-error',
      message: `Expected ${expected} at line ${range.start.line}, column ${range.start.column}.`,
      expected,
      range,
    };
  }

  const node = semantics(match).toAst();
  if (node.kind !== 'equation') {
    return {
      kind: 'syntax-error',
      message: 'Expected an equation at line 1, column 1.',
      expected: 'an equation',
      range: rangeFromOffsets(input, 0, 0),
    };
  }

  const resolver = asResolver(names);
  const left = resolveExpression(node.left, resolver);
  if (isDiagnostic(left)) {
    return left;
  }

  const right = resolveExpression(node.right, resolver);
  if (isDiagnostic(right)) {
    return right;
  }

  return {
    kind: 'success',
    relation: { kind: 'equation', left, right },
  };
}

export function createLearnerNameResolver(
  names: LearnerNameMap,
): LearnerNameResolver {
  const availableIdentifiers = Object.keys(names).sort();

  return {
    availableIdentifiers,
    resolve(identifier) {
      if (!Object.hasOwn(names, identifier)) {
        return { kind: 'unknown' };
      }

      const mapped = names[identifier];
      if (typeof mapped === 'string') {
        return { kind: 'resolved', quantityId: mapped };
      }

      const candidateIds = [...new Set(mapped)].sort();
      if (candidateIds.length === 0) {
        return { kind: 'unknown' };
      }

      if (candidateIds.length === 1) {
        return { kind: 'resolved', quantityId: candidateIds[0] };
      }

      return { kind: 'ambiguous', candidateIds };
    },
  };
}

function asResolver(names: LearnerNameSource): LearnerNameResolver {
  return isLearnerNameResolver(names)
    ? names
    : createLearnerNameResolver(names);
}

function isLearnerNameResolver(
  names: LearnerNameSource,
): names is LearnerNameResolver {
  return typeof (names as Partial<LearnerNameResolver>).resolve === 'function';
}

function resolveExpression(
  expression: ParsedExpression,
  resolver: LearnerNameResolver,
): Expression | NamedRelationDiagnostic {
  switch (expression.kind) {
    case 'identifier': {
      const resolution = resolver.resolve(expression.identifier);
      switch (resolution.kind) {
        case 'resolved':
          return { kind: 'quantity', id: resolution.quantityId };

        case 'unknown':
          return {
            kind: 'unknown-identifier',
            identifier: expression.identifier,
            message: `Unknown identifier ${JSON.stringify(expression.identifier)}.`,
            range: expression.range,
            availableIdentifiers: [...(resolver.availableIdentifiers ?? [])].sort(),
          };

        case 'ambiguous':
          return {
            kind: 'ambiguous-identifier',
            identifier: expression.identifier,
            message: `Identifier ${JSON.stringify(expression.identifier)} is ambiguous.`,
            range: expression.range,
            candidateIds: [...new Set(resolution.candidateIds)].sort(),
          };
      }
    }

    case 'integer': {
      const value = Number(expression.literal);
      return Number.isSafeInteger(value)
        ? { kind: 'literal', value }
        : {
            kind: 'invalid-integer-literal',
            literal: expression.literal,
            message: `Integer literal ${JSON.stringify(expression.literal)} is outside the safe integer range.`,
            range: expression.range,
          };
    }

    case 'add': {
      const left = resolveExpression(expression.left, resolver);
      if (isDiagnostic(left)) {
        return left;
      }
      const right = resolveExpression(expression.right, resolver);
      return isDiagnostic(right)
        ? right
        : { kind: 'add', left, right };
    }

    case 'multiply': {
      const left = resolveExpression(expression.left, resolver);
      if (isDiagnostic(left)) {
        return left;
      }
      const right = resolveExpression(expression.right, resolver);
      return isDiagnostic(right)
        ? right
        : { kind: 'multiply', left, right };
    }
  }
}

function isDiagnostic(
  value: Expression | NamedRelationDiagnostic,
): value is NamedRelationDiagnostic {
  return (
    value.kind === 'syntax-error' ||
    value.kind === 'unknown-identifier' ||
    value.kind === 'ambiguous-identifier' ||
    value.kind === 'invalid-integer-literal'
  );
}

function rangeFromOffsets(
  source: string,
  startOffset: number,
  endOffset: number,
): SourceRange {
  return {
    start: positionAt(source, startOffset),
    end: positionAt(source, endOffset),
  };
}

function positionAt(source: string, offset: number): SourcePosition {
  const lines = source.slice(0, offset).split(/\r\n|\r|\n/);
  return {
    offset,
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
}
