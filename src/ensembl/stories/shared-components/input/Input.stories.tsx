import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Input from 'src/shared/input/Input';

import styles from './Input.stories.scss';

const Wrapper = (props: any) => {
  const [value, setValue] = useState('');
  const { input: Input, ...otherProps } = props;

  return (
    <div>
      <Input value={value} onChange={setValue} {...otherProps} />
    </div>
  );
};

storiesOf('Components|Shared Components/Input', module)
  .add('default', () => <Wrapper input={Input} />)
  .add('with placeholder', () => (
    <Wrapper input={Input} placeholder="Enter something..." />
  ))
  .add('with onFocus and onBlur', () => (
    <Wrapper
      input={Input}
      placeholder="Enter something..."
      onFocus={action('input-focus')}
      onBlur={action('input-blur')}
    />
  ))
  .add('styled via received classname', () => (
    <Wrapper
      input={Input}
      placeholder="Enter something..."
      className={styles.customizedInput}
    />
  ));
