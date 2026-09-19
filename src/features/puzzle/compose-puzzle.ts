import type {
  Expression,
  Relation,
} from '../problem-model/expression';
import type { Problem } from '../problem-model/problem';
import {
  skins as allSkins,
  type Skin,
  type SkinId,
  type SkinPresentation,
} from '../skins';
import type { LearnerAnswer, NamedEquationChoice } from './learner-answer';
import { puzzleResources, type PuzzleLocale } from './lang';
import { modes } from './modes';
import {
  createNamedEquationChoiceSeeds,
  type NamedEquationChoiceSeed,
} from './modes/named-equation-choices';
import type {
  ModeId,
  ModeResult,
  ModeState,
  PuzzleFeedback,
  QuantitySelection,
} from './modes';

export type ScreenQuantity = {
  id: string;
  skinQuantityId: string;
  label: string;
  variableName: string;
  displayValue: string;
  role: string;
  given: { kind: 'known'; value: number } | { kind: 'hidden' };
};

export type ReplayContext = {
  seed: number;
  generatorVersion: string;
  skinId: SkinId;
  storySeed: number;
  locale: PuzzleLocale;
};

export type PuzzleScreenContext = {
  locale: PuzzleLocale;
  skinId: SkinId;
  story: string;
  quantities: readonly ScreenQuantity[];
  replay: ReplayContext | undefined;
};

export type StoryToQuantitiesScreen = {
  modeId: 'story-to-quantities';
  source: { kind: 'story' };
  target: {
    kind: 'quantities';
    prompt: string;
    quantities: readonly ScreenQuantity[];
  };
  input: { kind: 'quantity-selection' } & QuantitySelection;
};

export type QuantitiesToNamedEquationScreen = {
  modeId: 'quantities-to-named-equation';
  source: { kind: 'quantities'; quantities: readonly ScreenQuantity[] };
  target: { kind: 'named-equation'; prompt: string };
  input: { kind: 'expression'; value: string };
};

export type PuzzleScreenTask =
  | StoryToQuantitiesScreen
  | QuantitiesToNamedEquationScreen;

export type PuzzleSubmission =
  | {
      kind: 'quantity-selection';
      knownIds: readonly string[];
      unknownId?: string;
    }
  | {
      kind: 'named-equation';
      answerKind: LearnerAnswer['kind'];
      input: string;
      choiceId?: string;
      relation?: Relation;
    };

export type PuzzleScreen = {
  screen: PuzzleScreenTask;
  context: PuzzleScreenContext;
  submission?: PuzzleSubmission;
  feedback?: PuzzleFeedback;
};

export type ComposePuzzleOptions = {
  problem: Problem;
  skinId: SkinId;
  modeId: ModeId;
  locale: PuzzleLocale;
  storySeed?: number;
};

export function composePuzzle(options: ComposePuzzleOptions): PuzzleScreen {
  return mergeModeWithSkin(options, startMode(options));
}

export function submitPuzzle(
  options: ComposePuzzleOptions & {
    answer: LearnerAnswer | QuantitySelection;
  },
): PuzzleScreen {
  const presentation = presentSkinOf(options);
  const { state, feedback } = modes[options.modeId].submit({
    problem: options.problem,
    locale: options.locale,
    answer: options.answer,
    names: presentation.learnerNames,
  });
  return mergeModeWithSkin(options, { state, feedback });
}

function startMode(options: ComposePuzzleOptions): ModeResult {
  return modes[options.modeId].start({
    problem: options.problem,
    locale: options.locale,
  });
}

function mergeModeWithSkin(
  options: ComposePuzzleOptions,
  modeResult: ModeResult,
): PuzzleScreen {
  const presentation = presentSkinOf(options);
  const quantities = toScreenQuantities(presentation);
  return {
    screen: mergeTask(options, modeResult.state, quantities),
    context: {
      locale: options.locale,
      skinId: presentation.skinId,
      story: presentation.story.text,
      quantities,
      replay: composeReplay(options, presentation),
    },
    submission: submissionOf(modeResult),
    feedback: modeResult.feedback,
  };
}

function submissionOf(modeResult: ModeResult): PuzzleSubmission | undefined {
  const state = modeResult.state;
  if (state.modeId === 'story-to-quantities') {
    return state.input.knownIds.length === 0 && state.input.unknownId === undefined
      ? undefined
      : {
          kind: 'quantity-selection',
          knownIds: state.input.knownIds,
          ...(state.input.unknownId === undefined
            ? {}
            : { unknownId: state.input.unknownId }),
        };
  }
  return state.input.value === ''
    ? undefined
    : {
        kind: 'named-equation',
        answerKind: 'text',
        input: state.input.value,
        ...(modeResult.feedback?.kind === 'accepted'
          ? {}
          : { relation: undefined }),
      };
}

function mergeTask(
  options: ComposePuzzleOptions,
  state: ModeState,
  quantities: readonly ScreenQuantity[],
): PuzzleScreenTask {
  const resources = puzzleResources[options.locale];
  switch (state.modeId) {
    case 'story-to-quantities':
      return {
        modeId: 'story-to-quantities',
        source: { kind: 'story' },
        target: {
          kind: 'quantities',
          prompt: resources.storyToQuantities.prompt,
          quantities,
        },
        input: state.input,
      };
    case 'quantities-to-named-equation':
      return {
        modeId: 'quantities-to-named-equation',
        source: { kind: 'quantities', quantities },
        target: state.target,
        input: state.input,
      };
  }
}

function toScreenQuantities(
  presentation: SkinPresentation,
): readonly ScreenQuantity[] {
  return presentation.facts.map((fact) => ({
    id: fact.canonicalId,
    skinQuantityId: fact.skinQuantityId,
    label: fact.label,
    variableName: fact.variableName,
    displayValue:
      fact.visibility === 'known' ? `${fact.value} ${fact.unit}` : '?',
    role: fact.role,
    given:
      fact.visibility === 'known' && fact.value !== undefined
        ? { kind: 'known' as const, value: fact.value }
        : { kind: 'hidden' as const },
  }));
}

function composeReplay(
  options: ComposePuzzleOptions,
  presentation: SkinPresentation,
): ReplayContext | undefined {
  return options.problem.replay
    ? {
        ...options.problem.replay,
        locale: options.locale,
        skinId: presentation.skinId,
        storySeed: presentation.story.storySeed,
      }
    : undefined;
}

export function presentSkin(
  skinId: SkinId,
  problem: Problem,
  locale: PuzzleLocale,
  storySeed: number,
): SkinPresentation {
  const skin: Skin | undefined = allSkins[skinId];
  if (skin === undefined) {
    throw new Error(`Unknown skin ${skinId}.`);
  }
  return skin.present({ problem, locale, storySeed });
}

function presentSkinOf(options: ComposePuzzleOptions): SkinPresentation {
  return presentSkin(
    options.skinId,
    options.problem,
    options.locale,
    options.storySeed ?? options.problem.replay?.seed ?? 0,
  );
}

export function createNamedEquationChoices(
  problem: Problem,
  presentation: SkinPresentation,
): readonly NamedEquationChoice[] {
  return labelChoiceSeeds(
    createNamedEquationChoiceSeeds(problem),
    presentation,
  );
}

function labelChoiceSeeds(
  seeds: readonly NamedEquationChoiceSeed[],
  presentation: SkinPresentation,
): readonly NamedEquationChoice[] {
  const names = new Map(
    presentation.facts.map((fact) => [fact.canonicalId, fact.variableName]),
  );
  return seeds.map((seed) => ({
    id: seed.id,
    label: formatRelationLabel(seed.relation, names),
    relation: seed.relation,
  }));
}

function formatRelationLabel(
  relation: Relation,
  names: ReadonlyMap<string, string>,
): string {
  return `${formatExpression(relation.left, names)} = ${formatExpression(
    relation.right,
    names,
  )}`;
}

function formatExpression(
  expression: Expression,
  names: ReadonlyMap<string, string>,
): string {
  switch (expression.kind) {
    case 'literal':
      return String(expression.value);
    case 'quantity':
      return requireName(names, expression.id);
    case 'add':
      return formatBinary(expression.left, expression.right, '+', names);
    case 'multiply':
      return formatBinary(expression.left, expression.right, '*', names);
  }
}

function formatBinary(
  left: Expression,
  right: Expression,
  operator: '+' | '*',
  names: ReadonlyMap<string, string>,
): string {
  const formatOperand = (expression: Expression): string =>
    operator === '*' && expression.kind === 'add'
      ? `(${formatExpression(expression, names)})`
      : formatExpression(expression, names);
  return `${formatOperand(left)} ${operator} ${formatOperand(right)}`;
}

function requireName(
  names: ReadonlyMap<string, string>,
  id: string,
): string {
  const name = names.get(id);
  if (name === undefined) {
    throw new Error(`No skin name for canonical quantity ${id}.`);
  }
  return name;
}
