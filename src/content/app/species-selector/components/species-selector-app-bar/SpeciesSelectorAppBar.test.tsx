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
import times from 'lodash/times';
import noop from 'lodash/noop';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import {
  SpeciesSelectorAppBar,
  placeholderMessage
} from './SpeciesSelectorAppBar';
import RouteChecker from 'tests/router/RouteChecker';

jest.mock(
  'src/shared/components/communication-framework/ConversationIcon',
  () => () => <div>ConversationIcon</div>
);

const selectedSpecies = times(5, () => createSelectedSpecies());

const defaultReduxState = {
  speciesSelector: {
    committedItems: selectedSpecies
  }
};

const mockStore = configureMockStore();

const renderComponent = (state?: any) => {
  state = Object.assign({}, defaultReduxState, state);

  const routerInfo: { location: Location | null } = { location: null };

  const renderResult = render(
    <MemoryRouter initialEntries={['/species-selector']}>
      <Provider store={mockStore(state)}>
        <SpeciesSelectorAppBar
          isGeneSearchMode={false}
          onGeneSearchToggle={noop}
        />
        <RouteChecker
          setLocation={(location) => (routerInfo.location = location)}
        />
      </Provider>
    </MemoryRouter>
  );

  return {
    ...renderResult,
    routerInfo
  };
};

describe('<SpeciesSelectorAppBar />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows placeholder message if no species are selected', () => {
    const { container } = renderComponent({
      speciesSelector: { committedItems: [] }
    });
    expect(container.querySelector('.placeholderMessage')?.textContent).toBe(
      placeholderMessage
    );
  });

  it('does not show placeholder message if there are selected species', () => {
    const { container } = renderComponent();
    expect(container.querySelector('.placeholderMessage')).toBeFalsy();
  });

  it('renders the list of selected species if there are some', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.species').length).toBe(
      selectedSpecies.length
    );
  });

  it('opens the species page when a SelectedSpecies tab button is clicked', async () => {
    const { container, routerInfo } = renderComponent();
    const firstSelectedSpecies = container.querySelector(
      '.species'
    ) as HTMLElement;

    await userEvent.click(firstSelectedSpecies);

    const firstSpeciesGenomeId = selectedSpecies[0].genome_id;
    const speciesPageUrl = urlFor.speciesPage({
      genomeId: firstSpeciesGenomeId
    });

    expect(routerInfo.location?.pathname).toBe(speciesPageUrl);
  });
});
