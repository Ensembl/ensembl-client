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

import bringToFront from 'src/shared/utils/bringToFront';

import { Position } from './pointer-box-types';

const topRow = [Position.TOP_LEFT, Position.TOP_RIGHT];

const bottomRow = [Position.BOTTOM_LEFT, Position.BOTTOM_RIGHT];

const leftSide = [Position.LEFT_TOP, Position.LEFT_BOTTOM];

const rightSide = [Position.RIGHT_TOP, Position.RIGHT_BOTTOM];

type SimpleDOMRect = Omit<DOMRect, 'toJSON'>;

type FindOptimalPositionParams = {
  pointerBoxBoundingRect: SimpleDOMRect;
  rootBoundingRect: SimpleDOMRect;
  anchorBoundingRect: SimpleDOMRect;
  position: Position;
  pointerWidth: number;
  pointerHeight: number;
  pointerOffset: number;
};

export const findOptimalPosition = (params: FindOptimalPositionParams) => {
  const possiblePositions = getPossiblePositions(params);

  return possiblePositions.reduce(
    (result, position) => {
      const outOfBoundsArea = getTooltipOutOfBoundsArea({
        ...params,
        position
      });
      if (outOfBoundsArea < result.outOfBoundsArea) {
        return {
          position,
          outOfBoundsArea
        };
      } else {
        return result;
      }
    },
    { position: params.position, outOfBoundsArea: Infinity }
  ).position;
};

const getPossiblePositions = (params: FindOptimalPositionParams) => {
  const { position } = params;
  if (topRow.includes(position)) {
    return [...bringToFront(topRow, position), ...bottomRow];
  } else if (bottomRow.includes(position)) {
    return [...bringToFront(bottomRow, position), ...topRow];
  } else if (leftSide.includes(position)) {
    return [...bringToFront(leftSide, position), ...rightSide];
  } else if (rightSide.includes(position)) {
    return [...bringToFront(rightSide, position), ...leftSide];
  } else {
    return [];
  }
};

const getTooltipOutOfBoundsArea = (
  params: FindOptimalPositionParams
): number => {
  const {
    pointerBoxBoundingRect,
    rootBoundingRect,
    anchorBoundingRect,
    position,
    pointerWidth,
    pointerHeight,
    pointerOffset
  } = params;
  const halfPointerWidth = Math.floor(pointerWidth / 2);

  const { width, height } = pointerBoxBoundingRect;

  const {
    left: anchorLeft,
    right: anchorRight,
    width: anchorWidth,
    top: anchorTop,
    bottom: anchorBottom,
    height: anchorHeight
  } = anchorBoundingRect;
  const anchorCentreX = anchorLeft + anchorWidth / 2;
  const anchorCentreY = anchorTop + anchorHeight / 2;

  let predictedLeft = 0,
    predictedRight = 0,
    predictedTop = 0,
    predictedBottom = 0;

  if (position === Position.TOP_LEFT) {
    predictedLeft = anchorCentreX - width + halfPointerWidth + pointerOffset;
    predictedRight = predictedLeft + width;
    predictedTop = anchorTop - pointerHeight - height;
    predictedBottom = anchorTop;
  } else if (position === Position.TOP_RIGHT) {
    predictedLeft = anchorCentreX - halfPointerWidth - pointerOffset;
    predictedRight = predictedLeft + width;
    predictedTop = anchorTop - pointerHeight - height;
    predictedBottom = anchorTop;
  } else if (position === Position.BOTTOM_LEFT) {
    predictedLeft = anchorCentreX - width + halfPointerWidth + pointerOffset;
    predictedRight = predictedLeft + width;
    predictedTop = anchorBottom;
    predictedBottom = anchorBottom + pointerHeight + height;
  } else if (position === Position.BOTTOM_RIGHT) {
    predictedLeft = anchorCentreX - halfPointerWidth - pointerOffset;
    predictedRight = predictedLeft + width;
    predictedTop = anchorBottom;
    predictedBottom = anchorBottom + pointerHeight + height;
  } else if (position === Position.LEFT_TOP) {
    predictedLeft = anchorLeft - pointerHeight - width;
    predictedRight = anchorLeft;
    predictedTop = anchorCentreY - halfPointerWidth - pointerOffset;
    predictedBottom = predictedTop + height;
  } else if (position === Position.LEFT_BOTTOM) {
    predictedLeft = anchorLeft - pointerHeight - width;
    predictedRight = anchorLeft;
    predictedTop = anchorCentreY - height + halfPointerWidth + pointerOffset;
    predictedBottom = predictedTop + height;
  } else if (position === Position.RIGHT_TOP) {
    predictedLeft = anchorRight;
    predictedRight = anchorRight + pointerHeight + width;
    predictedTop = anchorCentreY - halfPointerWidth - pointerOffset;
    predictedBottom = predictedTop + height;
  } else if (position === Position.RIGHT_BOTTOM) {
    predictedLeft = anchorRight;
    predictedRight = anchorRight + pointerHeight + width;
    predictedTop = anchorCentreY - height + halfPointerWidth + pointerOffset;
    predictedBottom = predictedTop + height;
  }

  const predictedTooltipRect = {
    left: predictedLeft,
    right: predictedRight,
    top: predictedTop,
    bottom: predictedBottom,
    width,
    height
  };

  return calculateOverflowArea({
    tooltip: predictedTooltipRect,
    root: rootBoundingRect
  });
};

const calculateOverflowArea = (params: {
  tooltip: Omit<SimpleDOMRect, 'x' | 'y'>;
  root: SimpleDOMRect;
}) => {
  const {
    tooltip: {
      left: tooltipLeft,
      right: tooltipRight,
      top: tooltipTop,
      bottom: tooltipBottom,
      width: tooltipWidth,
      height: tooltipHeight
    },
    root: { left: rootLeft, right: rootRight, top: rootTop, bottom: rootBottom }
  } = params;

  let deltaX = 0,
    deltaY = 0;

  if (tooltipLeft < rootLeft) {
    deltaX = rootLeft - tooltipLeft;
  } else if (tooltipRight > rootRight) {
    deltaX = tooltipRight - rootRight;
  }

  if (tooltipTop < rootTop) {
    deltaY = rootTop - tooltipTop;
  } else if (tooltipBottom > rootBottom) {
    deltaY = tooltipBottom - rootBottom;
  }

  if (deltaX || deltaY) {
    return (
      deltaX * (tooltipHeight - deltaY) +
      deltaY * (tooltipWidth - deltaX) +
      deltaX * deltaY
    );
  } else {
    return 0;
  }
};
