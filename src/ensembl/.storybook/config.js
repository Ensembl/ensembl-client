import { configure, addParameters, addDecorator } from '@storybook/react';

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

configure(loadStories, module);
