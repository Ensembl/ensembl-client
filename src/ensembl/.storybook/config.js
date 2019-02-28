import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withNotes } from '@storybook/addon-notes';

function loadStories() {
  require('../stories/index.tsx');
}

addDecorator(
  withOptions({
    name: 'ENSEMBL',
    hierarchyRootSeparator: /\|/,
    hierarchySeparator: /\//
  })
)

addDecorator(withNotes);

configure(loadStories, module);
