import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';

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

configure(loadStories, module);