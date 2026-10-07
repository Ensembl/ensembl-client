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

import { useState, type ComponentProps } from 'react';

import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import CheckboxGroup from 'src/shared/components/checkbox-group/CheckboxGroup';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import styles from './CheckboxWithLabel.stories.module.css';

const StatefulCheckbox = (
  props: Pick<
    ComponentProps<typeof CheckboxWithLabel>,
    'label' | 'disabled' | 'theme'
  >
) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (isChecked: boolean) => {
    setChecked(isChecked);
  };

  return (
    <CheckboxWithLabel {...props} checked={checked} onChange={handleChange} />
  );
};

const DefaultCheckboxes = () => (
  <div className={styles.wrapper}>
    <CheckboxGroup>
      <StatefulCheckbox label="I am label, you can click me" />
      <StatefulCheckbox
        label="I am label of disabled checkbox"
        disabled={true}
      />
    </CheckboxGroup>
  </div>
);

const ThemedCheckboxes = () => (
  <div className={styles.wrapper}>
    <div className={styles.lightThemeWrapper}>
      <StatefulCheckbox label="Light theme (default)" />
    </div>
    <div className={styles.lightThemeWrapper}>
      <StatefulCheckbox theme="lighter" label="Lighter theme" />
    </div>
    <div className={styles.darkThemeWrapper}>
      <StatefulCheckbox theme="dark" label="Dark theme" />
    </div>
  </div>
);

const CheckboxesWithLongLabels = () => (
  <div className={styles.gridWrapper}>
    <CheckboxGroup>
      <StatefulCheckbox label="I am label" />
      <StatefulCheckbox
        label="I am label of disabled checkbox"
        disabled={true}
      />
      <StatefulCheckbox label="I am a very long long label that wraps to another line" />
    </CheckboxGroup>

    <CheckboxGroup>
      <StatefulCheckbox label="I am label" />
      <StatefulCheckbox label="I am a very long long label that wraps to another line" />
      <StatefulCheckbox label="I am label" />
    </CheckboxGroup>

    <CheckboxGroup>
      <StatefulCheckbox label="I am label" />
      <StatefulCheckbox label="I am label" />
    </CheckboxGroup>
  </div>
);

const CheckboxesWithQuestionButton = () => (
  <div className={styles.gridWrapper}>
    <CheckboxGroup>
      <div className={styles.checkboxWithQuestionButtonGrid}>
        <StatefulCheckbox label="I am label" />
        <QuestionButton helpText="Lorem ipsum" />
      </div>
      <div className={styles.checkboxWithQuestionButtonGrid}>
        <StatefulCheckbox label="I am a very long label that wraps to another line" />
        <QuestionButton helpText="Lorem ipsum" />
      </div>
    </CheckboxGroup>

    <CheckboxGroup>
      <div className={styles.checkboxWithQuestionButtonGrid}>
        <StatefulCheckbox label="I am label" />
        <QuestionButton helpText="Lorem ipsum" />
      </div>
      <div className={styles.checkboxWithQuestionButtonGrid}>
        <StatefulCheckbox label="I am a very long label that wraps to another line" />
        <QuestionButton helpText="Lorem ipsum" />
      </div>
    </CheckboxGroup>
  </div>
);

export const DefaultStory = {
  name: 'default',
  render: () => <DefaultCheckboxes />
};

export const ThemedCheckboxesStory = {
  name: 'themes',
  render: () => <ThemedCheckboxes />
};

export const CheckboxesWithLongLabelsStory = {
  name: 'grid with long labels',
  render: () => <CheckboxesWithLongLabels />
};

export const CheckboxesWithQuestionButtonStory = {
  name: 'with question buttons',
  render: () => <CheckboxesWithQuestionButton />
};

export default {
  title: 'Components/Shared Components/CheckboxWithLabel',
  argTypes: { onChange: { action: 'checkbox toggled' } }
};
