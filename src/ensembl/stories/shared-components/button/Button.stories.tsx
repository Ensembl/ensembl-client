import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { PrimaryButton, SecondaryButton } from 'src/shared/button/Button';

const onClick = action('button-click');

storiesOf('Components|Shared Components/Button/PrimaryButton', module)
  .add('default', () => (
    <div style={{ padding: '40px' }}>
      <PrimaryButton onClick={onClick}>Primary button</PrimaryButton>
    </div>
  ))
  .add('disabled', () => (
    <div style={{ padding: '40px' }}>
      <PrimaryButton onClick={onClick} isDisabled={true}>
        Primary button
      </PrimaryButton>
    </div>
  ));

storiesOf('Components|Shared Components/Button/SecondaryButton', module).add(
  'default',
  () => (
    <div style={{ padding: '40px' }}>
      <SecondaryButton onClick={onClick}>Secondary button</SecondaryButton>
    </div>
  )
);
