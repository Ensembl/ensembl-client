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

import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import styles from './QuestionButton.stories.module.css';

export default {
  title: 'Components/Shared Components/Question button'
};

export const InlineQuestionButton = () => (
  <div className={styles.inlineWrapper}>
    <span className={styles.text}>Some text requiring an explanation</span>
    <QuestionButton helpText="This is a hint" />
  </div>
);

InlineQuestionButton.storyName = 'inline';

export const InputQuestionButton = () => (
  <QuestionButton helpText="This is a hint" styleOption="in-input-field" />
);

InputQuestionButton.storyName = 'input';
