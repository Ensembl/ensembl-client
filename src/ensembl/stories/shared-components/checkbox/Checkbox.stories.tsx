import React from 'react';

import Checkbox from 'src/shared/checkbox/Checkbox';
import { storiesOf } from '@storybook/react';
import styles from './Checkbox.stories.scss';

storiesOf('Components|Shared Components/Checkbox', module).add(
  'checked',
  () => {
    return (
      <div className={styles.wrapper}>
        <Checkbox />
      </div>
    );
  }
);
