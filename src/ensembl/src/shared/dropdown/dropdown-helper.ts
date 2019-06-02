import {
  TIP_WIDTH,
  TIP_HEIGHT,
  TIP_HORIZONTAL_OFFSET
} from './dropdown-constants';

import { Position } from './dropdown-types';

const topRow = [Position.TOP_LEFT, Position.TOP_RIGHT];

const bottomRow = [Position.BOTTOM_LEFT, Position.BOTTOM_RIGHT];

const leftSide = [Position.LEFT_TOP, Position.LEFT_BOTTOM];

const rightSide = [Position.RIGHT_TOP, Position.RIGHT_BOTTOM];

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

enum FittingDimension {
  WIDTH,
  HEIGHT
}

type FindOptimalPositionParams = {
  intersectionEntry: IntersectionObserverEntry;
  anchorBoundingRect: ClientRect;
  position: Position;
};

type HorizontalDirection = Direction.LEFT | Direction.RIGHT;
type VerticalDirection = Direction.UP | Direction.DOWN;

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
  for (let position of possiblePositions) {
    if (willStayWithinBounds({ ...params, position })) {
      return position;
    }
  }

  // if no better position was found, return original position
  return params.position;
};

const getPossiblePositions = (params: FindOptimalPositionParams) => {
  const { position } = params;
  if (topRow.includes(position)) {
    return [...topRow, ...bottomRow];
  } else if (bottomRow.includes(position)) {
    return [...bottomRow, ...topRow];
  } else if (leftSide.includes(position)) {
    return [...leftSide, ...rightSide];
  } else if (rightSide.includes(position)) {
    return [...rightSide, ...leftSide];
  } else {
    return [];
  }
};

const willStayWithinBounds = (params: FindOptimalPositionParams) => {
  const {
    intersectionEntry: { boundingClientRect, rootBounds },
    anchorBoundingRect,
    position
  } = params;

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

  let predictedLeft, predictedRight, predictedTop, predictedBottom;
  if (position === Position.TOP_LEFT) {
    predictedLeft =
      anchorCentreX - width + TIP_WIDTH / 2 + TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorTop - TIP_HEIGHT - boundingClientRect.height;
    predictedBottom = anchorTop;
  } else if (position === Position.TOP_CENTRE) {
    predictedLeft = anchorCentreX - width / 2;
    predictedRight = predictedLeft + width;
    predictedTop = anchorTop - TIP_HEIGHT - boundingClientRect.height;
    predictedBottom = anchorTop;
  } else if (position === Position.TOP_RIGHT) {
    predictedLeft = anchorCentreX - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorTop - TIP_HEIGHT - boundingClientRect.height;
    predictedBottom = anchorTop;
  } else if (position === Position.BOTTOM_LEFT) {
    predictedLeft =
      anchorCentreX - width + TIP_WIDTH / 2 + TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorBottom;
    predictedBottom = anchorBottom + TIP_HEIGHT + boundingClientRect.height;
  } else if (position === Position.BOTTOM_CENTRE) {
    predictedLeft = anchorCentreX - width / 2;
    predictedRight = predictedLeft + width;
    predictedTop = anchorBottom;
    predictedBottom = anchorBottom + TIP_HEIGHT + boundingClientRect.height;
  } else if (position === Position.BOTTOM_RIGHT) {
    predictedLeft = anchorCentreX - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedRight = predictedLeft + width;
    predictedTop = anchorBottom;
    predictedBottom = anchorBottom + TIP_HEIGHT + boundingClientRect.height;
  } else if (position === Position.LEFT_TOP) {
    predictedLeft = anchorLeft - TIP_HEIGHT - width;
    predictedRight = anchorLeft;
    predictedTop = anchorCentreY - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedBottom = predictedTop + boundingClientRect.height;
  } else if (position === Position.LEFT_CENTRE) {
    predictedLeft = anchorLeft - TIP_HEIGHT - width;
    predictedRight = anchorLeft;
    predictedTop = anchorCentreY - boundingClientRect.height / 2;
    predictedBottom = predictedTop + boundingClientRect.height;
  } else if (position === Position.LEFT_BOTTOM) {
    predictedLeft = anchorLeft - TIP_HEIGHT - width;
    predictedRight = anchorLeft;
    predictedTop =
      anchorCentreY -
      boundingClientRect.height +
      TIP_WIDTH / 2 +
      TIP_HORIZONTAL_OFFSET;
    predictedBottom = predictedTop + boundingClientRect.height;
  } else if (position === Position.RIGHT_TOP) {
    predictedLeft = anchorRight;
    predictedRight = anchorRight + TIP_HEIGHT + width;
    predictedTop = anchorCentreY - TIP_WIDTH / 2 - TIP_HORIZONTAL_OFFSET;
    predictedBottom = predictedTop + boundingClientRect.height;
  } else if (position === Position.RIGHT_CENTRE) {
    predictedLeft = anchorRight;
    predictedRight = anchorRight + TIP_HEIGHT + width;
    predictedTop = anchorCentreY - boundingClientRect.height / 2;
    predictedBottom = predictedTop + boundingClientRect.height;
  } else if (position === Position.RIGHT_BOTTOM) {
    predictedLeft = anchorRight;
    predictedRight = anchorRight + TIP_HEIGHT + width;
    predictedTop =
      anchorCentreY -
      boundingClientRect.height +
      TIP_WIDTH / 2 +
      TIP_HORIZONTAL_OFFSET;
    predictedBottom = predictedTop + boundingClientRect.height;
  }

  return (
    predictedLeft &&
    predictedLeft > rootBounds.left &&
    (predictedRight && predictedRight < rootBounds.right) &&
    (predictedTop && predictedTop > rootBounds.top) &&
    (predictedBottom && predictedBottom < rootBounds.bottom)
  );
};
