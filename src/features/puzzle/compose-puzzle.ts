import type {
  Expression,
  Relation,
} from '../problem-model/expression';
import type { Problem } from '../problem-model/problem';
import {
  themes as allThemes,
  type Theme,
  type ThemeId,
  type ThemePresentation,
} from '../themes';
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
  ModeSubmission,
  PuzzleFeedback,
  QuantitySelection,
} from './modes';

export type ScreenQuantity = {
  id: string;
  themeQuantityId: string;
  label: string;
  variableName: string;
  displayValue: string;
  role: string;
  given: { kind: 'known'; value: number } | { kind: 'hidden' };
};

export type ReplayContext = {
  seed: number;
  generatorVersion: string;
  themeId: ThemeId;
  storySeed: number;
  locale: PuzzleLocale;
};

export type PuzzleScreenContext = {
  locale: PuzzleLocale;
  themeId: ThemeId;
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

export type PuzzleScreen = {
  screen: PuzzleScreenTask;
  context: PuzzleScreenContext;
  submission?: ModeSubmission;
  feedback?: PuzzleFeedback;
};

export type ComposePuzzleOptions = {
  problem: Problem;
  themeId: ThemeId;
  modeId: ModeId;
  locale: PuzzleLocale;
  storySeed?: number;
};

export function composePuzzle(options: ComposePuzzleOptions): PuzzleScreen {
  return mergeModeWithTheme(options, startMode(options));
}

export function submitPuzzle(
  options: ComposePuzzleOptions & {
    answer: LearnerAnswer | QuantitySelection;
  },
): PuzzleScreen {
  const presentation = presentThemeOf(options);
  const { state, feedback, submission } = modes[options.modeId].submit({
    problem: options.problem,
    locale: options.locale,
    answer: options.answer,
    names: presentation.learnerNames,
  });
  return mergeModeWithTheme(options, { state, feedback, submission });
}

function startMode(options: ComposePuzzleOptions): ModeResult {
  return modes[options.modeId].start({
    problem: options.problem,
    locale: options.locale,
  });
}

function mergeModeWithTheme(
  options: ComposePuzzleOptions,
  modeResult: ModeResult,
): PuzzleScreen {
  const presentation = presentThemeOf(options);
  const quantities = toScreenQuantities(presentation);
  return {
    screen: mergeTask(options, modeResult.state, quantities),
    context: {
      locale: options.locale,
      themeId: presentation.themeId,
      story: presentation.story.text,
      quantities,
      replay: composeReplay(options, presentation),
    },
    submission: modeResult.submission,
    feedback: modeResult.feedback,
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
  presentation: ThemePresentation,
): readonly ScreenQuantity[] {
  return presentation.facts.map((fact) => ({
    id: fact.canonicalId,
    themeQuantityId: fact.themeQuantityId,
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
  presentation: ThemePresentation,
): ReplayContext | undefined {
  return options.problem.replay
    ? {
        ...options.problem.replay,
        locale: options.locale,
        themeId: presentation.themeId,
        storySeed: presentation.story.storySeed,
      }
    : undefined;
}

export function presentTheme(
  themeId: ThemeId,
  problem: Problem,
  locale: PuzzleLocale,
  storySeed: number,
): ThemePresentation {
  const theme: Theme | undefined = allThemes[themeId];
  if (theme === undefined) {
    throw new Error(`Unknown theme ${themeId}.`);
  }
  return theme.present({ problem, locale, storySeed });
}

function presentThemeOf(options: ComposePuzzleOptions): ThemePresentation {
  return presentTheme(
    options.themeId,
    options.problem,
    options.locale,
    options.storySeed ?? options.problem.replay?.seed ?? 0,
  );
}

export function createNamedEquationChoices(
  problem: Problem,
  presentation: ThemePresentation,
): readonly NamedEquationChoice[] {
  return labelChoiceSeeds(
    createNamedEquationChoiceSeeds(problem),
    presentation,
  );
}

function labelChoiceSeeds(
  seeds: readonly NamedEquationChoiceSeed[],
  presentation: ThemePresentation,
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
    throw new Error(`No theme name for canonical quantity ${id}.`);
  }
  return name;
}
