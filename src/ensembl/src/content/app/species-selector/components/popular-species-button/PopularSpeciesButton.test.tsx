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
import { push } from 'connected-react-router';
import configureMockStore from 'redux-mock-store';
import set from 'lodash/fp/set';
import merge from 'lodash/merge';

import * as speciesSelectorSlice from 'src/content/app/species-selector/state/speciesSelectorSlice';
import * as urlFor from 'src/shared/helpers/urlHelper';

import PopularSpeciesButton, {
  Props as PopularSpeciesButtonProps
} from './PopularSpeciesButton';

import { createPopularSpecies } from 'tests/fixtures/popular-species';
import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import { RootState } from 'src/store';

jest.mock('connected-react-router', () => ({
  push: jest.fn(() => ({ type: 'push' }))
}));

jest.mock(
  'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics',
  () =>
    jest.fn(() => ({
      trackPopularSpeciesSelect: jest.fn()
    }))
);

const humanFromProps: ReturnType<typeof createPopularSpecies> = {
  ...createPopularSpecies(),
  genome_id: 'human'
};
const committedHuman: ReturnType<typeof createSelectedSpecies> = {
  ...createSelectedSpecies(),
  genome_id: 'human'
};
const committedWheat: ReturnType<typeof createSelectedSpecies> = {
  ...createSelectedSpecies(),
  genome_id: 'wheat'
};

const defaultReduxState = {
  speciesSelector: {
    currentItem: null as RootState['speciesSelector']['currentItem'],
    committedItems: [] as RootState['speciesSelector']['committedItems']
  }
};

const defaultProps = {
  species: humanFromProps
};

const mockStore = configureMockStore([thunk]);

type RenderComponentParams = {
  props?: Partial<PopularSpeciesButtonProps>;
  state?: {
    speciesSelector: Partial<typeof defaultReduxState['speciesSelector']>;
  };
};

const renderComponent = (params: RenderComponentParams) => {
  const state = merge({}, defaultReduxState, params.state);
  return render(
    <Provider store={mockStore(state)}>
      <PopularSpeciesButton {...defaultProps} {...params.props} />
    </Provider>
  );
};

describe('<PopularSpeciesButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('not available', () => {
    it('has appropriate class', () => {
      const props = set('species.is_available', false, defaultProps);
      const { container } = renderComponent({ props });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.contains('popularSpeciesButtonDisabled')).toBe(
        true
      );
    });

    it('does not select a species when clicked', () => {
      jest.spyOn(speciesSelectorSlice, 'handleSelectedSpecies');

      const props = set('species.is_available', false, defaultProps);
      const { container } = renderComponent({ props });

      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      userEvent.click(button);

      expect(speciesSelectorSlice.handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });

  describe('not selected', () => {
    it('has appropriate class', () => {
      const { container } = renderComponent({ props: defaultProps });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.length).toBe(1); // has only .popularSpeciesButton class
    });

    it('selects the species received from props when clicked', () => {
      jest.spyOn(speciesSelectorSlice, 'handleSelectedSpecies');

      const { container } = renderComponent({ props: defaultProps });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      userEvent.click(button);

      expect(speciesSelectorSlice.handleSelectedSpecies).toHaveBeenCalledWith(
        defaultProps.species
      );
    });
  });

  describe('selected', () => {
    const reduxFragmentWithSelectedSpecies = {
      speciesSelector: {
        currentItem: committedHuman
      }
    };

    it('has appropriate class', () => {
      const { container } = renderComponent({
        state: reduxFragmentWithSelectedSpecies
      });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.contains('popularSpeciesButtonSelected')).toBe(
        true
      );
    });

    it('clears selected species when clicked', () => {
      jest.spyOn(speciesSelectorSlice, 'handleSelectedSpecies');
      jest.spyOn(speciesSelectorSlice, 'clearSelectedSearchResult');

      const { container } = renderComponent({
        state: reduxFragmentWithSelectedSpecies
      });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      userEvent.click(button);

      expect(speciesSelectorSlice.clearSelectedSearchResult).toHaveBeenCalled();
      expect(speciesSelectorSlice.handleSelectedSpecies).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });
  });

  describe('committed', () => {
    const reduxFragmentWithCommittedSpecies = {
      speciesSelector: {
        committedItems: [committedWheat, committedHuman]
      }
    };

    it('has appropriate class', () => {
      const { container } = renderComponent({
        state: reduxFragmentWithCommittedSpecies
      });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      expect(button.classList.contains('popularSpeciesButtonCommitted')).toBe(
        true
      );
    });

    it('opens species page when clicked', () => {
      jest.spyOn(speciesSelectorSlice, 'handleSelectedSpecies');
      jest.spyOn(speciesSelectorSlice, 'clearSelectedSearchResult');

      const { container } = renderComponent({
        state: reduxFragmentWithCommittedSpecies
      });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      userEvent.click(button);

      expect(push).toHaveBeenCalledWith(
        urlFor.speciesPage({
          genomeId: defaultProps.species.genome_id
        })
      );

      expect(
        speciesSelectorSlice.clearSelectedSearchResult
      ).not.toHaveBeenCalled();
      expect(speciesSelectorSlice.handleSelectedSpecies).not.toHaveBeenCalled();
    });
  });
});
