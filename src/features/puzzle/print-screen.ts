import { printRelation } from '../problem-model/print-relation';
import type { PuzzleScreen, ScreenQuantity } from './start-puzzle';

export function printScreen(screen: PuzzleScreen): string {
  const lines = [
    `puzzle ${screen.source.kind} -> ${screen.target.kind}`,
    `replay seed=${screen.replay.seed} generator=${screen.replay.generatorVersion}`,
    `prompt ${screen.target.prompt}`,
    'quantities',
    ...screen.source.quantities.map((quantity) => printQuantity(quantity)),
    `input ${screen.input.kind} = ${JSON.stringify(screen.input.value)}`,
  ];

  if (screen.submission !== undefined) {
    lines.push(`submission ${screen.submission.kind}`);
    if (screen.submission.relation !== undefined) {
      lines.push(...indent(printRelation(screen.submission.relation)));
    }
  }

  if (screen.feedback !== undefined) {
    if ('checkPolicy' in screen.feedback) {
      lines.push(
        `check ${screen.feedback.checkPolicy} equation-sides=${screen.feedback.equationSides}`,
      );
    }
    if ('range' in screen.feedback) {
      const { start, end } = screen.feedback.range;
      const expected =
        screen.feedback.kind === 'syntax-error'
          ? ` expected=${JSON.stringify(screen.feedback.expected)}`
          : '';
      lines.push(
        `diagnostic range=${start.line}:${start.column}-${end.line}:${end.column} offsets=${start.offset}-${end.offset}${expected}`,
      );
    }
    lines.push(`feedback ${screen.feedback.kind}: ${screen.feedback.message}`);
  }

  return `${lines.join('\n')}\n`;
}

function printQuantity(quantity: ScreenQuantity): string {
  const value =
    quantity.given.kind === 'known' ? String(quantity.given.value) : '?';

  return `  ${quantity.id} [${quantity.role}] = ${value}`;
}

function indent(value: string): string[] {
  return value
    .trimEnd()
    .split('\n')
    .map((line) => `  ${line}`);
}
