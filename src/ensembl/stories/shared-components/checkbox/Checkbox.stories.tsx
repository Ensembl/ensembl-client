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

import Checkbox, {
  CheckboxProps
} from 'src/shared/components/checkbox/Checkbox';
import { storiesOf } from '@storybook/react';
import styles from './Checkbox.stories.scss';
import { action } from '@storybook/addon-actions';

const StatefulCheckbox = (props: Partial<CheckboxProps>) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (isChecked: boolean) => {
    setChecked(isChecked);
    action('checkbox-toggled')(isChecked);
  };

  return (
    <div>
      <Checkbox {...props} checked={checked} onChange={handleChange} />
    </div>
  );
};

storiesOf('Components|Shared Components/Checkbox', module)
  .add('default', () => {
    return (
      <div className={styles.wrapper}>
        <StatefulCheckbox />
      </div>
    );
  })
  .add('disabled', () => {
    return (
      <div className={styles.wrapper}>
        <StatefulCheckbox disabled={true} />
      </div>
    );
  })
  .add('with label', () => {
    return (
      <div className={styles.wrapper}>
        <StatefulCheckbox label={'I am label'} />
        <StatefulCheckbox
          disabled={true}
          label={'I am label of disabled checkbox'}
        />
      </div>
    );
  })
  .add('grid with long label', () => {
    return (
      <div className={styles.gridWrapper}>
        <div>
          <StatefulCheckbox label={'I am label'} />
          <StatefulCheckbox
            disabled={true}
            label={'I am label of disabled checkbox'}
          />
          <StatefulCheckbox
            label={'I am a very long long label that wraps to another line'}
          />
        </div>

        <div>
          <StatefulCheckbox label={'I am label'} />
          <StatefulCheckbox
            label={
              'I am another very long long label that wraps to another line'
            }
          />
          <StatefulCheckbox label={'I am label'} />
        </div>

        <div>
          <StatefulCheckbox label={'I am label'} />
          <StatefulCheckbox label={'I am label'} />
        </div>
      </div>
    );
  });
