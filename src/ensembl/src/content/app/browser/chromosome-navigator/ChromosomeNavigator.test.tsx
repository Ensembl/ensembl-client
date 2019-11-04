import React from 'react';
import { mount } from 'enzyme';
import random from 'lodash/random';

import * as textHelpers from 'src/shared/helpers/textHelpers';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import * as constants from './chromosomeNavigatorConstants';

import {
  ChromosomeNavigator,
  ChromosomeNavigatorProps
} from './ChromosomeNavigator';

// using hard-coded values to simplify calculations
const minimalProps = {
  containerWidth: 1000, // let's assume we have 1000-pixels-wide container
  length: 1000000, // and a chromosome 1 million nucleotides long
  viewportStart: 2000,
  viewportEnd: 20000,
  focusRegion: null,
  centromere: null
};

const scalingFactor = minimalProps.containerWidth / minimalProps.length;

const isApproximatelyEqual = (num1: number, num2: number) => {
  // account for rounding errors, which might make a difference of +/- 1
  return Math.abs(num1 - num2) <= 1;
};

describe('Chromosome Navigator', () => {
  beforeEach(() => {
    const mockMeasure: any = () => ({ width: 40 });
    jest.spyOn(textHelpers, 'measureText').mockImplementation(mockMeasure);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('renders without focusRegion or centromere', () => {
      const wrapper = mount(<ChromosomeNavigator {...minimalProps} />);
      expect(wrapper.find('svg').length).toBe(1);
      expect(wrapper.find('.viewport').length).toBe(1);
      expect(wrapper.find('.viewportBorder').length).toBe(2);
      expect(wrapper.find('.focusPointer').length).toBe(0); // no focus pointer
      expect(wrapper.find('.centromere').length).toBe(0); // no centromere region
    });

    it('renders focus pointer', () => {
      const focusStart = random(minimalProps.length / 2);
      const focusEnd = random(focusStart, minimalProps.length - 1);
      const wrapper = mount(
        <ChromosomeNavigator
          {...minimalProps}
          focusRegion={{ start: focusStart, end: focusEnd }}
        />
      );
      expect(wrapper.find('svg').length).toBe(1);
      expect(wrapper.find('.viewport').length).toBe(1);
      expect(wrapper.find('.viewportBorder').length).toBe(2);
      expect(wrapper.find('.focusPointer').length).toBeGreaterThanOrEqual(1);
    });

    it('renders centromere region', () => {
      const centromereStart = random(minimalProps.length / 2);
      const centromereEnd = centromereStart + random(10000);
      const wrapper = mount(
        <ChromosomeNavigator
          {...minimalProps}
          centromere={{ start: centromereStart, end: centromereEnd }}
        />
      );
      expect(wrapper.find('svg').length).toBe(1);
      expect(wrapper.find('.viewport').length).toBe(1);
      expect(wrapper.find('.centromere').length).toBe(1);
    });
  });

  describe('viewport position', () => {
    const getRenderedViewport = (props: ChromosomeNavigatorProps) => {
      const wrapper = mount(<ChromosomeNavigator {...props} />);
      const openingBracket = wrapper.find('.viewportBorder').at(0);
      const closingBracket = wrapper.find('.viewportBorder').at(1);
      const viewportAreas = wrapper.find('.viewport');
      return {
        wrapper,
        openingBracket,
        closingBracket,
        viewportAreas
      };
    };

    const assertBracketX = (bracket: any, position: number) => {
      /*
        A bracket is shaped like so: [ or like so: ]
        To check the x-coordinate of the bracket, we want to check
        the x-coordinate of the vertical bar of [
        which is the second tuple of coordinates in the points prop
      */
      const bracketX = bracket
        .props()
        .points.split(' ')[1]
        .split(',')[0];
      expect(parseInt(bracketX, 10)).toBe(position);
    };

    const assertViewportAreas = (areas: any, assertions: any) => {
      expect(areas.length).toBe(assertions.length);
      assertions.forEach((assertion: any, index: number) => {
        const { x, width } = assertion;
        if (x !== undefined) {
          expect(areas.at(index).props().x).toBe(x);
        }
        if (width !== undefined) {
          expect(areas.at(index).props().width).toBe(width);
        }
      });
    };

    describe('in the middle of chromosome', () => {
      it('is positioned correctly', () => {
        const {
          openingBracket,
          closingBracket,
          viewportAreas
        } = getRenderedViewport(minimalProps);
        const expectedStartX =
          (minimalProps.containerWidth / minimalProps.length) *
          minimalProps.viewportStart;
        const expectedEndX =
          (minimalProps.containerWidth / minimalProps.length) *
          minimalProps.viewportEnd;

        assertViewportAreas(viewportAreas, [
          { x: expectedStartX, width: expectedEndX - expectedStartX }
        ]);
        assertBracketX(openingBracket, expectedStartX);
        assertBracketX(closingBracket, expectedEndX);
      });

      it('does not allow overlapping of brackets for small viewports', () => {
        const smallDistance = Math.floor(
          (2 * constants.VIEWPORT_BRACKET_BAR_WIDTH) / scalingFactor
        );
        const randomDistance = random(smallDistance);
        const viewportStart = 20000;
        const viewportEnd = viewportStart + randomDistance;

        const props = { ...minimalProps, viewportStart, viewportEnd };
        const { openingBracket, closingBracket } = getRenderedViewport(props);

        // we expect the viewport’s start to be defined by props.viewportStart,
        // and the viewport’s end to be two bracket widths to the right of viewport start
        const expectedStartX = scalingFactor * props.viewportStart;
        const expectedEndX =
          expectedStartX + 2 * constants.VIEWPORT_BRACKET_BAR_WIDTH;
        assertBracketX(openingBracket, expectedStartX);
        assertBracketX(closingBracket, expectedEndX);
      });

      it('draws two viewport areas if start position is greater than end position', () => {
        // this emulates what we may encounter in circular chromosomes,
        // when user pans past the nominal end position of the chromosome,
        // and sees the end of the chromosome on the left side of canvas,
        // continuing into the start of the chromosome on the right side of canvas
        const chromosomeMidpoint = minimalProps.length / 2;
        const props = {
          ...minimalProps,
          viewportStart: random(chromosomeMidpoint, minimalProps.length),
          viewportEnd: random(chromosomeMidpoint)
        };
        const { viewportAreas } = getRenderedViewport(props);
        const expectedViewportAreaStyles = [
          {
            x: 0,
            width: Math.round(props.viewportEnd * scalingFactor)
          },
          {
            x: Math.round(props.viewportStart * scalingFactor),
            width: Math.round(
              (props.length - props.viewportStart) * scalingFactor
            )
          }
        ];
        assertViewportAreas(viewportAreas, expectedViewportAreaStyles);
      });
    });

    describe('in the end of the chromosome', () => {
      it('does not allow overlapping of brackets for small viewports', () => {
        const smallDistance = Math.floor(
          (2 * constants.VIEWPORT_BRACKET_BAR_WIDTH) / scalingFactor
        );
        const randomDistance = random(smallDistance);
        const viewportEnd = minimalProps.length;
        const viewportStart = viewportEnd - randomDistance;

        const props = { ...minimalProps, viewportStart, viewportEnd };
        const { openingBracket, closingBracket } = getRenderedViewport(props);

        // we expect the viewport’s end to be in the end of the chromosome,
        // and the viewport’s start to be two bracket widths to the left of viewport end
        const expectedEndX = scalingFactor * props.length;
        const expectedStartX =
          expectedEndX - 2 * constants.VIEWPORT_BRACKET_BAR_WIDTH;
        assertBracketX(openingBracket, expectedStartX);
        assertBracketX(closingBracket, expectedEndX);
      });
    });
  });

  describe('pointer position', () => {
    const getRenderedPointers = (props: ChromosomeNavigatorProps) => {
      const wrapper = mount(<ChromosomeNavigator {...props} />);
      const pointers = wrapper.find('.focusPointer');
      return {
        wrapper,
        pointers
      };
    };

    const assertPointerPositions = (pointers: any, positions: number[]) => {
      expect(pointers.length).toBe(positions.length);
      positions.forEach((position: number, index: number) => {
        const transform = pointers
          .at(index)
          .props()
          .transform.match(/translate\((\d+)\)/)[1];
        const actualPosition = parseInt(transform, 10);
        expect(isApproximatelyEqual(position, actualPosition)).toBe(true);
      });
    };

    it('displays two pointers when there is enough available space between them', () => {
      const chromosomeMidpoint = minimalProps.length / 2;
      const bufferZone = constants.POINTER_ARROWHEAD_WIDTH / scalingFactor + 1;
      const focusRegionStart = random(chromosomeMidpoint - bufferZone);
      const focusRegionEnd = random(
        chromosomeMidpoint + bufferZone,
        minimalProps.length
      );
      const props = {
        ...minimalProps,
        focusRegion: {
          start: focusRegionStart,
          end: focusRegionEnd
        }
      };
      const { pointers } = getRenderedPointers(props);
      const expectedFirstPointerX = Math.round(
        focusRegionStart * scalingFactor - constants.POINTER_ARROWHEAD_WIDTH / 2
      );
      const expectedSecondPointerX = Math.round(
        focusRegionEnd * scalingFactor - constants.POINTER_ARROWHEAD_WIDTH / 2
      );

      assertPointerPositions(pointers, [
        expectedFirstPointerX,
        expectedSecondPointerX
      ]);
    });

    it('displays a single pointer when there is not enough space for two', () => {
      const chromosomeMidpoint = minimalProps.length / 2;
      const focusArea = Math.round(
        0.9 * (constants.POINTER_ARROWHEAD_WIDTH / scalingFactor)
      );
      const focusRegionStart = chromosomeMidpoint;
      const focusRegionEnd = random(
        chromosomeMidpoint,
        chromosomeMidpoint + focusArea
      );
      const props = {
        ...minimalProps,
        focusRegion: {
          start: focusRegionStart,
          end: focusRegionEnd
        }
      };
      const { pointers } = getRenderedPointers(props);
      const expectedPointerX = Math.round(
        focusRegionStart * scalingFactor +
          (focusRegionEnd * scalingFactor - focusRegionStart * scalingFactor) /
            2 -
          constants.POINTER_ARROWHEAD_WIDTH / 2
      );

      assertPointerPositions(pointers, [expectedPointerX]);
    });
  });

  describe('labels', () => {
    const getRenderedLabels = (props: ChromosomeNavigatorProps) => {
      const wrapper = mount(<ChromosomeNavigator {...props} />);
      const labels = wrapper.find('.label');
      return {
        wrapper,
        labels
      };
    };

    const assertLabels = (labels: any, assertions: any) => {
      expect(labels.length).toBe(assertions.length);
      assertions.forEach((assertion: any, index: number) => {
        const { x, text } = assertion;
        if (x !== undefined) {
          expect(labels.at(index).props().x).toBe(x);
        }
        if (text !== undefined) {
          const actualText = labels.at(index).text();
          expect(actualText).toEqual(text);
        }
      });
    };

    const props = {
      ...minimalProps,
      focusRegion: {
        start: 30000,
        end: 60000
      }
    };

    it('displays two labels when there is enough space for them', () => {
      const mockLabelWidth = 10;
      const mockMeasure: any = () => ({ width: mockLabelWidth });
      jest.spyOn(textHelpers, 'measureText').mockImplementation(mockMeasure);

      const { labels } = getRenderedLabels(props);
      const expectedLabel1X =
        props.focusRegion.start * scalingFactor - mockLabelWidth / 2;
      const expectedLabel1Text = getCommaSeparatedNumber(
        props.focusRegion.start
      );
      const expectedLabel2X =
        props.focusRegion.end * scalingFactor - mockLabelWidth / 2;
      const expectedLabel2Text = getCommaSeparatedNumber(props.focusRegion.end);
      assertLabels(labels, [
        { x: expectedLabel1X, text: expectedLabel1Text },
        { x: expectedLabel2X, text: expectedLabel2Text }
      ]);
    });

    it('displays a single label combining two positions when there is not enough space for two', () => {
      const mockLabelWidth = 40;
      const mockMeasure: any = () => ({ width: mockLabelWidth });
      jest.spyOn(textHelpers, 'measureText').mockImplementation(mockMeasure);
      const { labels } = getRenderedLabels(props);

      const midpointBetweenPointers =
        props.focusRegion.start * scalingFactor +
        (props.focusRegion.end * scalingFactor -
          props.focusRegion.start * scalingFactor) /
          2;
      const expectedLabelX = midpointBetweenPointers - mockLabelWidth / 2;
      const expectedLabelText =
        getCommaSeparatedNumber(props.focusRegion.start) +
        '-' +
        getCommaSeparatedNumber(props.focusRegion.end);
      assertLabels(labels, [{ x: expectedLabelX, text: expectedLabelText }]);
    });

    it('shows a single value when start and end position are the same', () => {
      const mockLabelWidth = 40;
      const mockMeasure: any = () => ({ width: mockLabelWidth });
      jest.spyOn(textHelpers, 'measureText').mockImplementation(mockMeasure);

      const focusPosition = 20000;
      const props = {
        ...minimalProps,
        focusRegion: {
          start: focusPosition,
          end: focusPosition
        }
      };
      const { labels } = getRenderedLabels(props);

      const expectedLabelX = focusPosition * scalingFactor - mockLabelWidth / 2;
      const expectedLabelText = getCommaSeparatedNumber(
        props.focusRegion.start
      );
      assertLabels(labels, [{ x: expectedLabelX, text: expectedLabelText }]);
    });
  });
});
