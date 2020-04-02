import React from 'react';
import { storiesOf } from '@storybook/react';

import VariantsStory from './variantsStory';
import PositioningStory from './positioningStory';
import ScrollingStory from './scrollingStory';

storiesOf('Components|Shared Components/PointerBox', module)
  .add('variants', () => {
    return <VariantsStory />;
  })
  .add('positioning', () => {
    return <PositioningStory />;
  })
  .add('scrolling', () => {
    return <ScrollingStory />;
  });
