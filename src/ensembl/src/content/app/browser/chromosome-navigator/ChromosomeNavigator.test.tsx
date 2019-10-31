import React from 'react';
import { mount } from 'enzyme';
import random from 'lodash/random';

import * as textHelpers from 'src/shared/helpers/textHelpers';

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
        const scalingFactor = minimalProps.containerWidth / minimalProps.length;
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
    });

    describe('in the end of the chromosome', () => {
      it('does not allow overlapping of brackets for small viewports', () => {
        const scalingFactor = minimalProps.containerWidth / minimalProps.length;
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
    const assertPointerPositions = (pointers: any, positions: number[]) => {
      expect(pointers.length).toBe(positions.length);
      positions.forEach((position: number, index: number) => {
        const transform = pointers
          .at(index)
          .props()
          .transform.match(/translate\((\d+)\)/)[1];
        expect(parseInt(transform, 10)).toBe(position);
      });
    };
  });

  describe('centromere position', () => {});

  describe('labels', () => {});

  // // using hard-coded values to simplify calculations
  // let defaultProps = {
  //   containerWidth: 1000, // let's assume we have 1000-pixels-wide container
  //   length: 1000000, // and a chromosome 1 million nucleotides long
  //   viewPortStart: 200
  // }
});
