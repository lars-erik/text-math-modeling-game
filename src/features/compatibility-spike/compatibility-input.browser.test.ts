import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import './compatibility-input';

test('accepts keyboard input and submits with Enter', async () => {
  document.body.innerHTML = '<compatibility-input></compatibility-input>';

  const input = page.getByLabelText('Compatibility text');
  await userEvent.click(input);
  await userEvent.keyboard('browser ready');
  await userEvent.keyboard('{Enter}');

  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('Submitted: browser ready');
});
