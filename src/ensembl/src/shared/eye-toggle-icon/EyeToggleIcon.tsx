import React from 'react';

import eyeOnIcon from './eye-on.svg';
import eyeOffIcon from './eye-off.svg';

type Props = {
  iconStatus: string;
  description: string;
  callbackFunction: Function;
};

const EyeToggleIcon = (props: Props) => {
  return (
    <button onClick={props.callbackFunction()}>
      <img
        src={props.iconStatus === 'on' ? eyeOnIcon : eyeOffIcon}
        alt={props.description}
      />
    </button>
  );
};

EyeToggleIcon.defaultProps = {
  iconStatus: 'off',
  description: ''
};

export default EyeToggleIcon;
