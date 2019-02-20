import React from 'react';
import { storiesOf } from '@storybook/react';

import PopularSpeciesButton from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

storiesOf('Species Selector/Popular species button', module).add(
  'default',
  () => <PopularSpeciesButton />
);
