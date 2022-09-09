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
import { MemoryRouter, Location } from 'react-router-dom';
import { render, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/speciesSelectorSlice';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import SpeciesRemove, { confirmationMessage } from './SpeciesRemove';
import RouteChecker from 'tests/router/RouteChecker';

jest.mock(
  'src/content/app/species-selector/state/speciesSelectorSlice',
  () => ({
    deleteSpeciesAndSave: jest.fn(() => ({ type: 'deleteSpeciesAndSave' })),
    setSpeciesRemoveStatus: jest.fn(() => ({ type: 'setSpeciesRemoveStatus' }))
  })
);
jest.mock('src/content/app/species/hooks/useSpeciesAnalytics', () =>
  jest.fn(() => ({
    trackDeletedSpecies: jest.fn()
  }))
);

const selectedSpecies = createSelectedSpecies();

const mockState = {
  speciesPage: {
    general: {
      activeGenomeId: selectedSpecies.genome_id
    }
  },
  speciesSelector: {
    committedItems: [selectedSpecies],
    ui: {
      isRemovingSpecies: false
    }
  }
};

const mockStore = configureMockStore();

const wrapInRedux = (state: typeof mockState = mockState) => {
  const routerInfo: { location: Location | null } = { location: null };

  const renderResult = render(
    <MemoryRouter initialEntries={[`/species/${selectedSpecies.genome_id}`]}>
      <Provider store={mockStore(state)}>
        <SpeciesRemove />
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

describe('SpeciesSelectionControls', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly toggles removal confirmation dialog', async () => {
    const { container } = wrapInRedux();
    const removeSpeciesButton = getByText(
      container as HTMLElement,
      'Remove species'
    );

    // open removal confirmation dialog
    await userEvent.click(removeSpeciesButton);

    expect(container.querySelector('.speciesRemovalWarning')?.textContent).toBe(
      confirmationMessage
    );

    // close removal confitmation dialog
    const doNotRemoveLabel = getByText(
      container as HTMLElement,
      'Do not remove'
    );
    await userEvent.click(doNotRemoveLabel);

    expect(container.querySelector('.speciesRemovalWarning')).toBeFalsy();
  });

  it('removes species and redirects to species selector after removal', async () => {
    const { container, routerInfo } = wrapInRedux();

    // open removal confitmation dialog
    const removeSpeciesButton = getByText(
      container as HTMLElement,
      'Remove species'
    );
    await userEvent.click(removeSpeciesButton);

    const removeButton = getByText(container as HTMLElement, 'Remove'); // this will be a button element now
    await userEvent.click(removeButton);

    expect(deleteSpeciesAndSave).toHaveBeenCalledWith(
      selectedSpecies.genome_id
    );
    expect(routerInfo.location?.pathname).toBe(urlFor.speciesSelector());
  });
});
