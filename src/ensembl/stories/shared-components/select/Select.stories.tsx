/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import times from 'lodash/times';
import { action } from '@storybook/addon-actions';

import Select, {
  Option,
  OptionGroup
} from 'src/shared/components/select/Select';

import selectNotes from './select.md';

import styles from './Select.stories.scss';

const createSimpleOption = (number: number): Option => ({
  value: number,
  label: `option ${number}`,
  isSelected: false
});

const createSimpleOptions = (number: number) => {
  return times(number, (time) => createSimpleOption(time + 1));
};

const WrapperForOptions = (props: any) => {
  const [options, setOptions] = useState(props.options);

  const onSelect = (selectedValue: number) => {
    action(`selected: ${selectedValue}`)();

    const updatedOptions = options.map((option: Option) => ({
      ...option,
      isSelected: option.value === selectedValue
    }));
    setOptions(updatedOptions);
  };

  return (
    <div className={styles.defaultWrapper}>
      <Select options={options} onSelect={onSelect} />
    </div>
  );
};

const WrapperForOptionGroups = (props: any) => {
  const [optionGroups, setOptionGroups] = useState(props.optionGroups);

  const onSelect = (selectedValue: number) => {
    action(`selected: ${selectedValue}`)();

    const updatedOptionGroups = optionGroups.map((group: OptionGroup) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        isSelected: option.value === selectedValue
      }))
    }));

    setOptionGroups(updatedOptionGroups);
  };

  return (
    <div className={styles.defaultWrapper}>
      <Select optionGroups={optionGroups} onSelect={onSelect} />
    </div>
  );
};

storiesOf('Components|Shared Components/Select', module)
  .add(
    'default',
    () => <WrapperForOptions options={createSimpleOptions(5)} />,
    { notes: selectNotes }
  )
  .add('long list of options', () => {
    const options = createSimpleOptions(50);
    const longOption = {
      value: 'long option value',
      label: 'this is some ridiculously long text for an option',
      isSelected: false
    };
    options.splice(10, 0, longOption);

    return <WrapperForOptions options={options} />;
  })
  .add('groups of options', () => {
    const options1 = createSimpleOptions(2);
    const options2 = createSimpleOptions(3);
    const options3 = createSimpleOptions(4);
    const optionGroups = [
      { options: options1 },
      { options: options2 },
      { options: options3 }
    ];

    return <WrapperForOptionGroups optionGroups={optionGroups} />;
  });
