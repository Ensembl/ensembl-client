import React from 'react';

import defaultStyles from './Radio.scss';

export type RadioOption = {
  value: string | number | boolean;
  label: string;
};

export type RadioOptions = RadioOption[];

type Props = {
  onChange: (selectedOption: string | number | boolean) => void;
  classNames?: any;
  radioOptions: RadioOptions;
  selectedOption: string;
  disabled?: boolean;
};

const Radio = (props: Props) => {
  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const handleOnChange = (index: number) => {
    if (props.disabled) {
      return;
    }

    props.onChange(props.radioOptions[index].value);
  };

  return (
    <table className={styles.radioTable}>
      <tbody>
        <tr>
          {props.radioOptions.map((option: any, index: number) => {
            return (
              <td key={index}>
                <input
                  id={`radio_${index}`}
                  className={styles.radioInput}
                  value={option.value}
                  type="radio"
                  onChange={() => handleOnChange(index)}
                  checked={option.value === props.selectedOption}
                  disabled={props.disabled}
                  name="radio"
                />
                <label className={styles.radioLabel} htmlFor={`radio_${index}`}>
                  {option.label}
                </label>
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default Radio;
