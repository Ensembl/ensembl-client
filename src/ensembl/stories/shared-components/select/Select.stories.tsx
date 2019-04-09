import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import times from 'lodash/times';
import { action } from '@storybook/addon-actions';

import Select from 'src/shared/select/Select';

import styles from './Select.stories.scss';

const createSimpleOption = (number: number) => ({
  value: number,
  label: `option ${number}`,
  isSelected: false
});

const createSimpleOptions = (number: number) => {
  const options = times(number, (time) => createSimpleOption(time + 1));
  return {
    options
  };
};

const Wrapper = (props: any) => {
  const [options, setOptions] = useState(createSimpleOptions(5));

  const onSelect = (selectedValue: number) => {
    action(`selected: ${selectedValue}`)();
    const updatedOptions = options.options.map((option) => ({
      ...option,
      isSelected: option.value === selectedValue
    }));
    setOptions({
      ...options,
      options: updatedOptions
    });
  };

  return (
    <div className={styles.defaultWrapper}>
      <Select optionGroups={[options]} onSelect={onSelect} />
    </div>
  );
};

storiesOf('Components|Shared Components/Select', module).add('default', () => (
  <Wrapper />
));
