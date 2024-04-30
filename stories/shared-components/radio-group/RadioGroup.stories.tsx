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

import { useState } from 'react';
import times from 'lodash/times';

import RadioGroup, {
  RadioGroupProps,
  OptionValue
} from 'src/shared/components/radio-group/RadioGroup';

import styles from './RadioGroup.stories.module.css';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const defaultRadioOptions = [
  { value: 'option_1', label: 'Option 1' },
  { value: 'option_2', label: 'Option 2' },
  { value: 'option_3', label: 'Option 3' }
];

const StatefulRadioGroup = (props: Partial<RadioGroupProps> & DefaultArgs) => {
  const [selectedRadio, setSelectedRadio] = useState<OptionValue>('default');
  const options = props.options ?? defaultRadioOptions;

  const handleChange = (value: OptionValue) => {
    setSelectedRadio(value);
    props.onChange(value);
  };

  return (
    <div>
      <RadioGroup
        {...props}
        options={options}
        onChange={handleChange}
        selectedOption={selectedRadio}
      />
    </div>
  );
};

export const RadioGroupStory = (args: DefaultArgs) => (
  <div>
    <p>Light theme</p>
    <div className={styles.lightThemeWrapper}>
      <StatefulRadioGroup {...args} />
    </div>

    <p>Dark theme</p>
    <div className={styles.darkThemeWrapper}>
      <StatefulRadioGroup theme="dark" {...args} />
    </div>
  </div>
);

RadioGroupStory.storyName = 'radios in a column';

export const HorizontalRadioGroupStory = (args: DefaultArgs) => {
  const moreOptions = times(5, (count) => ({
    value: `option_${count}`,
    label: `Option ${count + 1}`
  }));

  return (
    <div>
      <p>Light theme</p>
      <div className={styles.lightThemeWrapper}>
        <StatefulRadioGroup direction="row" {...args} />
      </div>

      <p>Dark theme</p>
      <div className={styles.darkThemeWrapper}>
        <StatefulRadioGroup direction="row" theme="dark" {...args} />
      </div>

      <p>Line wrapping</p>
      <div className={styles.narrowOptionsWrapper}>
        <StatefulRadioGroup direction="row" options={moreOptions} {...args} />
      </div>
    </div>
  );
};

HorizontalRadioGroupStory.storyName = 'radios in a row';

export default {
  title: 'Components/Shared Components/RadioGroup',
  argTypes: { onChange: { action: 'changed' } }
};
