import React, { ReactNode } from 'react';

import styles from './Dropdown.scss';

type Props = {
  expandDirection: 'up' | 'down';
  tipPosition: 'left' | 'center' | 'right';
  verticalOffset: number; // distance (in px) between the end of the tip and the parent element
  autoAdjust: boolean; // try to adapt position so as not to extend beyond screen bounds
  parent: HTMLElement;
  children: ReactNode;
};

const TIP_WIDTH = 18;
const TIP_HEIGHT = 10;
const TIP_HORIZONTAL_OFFSET = 20; // distance from the side of the dropdown to the beginning of tip

const BOTTOM_OFFSET = 62; // FIXME, assumes that the dropdown is always below the element

const Dropdown = (props: Props) => {
  const { width: parentWidth } = props.parent.getBoundingClientRect();
  // calculate the x-coordinate of the dropdown,
  // so that its tip points to the center of the parent
  const x = parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2;
  const inlineStyles = {
    left: `${x}px`,
    bottom: -(BOTTOM_OFFSET + props.verticalOffset)
  };
  return (
    <div className={styles.dropdown} style={inlineStyles}>
      <DropdownTip />
      {props.children}
    </div>
  );
};

Dropdown.defaultProps = {
  expandDirection: 'down',
  tipPosition: 'left',
  verticalOffset: 0,
  autoAdjust: false
};

const DropdownTip = () => {
  const tipEndX = TIP_WIDTH / 2;
  const polygonPoints = `0,${TIP_HEIGHT} ${TIP_WIDTH},${TIP_HEIGHT} ${tipEndX},0`;
  const inlineStyles = {
    top: `-${TIP_HEIGHT}px`
  };

  return (
    <svg
      className={styles.dropdownTooltip}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${TIP_WIDTH} ${TIP_HEIGHT}`}
      style={inlineStyles}
    >
      <polygon points={polygonPoints} />
    </svg>
  );
};

export default Dropdown;
