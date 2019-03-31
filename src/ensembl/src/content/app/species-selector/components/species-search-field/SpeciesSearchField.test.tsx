import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import flatten from 'lodash/flatten';

import { SpeciesSearchField } from './SpeciesSearchField';
import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';

import AutosuggestSearchField from 'src/shared/autosuggest-search-field/AutosuggestSearchField';

import {
  SearchMatch,
  SearchMatches
} from 'src/content/app/species-selector/types/species-search';

const buildSearchMatch = (): SearchMatch => ({
  description: faker.lorem.words(),
  scientific_name: faker.lorem.words(),
  assembly_name: null,
  matched_substrings: [
    {
      length: 3,
      offset: 1,
      match: 'description'
    }
  ]
});

const buildSearchMatchGroup = (matches = 2): SearchMatches =>
  times(matches, () => buildSearchMatch());

const buildSearchMatchGroups = (groups = 2): SearchMatches[] =>
  times(groups, () => buildSearchMatchGroup());

const onSearchChange = jest.fn();
const onMatchSelected = jest.fn();

const defaultProps = {
  onSearchChange,
  onMatchSelected,
  matches: []
};

describe('<SpeciesSearchField', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    test('contains AutosuggestSearchField', () => {
      const wrapper = mount(<SpeciesSearchField {...defaultProps} />);

      expect(wrapper.find(AutosuggestSearchField).length).toBe(1);
    });

    test('displays suggested matches', () => {
      const matches = buildSearchMatchGroups();
      const props = {
        ...defaultProps,
        matches
      };
      const wrapper = mount(<SpeciesSearchField {...props} />);
      // to update get a search string into the state of SpeciesSearchField
      wrapper.find('input').simulate('change', { target: { value: 'foo' } });

      const expectedMatchedItemsNumber = flatten(matches).length;

      expect(wrapper.find(SpeciesSearchMatch).length).toBe(
        expectedMatchedItemsNumber
      );
    });
  });

  describe('behaviour', () => {
    let matches: SearchMatches[];
    let wrapper: any;

    beforeEach(() => {
      matches = buildSearchMatchGroups();
      const props = {
        ...defaultProps,
        matches
      };
      wrapper = mount(<SpeciesSearchField {...props} />);
      // to update get a search string into the state of SpeciesSearchField
      wrapper.find('input').simulate('change', { target: { value: 'foo' } });
    });

    test('triggers the onMatchSelected function when a match is clicked', () => {
      const firstMatchData = flatten(matches)[0];
      const firstMatchElement = wrapper.find(SpeciesSearchMatch).at(0);
      firstMatchElement.simulate('click');

      expect(onMatchSelected).toHaveBeenCalledWith(firstMatchData);
    });
  });
});
