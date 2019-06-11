import React, { useState, useEffect, useCallback } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import Radio, { RadioOptions } from 'src/shared/radio/Radio';

import styles from './CheckboxWithRadios.scss';

type Props = {
  radioOptions: RadioOptions;
  label: string;
  selectedOption: string;
  onChange: (selectedOption: string) => void;
};

const CheckboxWithRadios = (props: Props) => {
  const [isChecked, setisChecked] = useState(false);

  useEffect(() => {
    if (props.selectedOption) {
      setisChecked(true);
    }
  }, []);

  const handleCheckboxOnChange = useCallback(
    (isChecked: boolean) => {
      setisChecked(isChecked);
      props.onChange('');
    },
    [props.selectedOption]
  );

  const handleOnChange = useCallback(
    (selectedOption: string) => {
      props.onChange(selectedOption);
    },
    [props.selectedOption]
  );

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
