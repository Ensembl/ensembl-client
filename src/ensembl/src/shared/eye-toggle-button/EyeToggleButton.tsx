import React from 'react';
import classNames from 'classnames';

import eyeOnIcon from './eye-on.svg';
import eyeOffIcon from './eye-off.svg';

import styles from './EyeToggleButton.scss';

type Props = {
  iconStatus: boolean;
  description: string;
  onClick: () => void;
};

const EyeToggleButton = (props: Props) => {
  const className = classNames(styles.eyeToggleButton);

  return (
    <img
      onClick={props.onClick}
      className={className}
      src={props.iconStatus ? eyeOnIcon : eyeOffIcon}
      alt={props.description}
    />
  );
};

EyeToggleButton.defaultProps = {
  description: '',
  iconStatus: true
};

export default EyeToggleButton;
