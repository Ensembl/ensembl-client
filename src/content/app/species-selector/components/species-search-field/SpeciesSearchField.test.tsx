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
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';
import faker from '@faker-js/faker';
import times from 'lodash/times';
import merge from 'lodash/merge';

import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorSlice';

import { SpeciesSearchField, NOT_FOUND_TEXT } from './SpeciesSearchField';

import {
  SearchMatch,
  SearchMatches,
  MatchedFieldName
} from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

jest.mock(
  'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics',
  () =>
    jest.fn(() => ({
      trackAutocompleteSpeciesSelect: jest.fn()
    }))
);

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

const defaultReduxState = {
  speciesSelector: {
    search: {
      text: '',
      results: null
    } as RootState['speciesSelector']['search']
  }
};

const mockStore = configureMockStore([thunk]);

const renderComponent = (state?: {
  speciesSelector: {
    search: Partial<typeof defaultReduxState['speciesSelector']['search']>;
  };
}) => {
  state = merge({}, defaultReduxState, state);
  return render(
    <Provider store={mockStore(state)}>
      <SpeciesSearchField />
    </Provider>
  );
};

describe('<SpeciesSearchField />', () => {
  let searchText: string;

  beforeEach(() => {
    searchText = faker.lorem.words();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('contains AutosuggestSearchField', () => {
      const { container } = renderComponent();

      expect(
        container.querySelector('.autosuggestionSearchField')
      ).toBeTruthy();
    });

    it('does not show clear button for empty field', () => {
      const { container } = renderComponent();

      expect(container.querySelector('.closeButton')).toBeFalsy();
    });

    it('displays suggested matches', () => {
      const matches = buildSearchMatchGroups();
      const { container } = renderComponent({
        speciesSelector: {
          search: {
            text: searchText,
            results: matches
          }
        }
      });
      const renderedMatches = container.querySelectorAll('.speciesSearchMatch');

      expect(renderedMatches.length).toBe(matches.flat().length);
    });
  });

  describe('behaviour', () => {
    let matches: SearchMatches[];

    beforeEach(() => {
      matches = buildSearchMatchGroups();
    });

    it('triggers the onMatchSelected function when a match is clicked', () => {
      jest.spyOn(speciesSelectorActions, 'setSelectedSpecies');
      const { container } = renderComponent({
        speciesSelector: {
          search: {
            text: searchText,
            results: matches
          }
        }
      });
      const firstMatchData = matches.flat()[0];
      const firstMatchElement = container.querySelector(
        '.speciesSearchMatch'
      ) as HTMLElement;

      userEvent.click(firstMatchElement);

      expect(speciesSelectorActions.setSelectedSpecies).toHaveBeenCalledWith(
        firstMatchData
      );
    });

    it('shows a button for clearing field contents in a non-empty field', () => {
      jest.spyOn(speciesSelectorActions, 'clearSelectedSearchResult');
      jest.spyOn(speciesSelectorActions, 'clearSearch');
      const { container } = renderComponent({
        speciesSelector: {
          search: {
            text: searchText,
            results: matches
          }
        }
      });
      const clearButton = container.querySelector(
        '.closeButton'
      ) as HTMLElement;

      userEvent.click(clearButton);

      expect(
        speciesSelectorActions.clearSelectedSearchResult
      ).toHaveBeenCalled();
      expect(speciesSelectorActions.clearSearch).toHaveBeenCalled();
    });
  });

  describe('no matches found', () => {
    it('shows "not found" message', () => {
      const { container } = renderComponent({
        speciesSelector: {
          search: {
            results: []
          }
        }
      });
      const messagePanel = container.querySelector('.autosuggestionPlate');

      expect(messagePanel).toBeTruthy();
      expect(messagePanel?.textContent).toBe(NOT_FOUND_TEXT);
    });
  });
});
