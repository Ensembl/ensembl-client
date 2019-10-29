import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';
import { measureText } from 'src/shared/helpers/textHelpers';

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

type FocusPointerStyles = Array<{
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
  focusPointers: FocusPointerStyles;
  centromere: {
    centre: {
      cx: number;
      cy: number;
      r: number;
    };
    area: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  } | null;
  labels: Array<{
    text: string;
    styles: {
      x: number;
      y: number;
    };
  }> | null;
};

type Scale = (input: number) => number;

export const calculateStyles = (
  params: StyleCalculatorParams
): CalculatedStyles => {
  const scale = getScale(params.containerWidth, params.length);
  const focusPointerStyles = getFocusPointerStyles(params, scale);
  const labelStyles = getLabelStyles(params, focusPointerStyles);

  return {
    viewport: getViewportStyles(params, scale),
    focusPointers: focusPointerStyles,
    centromere: getCentromereStyles(params, scale),
    labels: labelStyles
  };
};

const getScale = (width: number, nucleotidesCount: number): Scale => {
  const scaleFactor = width / nucleotidesCount;
  return (position) => Math.round(scaleFactor * position);
};

const getViewportStyles = (params: StyleCalculatorParams, scale: Scale) => {
  const { containerWidth } = params;
  const {
    STICK_MARGIN_TOP,
    VIEWPORT_BRACKET_HEIGHT,
    VIEWPORT_BRACKET_BAR_WIDTH
  } = constants;
  const bracketY = STICK_MARGIN_TOP - 1;
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
    `${viewportStartX + VIEWPORT_BRACKET_BAR_WIDTH},${bracketY}`,
    `${viewportStartX},${bracketY}`,
    `${viewportStartX},${bracketY + VIEWPORT_BRACKET_HEIGHT}`,
    `${viewportStartX + VIEWPORT_BRACKET_BAR_WIDTH},${bracketY +
      VIEWPORT_BRACKET_HEIGHT}`
  ].join(' ');
  const closingBracketShape = [
    `${viewportEndX - VIEWPORT_BRACKET_BAR_WIDTH},${bracketY}`,
    `${viewportEndX},${bracketY}`,
    `${viewportEndX},${bracketY + VIEWPORT_BRACKET_HEIGHT}`,
    `${viewportEndX - VIEWPORT_BRACKET_BAR_WIDTH},${bracketY +
      VIEWPORT_BRACKET_HEIGHT}`
  ].join(' ');

  const viewportWidth = viewportEndX - viewportStartX;

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
  const {
    STICK_MARGIN_TOP,
    POINTER_ARROWHEAD_HEIGHT,
    POINTER_ARROWHEAD_WIDTH
  } = constants;
  const arrowheadBottomY = STICK_MARGIN_TOP + POINTER_ARROWHEAD_HEIGHT * 2;
  const arrowheadTopY = arrowheadBottomY - POINTER_ARROWHEAD_HEIGHT;
  const arrowheadPoints = [
    `0,${arrowheadBottomY}`,
    `${POINTER_ARROWHEAD_WIDTH / 2},${arrowheadTopY}`,
    `${POINTER_ARROWHEAD_WIDTH},${arrowheadBottomY}`
  ].join(' ');
  const lineStyles = {
    x1: constants.POINTER_ARROWHEAD_WIDTH / 2,
    y1: arrowheadTopY + 1,
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
    const {
      centromere: { start, end }
    } = params;
    const startPosition = scale(start);
    const endPosition = scale(end);
    const centromereCentreX = startPosition + (endPosition - startPosition) / 2;
    const centromereCentreY =
      constants.STICK_HEIGHT / 2 + constants.STICK_MARGIN_TOP;
    return {
      centre: {
        cx: centromereCentreX,
        cy: centromereCentreY,
        r: constants.CENTROMERE_RADIUS
      },
      area: {
        x: centromereCentreX - constants.CENTROMERE_REGION_WIDTH / 2,
        y: constants.STICK_MARGIN_TOP,
        height: constants.STICK_HEIGHT,
        width: constants.CENTROMERE_REGION_WIDTH
      }
    };
  }
};

const getLabelStyles = (
  params: StyleCalculatorParams,
  focusPointerStyles: FocusPointerStyles
) => {
  if (!focusPointerStyles || !params.focusRegion) {
    return null;
  }

  const formattedStart = getCommaSeparatedNumber(params.focusRegion.start);
  const formattedEnd = getCommaSeparatedNumber(params.focusRegion.end);
  const labelFont = '11px "IBM Plex Mono"';

  if (focusPointerStyles.length === 1) {
    // there is only one pointer at the focus region
    const labelText = `${formattedStart}-${formattedEnd}`;
    const { width: labelWidth } = measureText({
      text: labelText,
      font: labelFont
    });
    const halfLabelWidth = Math.round(labelWidth / 2);
    const labelX =
      focusPointerStyles[0].translateX -
      halfLabelWidth +
      constants.POINTER_ARROWHEAD_WIDTH / 2;

    return [
      {
        text: labelText,
        styles: {
          x: labelX,
          y: constants.LABEL_TOP_MARGIN
        }
      }
    ];
  } else {
    // there are two pointers at the focus region
    const { width: label1Width } = measureText({
      text: formattedStart,
      font: labelFont
    });
    const { width: label2Width } = measureText({
      text: formattedEnd,
      font: labelFont
    });
    const provisionalLabel1X =
      focusPointerStyles[0].translateX -
      Math.round(label1Width / 2) +
      constants.POINTER_ARROWHEAD_WIDTH / 2;
    const provisionalLabel2X =
      focusPointerStyles[1].translateX -
      Math.round(label2Width / 2) +
      constants.POINTER_ARROWHEAD_WIDTH / 2;

    if (
      provisionalLabel1X + label1Width + constants.MIN_DISTANCE_BETWEEN_LABELS >
      provisionalLabel2X
    ) {
      // the labels will overlap; combine them in a single label
      const labelText = `${formattedStart}-${formattedEnd}`;
      const { width: labelWidth } = measureText({
        text: labelText,
        font: labelFont
      });
      const halfLabelWidth = Math.round(labelWidth / 2);
      const midpoint =
        focusPointerStyles[0].translateX +
        (focusPointerStyles[1].translateX - focusPointerStyles[0].translateX) /
          2;
      const labelX =
        midpoint - halfLabelWidth + constants.POINTER_ARROWHEAD_WIDTH / 2;

      return [
        {
          text: labelText,
          styles: {
            x: labelX,
            y: constants.LABEL_TOP_MARGIN
          }
        }
      ];
    } else {
      return [
        {
          text: formattedStart,
          styles: {
            x: provisionalLabel1X,
            y: constants.LABEL_TOP_MARGIN
          }
        },
        {
          text: formattedEnd,
          styles: {
            x: provisionalLabel2X,
            y: constants.LABEL_TOP_MARGIN
          }
        }
      ];
    }
  }
};
