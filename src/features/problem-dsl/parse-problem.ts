import {
  parseNamedRelation,
  type SourcePosition,
  type SourceRange,
} from '../named-expression';
import type { Relation } from '../problem-model/expression';
import type {
  Dimension,
  Problem,
  ProblemReplay,
  Quantity,
  QuantityGiven,
  QuantityRole,
} from '../problem-model/problem';
import {
  validateProblemAst,
  type ProblemAstIssue,
} from '../problem-model/problem-validation';
import { problemGrammar } from './problem-grammar';

export type ParseProblemResult =
  | { kind: 'success'; problem: Problem }
  | { kind: 'invalid-problem'; issues: readonly ProblemAstIssue[] }
  | {
      kind: 'syntax-error';
      message: string;
      expected: string;
      range: SourceRange;
    };

type ParsedProblem = {
  id: string;
  concepts: readonly string[];
  quantities: readonly Quantity[];
  equation: ParsedEquation;
  replay?: ProblemReplay;
};

type ParsedEquation = {
  source: string;
  startOffset: number;
};

type ParsedNode =
  | ParsedProblem
  | Quantity
  | QuantityGiven
  | ProblemReplay
  | ParsedEquation
  | readonly string[]
  | string;

const semantics = problemGrammar.createSemantics().addOperation<ParsedNode>(
  'toDomain',
  {
    Problem(
      _problem,
      id,
      _open,
      concepts,
      quantities,
      equation,
      replay,
      _close,
    ) {
      return {
        id: id.sourceString,
        concepts: concepts.toDomain(),
        quantities: quantities.children.map((quantity) => quantity.toDomain()),
        equation: equation.toDomain(),
        ...(replay.children.length === 0
          ? {}
          : { replay: replay.children[0].toDomain() }),
      } as ParsedProblem;
    },
    Concepts(_concepts, _open, conceptIds, _close) {
      return conceptIds.children.map((conceptId) => conceptId.sourceString);
    },
    Quantity(_quantity, id, _colon, dimension, role, _equals, given) {
      return {
        id: id.sourceString,
        dimension: dimension.sourceString as Dimension,
        ...(role.children.length === 0
          ? {}
          : { role: role.children[0].toDomain() as QuantityRole }),
        given: given.toDomain(),
      } as Quantity;
    },
    Role(_role, role) {
      return role.sourceString;
    },
    Given_hidden(_question) {
      return { kind: 'hidden' } as QuantityGiven;
    },
    Given_known(integer) {
      return {
        kind: 'known',
        value: Number(integer.sourceString),
      } as QuantityGiven;
    },
    Equation(_equation, _open, source, _close) {
      const rawSource = source.sourceString;
      const leadingWhitespaceLength = rawSource.length - rawSource.trimStart().length;
      return {
        source: rawSource.trim(),
        startOffset: source.source.startIdx + leadingWhitespaceLength,
      } as ParsedEquation;
    },
    Replay(_replay, _open, _seed, seed, _generator, generatorVersion, _close) {
      return {
        seed: Number(seed.sourceString),
        generatorVersion: generatorVersion.sourceString,
      } as ProblemReplay;
    },
  },
);

const canonicalIdentifierResolver = {
  resolve(identifier: string) {
    return { kind: 'resolved' as const, quantityId: identifier };
  },
};

export function parseProblem(source: string): ParseProblemResult {
  const match = problemGrammar.match(source);
  if (match.failed()) {
    const offset = match.getRightmostFailurePosition();
    const range = rangeFromOffsets(source, offset, offset);
    const expected = match.getExpectedText();
    return {
      kind: 'syntax-error',
      message: `Expected ${expected} at line ${range.start.line}, column ${range.start.column}.`,
      expected,
      range,
    };
  }

  const parsed = semantics(match).toDomain() as ParsedProblem;

  const relationResult = parseNamedRelation(
    parsed.equation.source,
    canonicalIdentifierResolver,
  );
  if (relationResult.kind !== 'success') {
    const range = shiftRange(
      source,
      relationResult.range,
      parsed.equation.startOffset,
    );
    const expected = relationResult.kind === 'syntax-error'
      ? relationResult.expected
      : 'a valid canonical equation';
    return {
      kind: 'syntax-error',
      message: `Expected ${expected} at line ${range.start.line}, column ${range.start.column}.`,
      expected,
      range,
    };
  }

  const problem: Problem = {
    id: parsed.id,
    concepts: parsed.concepts,
    quantities: parsed.quantities,
    relation: relationResult.relation as Relation,
    ...(parsed.replay ? { replay: parsed.replay } : {}),
  };

  const issues = validateProblemAst(problem);
  return issues.length > 0
    ? { kind: 'invalid-problem', issues }
    : { kind: 'success', problem };
}

function shiftRange(
  source: string,
  range: SourceRange,
  offset: number,
): SourceRange {
  return rangeFromOffsets(
    source,
    offset + range.start.offset,
    offset + range.end.offset,
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
