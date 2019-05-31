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
    intersectionEntry: { boundingClientRect, rootBounds, isIntersecting }
  } = params;
  let { position } = params;

  if (isIntersecting) {
    return position;
  }
  const shouldShiftHorizontally =
    boundingClientRect.left < rootBounds.left ||
    boundingClientRect.right > rootBounds.right;
  const shouldShiftVertically =
    boundingClientRect.top < rootBounds.top ||
    boundingClientRect.bottom > rootBounds.bottom;

  if (shouldShiftHorizontally) {
    const direction =
      boundingClientRect.left < rootBounds.left
        ? Direction.RIGHT
        : Direction.LEFT;
    if ([...topRow, ...bottomRow].includes(position)) {
      position = shiftHorizontallyAlongRow({ ...params, direction });
    } else if ([...leftSide, ...rightSide].includes(position)) {
      position = flipLeftRight({ ...params, direction });
    }
  }

  if (shouldShiftVertically) {
    const direction =
      boundingClientRect.top < rootBounds.left ? Direction.DOWN : Direction.UP;

    if ([...leftSide, ...rightSide].includes(position)) {
      position = shiftVerticallyAlongSide({ ...params, direction });
    } else if ([...topRow, ...bottomRow].includes(position)) {
      position = flipTopBottom({ ...params, direction });
    }
  }

  return position;
};

const shiftHorizontallyAlongRow = (
  params: FindOptimalPositionParams & { direction: HorizontalDirection }
) => {
  const row = [topRow, bottomRow].find((row) => row.includes(params.position));
  if (!row) {
    // shouldn't happen
    return params.position;
  }

  const currentPositionIndex = row.indexOf(params.position);
  const availablePositions =
    params.direction === Direction.RIGHT
      ? row.slice(currentPositionIndex + 1)
      : row.slice(0, currentPositionIndex);

  for (let position of availablePositions) {
    if (
      willStayWithinBounds({
        ...params,
        position,
        fittingDimension: FittingDimension.WIDTH
      })
    ) {
      return position;
    }
  }

  return params.position;
};

const shiftVerticallyAlongSide = (
  params: FindOptimalPositionParams & { direction: VerticalDirection }
) => {
  const side = [leftSide, rightSide].find((side) =>
    side.includes(params.position)
  );
  if (!side) {
    // shouldn't happen
    return params.position;
  }
  const currentPositionIndex = side.indexOf(params.position);
  const availablePositions =
    params.direction === Direction.DOWN
      ? side.slice(currentPositionIndex + 1)
      : side.slice(0, currentPositionIndex);

  for (let position of availablePositions) {
    if (
      willStayWithinBounds({
        ...params,
        fittingDimension: FittingDimension.HEIGHT
      })
    ) {
      return position;
    }
  }

  return params.position;
};

const flipLeftRight = (
  params: FindOptimalPositionParams & { direction: HorizontalDirection }
) => {
  const [from, to] =
    params.direction === Direction.RIGHT
      ? [leftSide, rightSide]
      : [rightSide, leftSide];
  const index = from.indexOf(params.position);
  if (index > -1) {
    return to[index];
  } else {
    // shouldn't happen
    return params.position;
  }
};

const flipTopBottom = (
  params: FindOptimalPositionParams & { direction: VerticalDirection }
) => {
  const [to, from] =
    params.direction === Direction.DOWN
      ? [topRow, bottomRow]
      : [bottomRow, topRow];
  const index = from.indexOf(params.position);
  if (index > -1) {
    return to[index];
  } else {
    // shouldn't happen
    return params.position;
  }
};

const willStayWithinBounds = (
  params: FindOptimalPositionParams & { fittingDimension: FittingDimension }
) => {
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

  if (params.fittingDimension === FittingDimension.WIDTH) {
    return (
      predictedLeft &&
      predictedLeft > rootBounds.left &&
      (predictedRight && predictedRight < rootBounds.right)
    );
  } else {
    return (
      predictedTop &&
      predictedTop > rootBounds.top &&
      (predictedBottom && predictedBottom < rootBounds.bottom)
    );
  }
};
