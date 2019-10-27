import * as constants from './chromosomeNavigatorConstants';

type StyleCalculatorParams = {
  containerWidth: number; // width available for the stick, in pixels
  length: number; // length of the molecule represented by the stick, nucleotides
  viewportStart: number;
  viewportEnd: number;
  focusRegion: {
    start: number;
    end: number;
  } | null;
  centromere: {
    start: number;
    end: number;
  } | null;
};

export type CalculatedStyles = {
  viewport: {
    openingBracketShape: string;
    closingBracketShape: string;
    area: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  focusPointers: Array<{
    arrowhead: {
      points: string;
    };
    line: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
    translateX: number;
  }> | null;
  centromere: {} | null;
};

type Scale = (input: number) => number;

export const calculateStyles = (
  params: StyleCalculatorParams
): CalculatedStyles => {
  const scale = getScale(params.containerWidth, params.length);

  return {
    viewport: getViewportStyles(params, scale),
    focusPointers: getFocusPointerStyles(params, scale),
    centromere: getCentromereStyles(params, scale)
  };
};

const getScale = (width: number, nucleotidesCount: number): Scale => {
  const scaleFactor = width / nucleotidesCount;
  return (position) => Math.round(scaleFactor * position);
};

const getViewportStyles = (params: StyleCalculatorParams, scale: Scale) => {
  const { containerWidth } = params;
  const { VIEWPORT_BRACKET_HEIGHT, VIEWPORT_BRACKET_BAR_WIDTH } = constants;
  const fullBracketsWidth = 2 * VIEWPORT_BRACKET_BAR_WIDTH; // opening bracket + closing bracket
  let viewportStartX, viewportEndX;
  viewportEndX = scale(params.viewportEnd);
  // let openBracketX, closeBracketX;
  if (viewportEndX < containerWidth - fullBracketsWidth) {
    viewportStartX = scale(params.viewportStart);
    viewportEndX = Math.max(viewportEndX, fullBracketsWidth);
  } else {
    // ALSO, CONSIDER CIRCULAR CHROMOSOMES HERE
    viewportStartX = scale(params.viewportStart); // FIXME
    viewportEndX = Math.max(viewportEndX, fullBracketsWidth); // FIXME
  }

  const openingBracketShape = [
    `${viewportStartX + VIEWPORT_BRACKET_BAR_WIDTH},0`,
    `${viewportStartX},0`,
    `${viewportStartX},${VIEWPORT_BRACKET_HEIGHT}`,
    `${viewportStartX + VIEWPORT_BRACKET_BAR_WIDTH},${VIEWPORT_BRACKET_HEIGHT}`
  ].join(' ');
  const closingBracketShape = [
    `${viewportEndX - VIEWPORT_BRACKET_BAR_WIDTH},0`,
    `${viewportEndX},0`,
    `${viewportEndX},${VIEWPORT_BRACKET_HEIGHT}`,
    `${viewportEndX - VIEWPORT_BRACKET_BAR_WIDTH},${VIEWPORT_BRACKET_HEIGHT}`
  ].join(' ');

  const viewportWidth = viewportEndX - viewportStartX;
  console.log('viewportEndX', viewportEndX, 'viewportStartX', viewportStartX);

  return {
    openingBracketShape,
    closingBracketShape,
    area: {
      // FIXME: circular chromosomes
      x: viewportStartX,
      y: constants.STICK_MARGIN_TOP,
      width: viewportWidth,
      height: constants.STICK_HEIGHT
    }
  };
};

const getFocusPointerStyles = (params: StyleCalculatorParams, scale: Scale) => {
  if (!params.focusRegion) {
    return null;
  }

  const {
    focusRegion: { start, end }
  } = params;
  const focusRegionStart = scale(start);
  const focusRegionEnd = scale(end);
  const shouldUseSinglePointer =
    focusRegionEnd - focusRegionStart < 2 * constants.POINTER_ARROWHEAD_WIDTH;

  if (shouldUseSinglePointer) {
    const translateX =
      focusRegionStart +
      (focusRegionEnd - focusRegionStart) / 2 -
      constants.POINTER_ARROWHEAD_WIDTH / 2;
    return [
      {
        ...getArrowheadDefaultStyles(),
        translateX
      }
    ];
  } else {
    return [
      {
        ...getArrowheadDefaultStyles(),
        translateX: focusRegionStart - constants.POINTER_ARROWHEAD_WIDTH / 2
      },
      {
        ...getArrowheadDefaultStyles(),
        translateX: focusRegionEnd - constants.POINTER_ARROWHEAD_WIDTH / 2
      }
    ];
  }
};

const getArrowheadDefaultStyles = () => {
  const arrowheadPoints = [
    `0,${constants.POINTER_ARROWHEAD_HEIGHT * 2}`,
    `${constants.POINTER_ARROWHEAD_WIDTH / 2},${
      constants.POINTER_ARROWHEAD_HEIGHT
    }`,
    `${constants.POINTER_ARROWHEAD_WIDTH},${constants.POINTER_ARROWHEAD_HEIGHT *
      2}`
  ].join(' ');
  const lineStyles = {
    x1: constants.POINTER_ARROWHEAD_WIDTH / 2,
    y1: constants.POINTER_ARROWHEAD_HEIGHT + 1,
    x2: constants.POINTER_ARROWHEAD_WIDTH / 2,
    y2: constants.STICK_MARGIN_TOP
  };

  return {
    arrowhead: {
      points: arrowheadPoints
    },
    line: lineStyles
  };
};

const getCentromereStyles = (params: StyleCalculatorParams, scale: Scale) => {
  if (!params.centromere) {
    return null;
  } else {
    return {};
  }
};
