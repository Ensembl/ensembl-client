import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from 'src/shared/button/Button';

const onClick = action('button-click');

storiesOf('Components|Shared Components/Button', module).add('default', () => (
  <Button onClick={onClick}>Add</Button>
));
