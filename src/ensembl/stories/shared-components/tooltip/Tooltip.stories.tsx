import React from 'react';
import { storiesOf } from '@storybook/react';

import VariantsStory from './variantsStory';
import PositioningStory from './positioningStory';

storiesOf('Components|Shared Components/Tooltip', module)
  .add('variants', () => {
    return <VariantsStory />;
  })
  .add('positioning', () => {
    return <PositioningStory />;
  });
