import React from 'react';

import Checkbox from 'src/shared/checkbox/Checkbox';
import { storiesOf } from '@storybook/react';
import styles from './Checkbox.stories.scss';

storiesOf('Components|Shared Components/Checkbox', module)
  .add('default', () => {
    return (
      <div className={styles.wrapper}>
        <Checkbox />
      </div>
    );
  })
  .add('disabled', () => {
    return (
      <div className={styles.wrapper}>
        <Checkbox disabled={true} />
      </div>
    );
  })
  .add('with label', () => {
    return (
      <div className={styles.wrapper}>
        <Checkbox label={'I am a lable'} />
      </div>
    );
  });
