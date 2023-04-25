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

import React from 'react';

import Input from 'src/shared/components/input/Input';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import FlatInput from 'src/shared/components/input/FlatInput';

import styles from './Input.stories.scss';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

export const DefaultInputStory = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <Input {...args} />
  </div>
);

DefaultInputStory.storyName = 'default';

export const InputWithPlaceholderStory = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <Input placeholder="Enter something..." {...args} />
  </div>
);

InputWithPlaceholderStory.storyName = 'with placeholder';

export const FocusAndBlurStory = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <Input
      placeholder="Enter something..."
      onFocus={() => args.onChange('input-focus')}
      onBlur={() => args.onChange('input-blur')}
      {...args}
    />
  </div>
);

FocusAndBlurStory.storyName = 'handling focus and blur';

export const ShadedInputStory = () => (
  <>
    <div className={styles.stage}>
      <h2>Against a white background</h2>

      <p>Smaller shaded input</p>
      <div className={styles.wrapper}>
        <ShadedInput size="small" />
      </div>

      <p>Smaller shaded input with placeholder and help text</p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="small"
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>

      <p>
        Smaller shaded input of type "search", with placeholder and help text
      </p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="small"
          type="search"
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>

      <p>Larger shaded input</p>
      <div className={styles.wrapper}>
        <ShadedInput size="large" />
      </div>

      <p>Larger shaded input with placeholder and some help text</p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="large"
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>

      <p>
        Larger shaded input of type "search" with placeholder and some help text
      </p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="large"
          type="search"
          minLength={3}
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>
    </div>

    <div className={`${styles.stage} ${styles.greyStage}`}>
      <h2>Against a grey background</h2>

      <p>Smaller shaded input</p>
      <div className={styles.wrapper}>
        <ShadedInput size="small" />
      </div>

      <p>Smaller shaded input with placeholder and help text</p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="small"
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>

      <p>
        Smaller shaded input of type "search", with placeholder and help text
      </p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="small"
          type="search"
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>

      <p>Larger shaded input</p>
      <div className={styles.wrapper}>
        <ShadedInput size="large" />
      </div>

      <p>Larger shaded input with placeholder and some help text</p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="large"
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>

      <p>
        Larger shaded input of type "search" with placeholder and some help text
      </p>
      <div className={styles.wrapper}>
        <ShadedInput
          size="large"
          type="search"
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>
    </div>
  </>
);

ShadedInputStory.storyName = 'shaded input';

export const FlatInputStory = () => (
  <>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <h2>Against a grey background</h2>

      <p>Plain flat input without placeholder or help text</p>
      <div className={styles.smallerWrapper}>
        <FlatInput />
      </div>

      <p>Flat input with a placeholder and some help text</p>
      <div className={styles.smallerWrapper}>
        <FlatInput
          placeholder="Add some text..."
          help="Shows some text when hovered over"
        />
      </div>

      <p>
        Input of type "search" (try entering a text into it), with help text
      </p>
      <div className={styles.smallerWrapper}>
        <FlatInput
          placeholder="Add some text..."
          type="search"
          help="Shows some text when hovered over"
        />
      </div>

      <p>Disabled input (no icons shown in the right corner)</p>
      <div className={styles.smallerWrapper}>
        <FlatInput
          disabled={true}
          placeholder="Add some text..."
          type="search"
          help="Shows some text when hovered over"
        />
      </div>
    </div>
  </>
);

FlatInputStory.storyName = 'flat input';

export const CustomInputStory = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <Input
      placeholder="Enter something..."
      className={styles.customizedInput}
      {...args}
    />
  </div>
);

CustomInputStory.storyName = 'custom styling';

export default {
  title: 'Components/Shared Components/Input',
  argTypes: { onChange: { action: 'changed' } }
};
