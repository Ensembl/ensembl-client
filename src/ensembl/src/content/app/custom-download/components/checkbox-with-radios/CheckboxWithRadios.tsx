import React, { useState, useEffect } from 'react';
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
  const [isChecked, setisChecked] = useState(false);

  useEffect(() => {
    if (props.selectedOption) {
      setisChecked(true);
    }
  }, []);

  const handleCheckboxOnChange = (isChecked: boolean) => {
    setisChecked(isChecked);
    props.onChange('');
  };

  const handleOnChange = (selectedOption: string | number | boolean) => {
    props.onChange(selectedOption);
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
                onChange={handleOnChange}
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
