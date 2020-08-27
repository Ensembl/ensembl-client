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

import styles from './Input.stories.scss';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const Wrapper = (props: any) => {
  const [value, setValue] = useState('');
  const { input: Input, ...otherProps } = props;

  return (
    <div>
      <Input value={value} onChange={setValue} {...otherProps} />
    </div>
  );
};

export const DefaultInputStory = (args: DefaultArgs) => (
  <Wrapper input={Input} {...args} />
);

DefaultInputStory.story = {
  name: 'default'
};

export const InputWithPlaceholderStory = (args: DefaultArgs) => (
  <Wrapper input={Input} placeholder="Enter something..." {...args} />
);

InputWithPlaceholderStory.story = {
  name: 'with placeholder'
};

export const FocusAndBlurStory = (args: DefaultArgs) => (
  <Wrapper
    input={Input}
    placeholder="Enter something..."
    onFocus={action('input-focus')}
    onBlur={action('input-blur')}
    {...args}
  />
);

FocusAndBlurStory.story = {
  name: 'handling focus and blur'
};

export const CustomInputStory = (args: DefaultArgs) => (
  <Wrapper
    input={Input}
    placeholder="Enter something..."
    className={styles.customizedInput}
    {...args}
  />
);

CustomInputStory.story = {
  name: 'custom styling'
};

export default {
  title: 'Components/Shared Components/Input',
  argTypes: { onChange: { action: 'changed' } }
};
