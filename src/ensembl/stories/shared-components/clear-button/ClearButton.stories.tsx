import React from 'react';
import { storiesOf } from '@storybook/react';

import ClearButton from 'src/shared/components/clear-button/ClearButton';

storiesOf('Components|Shared Components/Clear button', module)
  .add('default', () => <ClearButton onClick={() => {}} />)
  .add('inverted', () => <ClearButton inverted onClick={() => {}} />);
