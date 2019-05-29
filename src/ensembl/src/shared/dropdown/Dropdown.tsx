import React, { ReactNode, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';

import { findOptimalPosition } from './dropdown-helper';
import { Position } from './dropdown-types';
import {
  TIP_WIDTH,
  TIP_HEIGHT,
  TIP_HORIZONTAL_OFFSET
} from './dropdown-constants';

import styles from './Dropdown.scss';

type Props = {
  position: Position;
  container?: HTMLElement | null;
  expandDirection: 'up' | 'down';
  tipPosition: 'left' | 'center' | 'right';
  verticalOffset: number; // distance (in px) between the end of the tip and the parent element
  autoAdjust: boolean; // try to adapt position so as not to extend beyond screen bounds
  children: ReactNode;
  onClose: () => void;
};

type DropdownParentElementState = HTMLElement | null;
type InlineStylesState = { top?: string; left?: string };

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
    const node = dropdownElementRef.current;
    const parentElement = node && node.parentElement;
    if (!(node && parentElement)) {
      return;
    }
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

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const optimalPosition = findOptimalPosition({
          intersectionEntry: entries[0],
          anchorBoundingRect: parentElement.getBoundingClientRect(),
          position: props.position
        });
        console.log('optimalPosition', optimalPosition);
      },
      {
        root: props.container,
        threshold: 1
      }
    );
    intersectionObserver.observe(node);

    return () => {
      intersectionObserver.unobserve(node);
    };
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

const getInlineStyles = (params: Props & { parentElement: HTMLElement }) => {
  const {
    width: parentWidth,
    height: parentHeight
  } = params.parentElement.getBoundingClientRect();
  // calculate the x-coordinate of the dropdown,
  // so that its tip points to the center of the parent

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        bodyStyles: {
          left: `${parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2}px`,
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          transform: 'rotate(180deg)',
          bottom: `${-TIP_HEIGHT}px`,
          left: `${TIP_HORIZONTAL_OFFSET}px`
        }
      };
    case Position.TOP_CENTRE:
      return {
        bodyStyles: {
          left: `50%`,
          transform: 'translateX(-50%)',
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          bottom: `${-TIP_HEIGHT}px`,
          left: `50%`,
          transform: 'rotate(180deg) translateX(-50%)'
        }
      };
    case Position.TOP_RIGHT:
      return {
        bodyStyles: {
          left: `calc(100% - 2 * ${TIP_HORIZONTAL_OFFSET}px - ${TIP_WIDTH}px)`,
          transform: 'translateX(-50%)',
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          bottom: `${-TIP_HEIGHT}px`,
          left: `100%`,
          transform: `rotate(180deg) translateX(calc(-${TIP_HORIZONTAL_OFFSET}px -${TIP_WIDTH}px)`
        }
      };

    case Position.BOTTOM_LEFT:
      return {
        bodyStyles: {
          left: `${parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2}px`,
          top: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: 0,
          left: `${TIP_HORIZONTAL_OFFSET}px`
        }
      };
    case Position.BOTTOM_CENTRE:
      return {
        bodyStyles: {
          left: `50%`,
          transform: 'translateX(-50%)',
          top: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: 0,
          left: `50%`,
          transform: 'translateX(-50%)'
        }
      };
    case Position.BOTTOM_RIGHT:
      return {
        bodyStyles: {
          left: `calc(100% - 2* ${TIP_HORIZONTAL_OFFSET}px - ${TIP_WIDTH}px)`,
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: `${-TIP_HEIGHT}px`,
          left: `100%`,
          transform: `rotate(180deg) translateX(calc(-${TIP_HORIZONTAL_OFFSET}px -${TIP_WIDTH}px)`
        }
      };

    case Position.LEFT_TOP:
      return {
        bodyStyles: {
          left: 0,
          transform: `translateX(calc(-100% - ${TIP_HEIGHT}px))`,
          top: `${parentHeight / 2 - TIP_HORIZONTAL_OFFSET - TIP_HEIGHT / 2}px`
        },
        tipStyles: {
          left: '100%',
          top: `${TIP_HORIZONTAL_OFFSET}px`
        }
      };

    // CONTINUE HERE
    case Position.LEFT_CENTRE:
      return {
        bodyStyles: {
          left: `50%`,
          transform: 'translateX(-50%)',
          top: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: 0,
          left: `50%`,
          transform: 'translateX(-50%)'
        }
      };
    case Position.LEFT_BOTTOM:
      return {
        bodyStyles: {
          left: `calc(100% - 2* ${TIP_HORIZONTAL_OFFSET}px - ${TIP_WIDTH}px)`,
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: `${-TIP_HEIGHT}px`,
          left: `100%`,
          transform: `rotate(180deg) translateX(calc(-${TIP_HORIZONTAL_OFFSET}px -${TIP_WIDTH}px)`
        }
      };
  }

  // const x = parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2;
  // setInlineStyles({
  //   top: `${parentHeight + TIP_HEIGHT + props.verticalOffset}px`,
  //   left: `${x}px`
  // });
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

export { Position };
export default Dropdown;
