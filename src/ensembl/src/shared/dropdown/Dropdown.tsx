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

type DropdownTipProps = {
  position: Position;
  style: InlineStyles;
};

type DropdownParentElementState = HTMLElement | null;
type InlineStyles = { [key: string]: string | number };
type InlineStylesState = {
  bodyStyles: InlineStyles;
  tipStyles: InlineStyles;
};

const Dropdown = (props: Props) => {
  const [parent, setParent] = useState<DropdownParentElementState>(null);
  const [inlineStyles, setInlineStyles] = useState<InlineStylesState>({
    bodyStyles: {},
    tipStyles: {}
  });
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

    setInlineStyles(getInlineStyles({ ...props, parentElement }));

    // const intersectionObserver = new IntersectionObserver(
    //   (entries) => {
    //     const optimalPosition = findOptimalPosition({
    //       intersectionEntry: entries[0],
    //       anchorBoundingRect: parentElement.getBoundingClientRect(),
    //       position: props.position
    //     });
    //     console.log('optimalPosition', optimalPosition);
    //   },
    //   {
    //     root: props.container,
    //     threshold: 1
    //   }
    // );
    // intersectionObserver.observe(node);

    // return () => {
    //   intersectionObserver.unobserve(node);
    // };
  }, []);

  const className = classNames(styles.dropdown, props.position, {
    [styles.dropdownInvisible]: !parent
  });

  return (
    <div
      className={className}
      ref={dropdownElementRef}
      style={inlineStyles.bodyStyles}
      onClick={handleClickInside}
    >
      <DropdownTip style={inlineStyles.tipStyles} position={props.position} />
      {props.children}
    </div>
  );
};

const getInlineStyles = (params: Props & { parentElement: HTMLElement }) => {
  // calculate styles of the tooltip
  // considering that its tip points at the center of the parent

  // NOTE: applying several consecutive translate functions in a transform
  // is a hack to enable support of IE11 (which doesn't support calc inside of a transform)

  const {
    width: parentWidth,
    height: parentHeight
  } = params.parentElement.getBoundingClientRect();

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        bodyStyles: {
          // left: `${parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2}px`,
          left: '50%',
          transform: `translateX(-100%) translateX(${TIP_HORIZONTAL_OFFSET}px) translateX(${TIP_WIDTH /
            2}px)`,
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          right: `${TIP_HORIZONTAL_OFFSET}px`,
          transform: 'rotate(180deg)',
          bottom: `${-TIP_HEIGHT}px`
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
          left: `50%`,
          bottom: `${-TIP_HEIGHT}px`,
          transform: `rotate(180deg) translate(-50%, -${TIP_HEIGHT}px)`,
          transformOrigin: 'left 0'
        }
      };
    case Position.TOP_RIGHT:
      return {
        bodyStyles: {
          left: `calc(50% - ${TIP_HORIZONTAL_OFFSET + TIP_WIDTH / 2}px)`,
          // left: `calc(100% - 2 * ${TIP_HORIZONTAL_OFFSET}px - ${TIP_WIDTH}px)`,
          // transform: 'translateX(-50%)',
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          bottom: `${-TIP_HEIGHT}px`,
          left: `${TIP_HORIZONTAL_OFFSET}px`,
          transform: `rotate(180deg)`
          // transform: `rotate(180deg) translateX(calc(-${TIP_HORIZONTAL_OFFSET}px -${TIP_WIDTH}px)`
        }
      };

    case Position.BOTTOM_LEFT:
      return {
        bodyStyles: {
          left: `${parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2}px`,
          top: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: `-${TIP_HEIGHT}px`,
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
          top: `-${TIP_HEIGHT}px`,
          left: `50%`,
          transform: 'translateX(-50%)'
        }
      };
    case Position.BOTTOM_RIGHT:
      return {
        bodyStyles: {
          top: `${parentHeight + TIP_HEIGHT}px`,
          left: '50%',
          transform: `translateX(calc(-100% + ${TIP_HORIZONTAL_OFFSET}px + ${TIP_WIDTH /
            2}px)`
        },
        tipStyles: {
          top: `${-TIP_HEIGHT}px`,
          left: `100%`,
          transform: `translateX(calc(-100% - ${TIP_HORIZONTAL_OFFSET}px))`
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
          top: `${TIP_HORIZONTAL_OFFSET}px`,
          transform: 'rotate(90deg)'
        }
      };
    case Position.LEFT_CENTRE:
      return {
        bodyStyles: {
          left: 0,
          transform: `translate(calc(-100% - ${TIP_HEIGHT}px), -50%)`,
          top: `50%`
        },
        tipStyles: {
          left: '100%',
          top: '50%',
          transform: 'rotate(90deg) translate(-50%, -99%)',
          transformOrigin: 'left 0'
        }
      };
    case Position.LEFT_BOTTOM:
      return {
        bodyStyles: {
          left: 0,
          top: '50%',
          transform: `translate(calc(-100% - ${TIP_HEIGHT}px), calc(-100% + ${TIP_HORIZONTAL_OFFSET}px + ${TIP_WIDTH}px))`
        },
        tipStyles: {
          left: '100%',
          top: '100%',
          transform: `rotate(90deg) translateY(calc(-${TIP_HORIZONTAL_OFFSET}px - ${TIP_WIDTH}px))`
        }
      };

    case Position.RIGHT_TOP:
      return {
        bodyStyles: {
          left: `calc(100% + ${TIP_HEIGHT}px)`,
          top: `${parentHeight / 2 - TIP_HORIZONTAL_OFFSET - TIP_HEIGHT / 2}px`
        },
        tipStyles: {
          left: 0,
          top: `${TIP_HORIZONTAL_OFFSET}px`,
          transform: 'rotate(-90deg)'
        }
      };
    case Position.RIGHT_CENTRE:
      return {
        bodyStyles: {
          left: `calc(100% + ${TIP_HEIGHT}px)`,
          top: `50%`,
          transform: `translateY(-50%)`
        },
        tipStyles: {
          left: `-${TIP_HEIGHT}px`,
          top: '50%',
          transform: `rotate(-90deg) translateX(-50%)`,
          transformOrigin: 'left 0'
        }
      };
    case Position.RIGHT_BOTTOM:
      return {
        bodyStyles: {
          left: `calc(100% + ${TIP_HEIGHT}px)`,
          top: '50%',
          transform: `translateY(calc(-100% + ${TIP_HORIZONTAL_OFFSET}px + ${TIP_WIDTH}px))`
        },
        tipStyles: {
          left: 0,
          bottom: `${TIP_HORIZONTAL_OFFSET}px`,
          transform: `rotate(-90deg)`
        }
      };
  }
};

Dropdown.defaultProps = {
  autoAdjust: false,
  expandDirection: 'down',
  tipPosition: 'left',
  verticalOffset: 0
};

const DropdownTip = (props: DropdownTipProps) => {
  const { style, position } = props;
  console.log('position', position);
  const tipEndX = TIP_WIDTH / 2;

  // let polygonPoints;
  // let viewBox;
  // switch (position) {
  //   // draw four tooltip shapes for different directions
  //   // (we probably could have achieved the same with just one tooltip,
  //   // with transform: rotate, tweaked transform-origin and transform: translate, but this seems easier)
  //   case Position.TOP_LEFT:
  //   case Position.TOP_CENTRE:
  //   case Position.TOP_RIGHT:
  //     // triangle pointing down
  //     polygonPoints = `0,0 ${tipEndX},${TIP_HEIGHT} ${TIP_WIDTH},0`;
  //     viewBox = `0 0 ${TIP_WIDTH} ${TIP_HEIGHT}`
  //     break;
  //   case Position.LEFT_TOP:
  //   case Position.LEFT_CENTRE:
  //   case Position.LEFT_BOTTOM:
  //     // triangle pointing right
  //     polygonPoints = `0,0 ${TIP_HEIGHT},${tipEndX} 0,${TIP_WIDTH}`;
  //     viewBox= `0 0 ${TIP_HEIGHT} ${TIP_WIDTH}`
  //     break;
  //   case Position.RIGHT_TOP:
  //   case Position.RIGHT_CENTRE:
  //   case Position.RIGHT_BOTTOM:
  //     // triangle pointing left
  //     console.log('should be here');
  //     polygonPoints = `0,${tipEndX} ${TIP_HEIGHT},0 ${TIP_HEIGHT},${TIP_WIDTH}`;
  //     viewBox= `0 0 ${TIP_HEIGHT} ${TIP_WIDTH}`
  //     break;
  //   default:
  //     // triangle pointing up
  //     console.log('am i here?');
  //     polygonPoints = `0,${TIP_HEIGHT} ${TIP_WIDTH},${TIP_HEIGHT} ${tipEndX},0`;
  //     viewBox= `0 0 ${TIP_WIDTH} ${TIP_HEIGHT}`
  // }

  const polygonPoints = `0,${TIP_HEIGHT} ${TIP_WIDTH},${TIP_HEIGHT} ${tipEndX},0`;
  console.log('style', style);

  return (
    <svg
      className={styles.dropdownTooltip}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${TIP_WIDTH} ${TIP_HEIGHT}`}
    >
      <polygon points={polygonPoints} />
    </svg>
  );
};

export { Position };
export default Dropdown;
