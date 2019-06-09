import React from 'react';
import classNames from 'classnames';

import { ReactComponent as CrossIcon } from './cross.svg';

import styles from './CloseButton.scss';

type Props = {
  inverted: boolean;
  onClick: () => void;
};

const CloseButton = (props: Props) => {
  const className = classNames(styles.closeButton, {
    [styles.closeButtonInverted]: props.inverted
  });

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    props.onClick();
  };

  return (
    <button className={className} onClick={handleClick}>
      <CrossIcon />
    </button>
  );
};

CloseButton.defaultProps = {
  inverted: false
};

export default CloseButton;
