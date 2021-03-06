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

import Textarea from 'src/shared/components/textarea/Textarea';

import styles from './Textarea.stories.scss';

type DefaultArgs = {
  onFocus: (...args: any) => void;
  onBlur: (...args: any) => void;
};

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

DefaultStory.storyName = 'default';

export const WithPlaceholderStory = () => (
  <Wrapper textarea={Textarea} placeholder="Enter something..." />
);

WithPlaceholderStory.storyName = 'with placeholder';

export const NoResizeStory = () => (
  <Wrapper
    textarea={Textarea}
    placeholder="Enter something..."
    resizable={false}
  />
);

NoResizeStory.storyName = 'resize disabled';

export const FocusBlurStory = (args: DefaultArgs) => (
  <Wrapper
    textarea={Textarea}
    placeholder="Enter something..."
    onFocus={args.onFocus()}
    onBlur={args.onBlur()}
  />
);

FocusBlurStory.storyName = 'with onFocus and onBlur';

export const CustomStyledStory = () => (
  <Wrapper
    textarea={Textarea}
    placeholder="Enter something..."
    className={styles.customizedTextarea}
  />
);

CustomStyledStory.storyName = 'with custom styles';

export default {
  title: 'Components/Shared Components/Textarea',
  argTypes: {
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' }
  }
};
