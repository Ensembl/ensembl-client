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

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';
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
    areas: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
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
  if (viewportEndX < containerWidth - fullBracketsWidth) {
    // we have not reached the end of the chromosome, and can calculate positions of the brackets left-to-right
    viewportStartX = scale(params.viewportStart);
    viewportEndX =
      viewportEndX >= viewportStartX
        ? Math.max(viewportEndX, viewportStartX + fullBracketsWidth)
        : viewportEndX;
  } else {
    // we are at the right end of the chromosome, and should calculate positions of the brackets right-to-left
    viewportStartX =
      params.viewportStart <= params.viewportEnd
        ? Math.min(
            scale(params.viewportStart),
            viewportEndX - fullBracketsWidth
          )
        : scale(params.viewportStart);
  }

  const openingBracketShape = [
    `${viewportStartX + VIEWPORT_BRACKET_BAR_WIDTH},${bracketY}`,
    `${viewportStartX},${bracketY}`,
    `${viewportStartX},${bracketY + VIEWPORT_BRACKET_HEIGHT}`,
    `${viewportStartX + VIEWPORT_BRACKET_BAR_WIDTH},${
      bracketY + VIEWPORT_BRACKET_HEIGHT
    }`
  ].join(' ');
  const closingBracketShape = [
    `${viewportEndX - VIEWPORT_BRACKET_BAR_WIDTH},${bracketY}`,
    `${viewportEndX},${bracketY}`,
    `${viewportEndX},${bracketY + VIEWPORT_BRACKET_HEIGHT}`,
    `${viewportEndX - VIEWPORT_BRACKET_BAR_WIDTH},${
      bracketY + VIEWPORT_BRACKET_HEIGHT
    }`
  ].join(' ');

  const areas = (
    viewportStartX < viewportEndX
      ? [
          {
            x: viewportStartX,
            width: viewportEndX - viewportStartX
          }
        ]
      : [
          {
            x: 0,
            width: viewportEndX
          },
          {
            x: viewportStartX,
            width: containerWidth - viewportStartX
          }
        ]
  ).map((styles) => ({
    ...styles,
    y: constants.STICK_MARGIN_TOP,
    height: constants.STICK_HEIGHT
  }));

  return {
    openingBracketShape,
    closingBracketShape,
    areas
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
    Math.abs(focusRegionEnd - focusRegionStart) <=
    constants.POINTER_ARROWHEAD_WIDTH;

  if (shouldUseSinglePointer) {
    const translateX =
      focusRegionStart +
      Math.round((focusRegionEnd - focusRegionStart) / 2) -
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
  }

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
    const labelText =
      formattedStart === formattedEnd
        ? formattedStart
        : `${formattedStart}-${formattedEnd}`;
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
      isOverlapping(
        provisionalLabel1X,
        label1Width,
        provisionalLabel2X,
        label2Width
      )
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

const isOverlapping = (
  label1X: number,
  label1Width: number,
  label2X: number,
  label2Width: number
) => {
  return label1X < label2X
    ? label1X + label1Width + constants.MIN_DISTANCE_BETWEEN_LABELS > label2X
    : label2X + label2Width + constants.MIN_DISTANCE_BETWEEN_LABELS > label1X;
};
