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
import { action } from '@storybook/addon-actions';

import Textarea from 'src/shared/components/textarea/Textarea';

import styles from './Textarea.stories.scss';

const Wrapper = (props: any) => {
  const [value, setValue] = useState('');
  const { textarea: Textarea, ...otherProps } = props;

  return (
    <div className={styles.defaultWrapper}>
      <Textarea value={value} onChange={setValue} {...otherProps} />
    </div>
  );
};

export const DefaultStory = () => <Wrapper textarea={Textarea} />;

DefaultStory.story = {
  name: 'default'
};

export const WithPlaceholderStory = () => (
  <Wrapper textarea={Textarea} placeholder="Enter something..." />
);

WithPlaceholderStory.story = {
  name: 'with placeholder'
};

export const NoResizeStory = () => (
  <Wrapper
    textarea={Textarea}
    placeholder="Enter something..."
    resizable={false}
  />
);

NoResizeStory.story = {
  name: 'resize disabled'
};

export const FocusBlurStory = () => (
  <Wrapper
    textarea={Textarea}
    placeholder="Enter something..."
    onFocus={action('Textarea-focus')}
    onBlur={action('Textarea-blur')}
  />
);

FocusBlurStory.story = {
  name: 'with onFocus and onBlur'
};

export const CustomStyledStory = () => (
  <Wrapper
    textarea={Textarea}
    placeholder="Enter something..."
    className={styles.customizedTextarea}
  />
);

CustomStyledStory.story = {
  name: 'with custom styles'
};

export default {
  title: 'Components/Shared Components/Textarea'
};
