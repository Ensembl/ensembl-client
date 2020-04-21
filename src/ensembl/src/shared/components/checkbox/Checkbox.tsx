import React from 'react';
import classNames from 'classnames';

import defaultStyles from './Checkbox.scss';

type ClassNames = Partial<{
  checkboxHolder: string;
  checked: string;
  unchecked: string;
  disabled: string;
}>;

type WithoutLabelProps = {
  onChange: (status: boolean) => void;
  classNames?: ClassNames;
  disabled?: boolean;
  checked: boolean;
};

type WithLabelProps = WithoutLabelProps & {
  label: string;
  labelClassName?: string;
};

export type CheckboxProps = WithLabelProps | WithoutLabelProps;

const isWithLabel = (props: CheckboxProps): props is WithLabelProps => {
  return 'label' in props;
};

const Checkbox = (props: CheckboxProps) => {
  const handleOnChange = () => {
    // Do nothing if it is disabled
    if (props.disabled) {
      return;
    }

    // Call the onChange function
    props.onChange(!props.checked);
  };

  const styles = props.classNames
    ? ({ ...defaultStyles, ...props.classNames } as { [key: string]: string })
    : defaultStyles;
  const className = classNames(
    styles.defaultCheckbox,
    { [styles.checked]: props.checked },
    { [styles.unchecked]: !props.checked },
    { [styles.disabled]: props.disabled }
  );
  const labelClassName = classNames(
    styles.defaultLabel,
    isWithLabel(props) && props.labelClassName
  );

  return (
    <div className={styles.checkboxHolder}>
      <input
        type="checkbox"
        className={styles.hiddenInput}
        onChange={handleOnChange}
        checked={props.checked}
      />
      <div onClick={handleOnChange} className={className} />
      {isWithLabel(props) && (
        <label onClick={handleOnChange} className={labelClassName}>
          {props.label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
