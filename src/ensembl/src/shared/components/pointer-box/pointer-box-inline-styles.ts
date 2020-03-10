import { Position } from './pointer-box-types';
import { PointerBoxProps, InlineStylesState } from './PointerBox';

type Params = PointerBoxProps;

/*
  Functions for calculating inline styles of the pointer box
  that position it is such a way that its pointer points at the center of the anchor element
*/

export const getStylesForRenderingIntoBody = (
  params: Params
): InlineStylesState => {
  const commonStyles = getCommonStyles(params);

  return {
    ...commonStyles,
    bodyStyles: {
      ...commonStyles.bodyStyles,
      ...getBodyStylesForRenderingIntoBody(params)
    }
  };
};

export const getStylesForRenderingIntoAnchor = (
  params: Params
): InlineStylesState => {
  const commonStyles = getCommonStyles(params);

  return {
    ...commonStyles,
    bodyStyles: {
      ...commonStyles.bodyStyles,
      ...getBodyStylesForRenderingIntoAnchor(params)
    }
  };
};

const getCommonStyles = (params: Params): InlineStylesState => {
  const { pointerWidth, pointerHeight, pointerOffset } = params;
  const halfPointerWidth = Math.floor(pointerWidth / 2);

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        bodyStyles: {
          transform: `translateX(calc(${pointerOffset}px + ${halfPointerWidth}px - 100%))`
        },
        pointerStyles: {
          right: `${pointerOffset}px`,
          transform: 'rotate(180deg)',
          bottom: `${-pointerHeight + 1}px`
        }
      };
    case Position.TOP_RIGHT:
      return {
        bodyStyles: {},
        pointerStyles: {
          bottom: `${-pointerHeight + 1}px`,
          left: `${pointerOffset}px`,
          transform: `rotate(180deg)`
        }
      };
    case Position.BOTTOM_LEFT:
      return {
        bodyStyles: {
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
        bodyStyles: {},
        pointerStyles: {
          top: `${-pointerHeight + 1}px`,
          left: `${pointerOffset}px`
        }
      };
    case Position.LEFT_TOP:
      return {
        bodyStyles: {
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

const getBodyStylesForRenderingIntoBody = (
  params: Params
): { [key: string]: string } => {
  const { anchor, pointerWidth, pointerHeight, pointerOffset } = params;
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
        left: `${anchorLeft + anchorWidth / 2}px`,
        bottom: `${window.innerHeight - anchorTop + pointerHeight}px`
      };
    case Position.TOP_RIGHT:
      return {
        left: `${anchorLeft +
          halfAnchorWidth -
          pointerOffset -
          halfPointerWidth}px`,
        bottom: `${window.innerHeight - anchorTop + pointerHeight}px`
      };
    case Position.BOTTOM_LEFT:
      return {
        top: `${anchorTop + window.scrollY + anchorHeight + pointerHeight}px`,
        left: `${anchorLeft + anchorWidth / 2}px`
      };
    case Position.BOTTOM_RIGHT:
      return {
        left: `${anchorLeft +
          halfAnchorWidth -
          pointerOffset -
          halfPointerWidth}px`,
        top: `${anchorTop + window.scrollY + anchorHeight + pointerHeight}px`
      };
    case Position.LEFT_TOP:
      return {
        left: `${anchorLeft - pointerHeight}px`,
        top: `${anchorTop + halfAnchorHeight}px`
      };
    case Position.LEFT_BOTTOM:
      return {
        left: `${anchorLeft - pointerHeight}px`,
        top: `${anchorTop + halfAnchorHeight}px`
      };
    case Position.RIGHT_TOP:
      return {
        left: `${anchorLeft + anchorWidth + pointerHeight}px`,
        top: `${anchorTop + halfAnchorHeight + pointerOffset}px`
      };
    case Position.RIGHT_BOTTOM:
      return {
        left: `${anchorLeft + anchorWidth + pointerHeight}px`,
        top: `${anchorTop + halfAnchorHeight}px`
      };
  }
};

const getBodyStylesForRenderingIntoAnchor = (
  params: Params
): { [key: string]: string } => {
  const { anchor, pointerWidth, pointerHeight, pointerOffset } = params;
  const anchorBoundingRect = anchor.getBoundingClientRect();
  const anchorWidth = anchorBoundingRect.width;
  const halfAnchorWidth = anchorWidth / 2;
  const anchorHeight = anchorBoundingRect.height;
  const halfPointerWidth = Math.floor(pointerWidth / 2);

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        left: '50%',
        bottom: `${anchorHeight + pointerHeight}px`
      };
    case Position.TOP_RIGHT:
      return {
        left: `calc(50% - ${pointerOffset + halfPointerWidth}px)`,
        bottom: `${anchorHeight + pointerHeight}px`
      };
    case Position.BOTTOM_LEFT:
      return {
        top: `${anchorHeight + pointerHeight}px`,
        left: '50%'
      };
    case Position.BOTTOM_RIGHT:
      return {
        left: `${halfAnchorWidth - pointerOffset - halfPointerWidth}px`,
        top: `${anchorHeight + pointerHeight}px`
      };
    case Position.LEFT_TOP:
      return {
        left: `-${pointerHeight}px`,
        top: `50%`
      };
    case Position.LEFT_BOTTOM:
      return {
        left: `-${pointerHeight}px`,
        top: `50%`
      };
    case Position.RIGHT_TOP:
      return {
        left: `calc(100% + ${pointerHeight}px)`,
        top: `calc(50% + ${pointerOffset}px)`
      };
    case Position.RIGHT_BOTTOM:
      return {
        left: `calc(100% + ${pointerHeight}px)`,
        top: '50%'
      };
  }
};
