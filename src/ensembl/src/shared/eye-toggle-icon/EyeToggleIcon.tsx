import React from 'react';
import classNames from 'classnames';

import eyeOnIcon from './eye-on.svg';
import eyeOffIcon from './eye-off.svg';

import styles from './EyeToggleIcon.scss';

type Props = {
  iconStatus: string;
  description: string;
  callbackFunction: () => void;
};

const EyeToggleIcon = (props: Props) => {
  const handleClick = () => {
    props.callbackFunction();
  };

  const className = classNames(styles.eyeToggleIcon);

  return (
    <img
      onClick={handleClick}
      className={className}
      src={props.iconStatus === 'on' ? eyeOnIcon : eyeOffIcon}
      alt={props.description}
    />
  );
};

EyeToggleIcon.defaultProps = {
  description: '',
  iconStatus: 'off'
};

export default EyeToggleIcon;
