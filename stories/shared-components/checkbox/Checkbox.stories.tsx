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

import { useState } from 'react';

import Checkbox, {
  CheckboxProps
} from 'src/shared/components/checkbox/Checkbox';
import styles from './Checkbox.stories.module.css';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const StatefulCheckbox = (props: Partial<CheckboxProps> & DefaultArgs) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (isChecked: boolean) => {
    setChecked(isChecked);
    props.onChange(isChecked);
  };

  return (
    <div>
      <Checkbox {...props} checked={checked} onChange={handleChange} />
    </div>
  );
};

export const CheckboxStory = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <p>Enabled</p>
    <StatefulCheckbox {...args} />
    <p>Disabled</p>
    <StatefulCheckbox disabled={true} {...args} />
  </div>
);

CheckboxStory.storyName = 'without label';

export const LabelledCheckboxStory = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <StatefulCheckbox label="I am label, you can click me" {...args} />
    <StatefulCheckbox
      disabled={true}
      label="I am label of disabled checkbox"
      {...args}
    />
  </div>
);

LabelledCheckboxStory.storyName = 'with label';

export const ThemesStory = (args: DefaultArgs) => (
  <div className={styles.wrapper}>
    <div className={styles.lightThemeWrapper}>
      <StatefulCheckbox {...args} label="Light theme (default)" />
    </div>
    <div className={styles.lightThemeWrapper}>
      <StatefulCheckbox theme="lighter" label="Lighter theme" {...args} />
    </div>
    <div className={styles.darkThemeWrapper}>
      <StatefulCheckbox theme="dark" label="Dark theme" {...args} />
    </div>
  </div>
);

ThemesStory.storyName = 'themes';

export const LongLabelledCheckboxStory = (args: DefaultArgs) => (
  <div className={styles.gridWrapper}>
    <div>
      <StatefulCheckbox label="I am label" {...args} />
      <StatefulCheckbox
        disabled={true}
        label="I am label of disabled checkbox"
        {...args}
      />
      <StatefulCheckbox
        label="I am a very long long label that wraps to another line"
        {...args}
      />
    </div>

    <div>
      <StatefulCheckbox label="I am label" {...args} />
      <StatefulCheckbox
        label="I am another very long long label that wraps to another line"
        {...args}
      />
      <StatefulCheckbox label="I am label" {...args} />
    </div>

    <div>
      <StatefulCheckbox label="I am label" {...args} />
      <StatefulCheckbox label="I am label" {...args} />
    </div>
  </div>
);

LongLabelledCheckboxStory.storyName = 'grid with long labels';

export default {
  title: 'Components/Shared Components/Checkbox',
  argTypes: { onChange: { action: 'checkbox toggled' } }
};
