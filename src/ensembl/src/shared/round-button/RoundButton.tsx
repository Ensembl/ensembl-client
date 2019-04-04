import React, { ReactNode } from 'react';
import classNames from 'classnames';

import defaultStyles from './RoundButton.scss';

export enum RoundButtonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled',
  DEFAULT = 'default'
}

type Props = {
  onClick: () => void;
  buttonStatus: RoundButtonStatus;
  classNames?: { [key in RoundButtonStatus]?: string };
  children: ReactNode;
};

const RoundButton = (props: Props) => {
  const handleClick = () => {
    if (props.buttonStatus !== RoundButtonStatus.DISABLED) {
      props.onClick();
    }
  };

  const styles = classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const className = classNames(styles.default, styles[props.buttonStatus]);

  return (
    <button className={className} onClick={handleClick}>
      {props.children}
    </button>
  );
};

RoundButton.defaultProps = {
  buttonStatus: RoundButtonStatus.DEFAULT
};

export default RoundButton;
