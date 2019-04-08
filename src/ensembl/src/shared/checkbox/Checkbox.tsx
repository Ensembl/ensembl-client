import React, { useState } from 'react';
import classNames from 'classnames';

import defaultStyles from './Checkbox.scss';

export enum CheckboxStatus {
  CHECKED = 'checked',
  DISABLED = 'disabled',
  UNCHECKED = 'unchecked'
}

type Props = {
  onClick?: () => void;
  status: CheckboxStatus;
  classNames?: { [key in CheckboxStatus]: string };
  label?: string;
  labelClassName?: string;
};

const Checkbox = (props: Props) => {
  const [checkedStatus, toggleCheckedStatus] = useState(props.status);

  const handleOnClick = () => {
    // Do nothing if it is disabled
    if (props.status === CheckboxStatus.DISABLED) {
      return;
    }

    // Toggle the checked status
    if (checkedStatus === CheckboxStatus.CHECKED) {
      toggleCheckedStatus(CheckboxStatus.UNCHECKED);
    } else {
      toggleCheckedStatus(CheckboxStatus.CHECKED);
    }

    // Call the onClick function if we have one
    if (props.onClick) {
      props.onClick();
    }
  };

  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const className = classNames(styles.defaultCheckbox, styles[checkedStatus]);
  const labelClassName = classNames(
    defaultStyles.defaultLabel,
    props.labelClassName
  );

  return (
    <div onClick={handleOnClick} className={defaultStyles.checkboxHolder}>
      <div className={className} />
      {props.label && <div className={labelClassName}>{props.label}</div>}
    </div>
  );
};

Checkbox.defaultProps = {
  status: CheckboxStatus.UNCHECKED
};

export default Checkbox;
