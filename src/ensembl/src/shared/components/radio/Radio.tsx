import React from 'react';

import defaultStyles from './Radio.scss';

import classNamesMeger from 'classnames';

export type RadioOption = {
  value: string | number | boolean;
  label: string;
};

export type RadioOptions = RadioOption[];

type Props = {
  onChange: (selectedOption: string | number | boolean) => void;
  classNames?: {
    radioInput?: string;
    radioLabel?: string;
    radioWrapper?: string;
    defaultRadio?: string;
    checked?: any;
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
        const radioClass = classNamesMeger(styles.defaultRadio, {
          [styles.checked]: option.value === props.selectedOption
        });

        return (
          <span key={index} className={styles.radioWrapper}>
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
            <div onClick={() => handleOnChange(index)} className={radioClass} />
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
