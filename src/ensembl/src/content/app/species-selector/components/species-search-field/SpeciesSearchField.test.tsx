import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import times from 'lodash/times';

import { SpeciesSearchField } from './SpeciesSearchField';

import AutosuggestSearchField from 'src/shared/autosuggest-search-field/AutosuggestSearchField';

import {
  SearchMatch,
  SearchMatchGroup
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

const buildSearchMatchGroup = (matches = 2): SearchMatchGroup => ({
  matches: times(matches, buildSearchMatch)
});

const buildSearchMatchGroups = (groups = 2): SearchMatchGroup[] => {
  return times(groups, buildSearchMatchGroup);
};

const onSearchChange = jest.fn();

const defaultProps = {
  onSearchChange,
  matches: []
};

describe('<SpeciesSearchField', () => {
  describe('rendering', () => {
    test('contains AutosuggestSearchField', () => {
      const wrapper = mount(<SpeciesSearchField {...defaultProps} />);

      expect(wrapper.find(AutosuggestSearchField).length).toBe(1);
    });
  });
});
