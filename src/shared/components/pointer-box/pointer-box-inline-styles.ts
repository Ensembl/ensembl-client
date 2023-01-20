/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Position } from './pointer-box-types';
import { PointerBoxProps, InlineStylesState } from './PointerBox';

type Params = Required<
  Pick<
    PointerBoxProps,
    'position' | 'pointerWidth' | 'pointerHeight' | 'pointerOffset' | 'anchor'
  >
>;

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
    boxStyles: {
      ...commonStyles.boxStyles,
      ...getBoxStylesForRenderingIntoBody(params)
    }
  };
};

export const getStylesForRenderingIntoAnchor = (
  params: Params
): InlineStylesState => {
  const commonStyles = getCommonStyles(params);

  return {
    ...commonStyles,
    boxStyles: {
      ...commonStyles.boxStyles,
      ...getBoxStylesForRenderingIntoAnchor(params)
    }
  };
};

const getCommonStyles = (params: Params): InlineStylesState => {
  const { pointerWidth, pointerHeight, pointerOffset } = params;
  const halfPointerWidth = Math.floor(pointerWidth / 2);

  switch (params.position) {
    case Position.TOP_LEFT:
      return {
        boxStyles: {
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
        boxStyles: {},
        pointerStyles: {
          bottom: `${-pointerHeight + 1}px`,
          left: `${pointerOffset}px`,
          transform: `rotate(180deg)`
        }
      };
    case Position.BOTTOM_LEFT:
      return {
        boxStyles: {
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
        boxStyles: {},
        pointerStyles: {
          top: `${-pointerHeight + 1}px`,
          left: `${pointerOffset}px`
        }
      };
    case Position.LEFT_TOP:
      return {
        boxStyles: {
          transform: `translateX(-100%) translateY(calc(-100% + ${
            pointerOffset + halfPointerWidth
          }px))`
        },
        pointerStyles: {
          left: 'calc(100% - 4px)',
          bottom: `${pointerOffset + pointerWidth}px`,
          transform: 'rotate(90deg)',
          transformOrigin: 'left bottom'
        }
      };
    case Position.LEFT_BOTTOM:
      return {
        boxStyles: {
          transform: `translateX(-100%) translateY(-${
            pointerOffset + halfPointerWidth
          }px)`
        },
        pointerStyles: {
          left: 'calc(100% - 4px)',
          top: `${pointerOffset - pointerWidth}px`,
          transform: `rotate(90deg)`,
          transformOrigin: 'left bottom'
        }
      };
    case Position.RIGHT_TOP:
      return {
        boxStyles: {
          transform: `translateY(calc(-100% + ${halfPointerWidth}px))`
        },
        pointerStyles: {
          left: `4px`,
          bottom: `${pointerOffset}px`,
          transform: 'rotate(-90deg)',
          transformOrigin: 'left bottom'
        }
      };
    case Position.RIGHT_BOTTOM:
      return {
        boxStyles: {
          transform: `translateY(-${pointerOffset + halfPointerWidth}px)`
        },
        pointerStyles: {
          left: `4px`,
          top: `${pointerOffset}px`,
          transform: `rotate(-90deg)`,
          transformOrigin: 'left bottom'
        }
      };
  }
};

const getBoxStylesForRenderingIntoBody = (
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
        bottom: `${
          window.innerHeight - window.scrollY - anchorTop + pointerHeight
        }px`
      };
    case Position.TOP_RIGHT:
      return {
        left: `${
          anchorLeft + halfAnchorWidth - pointerOffset - halfPointerWidth
        }px`,
        bottom: `${
          window.innerHeight - window.scrollY - anchorTop + pointerHeight
        }px`
      };
    case Position.BOTTOM_LEFT:
      return {
        top: `${anchorTop + window.scrollY + anchorHeight + pointerHeight}px`,
        left: `${anchorLeft + anchorWidth / 2}px`
      };
    case Position.BOTTOM_RIGHT:
      return {
        left: `${
          anchorLeft + halfAnchorWidth - pointerOffset - halfPointerWidth
        }px`,
        top: `${anchorTop + window.scrollY + anchorHeight + pointerHeight}px`
      };
    case Position.LEFT_TOP:
      return {
        left: `${anchorLeft - pointerHeight}px`,
        top: `${anchorTop + window.scrollY + halfAnchorHeight}px`
      };
    case Position.LEFT_BOTTOM:
      return {
        left: `${anchorLeft - pointerHeight}px`,
        top: `${anchorTop + window.scrollY + halfAnchorHeight}px`
      };
    case Position.RIGHT_TOP:
      return {
        left: `${anchorLeft + anchorWidth + pointerHeight}px`,
        top: `${
          anchorTop + window.scrollY + halfAnchorHeight + pointerOffset
        }px`
      };
    case Position.RIGHT_BOTTOM:
      return {
        left: `${anchorLeft + anchorWidth + pointerHeight}px`,
        top: `${anchorTop + window.scrollY + halfAnchorHeight}px`
      };
  }
};

const getBoxStylesForRenderingIntoAnchor = (
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
