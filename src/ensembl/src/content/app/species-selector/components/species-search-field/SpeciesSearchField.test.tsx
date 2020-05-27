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

import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';
import flatten from 'lodash/flatten';

import { SpeciesSearchField, NOT_FOUND_TEXT } from './SpeciesSearchField';
import SpeciesSearchMatch from '../species-search-match/SpeciesSearchMatch';
import ClearButton from 'src/shared/components/clear-button/ClearButton';
import AutosuggestSearchField from 'src/shared/components/autosuggest-search-field/AutosuggestSearchField';

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

describe('<SpeciesSearchField />', () => {
  let searchText: string;

  beforeEach(() => {
    searchText = faker.lorem.words();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    test('contains AutosuggestSearchField', () => {
      const wrapper = mount(<SpeciesSearchField {...defaultProps} />);

      expect(wrapper.find(AutosuggestSearchField).length).toBe(1);
    });

    test('does not show clear button for empty field', () => {
      const wrapper = mount(<SpeciesSearchField {...defaultProps} />);

      expect(wrapper.find(ClearButton).length).toBe(0);
    });

    test('displays suggested matches', () => {
      const matches = buildSearchMatchGroups();
      const props = {
        ...defaultProps,
        searchText,
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
        searchText,
        matches
      };
      wrapper = mount(<SpeciesSearchField {...props} />);
    });

    test('triggers the onMatchSelected function when a match is clicked', () => {
      const firstMatchData = flatten(matches)[0];
      const firstMatchElement = wrapper.find(SpeciesSearchMatch).at(0);
      firstMatchElement.simulate('click');

      expect(onMatchSelected).toHaveBeenCalledWith(firstMatchData);
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
