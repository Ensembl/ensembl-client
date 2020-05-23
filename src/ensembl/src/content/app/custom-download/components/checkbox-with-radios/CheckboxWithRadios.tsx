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
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import RadioGroup, {
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import styles from './CheckboxWithRadios.scss';

export type CheckboxWithRadiosProps = {
  options: RadioOptions;
  label: string;
  selectedOption: string;
  disabled?: boolean;
  onChange: (selectedOption: string | number | boolean) => void;
};

const CheckboxWithRadios = (props: CheckboxWithRadiosProps) => {
  const [isChecked, setisChecked] = useState(Boolean(props.selectedOption));

  const handleCheckboxOnChange = (isChecked: boolean) => {
    setisChecked(isChecked);
    props.onChange('');
  };

  return (
    <table className={styles.radioTable}>
      <tbody>
        <tr>
          <td>
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxOnChange}
              label={props.label}
              disabled={props.disabled}
            />
          </td>
          {isChecked && (
            <td>
              <RadioGroup
                onChange={props.onChange}
                options={props.options}
                selectedOption={props.selectedOption}
              />
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default CheckboxWithRadios;
