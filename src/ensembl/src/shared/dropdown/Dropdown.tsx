import React, { ReactNode } from 'react';

import styles from './Dropdown.scss';

type Props = {
  expandDirection: 'up' | 'down';
  tipPosition: 'left' | 'center' | 'right';
  verticalOffset: number; // distance (in px) between the end of the tip and the parent element
  autoAdjust: boolean; // try to adapt position so as not to extend beyond screen bounds
  parent: JSX.Element;
  children: ReactNode;
};

const Dropdown = (props: Props) => {};

Dropdown.defaultProps = {
  expandDirection: 'down',
  tipPosition: 'left',
  verticalOffset: 0,
  autoAdjust: false
};

export default Dropdown;
