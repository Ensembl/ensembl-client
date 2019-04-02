import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { PrimaryButton, SecondaryButton } from 'src/shared/button/Button';

import styles from './Button.stories.scss';

const onClick = action('button-click');

storiesOf('Components|Shared Components/Button/PrimaryButton', module)
  .add('default', () => (
    <div className={styles.wrapper}>
      <PrimaryButton onClick={onClick}>Primary button</PrimaryButton>
    </div>
  ))
  .add('disabled', () => (
    <>
      <p>On white background</p>
      <div className={styles.wrapper}>
        <PrimaryButton onClick={onClick} isDisabled={true}>
          Primary button
        </PrimaryButton>
      </div>
      <p>On light-grey background</p>
      <div className={`${styles.wrapper} ${styles.lightGreyWrapper}`}>
        <PrimaryButton onClick={onClick} isDisabled={true}>
          Primary button
        </PrimaryButton>
      </div>
    </>
  ));

storiesOf('Components|Shared Components/Button/SecondaryButton', module).add(
  'default',
  () => (
    <div style={{ padding: '40px' }}>
      <SecondaryButton onClick={onClick}>Secondary button</SecondaryButton>
    </div>
  )
);
