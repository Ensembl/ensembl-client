import React, { useState } from 'react';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import RadioGroup, { RadioOptions } from 'src/shared/components/radio-group/RadioGroup';

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
