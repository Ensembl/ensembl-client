import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
  PrimaryButton,
  SecondaryButton
} from 'src/shared/components/button/Button';

import primaryButtonNotes from './primaryButtonNotes.md';
import secondaryButtonNotes from './secondaryButtonNotes.md';

import styles from './Button.stories.scss';

const onClick = action('button-click');

storiesOf('Components|Shared Components/Button/PrimaryButton', module)
  .add(
    'default',
    () => (
      <div className={styles.wrapper}>
        <PrimaryButton onClick={onClick}>Primary button</PrimaryButton>
      </div>
    ),
    { notes: primaryButtonNotes }
  )
  .add(
    'disabled',
    () => (
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
    ),
    { notes: primaryButtonNotes }
  );

storiesOf('Components|Shared Components/Button/SecondaryButton', module).add(
  'default',
  () => (
    <div className={styles.wrapper}>
      <SecondaryButton onClick={onClick}>Secondary button</SecondaryButton>
    </div>
  ),
  { notes: secondaryButtonNotes }
);
