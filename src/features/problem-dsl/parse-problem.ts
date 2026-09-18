import { parseNamedRelation } from '../named-expression';
import type { Relation } from '../problem-model/expression';
import type {
  Dimension,
  Problem,
  ProblemReplay,
  Quantity,
  QuantityGiven,
  QuantityRole,
} from '../problem-model/problem';
import { problemGrammar } from './problem-grammar';

export type ParseProblemResult =
  | { kind: 'success'; problem: Problem }
  | { kind: 'syntax-error'; message: string };

type ParsedProblem = {
  id: string;
  concepts: readonly string[];
  quantities: readonly Quantity[];
  equationSource: string;
  scenarioId: string;
  symbols: readonly (readonly [string, string])[];
  replay?: ProblemReplay;
};

type ParsedNode =
  | ParsedProblem
  | Quantity
  | QuantityGiven
  | ProblemReplay
  | readonly string[]
  | readonly [string, string]
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
      scenario,
      symbols,
      replay,
      _close,
    ) {
      return {
        id: id.sourceString,
        concepts: concepts.toDomain(),
        quantities: quantities.children.map((quantity) => quantity.toDomain()),
        equationSource: equation.toDomain(),
        scenarioId: scenario.toDomain(),
        symbols: symbols.children.map((symbol) => symbol.toDomain()),
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
      return source.sourceString.trim();
    },
    Scenario(_scenario, scenarioId) {
      return scenarioId.sourceString;
    },
    Symbol(_symbol, quantityId, _equals, symbol) {
      return [quantityId.sourceString, symbol.sourceString] as const;
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
    return { kind: 'syntax-error', message: match.message };
  }

  const parsed = semantics(match).toDomain() as ParsedProblem;
  const relationResult = parseNamedRelation(
    parsed.equationSource,
    canonicalIdentifierResolver,
  );
  if (relationResult.kind !== 'success') {
    return { kind: 'syntax-error', message: relationResult.message };
  }

  return {
    kind: 'success',
    problem: {
      id: parsed.id,
      concepts: parsed.concepts,
      quantities: parsed.quantities,
      relation: relationResult.relation as Relation,
      scenarioId: parsed.scenarioId,
      academicSymbols: Object.fromEntries(parsed.symbols),
      ...(parsed.replay ? { replay: parsed.replay } : {}),
    },
  };
}
