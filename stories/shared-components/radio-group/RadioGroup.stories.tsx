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

import React, { useState } from 'react';

import RadioGroup, {
  RadioGroupProps,
  RadioOptions,
  OptionValue
} from 'src/shared/components/radio-group/RadioGroup';

import styles from './RadioGroup.stories.scss';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const StatefulRadioGroup = (props: Partial<RadioGroupProps> & DefaultArgs) => {
  const [selectedRadio, setSelectedRadio] = useState<OptionValue>('default');

  const handleChange = (value: OptionValue) => {
    setSelectedRadio(value);
    props.onChange(value);
  };

  const radioData: RadioOptions = [
    { value: 'default', label: 'Default' },
    { value: 'length_longest', label: 'Spliced length: longest - shortest' },
    { value: 'length_shortest', label: 'Spliced length: shortest - longest' }
  ];

  return (
    <div>
      <RadioGroup
        {...props}
        options={radioData}
        onChange={handleChange}
        selectedOption={selectedRadio}
      />
    </div>
  );
};

export const RadioGroupStory = (args: DefaultArgs) => (
  <div>
    <StatefulRadioGroup {...args} />
  </div>
);

RadioGroupStory.storyName = 'default (light theme)';

export const DarkThemeCheckboxStory = (args: DefaultArgs) => (
  <div className={styles.darkThemeWrapper}>
    <StatefulRadioGroup theme="dark" {...args} />
  </div>
);

DarkThemeCheckboxStory.storyName = 'dark theme';

export const DisabledCheckboxStory = (args: DefaultArgs) => (
  <div>
    <StatefulRadioGroup disabled={true} {...args} />
  </div>
);

DisabledCheckboxStory.storyName = 'disabled';

export default {
  title: 'Components/Shared Components/RadioGroup',
  argTypes: { onChange: { action: 'changed' } }
};
