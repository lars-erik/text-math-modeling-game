import { expect, test } from 'vitest';

import { en } from './en';
import { nb } from './nb';

test('generic puzzle locales expose identical nested resource keys', () => {
  expect(nestedKeys(nb)).toEqual(nestedKeys(en));
});

function nestedKeys(value: object, prefix = ''): string[] {
  return Object.entries(value)
    .flatMap(([key, child]) => {
      const path = prefix === '' ? key : `${prefix}.${key}`;
      return typeof child === 'object' && child !== null
        ? nestedKeys(child, path)
        : [path];
    })
    .sort();
}
