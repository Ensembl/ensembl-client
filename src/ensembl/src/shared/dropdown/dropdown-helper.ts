import { Position } from './dropdown-types';

const topRow = [Position.TOP_LEFT, Position.TOP_CENTRE, Position.TOP_RIGHT];

const bottomRow = [
  Position.BOTTOM_LEFT,
  Position.BOTTOM_CENTRE,
  Position.BOTTOM_RIGHT
];

const leftSide = [
  Position.LEFT_TOP,
  Position.LEFT_CENTRE,
  Position.LEFT_BOTTOM
];

const rightSide = [
  Position.RIGHT_TOP,
  Position.RIGHT_CENTRE,
  Position.RIGHT_BOTTOM
];

type FindOptimalPositionParams = {
  intersectionEntry: IntersectionObserverEntry;
  anchorBoundingRect: ClientRect;
  position: Position;
};

export const findOptimalPosition = (params: FindOptimalPositionParams) => {
  const {
    intersectionEntry: { boundingClientRect, rootBounds, isIntersecting },
    anchorBoundingRect
  } = params;
  let { position } = params;
  console.log(
    'boundingClientRect',
    boundingClientRect,
    'rootBounds',
    rootBounds
  );
  console.log('anchorBoundingRect', anchorBoundingRect);
  console.log('position', position);

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
    // position = ''
  }
};
