import React from 'react';
import classNames from 'classnames';
import styles from './Overlay.scss';

type OverlayProps = {
  className?: string;
};

const Overlay = (props: OverlayProps) => {
  const overlayClassNames = classNames(styles.overlayDefault, props.className);
  return <div className={overlayClassNames}></div>;
};

export default Overlay;
