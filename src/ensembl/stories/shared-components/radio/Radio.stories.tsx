import React, { useState } from 'react';

import Radio, { RadioOptions } from 'src/shared/components/radio/Radio';
import { storiesOf } from '@storybook/react';
import styles from './Radio.stories.scss';
import { action } from '@storybook/addon-actions';

const radioData: RadioOptions = [
  { value: 'default', label: 'Default' },
  { value: 'length_longest', label: 'Spliced length: longest - shortest' },
  { value: 'length_shortest', label: 'Spliced length: shortest - longest' }
];

const Wrapper = (props: any) => {
  const [selectedRadio, setselectedRadio] = useState('default');

  const handleOnchange = (value: string) => {
    setselectedRadio(value);
    action('radio-clicked')(value);
  };

  return (
    <div>
      <Radio
        {...props}
        options={radioData}
        onChange={handleOnchange}
        selectedOption={selectedRadio}
      ></Radio>
    </div>
  );
};

storiesOf('Components|Shared Components/Radio', module)
  .add('default', () => {
    return <Wrapper />;
  })
  .add('Entity Viewer style', () => {
    const EVClassNames = {
      radioWrapper: styles.radioWrapper
    };

    return (
      <div className={styles.wrapper}>
        <Wrapper classNames={EVClassNames} />
      </div>
    );
  });
