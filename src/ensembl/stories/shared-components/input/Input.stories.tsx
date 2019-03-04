import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Input from 'src/shared/input/Input';

import styles from './Input.stories.scss';

storiesOf('Components|Shared Components/Input', module)
  .add('default', () => (
    <div>
      <Input onChange={action('on-input-change')} />
    </div>
  ))
  .add('with placeholder', () => (
    <div>
      <Input
        placeholder="Enter something..."
        onChange={action('on-input-change')}
      />
    </div>
  ))
  .add('styled via received classname', () => (
    <div>
      <Input
        className={styles.customizedInput}
        onChange={action('on-input-change')}
      />
    </div>
  ));
