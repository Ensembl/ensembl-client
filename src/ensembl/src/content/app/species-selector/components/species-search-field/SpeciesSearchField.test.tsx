import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import flatten from 'lodash/flatten';

import { SpeciesSearchField, NOT_FOUND_TEXT } from './SpeciesSearchField';
import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';
import ClearButton from 'src/shared/clear-button/ClearButton';
import GoogleAnalyticsTracking from 'src/services/analytics-service';
import AutosuggestSearchField from 'src/shared/autosuggest-search-field/AutosuggestSearchField';

import {
  SearchMatch,
  SearchMatches,
  MatchedFieldName
} from 'src/content/app/species-selector/types/species-search';

const buildSearchMatch = (): SearchMatch => ({
  genome_id: faker.lorem.word(),
  reference_genome_id: null,
  common_name: faker.lorem.words(),
  scientific_name: faker.lorem.words(),
  assembly_name: faker.lorem.word(),
  matched_substrings: [
    {
      length: 3,
      offset: 1,
      match: MatchedFieldName.COMMON_NAME
    }
  ]
});

const buildSearchMatchGroup = (matches = 2): SearchMatches =>
  times(matches, () => buildSearchMatch());

const buildSearchMatchGroups = (groups = 2): SearchMatches[] =>
  times(groups, () => buildSearchMatchGroup());

const onSearchChange = jest.fn();
const onMatchSelected = jest.fn();
const clearSelectedSearchResult = jest.fn();
const clearSearch = jest.fn();

const defaultProps = {
  onSearchChange,
  onMatchSelected,
  clearSelectedSearchResult,
  clearSearch,
  searchText: '',
  selectedItemText: null,
  matches: []
};

describe('<SpeciesSearchField', () => {
  // beforeEach(() => {
  //   jest
  //     .spyOn(GoogleAnalyticsTracking, 'get')
  //     .mockImplementation(() => Promise.resolve());
  // });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    test('contains AutosuggestSearchField', () => {
      const wrapper = mount(<SpeciesSearchField {...defaultProps} />);

      expect(wrapper.find(AutosuggestSearchField).length).toBe(1);
    });

    test('does not show clear button for empty field', () => {
      const props = { ...defaultProps, searchText: '' };
      const wrapper = mount(<SpeciesSearchField {...props} />);

      expect(wrapper.find(ClearButton).length).toBe(0);
    });

    test('displays suggested matches', () => {
      const matches = buildSearchMatchGroups();
      const props = {
        ...defaultProps,
        searchText: faker.lorem.word(),
        matches
      };
      const wrapper = mount(<SpeciesSearchField {...props} />);
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
        searchText: faker.lorem.word(),
        matches
      };
      wrapper = mount(<SpeciesSearchField {...props} />);
    });

    test('triggers the onMatchSelected function when a match is clicked', () => {
      const firstMatchData = flatten(matches)[0];
      const firstMatchElement = wrapper.find(SpeciesSearchMatch).at(0);
      firstMatchElement.simulate('click');

      expect(onMatchSelected).toHaveBeenCalledWith(
        firstMatchData,
        'species_search'
      );
    });

    test('shows a button for clearing field contents in a non-empty field', () => {
      const clearButton = wrapper.find(ClearButton);

      clearButton.simulate('click');

      expect(clearSelectedSearchResult).toHaveBeenCalled();
      expect(clearSearch).toHaveBeenCalled();
    });
  });

  describe('no matches found', () => {
    test('shows "not found" message', () => {
      const wrapper = mount(<SpeciesSearchField {...defaultProps} />);
      const messagePanel = wrapper.find('.autosuggestionPlate');

      expect(messagePanel.length).toBe(1);
      expect(messagePanel.text()).toBe(NOT_FOUND_TEXT);
    });
  });
});
