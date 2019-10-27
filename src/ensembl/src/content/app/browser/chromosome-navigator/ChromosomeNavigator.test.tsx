import React from 'react';
// import faker from 'faker';
import { mount } from 'enzyme';
import random from 'lodash/random';

import { ChromosomeNavigator } from './ChromosomeNavigator';

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
    describe('linear chromosome', () => {
      it('correctly positions viewport in the middle of chromosome', () => {
        const wrapper = mount(<ChromosomeNavigator {...minimalProps} />);
        const openingBracket = wrapper.find('.viewportBorder').at(0);
        const closingBracket = wrapper.find('.viewportBorder').at(1);
        const viewportArea = wrapper.find('.viewport').at(0);
        const openingBracketX = openingBracket
          .props()
          .points.split(' ')[1]
          .split(',')[0];
        const closingBracketX = closingBracket
          .props()
          .points.split(' ')[1]
          .split(',')[0];

        const expectedStartX =
          (minimalProps.containerWidth / minimalProps.length) *
          minimalProps.viewportStart;
        const expectedEndX =
          (minimalProps.containerWidth / minimalProps.length) *
          minimalProps.viewportEnd;

        expect(viewportArea.props().x).toBe(expectedStartX);
        expect(viewportArea.props().width).toBe(expectedEndX - expectedStartX);
        expect(openingBracketX).toBe(`${expectedStartX}`);
        expect(closingBracketX).toBe(`${expectedEndX}`);
      });

      it.skip('correctly positions viewport in the end of chromosome', () => {});

      it.skip('correctly positions small viewport', () => {});
    });
  });

  describe('pointer position', () => {});

  describe('centromere position', () => {});

  describe('labels', () => {});

  // // using hard-coded values to simplify calculations
  // let defaultProps = {
  //   containerWidth: 1000, // let's assume we have 1000-pixels-wide container
  //   length: 1000000, // and a chromosome 1 million nucleotides long
  //   viewPortStart: 200
  // }
});
