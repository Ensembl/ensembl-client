import React from 'react';
import classNames from 'classnames';

import { ReactComponent as CrossIcon } from './cross.svg';

import styles from './CloseButton.scss';

type Props = {
  inverted: boolean;
  onClick: Function;
};

const CloseButton = (props: Props) => {
  const className = classNames(styles.closeButton, {
    [styles.closeButtonInverted]: props.inverted
  });

  return (
    <button className={className}>
      <CrossIcon />
    </button>
  );
};

CloseButton.defaultProps = {
  inverted: false
};

export default CloseButton;
