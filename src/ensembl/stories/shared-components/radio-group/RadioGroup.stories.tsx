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
