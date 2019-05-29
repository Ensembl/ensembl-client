import React, { useState, useEffect, useCallback } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';

import styles from './CheckboxWithRadios.scss';

type Props = {
  radioOptions: any;
  label: string;
  selectedOption: string;
  onChange: (selecteOption: string) => void;
};

const CheckboxWithRadios = (props: Props) => {
  const [checkedStatus, setCheckedStatus] = useState(false);

  useEffect(() => {
    if (props.selectedOption) {
      setCheckedStatus(true);
    }
  }, []);

  const handleCheckboxOnChange = useCallback(
    (checkedStatus: boolean) => {
      setCheckedStatus(checkedStatus);
      props.onChange('');
    },
    [props.selectedOption]
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(event.target.value);
    },
    [props.selectedOption]
  );

  return (
    <>
      <table className={styles.radioTable}>
        <tbody>
          <tr>
            <td>
              <Checkbox
                checked={checkedStatus}
                onChange={handleCheckboxOnChange}
                label={props.label}
              />
            </td>
            {checkedStatus &&
              props.radioOptions.map((option: any, key: number) => {
                let isSelected = false;
                if (option.value === props.selectedOption) {
                  isSelected = true;
                }
                return (
                  <td key={key}>
                    <input
                      className={styles.optionRadio}
                      value={option.value}
                      type="radio"
                      onChange={handleOnChange}
                      checked={isSelected}
                      name="radio"
                    />
                    <span>{option.label}</span>
                  </td>
                );
              })}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default CheckboxWithRadios;
