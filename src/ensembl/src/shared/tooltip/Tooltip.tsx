import React, { ReactNode, useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { findOptimalPosition } from './tooltip-helper';
import { Position } from './tooltip-types';
import {
  TIP_WIDTH,
  TIP_HEIGHT,
  TIP_HORIZONTAL_OFFSET,
  TOOLTIP_TIMEOUT
} from './tooltip-constants';

import styles from './Tooltip.scss';

type Props = {
  position: Position;
  container?: HTMLElement | null;
  autoAdjust: boolean; // try to adapt position so as not to extend beyond screen bounds
  delay: number;
  children: ReactNode;
  onClose: () => void;
};

type TipProps = {
  style: InlineStyles;
};

type InlineStyles = { [key: string]: string | number | undefined };
type InlineStylesState = {
  bodyStyles: InlineStyles;
  tipStyles: InlineStyles;
};

const Tooltip = (props: Props) => {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isPositioning, setIsPositioning] = useState(props.autoAdjust);
  const parentRef = useRef<HTMLElement | null>(null);
  const positionRef = useRef<Position | null>(null);
  const [inlineStyles, setInlineStyles] = useState<InlineStylesState>({
    bodyStyles: {},
    tipStyles: {}
  });
  const tooltipElementRef: React.RefObject<HTMLDivElement> = useRef(null);
  let timeoutId: NodeJS.Timeout;

  const handleClickInside = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleClickOutside = (e: Event) => {
    if (!parentRef.current) return;

    let target;
    if (e.type === 'touchend' && (e as TouchEvent).touches) {
      target = (e as TouchEvent).touches[0];
    } else {
      target = e.target;
    }

    if (target instanceof HTMLElement && !parentRef.current.contains(target)) {
      props.onClose();
    }
  };

  useEffect(() => {
    timeoutId = setTimeout(() => {
      console.log('about to set is waiting');
      setIsWaiting(false);
    }, props.delay);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchend', handleClickOutside, true);
    return function cleanup() {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchend', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    const node = tooltipElementRef.current;
    const parentElement = node && node.parentElement;
    if (!(node && parentElement)) {
      return;
    }
    parentRef.current = parentElement;

    setInlineStyles(getInlineStyles({ ...props, parentElement }));

    if (!props.autoAdjust) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const optimalPosition = findOptimalPosition({
          intersectionEntry: entries[0],
          anchorBoundingRect: parentElement.getBoundingClientRect(),
          position: positionRef.current || props.position
        });
        if (optimalPosition !== positionRef.current) {
          positionRef.current = optimalPosition;
        }
        setInlineStyles(
          getInlineStyles({
            ...props,
            position: optimalPosition,
            parentElement
          })
        );
        setIsPositioning(false);
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
  }, [isWaiting]);

  const className = classNames(
    styles.tooltip,
    positionRef.current || props.position,
    { [styles.tooltipInvisible]: !parentRef.current || isPositioning }
  );

  return isWaiting ? null : (
    <div
      className={className}
      ref={tooltipElementRef}
      style={inlineStyles.bodyStyles}
      onClick={handleClickInside}
    >
      <TooltipTip style={inlineStyles.tipStyles} />
      {props.children}
    </div>
  );
};

const getInlineStyles = (params: Props & { parentElement: HTMLElement }) => {
  // calculate styles of the tooltip
  // considering that its tip points at the center of the parent

  // NOTE: applying several consecutive translate functions in a transform
  // instead of just using the CSS calc function
  // is done to support IE11 (which doesn't allow calc inside of a transform)

  const {
    width: parentWidth,
    height: parentHeight
  } = params.parentElement.getBoundingClientRect();

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        bodyStyles: {
          left: '50%',
          transform: `translateX(-100%) translateX(${TIP_HORIZONTAL_OFFSET}px) translateX(${TIP_WIDTH /
            2}px)`,
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          right: `${TIP_HORIZONTAL_OFFSET}px`,
          transform: 'rotate(180deg)',
          bottom: `${-TIP_HEIGHT + 1}px`
        }
      };
    case Position.TOP_RIGHT:
      return {
        bodyStyles: {
          left: `calc(50% - ${TIP_HORIZONTAL_OFFSET + TIP_WIDTH / 2}px)`,
          bottom: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          bottom: `${-TIP_HEIGHT + 1}px`,
          left: `${TIP_HORIZONTAL_OFFSET}px`,
          transform: `rotate(180deg)`
        }
      };
    case Position.BOTTOM_LEFT:
      return {
        bodyStyles: {
          top: `${parentHeight + TIP_HEIGHT}px`,
          left: '50%',
          transform: `translateX(calc(-100% + ${TIP_HORIZONTAL_OFFSET}px + ${TIP_WIDTH /
            2}px)`
        },
        tipStyles: {
          top: `${-TIP_HEIGHT + 1}px`,
          left: `100%`,
          transform: `translateX(calc(-100% - ${TIP_HORIZONTAL_OFFSET}px))`
        }
      };
    case Position.BOTTOM_RIGHT:
      return {
        bodyStyles: {
          left: `${parentWidth / 2 - TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2}px`,
          top: `${parentHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: `${-TIP_HEIGHT + 1}px`,
          left: `${TIP_HORIZONTAL_OFFSET}px`
        }
      };
    case Position.LEFT_TOP:
      return {
        bodyStyles: {
          left: `-${TIP_HEIGHT}px`,
          top: `50%`,
          transform: `translateX(-100%) translateY(-100%) translateY(${TIP_HORIZONTAL_OFFSET}px)`
        },
        tipStyles: {
          left: 'calc(100% - 1px)',
          bottom: `${TIP_HORIZONTAL_OFFSET + TIP_WIDTH / 2}px`,
          transform: 'rotate(90deg)',
          transformOrigin: 'left bottom'
        }
      };
    case Position.LEFT_BOTTOM:
      return {
        bodyStyles: {
          left: 0,
          top: '50%',
          transform: `translateX(-100%) translateX(-${TIP_HEIGHT}px) translateY(-${TIP_HORIZONTAL_OFFSET}px)`
        },
        tipStyles: {
          left: 'calc(100% - 1px)',
          top: `calc(${TIP_HORIZONTAL_OFFSET}px - ${TIP_HEIGHT}px - ${TIP_WIDTH /
            2}px)`,
          transform: `rotate(90deg)`,
          transformOrigin: 'left bottom'
        }
      };
    case Position.RIGHT_TOP:
      return {
        bodyStyles: {
          left: `calc(100% + ${TIP_HEIGHT}px)`,
          top: `calc(50% + ${TIP_HORIZONTAL_OFFSET}px)`,
          transform: `translateY(-100%)`
        },
        tipStyles: {
          left: `1px`,
          bottom: `${TIP_HORIZONTAL_OFFSET - TIP_WIDTH / 2}px`,
          transform: 'rotate(-90deg)',
          transformOrigin: 'left bottom'
        }
      };
    case Position.RIGHT_BOTTOM:
      return {
        bodyStyles: {
          left: `calc(100% + ${TIP_HEIGHT}px)`,
          top: '50%',
          transform: `translateY(-${TIP_HORIZONTAL_OFFSET}px)`
        },
        tipStyles: {
          left: `1px`,
          top: `calc(${TIP_HORIZONTAL_OFFSET}px + ${TIP_WIDTH / 2}px)`,
          transform: `rotate(-90deg) translateY(-${TIP_HEIGHT}px)`,
          transformOrigin: 'left 0'
        }
      };
  }
};

Tooltip.defaultProps = {
  delay: TOOLTIP_TIMEOUT,
  position: Position.BOTTOM_RIGHT,
  onClose: noop,
  autoAdjust: false
};

const TooltipTip = (props: TipProps) => {
  const { style } = props;
  const tipEndX = TIP_WIDTH / 2;

  const polygonPoints = `0,${TIP_HEIGHT} ${TIP_WIDTH},${TIP_HEIGHT} ${tipEndX},0`;

  return (
    <svg
      className={styles.tooltipTip}
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
export default Tooltip;
