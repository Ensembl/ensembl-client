import {
  TIP_WIDTH,
  TIP_HEIGHT,
  TIP_HORIZONTAL_OFFSET
} from './tooltip-constants';

import { Position } from './tooltip-types';

const topRow = [Position.TOP_LEFT, Position.TOP_RIGHT];

const bottomRow = [Position.BOTTOM_LEFT, Position.BOTTOM_RIGHT];

const leftSide = [Position.LEFT_TOP, Position.LEFT_BOTTOM];

const rightSide = [Position.RIGHT_TOP, Position.RIGHT_BOTTOM];

type FindOptimalPositionParams = {
  intersectionEntry: IntersectionObserverEntry;
  anchorBoundingRect: ClientRect;
  position: Position;
};

export const findOptimalPosition = (params: FindOptimalPositionParams) => {
  const {
    intersectionEntry: { isIntersecting }
  } = params;
  let { position } = params;

  if (isIntersecting) {
    return position;
  }

  return adjustPosition(params);
};

const adjustPosition = (params: FindOptimalPositionParams) => {
  const possiblePositions = getPossiblePositions(params);
  if (!possiblePositions.length) {
    return params.position;
  }

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
    return [...preferredFirst(topRow, position), ...bottomRow];
  } else if (bottomRow.includes(position)) {
    return [...preferredFirst(bottomRow, position), ...topRow];
  } else if (leftSide.includes(position)) {
    return [...preferredFirst(leftSide, position), ...rightSide];
  } else if (rightSide.includes(position)) {
    return [...preferredFirst(rightSide, position), ...leftSide];
  } else {
    return [];
  }
};

const preferredFirst = (positions: Position[], preferredPosition: Position) => {
  return [...positions].sort((position) =>
    position === preferredPosition ? -1 : 0
  );
};

const getTooltipOutOfBoundsArea = (
  params: FindOptimalPositionParams
): number => {
  const {
    intersectionEntry: { boundingClientRect, rootBounds },
    anchorBoundingRect,
    position
  } = params;

  if (!rootBounds) {
    // shouldn't happen, but makes typescript happy
    return 0;
  }

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

  const { width, height } = boundingClientRect;

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
    root: rootBounds
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
    root: {
      left: rootLeft,
      right: rootRight,
      top: rootTop,
      bottom: rootBottom,
      width: rootWidth,
      height: rootHeight
    }
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
