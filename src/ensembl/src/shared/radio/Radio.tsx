import React, { useCallback } from 'react';

import defaultStyles from './Radio.scss';

export type radioOption = {
  value: string;
  label: string;
};

export type radioOptions = radioOption[];

type Props = {
  onChange: (selectedOption: string) => void;
  classNames?: any;
  radioOptions: radioOptions;
  selectedOption: string;
  disabled?: boolean;
};

const Radio = (props: Props) => {
  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (props.disabled) {
        return;
      }
      props.onChange(event.target.value);
    },
    [props.selectedOption]
  );

  return (
    <>
      <table className={styles.radioTable}>
        <tbody>
          <tr>
            {props.radioOptions.map((option: any, key: number) => {
              return (
                <td key={key}>
                  <input
                    id={`radio_${key}`}
                    className={styles.radioInput}
                    value={option.value}
                    type="radio"
                    onChange={handleOnChange}
                    checked={option.value === props.selectedOption}
                    disabled={props.disabled}
                    name="radio"
                  />
                  <label className={styles.radioLabel} htmlFor={`radio_${key}`}>
                    {option.label}
                  </label>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Radio;
