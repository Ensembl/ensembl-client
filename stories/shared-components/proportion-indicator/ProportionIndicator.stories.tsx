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

import {
  CircularPercentageIndicator,
  CircularFractionIndicator
} from 'src/shared/components/proportion-indicator/CircularProportionIndicator';
import {
  LinearPercentageIndicator,
  LinearFractionIndicator
} from 'src/shared/components/proportion-indicator/LinearProportionIndicator';

import styles from './ProportionIndicator.stories.module.css';

const percentageControlDefaults = {
  min: 0,
  max: 100,
  step: 0.5
};

const fractionControlDefaults = {
  min: 0,
  max: 1,
  step: 0.01
};

const renderControls = (
  props: {
    value: number;
    setValue: (val: number) => void;
  } & typeof percentageControlDefaults
) => {
  const { value, setValue, min, max, step } = props;

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.currentTarget.value);
    setValue(newValue);
  };

  return (
    <div className={styles.controls}>
      <label>Change value</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const CircularPercentageIndicatorStory = () => {
  const [value, setValue] = useState(20);

  return (
    <div>
      <CircularPercentageIndicator value={value} />
      {renderControls({ value, setValue, ...percentageControlDefaults })}
    </div>
  );
};

const CircularFractionIndicatorStory = () => {
  const [value, setValue] = useState(0.3);

  return (
    <div>
      <CircularFractionIndicator value={value} />
      {renderControls({ value, setValue, ...fractionControlDefaults })}
    </div>
  );
};

const LinearPercentageIndicatorStory = () => {
  const [value, setValue] = useState(20);

  return (
    <div>
      <LinearPercentageIndicator value={value} />
      {renderControls({ value, setValue, ...percentageControlDefaults })}
    </div>
  );
};

const LinearFractionIndicatorStory = () => {
  const [value, setValue] = useState(0.3);

  return (
    <div>
      <LinearFractionIndicator value={value} />
      {renderControls({ value, setValue, ...fractionControlDefaults })}
    </div>
  );
};

export const ExportedCircularPercentageIndicatorStory = {
  name: 'CircularPercentageIndicator',
  render: () => <CircularPercentageIndicatorStory />
};

export const ExportedCircularFractionIndicatorStory = {
  name: 'CirculaFractionIndicator',
  render: () => <CircularFractionIndicatorStory />
};

export const ExportedLinearPercentageIndicatorStory = {
  name: 'LinearPercentageIndicator',
  render: () => <LinearPercentageIndicatorStory />
};

export const ExportedLinearFractionIndicatorStory = {
  name: 'LinearFractionIndicator',
  render: () => <LinearFractionIndicatorStory />
};

export default {
  title: 'Components/Shared Components/ProportionIndicator'
};
