import { printRelation } from '../problem-model/print-relation';
import {
  formatAcademicInput,
  renderToString,
} from '../representations/academic-relation';
import { formatNamedRelation } from '../representations/named-relation';
import type { PuzzleScreen } from './compose-puzzle';

export function printScreen(puzzleScreen: PuzzleScreen): string {
  const { screen, context } = puzzleScreen;
  const lines = [
    `puzzle ${screen.source.kind} -> ${screen.target.kind}`,
    context.replay
      ? `replay seed=${context.replay.seed} generator=${context.replay.generatorVersion} theme=${context.replay.themeId} story-seed=${context.replay.storySeed} locale=${context.replay.locale}`
      : 'replay none',
    `prompt ${screen.target.prompt}`,
  ];
  if (screen.modeId === 'story-to-quantities') {
    lines.push('source', `  ${context.story}`);
  }
  lines.push('quantities');
  lines.push(
    ...context.quantities.map((quantity) => printQuantity(quantity)),
  );
  if (screen.modeId === 'story-to-quantities') {
    lines.push(
      `selection known=[${screen.input.knownIds.join(', ')}] unknown=${screen.input.unknownId ?? 'none'}`,
    );
  } else if (screen.modeId === 'quantities-to-named-equation') {
    lines.push(`input expression = ${JSON.stringify(screen.input.value)}`);
  } else if (screen.modeId === 'named-equation-to-academic-notation') {
    lines.push(
      `named ${formatNamedRelation(screen.source.relation, screen.source.names)}`,
      ...printSymbolKey(screen.symbolKey),
      `input academic = ${JSON.stringify(screen.input.value)}`,
    );
  } else if (screen.modeId === 'academic-notation-to-named-equation') {
    lines.push(
      `academic-input ${formatAcademicInput(screen.source.relation, screen.source.symbols)}`,
      `academic-display ${renderToString(screen.source.relation, screen.source.symbols)}`,
      ...printSymbolKey(screen.symbolKey),
      `input named = ${JSON.stringify(screen.input.value)}`,
    );
  } else {
    lines.push(
      `named-model ${formatNamedRelation(
        screen.source.relation,
        Object.fromEntries(
          context.quantities.map((quantity) => [
            quantity.id,
            quantity.variableName,
          ]),
        ),
      )}`,
      'candidates',
      ...screen.target.candidates.flatMap((candidate) => [
        `  ${candidate.optionPosition}: ${candidate.id}`,
        `    ${candidate.label}`,
      ]),
      `input story-choice = ${screen.input.selectedChoiceId ?? 'none'}`,
    );
  }
  if (puzzleScreen.submission !== undefined) {
    const submission = puzzleScreen.submission;
    lines.push(`submission ${submission.kind}`);
    if (submission.kind === 'named-equation') {
      lines.push(`  answer-kind ${submission.answerKind}`);
      if (submission.choiceId !== undefined) {
        lines.push(`  choice ${submission.choiceId}`);
      }
      if (submission.relation !== undefined) {
        lines.push(...indent(printRelation(submission.relation)));
      }
    } else if (submission.kind === 'academic-notation') {
      lines.push(`  input ${JSON.stringify(submission.input)}`);
      if (submission.relation !== undefined) {
        lines.push(...indent(printRelation(submission.relation)));
      }
    } else if (submission.kind === 'story-choice') {
      lines.push(`  choice ${submission.choiceId}`);
      if (submission.relation !== undefined) {
        lines.push(...indent(printRelation(submission.relation)));
      }
    }
  }
  if (puzzleScreen.feedback !== undefined) {
    const feedback = puzzleScreen.feedback;
    if ('checkPolicy' in feedback) {
      lines.push(
        `check ${feedback.checkPolicy} equation-sides=${feedback.equationSides}`,
      );
    }
    if (feedback.kind === 'misconception') {
      lines.push(
        `misconception ${feedback.misconception.kind} base=${feedback.misconception.baseQuantityId} count=${feedback.misconception.countQuantityId}`,
      );
    }
    if ('range' in feedback) {
      const { start, end } = feedback.range;
      const expected =
        feedback.kind === 'syntax-error'
          ? ` expected=${JSON.stringify(feedback.expected)}`
          : '';
      lines.push(
        `diagnostic range=${start.line}:${start.column}-${end.line}:${end.column} offsets=${start.offset}-${end.offset}${expected}`,
      );
    }
    lines.push(`feedback ${feedback.kind}: ${feedback.message}`);
  }
  return `${lines.join('\n')}\n`;
}

function printSymbolKey(
  symbols: readonly { symbol: string; variableName: string }[],
): string[] {
  return [
    'symbols',
    ...symbols.map((entry) => `  ${entry.symbol} = ${entry.variableName}`),
  ];
}

function printQuantity(
  quantity: PuzzleScreen['context']['quantities'][number],
): string {
  const value =
    quantity.given.kind === 'known' ? String(quantity.given.value) : '?';
  return `  ${quantity.themeQuantityId} [${quantity.role}] = ${value}`;
}

function indent(value: string): string[] {
  return value
    .trimEnd()
    .split('\n')
    .map((line) => `  ${line}`);
}
