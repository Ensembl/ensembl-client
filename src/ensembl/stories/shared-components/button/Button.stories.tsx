import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { PrimaryButton, SecondaryButton } from 'src/shared/button/Button';

const onClick = action('button-click');

storiesOf('Components|Shared Components/Button/PrimaryButton', module)
  .add('default', () => <PrimaryButton onClick={onClick}>Add</PrimaryButton>)
  .add('disabled', () => (
    <PrimaryButton onClick={onClick} isDisabled={true}>
      Add
    </PrimaryButton>
  ));

storiesOf('Components|Shared Components/Button/SecondaryButton', module).add(
  'default',
  () => <SecondaryButton onClick={onClick}>Add</SecondaryButton>
);
