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
import { render, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { push } from 'connected-react-router';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { deleteSpeciesAndSave } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import SpeciesRemove, { confirmationMessage } from './SpeciesRemove';

jest.mock('connected-react-router', () => ({
  push: jest.fn(() => ({ type: 'push' }))
}));
jest.mock(
  'src/content/app/species-selector/state/speciesSelectorActions',
  () => ({
    deleteSpeciesAndSave: jest.fn(() => ({ type: 'deleteSpeciesAndSave' }))
  })
);
jest.mock('src/shared/hooks/useAnalyticsService', () =>
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
    committedItems: [selectedSpecies]
  }
};

const mockStore = configureMockStore([thunk]);

const wrapInRedux = (state: typeof mockState = mockState) => {
  return render(
    <Provider store={mockStore(state)}>
      <SpeciesRemove />
    </Provider>
  );
};

describe('SpeciesSelectionControls', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly toggles removal confirmation dialog', () => {
    const { container } = wrapInRedux();
    const removeLabel = getByText(container as HTMLElement, 'Remove');

    // open removal confitmation dialog
    userEvent.click(removeLabel);

    expect(container.querySelector('.speciesRemovalWarning')?.textContent).toBe(
      confirmationMessage
    );

    // close removal confitmation dialog
    const doNotRemoveLabel = getByText(
      container as HTMLElement,
      'Do not remove'
    );
    userEvent.click(doNotRemoveLabel);

    expect(container.querySelector('.speciesRemovalWarning')).toBeFalsy();
  });

  it('removes species and redirects to species selector after removal', () => {
    const { container } = wrapInRedux();

    // open removal confitmation dialog
    const removeLabel = getByText(container as HTMLElement, 'Remove');
    userEvent.click(removeLabel);

    const removeButton = getByText(container as HTMLElement, 'Remove'); // this will be a button element now
    userEvent.click(removeButton);

    expect(deleteSpeciesAndSave).toHaveBeenCalledWith(
      selectedSpecies.genome_id
    );
    expect(push).toHaveBeenCalledWith(urlFor.speciesSelector());
  });
});
