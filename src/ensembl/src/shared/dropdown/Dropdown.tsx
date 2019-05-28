import React, { ReactNode, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './Dropdown.scss';

export enum Position {
  TOP_LEFT = 'top_left',
  TOP_CENTRE = 'top_centre',
  TOP_RIGHT = 'top_right',
  RIGHT_TOP = 'right_top',
  RIGHT_CENTRE = 'right_centre',
  RIGHT_BOTTOM = 'right_bottom',
  BOTTOM_RIGHT = 'bottom_right',
  BOTTOM_CENTRE = 'bottom_centre',
  BOTTOM_LEFT = 'bottom_left',
  LEFT_BOTTOM = 'left_bottom',
  LEFT_CENTRE = 'left_centre',
  LEFT_TOP = 'left_top'
}

type Props = {
  expandDirection: 'up' | 'down';
  tipPosition: 'left' | 'center' | 'right';
  verticalOffset: number; // distance (in px) between the end of the tip and the parent element
  autoAdjust: boolean; // try to adapt position so as not to extend beyond screen bounds
  children: ReactNode;
  onClose: () => void;
};

type DropdownParentElementState = HTMLElement | null;
type InlineStylesState = { top?: string; left?: string };

const TIP_WIDTH = 18;
const TIP_HEIGHT = 10;
const TIP_HORIZONTAL_OFFSET = 20; // distance from the side of the dropdown to the beginning of tip

const Dropdown = (props: Props) => {
  const [parent, setParent] = useState<DropdownParentElementState>(null);
  const [inlineStyles, setInlineStyles] = useState<InlineStylesState>({});
  const dropdownElementRef: React.RefObject<HTMLDivElement> = useRef(null);

  const handleClickInside = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleClickOutside = (e: Event) => {
    if (!parent) return;

    let target;
    if (e.type === 'touchend' && (e as TouchEvent).touches) {
      target = (e as TouchEvent).touches[0];
    } else {
      target = e.target;
    }

    if (target instanceof HTMLElement && !parent.contains(target)) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchend', handleClickOutside, true);
    return function cleanup() {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchend', handleClickOutside, true);
    };
  }, []);

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
      setInlineStyles({
        top: `${parentHeight + TIP_HEIGHT + props.verticalOffset}px`,
        left: `${x}px`
      });
    }
  }, []);

  useEffect(() => {
    const node = dropdownElementRef.current;
    if (!node) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries);
      },
      {
        threshold: 1
      }
    );
    intersectionObserver.observe(node);
  }, []);

  const className = classNames(styles.dropdown, {
    [styles.dropdownInvisible]: !parent
  });

  return (
    <div
      className={className}
      ref={dropdownElementRef}
      style={inlineStyles}
      onClick={handleClickInside}
    >
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
