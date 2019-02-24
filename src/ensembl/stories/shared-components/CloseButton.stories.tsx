import React from 'react';
import { storiesOf } from '@storybook/react';

import CloseButton from 'src/shared/close-button/CloseButton';

storiesOf('Components|Shared Components/Close button', module)
  .add('default', () => <CloseButton onClick={() => {}} />)
  .add('inverted', () => <CloseButton inverted onClick={() => {}} />);
