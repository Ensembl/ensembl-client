import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Textarea from 'src/shared/components/textarea/Textarea';

import styles from './Textarea.stories.scss';

const Wrapper = (props: any) => {
  const [value, setValue] = useState('');
  const { Textarea: Textarea, ...otherProps } = props;

  return (
    <div className={styles.defaultWrapper}>
      <Textarea value={value} onChange={setValue} {...otherProps} />
    </div>
  );
};

storiesOf('Components|Shared Components/Textarea', module)
  .add('default', () => <Wrapper Textarea={Textarea} />)
  .add('with placeholder', () => (
    <Wrapper Textarea={Textarea} placeholder="Enter something..." />
  ))
  .add('resize disabled', () => (
    <Wrapper
      Textarea={Textarea}
      placeholder="Enter something..."
      resizable={false}
    />
  ))
  .add('with onFocus and onBlur', () => (
    <Wrapper
      Textarea={Textarea}
      placeholder="Enter something..."
      onFocus={action('Textarea-focus')}
      onBlur={action('Textarea-blur')}
    />
  ))
  .add('styled via received classname', () => (
    <Wrapper
      Textarea={Textarea}
      placeholder="Enter something..."
      className={styles.customizedTextarea}
    />
  ));
