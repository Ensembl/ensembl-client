import React from 'react';

import defaultStyles from './RadioGroup.scss';

import classNamesMerger from 'classnames';

export type RadioOption = {
  value: string | number | boolean;
  label: string;
};

export type RadioOptions = RadioOption[];

type Props = {
  onChange: (selectedOption: string | number | boolean) => void;
  classNames?: {
    label?: string;
    wrapper?: string;
    default?: string;
    checked?: string;
  };
  options: RadioOptions;
  selectedOption: string | number | boolean;
  disabled?: boolean;
};

const RadioGroup = (props: Props) => {
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
      {props.options.map((option, index) => {
        const radioClass = classNamesMerger(
          styles.default,
          option.value === props.selectedOption ? styles.checked : undefined
        );

        return (
          <div key={index} className={styles.wrapper}>
            <div onClick={() => handleOnChange(index)} className={radioClass} />
            <label className={styles.label}>
              <input
                className={defaultStyles.radio}
                type="radio"
                onChange={() => handleOnChange(index)}
                checked={option.value === props.selectedOption}
                disabled={props.disabled}
                name="radio"
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
