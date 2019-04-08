import faker from 'faker';
import random from 'lodash/random';
import times from 'lodash/times';

import { Option, OptionGroup } from '../Select';

import {
  findSelectedIndexForOptions,
  findSelectedIndexForOptionGroups
} from './select-helpers';

const buildOption = (): Option => ({
  value: faker.random.number(),
  label: faker.lorem.words(),
  isSelected: false
});

const buildOptionGroup = (options: Option[]): OptionGroup => ({
  options
});

describe('findSelectedIndexForOptions', () => {
  let numberOfOptions;
  let options: Option[];
  let selectedOptionIndex: number;

  beforeEach(() => {
    numberOfOptions = 10;
    options = times(numberOfOptions, () => buildOption());
    selectedOptionIndex = random(numberOfOptions);
  });

  test('finds index of selected option in an array of options', () => {
    options[selectedOptionIndex].isSelected = true;

    expect(findSelectedIndexForOptions(options)).toBe(selectedOptionIndex);
  });

  test('returns -1 if none of the options in the array is selected', () => {
    expect(findSelectedIndexForOptions(options)).toBe(-1);
  });
});

describe('findSelectedIndexForOptionGroups', () => {
  let numberOfOptionGroups: number;
  let numberOfOptionsPerGroup: number;
  let optionGroups: OptionGroup[];
  let selectedOptionIndex: [number, number];

  beforeEach(() => {
    numberOfOptionGroups = 5;
    numberOfOptionsPerGroup = 10;

    optionGroups = times(numberOfOptionGroups, () => {
      const options = times(numberOfOptionsPerGroup, () => buildOption());
      return buildOptionGroup(options);
    });

    selectedOptionIndex = [
      random(numberOfOptionGroups),
      random(numberOfOptionsPerGroup)
    ];
  });

  test('finds index of selected option in an array of option groups', () => {
    const [groupIndex, optionIndex] = selectedOptionIndex;
    optionGroups[groupIndex].options[optionIndex].isSelected = true;

    expect(findSelectedIndexForOptionGroups(optionGroups)).toEqual(
      selectedOptionIndex
    );
  });

  test('returns -1 if none of the options is selected', () => {
    expect(findSelectedIndexForOptionGroups(optionGroups)).toEqual(-1);
  });
});
