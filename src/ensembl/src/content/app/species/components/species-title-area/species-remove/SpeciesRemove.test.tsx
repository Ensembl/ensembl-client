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
  return mount(
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
    const wrapper = wrapInRedux();
    const removeLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Remove')
      .first();
    removeLabel.simulate('click');

    expect(wrapper.text()).toContain(confirmationMessage);

    const doNotRemoveLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Do not remove')
      .first();

    doNotRemoveLabel.simulate('click');

    expect(wrapper.text()).not.toContain(confirmationMessage);
  });

  it('removes species and redirects to species selector after removal', () => {
    const wrapper = wrapInRedux();

    // open removal confitmation dialog
    const removeLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Remove')
      .first();
    removeLabel.simulate('click');

    const removeButton = wrapper.find('button.primaryButton');
    removeButton.simulate('click');

    expect(deleteSpeciesAndSave).toHaveBeenCalledWith(
      selectedSpecies.genome_id
    );
    expect(push).toHaveBeenCalledWith(urlFor.speciesSelector());
  });
});
