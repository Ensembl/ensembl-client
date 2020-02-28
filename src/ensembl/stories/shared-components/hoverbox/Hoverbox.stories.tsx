import React from 'react';
import { storiesOf } from '@storybook/react';

import { Hoverbox } from 'src/shared/components/hoverbox';

storiesOf('Components|Shared Components/Hoverbox', module).add(
  'default',
  () => <Hoverbox>This is hoverbox content</Hoverbox>
);
