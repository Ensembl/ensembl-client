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
      <Checkbox
        aria-label="first"
        checked={firstChecked}
        onChange={handleFirstCheckboxChange}
      />
      <Checkbox checked={secondChecked} onChange={handleSecondCheckboxChange} />
      <PrimaryButton onClick={onToggleAll}>Toggle all</PrimaryButton>
    </div>
  );
};

export const DefaultCheckboxStory = {
  name: 'default',
  render: () => <CheckboxesWithoutLabel />
};

export const ControlledCheckboxesStory = {
  name: 'controlled checkboxes',
  render: () => <ControlledCheckboxes />
};

export default {
  title: 'Components/Shared Components/Checkbox',
  argTypes: { onChange: { action: 'checkbox toggled' } }
};
