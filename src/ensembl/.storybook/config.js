import { configure, addParameters } from '@storybook/react';

function loadStories() {
  require('../stories/index.tsx');
}

addParameters({
  options: {
    name: 'ENSEMBL'
  },
});

configure(loadStories, module);
