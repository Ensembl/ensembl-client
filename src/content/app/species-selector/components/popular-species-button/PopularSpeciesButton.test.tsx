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
import { MemoryRouter, Location } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';
import set from 'lodash/fp/set';
import merge from 'lodash/merge';

import * as speciesSelectorActions from 'src/content/app/species-selector/state/speciesSelectorSlice';
import * as urlFor from 'src/shared/helpers/urlHelper';

import PopularSpeciesButton, {
  Props as PopularSpeciesButtonProps
} from './PopularSpeciesButton';
import RouteChecker from 'tests/router/RouteChecker';

import { createPopularSpecies } from 'tests/fixtures/popular-species';
import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import { RootState } from 'src/store';

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

const mockStore = configureMockStore();

type RenderComponentParams = {
  props?: Partial<PopularSpeciesButtonProps>;
  state?: {
    speciesSelector: Partial<typeof defaultReduxState['speciesSelector']>;
  };
};

const renderComponent = (params: RenderComponentParams) => {
  const state = merge({}, defaultReduxState, params.state);
  const routerInfo: { location: Location | null } = { location: null };

  const renderResult = render(
    <MemoryRouter initialEntries={['/species-selector']}>
      <Provider store={mockStore(state)}>
        <PopularSpeciesButton {...defaultProps} {...params.props} />
        <RouteChecker setLocation={(loc) => (routerInfo.location = loc)} />
      </Provider>
    </MemoryRouter>
  );

  return {
    ...renderResult,
    routerInfo
  };
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

    it('does not select a species when clicked', async () => {
      jest.spyOn(speciesSelectorActions, 'setSelectedSpecies');

      const props = set('species.is_available', false, defaultProps);
      const { container } = renderComponent({ props });

      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;
      await userEvent.click(button);

      expect(speciesSelectorActions.setSelectedSpecies).not.toHaveBeenCalled();
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

    it('selects the species received from props when clicked', async () => {
      jest.spyOn(speciesSelectorActions, 'setSelectedSpecies');

      const { container } = renderComponent({ props: defaultProps });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      await userEvent.click(button);

      expect(speciesSelectorActions.setSelectedSpecies).toHaveBeenCalledWith(
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

    it('clears selected species when clicked', async () => {
      jest.spyOn(speciesSelectorActions, 'setSelectedSpecies');
      jest.spyOn(speciesSelectorActions, 'clearSelectedSearchResult');

      const { container, routerInfo } = renderComponent({
        state: reduxFragmentWithSelectedSpecies
      });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      await userEvent.click(button);

      expect(
        speciesSelectorActions.clearSelectedSearchResult
      ).toHaveBeenCalled();
      expect(speciesSelectorActions.setSelectedSpecies).not.toHaveBeenCalled();
      expect(routerInfo.location?.pathname).toBe('/species-selector'); // the click has not caused a url change
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

    it('opens species page when clicked', async () => {
      jest.spyOn(speciesSelectorActions, 'setSelectedSpecies');
      jest.spyOn(speciesSelectorActions, 'clearSelectedSearchResult');

      const { container, routerInfo } = renderComponent({
        state: reduxFragmentWithCommittedSpecies
      });
      const button = container.querySelector(
        '.popularSpeciesButton'
      ) as HTMLElement;

      await userEvent.click(button);

      expect(routerInfo.location?.pathname).toBe(
        urlFor.speciesPage({
          genomeId: defaultProps.species.genome_id
        })
      );

      expect(
        speciesSelectorActions.clearSelectedSearchResult
      ).not.toHaveBeenCalled();
      expect(speciesSelectorActions.setSelectedSpecies).not.toHaveBeenCalled();
    });
  });
});
