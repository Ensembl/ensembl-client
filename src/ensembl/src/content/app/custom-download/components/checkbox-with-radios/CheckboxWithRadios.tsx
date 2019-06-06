import React, { useState, useEffect, useCallback } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import Radio, { radioOptions } from 'src/shared/radio/Radio';

import styles from './CheckboxWithRadios.scss';

type Props = {
  radioOptions: radioOptions;
  label: string;
  selectedOption: string;
  onChange: (selectedOption: string) => void;
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
    (selectedOption: string) => {
      props.onChange(selectedOption);
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
            {checkedStatus && (
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
    </>
  );
};

export default CheckboxWithRadios;
