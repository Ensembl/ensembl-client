import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import classNames from 'classnames';

import styles from './SlideToggle.scss';

type Props = {
  isOn: boolean;
  className?: string;
  onChange: (isOn: boolean) => void;
};

const springConfig = {
  mass: 1,
  tension: 320,
  clamp: true,
  friction: 10
};

const activeTrackStyles = {
  config: springConfig,
  fill: '#0099FF',
  stroke: '#0099FF'
};

const inactiveTrackStyles = {
  config: springConfig,
  fill: '#FFFFFF',
  stroke: '#B7C0C8'
};

const activeThumbStyles = {
  config: springConfig,
  fill: '#FFFFFF',
  cx: 14
};

const inactiveThumbStyles = {
  config: springConfig,
  fill: '#0099FF',
  cx: 5
};

const SlideToggle = (props: Props) => {
  const [isOn, setIsOn] = useState(props.isOn);
  const [trackStyles, setTrackStyles] = useSpring(() =>
    props.isOn ? activeTrackStyles : inactiveTrackStyles
  );
  const [thumbStyles, setThumbStyles] = useSpring(() =>
    props.isOn ? activeThumbStyles : inactiveThumbStyles
  );

  const onToggle = () => {
    setTrackStyles(isOn ? inactiveTrackStyles : activeTrackStyles);
    setThumbStyles(isOn ? inactiveThumbStyles : activeThumbStyles);
    props.onChange(!isOn);
    setIsOn(!isOn);
  };

  const className = classNames(styles.slideToggle, props.className);

  return (
    <svg
      className={className}
      onClick={onToggle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 19 10"
    >
      <animated.path
        d="M14.5,14.5h-9A4.48,4.48,0,0,1,1,10H1A4.48,4.48,0,0,1,5.5,5.5h9A4.48,4.48,0,0,1,19,10h0A4.48,4.48,0,0,1,14.5,14.5Z"
        transform="translate(-0.5 -5)"
        style={trackStyles}
      />
      <animated.circle style={thumbStyles} cy="5" r="4" />
    </svg>
  );
};

export default SlideToggle;
