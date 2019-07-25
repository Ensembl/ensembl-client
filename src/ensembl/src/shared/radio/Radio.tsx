import React from 'react';

import defaultStyles from './Radio.scss';

export type RadioOption = {
  value: string | number | boolean;
  label: string;
  order?: number;
};

export type RadioOptions = RadioOption[];

type Props = {
  onChange: (selectedOption: string | number | boolean) => void;
  classNames?: {
    radioInput?: string;
    radioLabel?: string;
  };
  options: RadioOptions;
  selectedOption: string | number | boolean;
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

    props.onChange(props.options[index].value);
  };

  return (
    <div>
      {props.options.map((option: any, index: number) => {
        return (
          <span key={index}>
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
          </span>
        );
      })}
    </div>
  );
};

export default Radio;
