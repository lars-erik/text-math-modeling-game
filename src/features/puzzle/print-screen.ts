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

  return `${lines.join('\n')}\n`;
}

function printQuantity(quantity: ScreenQuantity): string {
  const value =
    quantity.given.kind === 'known' ? String(quantity.given.value) : '?';

  return `  ${quantity.id} [${quantity.role}] = ${value}`;
}
