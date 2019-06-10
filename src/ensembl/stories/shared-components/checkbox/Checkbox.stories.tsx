import React, { useState } from 'react';

import Checkbox from 'src/shared/checkbox/Checkbox';
import { storiesOf } from '@storybook/react';
import styles from './Checkbox.stories.scss';
import { action } from '@storybook/addon-actions';

const Wrapper = (props: any) => {
  const [checked, setChecked] = useState(false);

  const handleOnchange = (isChecked: boolean) => {
    setChecked(isChecked);
    action('checkbox-toggled')(isChecked);
  };

  return (
    <div className={styles.wrapper}>
      <Checkbox {...props} checked={checked} onChange={handleOnchange} />
    </div>
  );
};

storiesOf('Components|Shared Components/Checkbox', module)
  .add('default', () => {
    return <Wrapper />;
  })
  .add('disabled', () => {
    return (
      <div className={styles.wrapper}>
        <Wrapper disabled={true} />
      </div>
    );
  })
  .add('with label', () => {
    return (
      <div className={styles.wrapper}>
        <Wrapper label={'I am a label'} />
      </div>
    );
  });
