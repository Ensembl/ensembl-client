import React from 'react';
import classNames from 'classnames';

import defaultStyles from './RadioGroup.scss';

type OptionValue = string | number | boolean;
export type RadioOption = {
  value: OptionValue;
  label: string;
};

export type RadioOptions = RadioOption[];

type Props = {
  onChange: (selectedOption: OptionValue) => void;
  classNames?: {
    label?: string;
    wrapper?: string;
    radio?: string;
    radioChecked?: string;
  };
  options: RadioOptions;
  selectedOption: OptionValue;
  disabled?: boolean;
};

const RadioGroup = (props: Props) => {
  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const handleOnChange = (value: OptionValue) => {
    if (props.disabled || value === props.selectedOption) {
      return;
    }

    props.onChange(value);
  };

  return (
    <div>
      {props.options.map((option, index) => {
        const radioClass = classNames(
          styles.radio,
          option.value === props.selectedOption
            ? styles.radioChecked
            : undefined
        );
        const { value } = option;

        return (
          <div key={index} className={styles.wrapper}>
            <div onClick={() => handleOnChange(value)} className={radioClass} />
            <label className={styles.label}>
              <input
                className={defaultStyles.input}
                type="radio"
                onChange={() => handleOnChange(value)}
                checked={option.value === props.selectedOption}
                disabled={props.disabled}
              />
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroup;
