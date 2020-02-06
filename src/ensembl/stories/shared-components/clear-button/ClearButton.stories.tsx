import React from 'react';
import { storiesOf } from '@storybook/react';
import noop from 'lodash/noop';

import ClearButton from 'src/shared/components/clear-button/ClearButton';

storiesOf('Components|Shared Components/Clear button', module)
  .add('default', () => <ClearButton onClick={noop} />)
  .add('inverted', () => <ClearButton inverted onClick={noop} />);
