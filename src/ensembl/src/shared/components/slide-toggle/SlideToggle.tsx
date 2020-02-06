import React, { useState } from 'react';
import classNames from 'classnames';

import styles from './SlideToggle.scss';

type Props = {
  isOn: boolean;
  className?: string;
  onChange: (isOn: boolean) => void;
};

const SlideToggle = (props: Props) => {
  const [isOn, setIsOn] = useState(props.isOn);

  const onToggle = () => {
    props.onChange(!isOn);
    setIsOn(!isOn);
  };

  const className = classNames(
    styles.slideToggle,
    props.className,
    { [styles.slideToggleOn]: isOn },
    { [styles.slideToggleOff]: !isOn }
  );

  return (
    <svg
      className={className}
      onClick={onToggle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 19 10"
    >
      <path
        className={styles.slideToggleTrack}
        d="M14.5,14.5h-9A4.48,4.48,0,0,1,1,10H1A4.48,4.48,0,0,1,5.5,5.5h9A4.48,4.48,0,0,1,19,10h0A4.48,4.48,0,0,1,14.5,14.5Z"
        transform="translate(-0.5 -5)"
      />
      <circle className={styles.slideToggleThumb} cx="5" cy="5" r="4" />
    </svg>
  );
};

export default SlideToggle;
