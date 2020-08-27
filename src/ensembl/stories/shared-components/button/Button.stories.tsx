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

import {
  PrimaryButton,
  SecondaryButton
} from 'src/shared/components/button/Button';

import primaryButtonNotes from './primaryButtonNotes.md';
import secondaryButtonNotes from './secondaryButtonNotes.md';

import styles from './Button.stories.scss';

export default {
  title: 'Components/Shared Components/Button',
  argTypes: { onClick: { action: 'button clicked' } }
};

type DefaultArgs = {
  onClick: (...args: any) => void;
};

export const DefaultPrimaryButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <PrimaryButton onClick={args.onClick}>Primary button</PrimaryButton>
  </div>
);

DefaultPrimaryButton.story = {
  name: 'PrimaryButton',
  parameters: { notes: primaryButtonNotes }
};

export const DisabledPrimaryButton = (args: DefaultArgs) => (
  <>
    <p>On white background</p>
    <div className={styles.wrapper}>
      <PrimaryButton onClick={args.onClick} isDisabled={true}>
        Primary button
      </PrimaryButton>
    </div>
    <p>On light-grey background</p>
    <div className={`${styles.wrapper} ${styles.lightGreyWrapper}`}>
      <PrimaryButton onClick={args.onClick} isDisabled={true}>
        Primary button
      </PrimaryButton>
    </div>
  </>
);

DisabledPrimaryButton.story = {
  name: 'PrimaryButton disabled',
  parameters: { notes: primaryButtonNotes }
};

export const DefaultSecondaryButton = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <SecondaryButton onClick={args.onClick}>Secondary button</SecondaryButton>
  </div>
);

DefaultSecondaryButton.story = {
  name: 'SecondaryButton',
  parameters: { notes: secondaryButtonNotes }
};
