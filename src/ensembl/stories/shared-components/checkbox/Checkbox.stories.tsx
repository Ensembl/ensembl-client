import React from 'react';

import Checkbox from 'src/shared/checkbox/Checkbox';
import { storiesOf } from '@storybook/react';
import styles from './Checkbox.stories.scss';
import { action } from '@storybook/addon-actions';

storiesOf('Components|Shared Components/Checkbox', module)
  .add('default', () => {
    return (
      <div className={styles.wrapper}>
        <Checkbox onChange={action('checkbox-toggled')} />
      </div>
    );
  })
  .add('disabled', () => {
    return (
      <div className={styles.wrapper}>
        <Checkbox disabled={true} onChange={action('checkbox-toggled')} />
      </div>
    );
  })
  .add('with label', () => {
    return (
      <div className={styles.wrapper}>
        <Checkbox
          label={'I am a label'}
          onChange={action('checkbox-toggled')}
        />
      </div>
    );
  });
