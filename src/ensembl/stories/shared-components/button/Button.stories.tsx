/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
