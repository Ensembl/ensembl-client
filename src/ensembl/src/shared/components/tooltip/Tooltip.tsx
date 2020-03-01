import React, { ReactNode, useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import noop from 'lodash/noop';

import windowService from 'src/services/window-service';
import useOutsideClick from 'src/shared/hooks/useOutsideClick';

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
  anchor: HTMLElement;
  container?: HTMLElement | null;
  autoAdjust: boolean; // try to adjust tooltip position so as not to extend beyond screen bounds
  delay: number;
  children: ReactNode;
  onClose: () => void;
};

type PropsWithNullableAnchor = Omit<Props, 'anchor'> & {
  anchor: HTMLElement | null;
};

type TipProps = {
  style: InlineStyles;
};

type InlineStyles = { [key: string]: string | number | undefined };
type InlineStylesState = {
  bodyStyles: InlineStyles;
  tipStyles: InlineStyles;
};

const Tooltip = (props: PropsWithNullableAnchor) => {
  return props.anchor ? <TooltipWithAnchor {...(props as Props)} /> : null;
};

const TooltipWithAnchor = (props: Props) => {
  const [isWaiting, setIsWaiting] = useState(true);
  const [isPositioning, setIsPositioning] = useState(props.autoAdjust);
  const positionRef = useRef<Position | null>(null);
  const [inlineStyles, setInlineStyles] = useState<InlineStylesState>({
    bodyStyles: {},
    tipStyles: {}
  });
  const tooltipElementRef: React.RefObject<HTMLDivElement> = useRef(null);
  useOutsideClick(tooltipElementRef, props.onClose);
  let timeoutId: NodeJS.Timeout;

  const handleClickInside = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    timeoutId = setTimeout(() => {
      setIsWaiting(false);
    }, props.delay);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isWaiting) {
      return;
    }

    const tooltipElement = tooltipElementRef.current;

    if (!tooltipElement) {
      return;
    }

    setInlineStyles(getInlineStyles(props));

    if (props.autoAdjust) {
      adjustPosition(tooltipElement, props.anchor);
    }
  }, [isWaiting]);

  const adjustPosition = (
    tooltipElement: HTMLDivElement,
    parentElement: HTMLElement
  ) => {
    const tooltipBoundingRect = tooltipElement.getBoundingClientRect();
    const rootBoundingRect = props.container
      ? props.container.getBoundingClientRect()
      : windowService.getDimensions();
    const anchorBoundingRect = parentElement.getBoundingClientRect();

    const optimalPosition = findOptimalPosition({
      tooltipBoundingRect,
      anchorBoundingRect,
      rootBoundingRect,
      position: positionRef.current || props.position
    });

    if (optimalPosition !== positionRef.current) {
      positionRef.current = optimalPosition;
    }
    setInlineStyles(
      getInlineStyles({
        ...props,
        position: optimalPosition
      })
    );
    setIsPositioning(false);
  };

  const hasInlineStyles = () => Object.keys(inlineStyles.bodyStyles).length;

  const className = classNames(
    styles.tooltip,
    positionRef.current || props.position,
    { [styles.tooltipInvisible]: isPositioning || !hasInlineStyles() }
  );

  return isWaiting
    ? null
    : ReactDOM.createPortal(
        <div
          className={className}
          ref={tooltipElementRef}
          style={inlineStyles.bodyStyles}
          onClick={handleClickInside}
        >
          <TooltipTip style={inlineStyles.tipStyles} />
          {props.children}
        </div>,
        document.body
      );
};

const getInlineStyles = (params: Props) => {
  // calculate styles of the tooltip
  // considering that its tip points at the center of the anchor element

  const anchorBoundingRect = params.anchor.getBoundingClientRect();
  const anchorWidth = anchorBoundingRect.width;
  const halfAnchorWidth = anchorWidth / 2;
  const anchorHeight = anchorBoundingRect.height;
  const halfAnchorHeight = anchorHeight / 2;
  const anchorLeft = Math.round(anchorBoundingRect.left);
  const anchorTop = Math.round(anchorBoundingRect.top);
  const halfTipWidth = TIP_WIDTH / 2;

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        bodyStyles: {
          left: `${anchorLeft + anchorWidth / 2}px`,
          transform: `translateX(calc(${TIP_HORIZONTAL_OFFSET}px + ${TIP_WIDTH /
            2}px - 100%))`,
          bottom: `${window.innerHeight - anchorTop + TIP_HEIGHT}px`
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
          left: `${anchorLeft +
            halfAnchorWidth -
            TIP_HORIZONTAL_OFFSET -
            halfTipWidth}px`,
          bottom: `${window.innerHeight - anchorTop + TIP_HEIGHT}px`
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
          top: `${anchorTop + anchorHeight + TIP_HEIGHT}px`,
          left: `${anchorLeft + anchorWidth / 2}px`,
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
          left: `${anchorLeft +
            halfAnchorWidth -
            TIP_HORIZONTAL_OFFSET -
            halfTipWidth}px`,
          top: `${anchorTop + anchorHeight + TIP_HEIGHT}px`
        },
        tipStyles: {
          top: `${-TIP_HEIGHT + 1}px`,
          left: `${TIP_HORIZONTAL_OFFSET}px`
        }
      };
    case Position.LEFT_TOP:
      return {
        bodyStyles: {
          left: `${anchorLeft - TIP_HEIGHT}px`,
          top: `${anchorTop + halfAnchorHeight}px`,
          transform: `translateX(-100%) translateY(calc(-100% + ${TIP_HORIZONTAL_OFFSET}px))`
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
          left: `${anchorLeft - TIP_HEIGHT}px`,
          top: `${anchorTop + halfAnchorHeight}px`,
          transform: `translateX(-100%) translateY(-${TIP_HORIZONTAL_OFFSET}px)`
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
          left: `${anchorLeft + anchorWidth + TIP_HEIGHT}px`,
          top: `${anchorTop + halfAnchorHeight + TIP_HORIZONTAL_OFFSET}px`,
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
          left: `${anchorLeft + anchorWidth + TIP_HEIGHT}px`,
          top: `${anchorTop + halfAnchorHeight}px`,
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
