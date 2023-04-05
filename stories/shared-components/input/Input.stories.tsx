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
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

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
      <p>Against white background</p>
      <div className={styles.wrapper}>
        <ShadedInput placeholder="Placeholder for dev..." />
      </div>
    </div>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>Against grey background</p>
      <div className={styles.wrapper}>
        <ShadedInput placeholder="Placeholder for dev..." />
      </div>
    </div>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>Against grey background with icon</p>
      <div className={styles.wrapper}>
        <ShadedInput
          placeholder="Placeholder for dev..."
          rightCorner={
            <QuestionButton helpText="Shows some text when hovered over" />
          }
        />
      </div>
    </div>
  </>
);

ShadedInputStory.storyName = 'shaded input';

export const FlatInputStory = () => (
  <>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>With no icon in grey background</p>
      <div className={styles.wrapper}>
        <FlatInput placeholder="Placeholder for dev..." />
      </div>
    </div>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>Disabled with no icon in grey background</p>
      <div className={styles.wrapper}>
        <FlatInput placeholder="Placeholder for dev..." disabled={true} />
      </div>
    </div>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>With icon in grey background</p>
      <div className={styles.wrapper}>
        <FlatInput
          placeholder="Placeholder for dev..."
          rightCorner={
            <QuestionButton helpText="Shows some text when hovered over" />
          }
        />
      </div>
    </div>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>Disabled with icon in grey background</p>
      <div className={styles.wrapper}>
        <FlatInput
          placeholder="Placeholder for dev..."
          disabled={true}
          rightCorner={
            <QuestionButton helpText="Shows some text when hovered over" />
          }
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
