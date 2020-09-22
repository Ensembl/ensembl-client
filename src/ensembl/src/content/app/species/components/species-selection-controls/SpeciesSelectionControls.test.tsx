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

import {
  toggleSpeciesUseAndSave,
  deleteSpeciesAndSave
} from 'src/content/app/species-selector/state/speciesSelectorActions';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import SpeciesSelectionControls, {
  speciesRemovalConfirmationMessage
} from './SpeciesSelectionControls';
import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

jest.mock('connected-react-router', () => ({
  push: jest.fn(() => ({ type: 'push' }))
}));
jest.mock(
  'src/content/app/species-selector/state/speciesSelectorActions',
  () => ({
    deleteSpeciesAndSave: jest.fn(() => ({ type: 'deleteSpeciesAndSave' })),
    toggleSpeciesUseAndSave: jest.fn(() => ({
      type: 'toggleSpeciesUseAndSave'
    }))
  })
);

const selectedSpecies = createSelectedSpecies();
const disabledSpecies = {
  ...selectedSpecies,
  isEnabled: false
};

const stateWithEnabledSpecies = {
  speciesPage: {
    general: {
      activeGenomeId: selectedSpecies.genome_id
    }
  },
  speciesSelector: {
    committedItems: [selectedSpecies]
  }
};

const stateWithDisabledSpecies = {
  ...stateWithEnabledSpecies,
  speciesSelector: {
    committedItems: [disabledSpecies]
  }
};

const mockStore = configureMockStore([thunk]);

const wrapInRedux = (
  state: typeof stateWithEnabledSpecies = stateWithEnabledSpecies
) => {
  return mount(
    <Provider store={mockStore(state)}>
      <SpeciesSelectionControls />
    </Provider>
  );
};

describe('SpeciesSelectionControls', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows correct controls for enabled species', () => {
    const wrapper = wrapInRedux();
    const slideToggle = wrapper.find(SlideToggle);
    const useLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Use')
      .first();
    const doNotUseLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === "Don't use")
      .first();

    expect(slideToggle.prop('isOn')).toBe(true);
    expect(useLabel.hasClass('clickable')).toBe(false);
    expect(doNotUseLabel.hasClass('clickable')).toBe(true);
  });

  it('shows correct controls for disabled species', () => {
    const wrapper = wrapInRedux(stateWithDisabledSpecies);

    const slideToggle = wrapper.find(SlideToggle);
    const useLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Use')
      .first();
    const doNotUseLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === "Don't use")
      .first();

    expect(slideToggle.prop('isOn')).toBe(false);
    expect(useLabel.hasClass('clickable')).toBe(true);
    expect(doNotUseLabel.hasClass('clickable')).toBe(false);
  });

  it('changes species status via the toggle', () => {
    const wrapper = wrapInRedux(stateWithDisabledSpecies);
    const slideToggle = wrapper.find(SlideToggle);
    slideToggle.prop('onChange')(true);

    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      disabledSpecies.genome_id
    );

    jest.clearAllMocks();

    slideToggle.prop('onChange')(false);
    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      disabledSpecies.genome_id
    );
  });

  it('disables species by clicking on label', () => {
    const wrapper = wrapInRedux();
    const doNotUseLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === "Don't use")
      .first();
    doNotUseLabel.simulate('click');

    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      selectedSpecies.genome_id
    );
  });

  it('enables species by clicking on label', () => {
    const wrapper = wrapInRedux(stateWithDisabledSpecies);
    const useLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Use')
      .first();
    useLabel.simulate('click');

    expect(toggleSpeciesUseAndSave).toHaveBeenCalledWith(
      selectedSpecies.genome_id
    );
  });

  it('correctly toggles removal dialog', () => {
    const wrapper = wrapInRedux();
    const removeLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Remove')
      .first();
    removeLabel.simulate('click');

    expect(wrapper.text()).toContain(speciesRemovalConfirmationMessage);

    const doNotRemoveLabel = wrapper
      .find('span')
      .filterWhere((wrapper) => wrapper.text() === 'Do not remove')
      .first();

    doNotRemoveLabel.simulate('click');

    expect(wrapper.text()).not.toContain(speciesRemovalConfirmationMessage);
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
