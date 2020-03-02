import bringToFront from 'src/shared/utils/bringToFront';

import {
  POINTER_WIDTH,
  POINTER_HEIGHT,
  POINTER_OFFSET
} from './pointer-box-constants';

import { Position } from './pointer-box-types';

const topRow = [Position.TOP_LEFT, Position.TOP_RIGHT];

const bottomRow = [Position.BOTTOM_LEFT, Position.BOTTOM_RIGHT];

const leftSide = [Position.LEFT_TOP, Position.LEFT_BOTTOM];

const rightSide = [Position.RIGHT_TOP, Position.RIGHT_BOTTOM];

type FindOptimalPositionParams = {
  pointerBoxBoundingRect: ClientRect;
  rootBoundingRect: ClientRect;
  anchorBoundingRect: ClientRect;
  position: Position;
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
    tooltipBoundingRect,
    rootBoundingRect,
    anchorBoundingRect,
    position
  } = params;

  const { width, height } = tooltipBoundingRect;

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
    predictedLeft =
      anchorCentreX - width + TIP_WIDTH / 2 + TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorTop - TIP_HEIGHT - height;
    predictedBottom = anchorTop;
  } else if (position === Position.TOP_RIGHT) {
    predictedLeft = anchorCentreX - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorTop - TIP_HEIGHT - height;
    predictedBottom = anchorTop;
  } else if (position === Position.BOTTOM_LEFT) {
    predictedLeft =
      anchorCentreX - width + TIP_WIDTH / 2 + TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorBottom;
    predictedBottom = anchorBottom + TIP_HEIGHT + height;
  } else if (position === Position.BOTTOM_RIGHT) {
    predictedLeft = anchorCentreX - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorBottom;
    predictedBottom = anchorBottom + TIP_HEIGHT + height;
  } else if (position === Position.LEFT_TOP) {
    predictedLeft = anchorLeft - TIP_HEIGHT - width;
    predictedRight = anchorLeft;
    predictedTop = anchorCentreY - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedBottom = predictedTop + height;
  } else if (position === Position.LEFT_BOTTOM) {
    predictedLeft = anchorLeft - TIP_HEIGHT - width;
    predictedRight = anchorLeft;
    predictedTop =
      anchorCentreY - height + TIP_WIDTH / 2 + TIP_HORIZONTAL_OFFSET;
    predictedBottom = predictedTop + height;
  } else if (position === Position.RIGHT_TOP) {
    predictedLeft = anchorRight;
    predictedRight = anchorRight + TIP_HEIGHT + width;
    predictedTop = anchorCentreY - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedBottom = predictedTop + height;
  } else if (position === Position.RIGHT_BOTTOM) {
    predictedLeft = anchorRight;
    predictedRight = anchorRight + TIP_HEIGHT + width;
    predictedTop =
      anchorCentreY - height + TIP_WIDTH / 2 + TIP_HORIZONTAL_OFFSET;
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
  tooltip: ClientRect;
  root: ClientRect;
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
