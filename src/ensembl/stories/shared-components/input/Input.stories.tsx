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

import Input from 'src/shared/components/input/Input';
import ShadedInput from 'src/shared/components/input/ShadedInput';

import styles from './Input.stories.scss';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const Wrapper = (props: any) => {
  const [value, setValue] = useState('');
  const { input: Input, ...otherProps } = props;

  const onChange = (value: string) => {
    setValue(value);
    props.onChange(value);
  };

  return (
    <div className={styles.wrapper}>
      <Input value={value} {...otherProps} onChange={onChange} />
    </div>
  );
};

export const DefaultInputStory = (args: DefaultArgs) => (
  <Wrapper input={Input} {...args} />
);

DefaultInputStory.storyName = 'default';

export const InputWithPlaceholderStory = (args: DefaultArgs) => (
  <Wrapper input={Input} placeholder="Enter something..." {...args} />
);

InputWithPlaceholderStory.storyName = 'with placeholder';

export const FocusAndBlurStory = (args: DefaultArgs) => (
  <Wrapper
    input={Input}
    placeholder="Enter something..."
    onFocus={() => args.onChange('input-focus')}
    onBlur={() => args.onChange('input-blur')}
    {...args}
  />
);

FocusAndBlurStory.storyName = 'handling focus and blur';

export const ShadedInputStory = (args: DefaultArgs) => (
  <>
    <div className={styles.stage}>
      <p>Against white background</p>
      <Wrapper
        input={ShadedInput}
        placeholder="Placeholder for dev..."
        {...args}
      />
    </div>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>Against grey background</p>
      <Wrapper
        input={ShadedInput}
        placeholder="Placeholder for dev..."
        {...args}
      />
    </div>
  </>
);

ShadedInputStory.storyName = 'shaded input';

export const CustomInputStory = (args: DefaultArgs) => (
  <Wrapper
    input={Input}
    placeholder="Enter something..."
    className={styles.customizedInput}
    {...args}
  />
);

CustomInputStory.storyName = 'custom styling';

export default {
  title: 'Components/Shared Components/Input',
  argTypes: { onChange: { action: 'changed' } }
};
