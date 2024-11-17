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

import { useState, type FormEvent } from 'react';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './Checkbox.stories.module.css';

const CheckboxesWithoutLabel = () => (
  <div className={styles.wrapper}>
    <p>Enabled</p>
    <Checkbox />
    <p>Disabled</p>
    <Checkbox disabled={true} />
  </div>
);

const CheckboxesWithLabel = () => (
  <div className={styles.wrapper}>
    <Checkbox>I am label, you can click me</Checkbox>
    <Checkbox disabled={true}>I am label of disabled checkbox</Checkbox>
  </div>
);

const ThemedCheckboxes = () => (
  <div className={styles.wrapper}>
    <div className={styles.lightThemeWrapper}>
      <Checkbox>Light theme (default)</Checkbox>
    </div>
    <div className={styles.lightThemeWrapper}>
      <Checkbox theme="lighter">Lighter theme</Checkbox>
    </div>
    <div className={styles.darkThemeWrapper}>
      <Checkbox theme="dark">Dark theme</Checkbox>
    </div>
  </div>
);

const CheckboxesWithLongLabels = () => (
  <div className={styles.gridWrapper}>
    <div>
      <Checkbox>I am label</Checkbox>
      <Checkbox disabled={true}>I am label of disabled checkbox</Checkbox>
      <Checkbox>
        I am a very long long label that wraps to another line
      </Checkbox>
    </div>

    <div>
      <Checkbox>I am label</Checkbox>
      <Checkbox>
        I am another very long long label that wraps to another line
      </Checkbox>
      <Checkbox>I am label</Checkbox>
    </div>

    <div>
      <Checkbox>I am label</Checkbox>
      <Checkbox>I am label</Checkbox>
    </div>
  </div>
);

const ControlledCheckboxes = () => {
  const [firstChecked, setFirtsChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);

  const handleFirstCheckboxChange = (event: FormEvent<HTMLInputElement>) => {
    setFirtsChecked(event.currentTarget.checked);
  };

  const handleSecondCheckboxChange = (event: FormEvent<HTMLInputElement>) => {
    setSecondChecked(event.currentTarget.checked);
  };

  const onToggleAll = () => {
    setFirtsChecked(!firstChecked);
    setSecondChecked(!firstChecked);
  };

  return (
    <div className={styles.controlledCheckboxesStory}>
      <p>
        Making sure that checkboxes can be toggled both in isolation, and via
        the props from the parent.
      </p>
      <Checkbox checked={firstChecked} onChange={handleFirstCheckboxChange} />
      <Checkbox checked={secondChecked} onChange={handleSecondCheckboxChange} />
      <PrimaryButton onClick={onToggleAll}>Toggle all</PrimaryButton>
    </div>
  );
};

export const DefaultCheckboxStory = {
  name: 'without label',
  render: () => <CheckboxesWithoutLabel />
};

export const CheckboxWithLabelStory = {
  name: 'with label',
  render: () => <CheckboxesWithLabel />
};

export const ThemedCheckboxesStory = {
  name: 'themes',
  render: () => <ThemedCheckboxes />
};

export const CheckboxesWithLongLabelsStory = {
  name: 'grid with long labels',
  render: () => <CheckboxesWithLongLabels />
};

export const ControlledCheckboxesStory = {
  name: 'controlled checkboxes',
  render: () => <ControlledCheckboxes />
};

export default {
  title: 'Components/Shared Components/Checkbox',
  argTypes: { onChange: { action: 'checkbox toggled' } }
};
