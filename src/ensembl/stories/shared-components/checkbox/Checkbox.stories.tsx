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
  });
