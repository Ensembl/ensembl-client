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
};

const Checkbox = (props: Props) => {
  const [checkedStatus, toggleCheckedStatus] = useState(props.status);

  const handleOnClick = () => {
    // Do nothing if it is disabled
    if (props.status === CheckboxStatus.DISABLED) {
      return;
    }

    console.log(checkedStatus);
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

  const className = classNames(
    defaultStyles.unchecked,
    defaultStyles[checkedStatus]
  );

  return <div onClick={handleOnClick} className={className} />;
};

Checkbox.defaultProps = {
  status: CheckboxStatus.UNCHECKED
};

export default Checkbox;
