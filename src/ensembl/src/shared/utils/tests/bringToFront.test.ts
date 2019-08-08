import range from 'lodash/range';
import random from 'lodash/random';
import last from 'lodash/last';

import bringToFront from '../bringToFront';

describe('bringToFront', () => {
  it('ensures a given member of an array is in its head', () => {
    const minNumberOfMembers = 2;
    const maxNumberOfMembers = 10000;
    const numberOfMembers = random(minNumberOfMembers, maxNumberOfMembers);
    const elements = range(numberOfMembers);
    const chosenElementIndex = random(numberOfMembers - 1);
    const chosenElement = elements[chosenElementIndex];

    const withChosenFirst = bringToFront(elements, chosenElement);

    expect(withChosenFirst.length).toBe(elements.length);
    expect(withChosenFirst[0]).toBe(chosenElement);
  });

  describe('edge cases', () => {
    it('returns empty array if passed an empty array', () => {
      const element = 'foo';
      expect(bringToFront([], element).length).toBe(0);
    });

    it('returns unchanged array if it contains a single element', () => {
      const element = random(100);
      const elements = [element];
      expect(bringToFront(elements, element)).toEqual(elements);
    });

    it('returns unchanged array if it does not contain promoted element', () => {
      const elements = range(10);
      const missingElement = (last(elements) as number) + 1;
      expect(bringToFront(elements, missingElement)).toEqual(elements);
    });

    it('can handle elements as objects', () => {
      const buildElement = (number: number) => ({ number });
      const elements = range(10).map(buildElement);
      const lastElement = last(elements);

      const newElements = bringToFront(elements, lastElement);

      expect(newElements.length).toBe(elements.length);
      expect(newElements[0]).toEqual(lastElement);
    });
  });
});
