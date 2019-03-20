import React from 'react';
import { storiesOf } from '@storybook/react';

import Accordion from 'src/shared/accordion/Accordion';

storiesOf('Components|Shared Components/Accordion', module).add(
  'default',
  () => <Accordion />
);
