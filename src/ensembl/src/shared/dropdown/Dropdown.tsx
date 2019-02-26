import React, { ReactNode, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './Dropdown.scss';
import { string } from 'prop-types';

type Props = {
  expandDirection: 'up' | 'down';
  tipPosition: 'left' | 'center' | 'right';
  verticalOffset: number; // distance (in px) between the end of the tip and the parent element
  autoAdjust: boolean; // try to adapt position so as not to extend beyond screen bounds
  children: ReactNode;
};

type DropdownParentElementState = HTMLElement | null;

const TIP_WIDTH = 18;
const TIP_HEIGHT = 10;
const TIP_HORIZONTAL_OFFSET = 20; // distance from the side of the dropdown to the beginning of tip

const Dropdown = (props: Props) => {
  const [parent, setParent] = useState<DropdownParentElementState>(null);
  const dropdownElementRef: React.RefObject<HTMLDivElement> = useRef(null);
  let inlineStyles: { top?: string; left?: string } = {};

  useEffect(() => {
    if (dropdownElementRef.current) {
      const parentElement = dropdownElementRef.current.parentElement;
      if (!parentElement) return;
      setParent(parentElement);

      const {
        width: parentWidth,
        height: parentHeight
      } = parentElement.getBoundingClientRect();
      // calculate the x-coordinate of the dropdown,
      // so that its tip points to the center of the parent
      const x = parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2;
      console.log('i am here');
      inlineStyles.top = `${parentHeight +
        TIP_HEIGHT +
        props.verticalOffset}px`;
      inlineStyles.left = `${x}px`;
      console.log('inlineStyles in useEffect', inlineStyles);
    }
  });

  const className = classNames(styles.dropdown, {
    [styles.dropdownInvisible]: !parent
  });

  console.log('inlineStyles', inlineStyles);

  return (
    <div className={className} ref={dropdownElementRef} style={inlineStyles}>
      <DropdownTip />
      {props.children}
    </div>
  );
};

Dropdown.defaultProps = {
  autoAdjust: false,
  expandDirection: 'down',
  tipPosition: 'left',
  verticalOffset: 0
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
