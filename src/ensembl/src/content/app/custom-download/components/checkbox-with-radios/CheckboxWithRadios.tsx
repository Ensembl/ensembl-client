import React, { useState } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import Radio, { RadioOptions } from 'src/shared/radio/Radio';

import styles from './CheckboxWithRadios.scss';

type Props = {
  radioOptions: RadioOptions;
  label: string;
  selectedOption: string;
  onChange: (selectedOption: string | number | boolean) => void;
};

const CheckboxWithRadios = (props: Props) => {
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
                radioOptions={props.radioOptions}
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
