import { configure, addParameters, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

function loadStories() {
  require('../stories/index.tsx');
}

addParameters({
  options: {
    name: 'ENSEMBL',
    hierarchyRootSeparator: /\|/,
    hierarchySeparator: /\//
  },
});

addDecorator(withNotes);

configure(loadStories, module);
