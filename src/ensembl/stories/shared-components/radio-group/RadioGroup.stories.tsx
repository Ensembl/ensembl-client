import React, { useState } from 'react';

import RadioGroup, {
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';
import { storiesOf } from '@storybook/react';
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
      <RadioGroup
        {...props}
        options={radioData}
        onChange={handleOnchange}
        selectedOption={selectedRadio}
      ></RadioGroup>
    </div>
  );
};

storiesOf('Components|Shared Components/RadioGroup', module).add(
  'default',
  () => {
    return <Wrapper />;
  }
);
