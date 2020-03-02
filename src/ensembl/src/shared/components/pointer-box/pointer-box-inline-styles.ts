import { Position } from './pointer-box-types';
import { PointerBoxProps, InlineStylesState } from './PointerBox';

type Params = PointerBoxProps;

export const getStylesForRenderingIntoBody = (params: Params): InlineStylesState => {
  // calculate styles of the tooltip
  // considering that its tip points at the center of the anchor element

  const {
    anchor,
    pointerWidth,
    pointerHeight,
    pointerOffset
  } = params;
  const anchorBoundingRect = anchor.getBoundingClientRect();
  const anchorWidth = anchorBoundingRect.width;
  const halfAnchorWidth = anchorWidth / 2;
  const anchorHeight = anchorBoundingRect.height;
  const halfAnchorHeight = anchorHeight / 2;
  const anchorLeft = Math.round(anchorBoundingRect.left);
  const anchorTop = Math.round(anchorBoundingRect.top);
  const halfPointerWidth = Math.floor(pointerWidth / 2);

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        bodyStyles: {
          left: `${anchorLeft + anchorWidth / 2}px`,
          transform: `translateX(calc(${pointerOffset}px + ${halfPointerWidth}px - 100%))`,
          bottom: `${window.innerHeight - anchorTop + pointerHeight}px`
        },
        pointerStyles: {
          right: `${pointerOffset}px`,
          transform: 'rotate(180deg)',
          bottom: `${-pointerHeight + 1}px`
        }
      };
    case Position.TOP_RIGHT:
      return {
        bodyStyles: {
          left: `${anchorLeft +
            halfAnchorWidth -
            pointerOffset -
            halfPointerWidth}px`,
          bottom: `${window.innerHeight - anchorTop + pointerHeight}px`
        },
        pointerStyles: {
          bottom: `${-pointerHeight + 1}px`,
          left: `${pointerOffset}px`,
          transform: `rotate(180deg)`
        }
      };
    case Position.BOTTOM_LEFT:
      return {
        bodyStyles: {
          top: `${anchorTop + anchorHeight + pointerHeight}px`,
          left: `${anchorLeft + anchorWidth / 2}px`,
          transform: `translateX(calc(-100% + ${pointerOffset}px + ${halfPointerWidth}px)`
        },
        pointerStyles: {
          top: `${-pointerHeight + 1}px`,
          left: `100%`,
          transform: `translateX(calc(-100% - ${pointerOffset}px))`
        }
      };
    case Position.BOTTOM_RIGHT:
      return {
        bodyStyles: {
          left: `${anchorLeft +
            halfAnchorWidth -
            pointerOffset -
            halfPointerWidth}px`,
          top: `${anchorTop + anchorHeight + pointerHeight}px`
        },
        pointerStyles: {
          top: `${-pointerHeight + 1}px`,
          left: `${pointerOffset}px`
        }
      };
    case Position.LEFT_TOP:
      return {
        bodyStyles: {
          left: `${anchorLeft - pointerHeight}px`,
          top: `${anchorTop + halfAnchorHeight}px`,
          transform: `translateX(-100%) translateY(calc(-100% + ${pointerOffset}px))`
        },
        pointerStyles: {
          left: 'calc(100% - 1px)',
          bottom: `${pointerOffset + halfPointerWidth}px`,
          transform: 'rotate(90deg)',
          transformOrigin: 'left bottom'
        }
      };
    case Position.LEFT_BOTTOM:
      return {
        bodyStyles: {
          left: `${anchorLeft - pointerHeight}px`,
          top: `${anchorTop + halfAnchorHeight}px`,
          transform: `translateX(-100%) translateY(-${pointerOffset}px)`
        },
        pointerStyles: {
          left: 'calc(100% - 1px)',
          top: `calc(${pointerOffset}px - ${pointerHeight}px - ${halfPointerWidth}px)`,
          transform: `rotate(90deg)`,
          transformOrigin: 'left bottom'
        }
      };
    case Position.RIGHT_TOP:
      return {
        bodyStyles: {
          left: `${anchorLeft + anchorWidth + pointerHeight}px`,
          top: `${anchorTop + halfAnchorHeight + pointerOffset}px`,
          transform: `translateY(-100%)`
        },
        pointerStyles: {
          left: `1px`,
          bottom: `${pointerOffset - halfPointerWidth}px`,
          transform: 'rotate(-90deg)',
          transformOrigin: 'left bottom'
        }
      };
    case Position.RIGHT_BOTTOM:
      return {
        bodyStyles: {
          left: `${anchorLeft + anchorWidth + pointerHeight}px`,
          top: `${anchorTop + halfAnchorHeight}px`,
          transform: `translateY(-${pointerOffset}px)`
        },
        pointerStyles: {
          left: `1px`,
          top: `calc(${pointerOffset}px + ${halfPointerWidth}px)`,
          transform: `rotate(-90deg) translateY(-${pointerHeight}px)`,
          transformOrigin: 'left 0'
        }
      };
  }
};
