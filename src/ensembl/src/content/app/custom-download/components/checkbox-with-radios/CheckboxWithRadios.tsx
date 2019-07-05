import React, { useState } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import Radio, { RadioOptions } from 'src/shared/radio/Radio';

import styles from './CheckboxWithRadios.scss';

export type CheckboxWithRadiosProps = {
  options: RadioOptions;
  label: string;
  selectedOption: string;
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
            />
          </td>
          {isChecked && (
            <td>
              <Radio
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
