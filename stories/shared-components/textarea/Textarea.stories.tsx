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

import Textarea from 'src/shared/components/textarea/Textarea';
import ShadedTextarea from 'src/shared/components/textarea/ShadedTextarea';

import styles from './Textarea.stories.module.css';

type DefaultArgs = {
  onFocus: (...args: any) => void;
  onBlur: (...args: any) => void;
};

export const DefaultStory = () => (
  <div className={styles.defaultWrapper}>
    <Textarea />
  </div>
);

DefaultStory.storyName = 'default';

export const WithPlaceholderStory = () => (
  <div className={styles.defaultWrapper}>
    <Textarea placeholder="Enter something..." />
  </div>
);

WithPlaceholderStory.storyName = 'with placeholder';

export const NoResizeStory = () => (
  <div className={styles.defaultWrapper}>
    <Textarea placeholder="Enter something..." resizable={false} />
  </div>
);

NoResizeStory.storyName = 'resize disabled';

export const FocusBlurStory = (args: DefaultArgs) => (
  <div className={styles.defaultWrapper}>
    <Textarea
      placeholder="Enter something..."
      onFocus={args.onFocus}
      onBlur={args.onBlur}
    />
  </div>
);

FocusBlurStory.storyName = 'with onFocus and onBlur';

export const ShadedTextareaStory = () => (
  <>
    <div className={styles.stage}>
      <p>Against a white background</p>
      <div className={styles.defaultWrapper}>
        <ShadedTextarea placeholder="Enter something..." />
      </div>
    </div>
    <div className={`${styles.stage} ${styles.greyStage}`}>
      <p>Against a grey background</p>
      <div className={styles.defaultWrapper}>
        <ShadedTextarea placeholder="Enter something..." />
      </div>
    </div>
  </>
);

ShadedTextareaStory.storyName = 'shaded textarea';

export const CustomStyledStory = () => (
  <div className={styles.defaultWrapper}>
    <Textarea
      placeholder="Enter something..."
      className={styles.customizedTextarea}
    />
  </div>
);

CustomStyledStory.storyName = 'with custom styles';

export default {
  title: 'Components/Shared Components/Textarea',
  argTypes: {
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' }
  }
};
