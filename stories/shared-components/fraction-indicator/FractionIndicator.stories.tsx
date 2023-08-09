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

import React, { useState, type FormEvent } from 'react';

import CircularFractionIndicator from 'src/shared/components/fraction-indicator/CircularFractionIndicator';
import LinearFractionIndicator from 'src/shared/components/fraction-indicator/LinearFractionIndicator';

import styles from './FractionIndicator.stories.scss';

const CircularFractionIndicatorStory = () => {
  const [value, setValue] = useState(20);

  const onValueChange = (event: FormEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.currentTarget.value);
    setValue(newValue);
  };

  return (
    <div>
      <CircularFractionIndicator value={value} />
      <div className={styles.controls}>
        <label>Change value</label>
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={value}
          onChange={onValueChange}
        />
      </div>
    </div>
  );
};

const LinearFractionIndicatorStory = () => {
  const [value, setValue] = useState(20);

  const onValueChange = (event: FormEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.currentTarget.value);
    setValue(newValue);
  };

  return (
    <div>
      <LinearFractionIndicator value={value} />
      <div className={styles.controls}>
        <label>Change value</label>
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={value}
          onChange={onValueChange}
        />
      </div>
    </div>
  );
};

export const ExportedCircularFractionIndicatorStory = {
  name: 'CircularFractionIndicator',
  render: () => <CircularFractionIndicatorStory />
};

export const ExportedLinearFractionIndicatorStory = {
  name: 'LinearFractionIndicator',
  render: () => <LinearFractionIndicatorStory />
};

export default {
  title: 'Components/Shared Components/FractionIndicator'
};
