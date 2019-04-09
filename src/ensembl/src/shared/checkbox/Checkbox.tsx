import React, { useState } from 'react';
import classNames from 'classnames';

import defaultStyles from './Checkbox.scss';

type WithoutLabelProps = {
  onChange: (status: boolean) => void;
  classNames?: any;
  disabled?: boolean;
  checked: boolean;
};

type WithLabelProps = WithoutLabelProps & {
  label: string;
  labelClassName?: string;
};

type Props = WithLabelProps | WithoutLabelProps;

const Checkbox = (props: Props) => {
  const [checkedStatus, toggleCheckedStatus] = useState(props.checked);

  const handleOnChange = () => {
    // Do nothing if it is disabled
    if (props.disabled) {
      return;
    }

    // Toggle the checked status
    toggleCheckedStatus(!checkedStatus);

    // Call the onChange function
    props.onChange(!checkedStatus);
  };

  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const className = classNames(
    styles.defaultCheckbox,
    { [styles.checked]: checkedStatus },
    { [styles.unchecked]: !checkedStatus },
    { [styles.disabled]: props.disabled }
  );
  const labelClassName = classNames(
    defaultStyles.defaultLabel,
    props.labelClassName
  );

  return (
    <div className={defaultStyles.checkboxHolder}>
      <input
        type="checkbox"
        className={defaultStyles.hiddenInput}
        onChange={handleOnChange}
        defaultChecked={checkedStatus}
      />
      <div onClick={handleOnChange} className={className} />
      {props.label && (
        <label onClick={handleOnChange} className={labelClassName}>
          {props.label}
        </label>
      )}
    </div>
  );
};

Checkbox.defaultProps = {
  checked: false
};

export default Checkbox;
