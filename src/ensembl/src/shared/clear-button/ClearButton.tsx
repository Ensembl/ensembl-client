import React from 'react';
import classNames from 'classnames';

import { ReactComponent as CrossIcon } from './cross.svg';

import styles from './ClearButton.scss';

type Props = {
  inverted: boolean;
  onClick: () => void;
};

const ClearButton = (props: Props) => {
  const className = classNames(styles.clearButton, {
    [styles.clearButtonInverted]: props.inverted
  });

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    props.onClick();
  };

  return (
    <div className={className} onClick={handleClick}>
      <CrossIcon />
    </div>
  );
};

ClearButton.defaultProps = {
  inverted: false
};

export default ClearButton;
