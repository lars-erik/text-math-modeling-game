import type { StoryQuantitiesScreen } from './story-quantities';

export function printStoryQuantitiesScreen(screen: StoryQuantitiesScreen): string {
  const lines = [
    'puzzle story -> quantities',
    screen.replay
      ? `replay seed=${screen.replay.seed} generator=${screen.replay.generatorVersion} scenario=${screen.replay.scenarioId} story-seed=${screen.replay.storySeed} locale=${screen.replay.locale}`
      : 'replay none',
    'source',
    `  ${screen.source.text}`,
    `prompt ${screen.target.prompt}`,
    'choices',
    ...screen.target.choices.map(
      (choice) =>
        `  ${choice.id} variable=${choice.variableName} label=${JSON.stringify(choice.label)} value=${choice.displayValue}`,
    ),
    `selection known=[${screen.input.knownIds.join(', ')}] unknown=${screen.input.unknownId ?? 'none'}`,
  ];

  if (screen.feedback !== undefined) {
    lines.push(`feedback ${screen.feedback.kind}: ${screen.feedback.message}`);
  }

  return `${lines.join('\n')}\n`;
}
