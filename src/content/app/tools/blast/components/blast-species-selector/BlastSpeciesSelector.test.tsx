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
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import BlastSpeciesSelector from './BlastSpeciesSelector';

const speciesList = [
  {
    assembly_name: 'GRCh38.p13',
    common_name: 'Human',
    genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
    scientific_name: 'Homo sapiens'
  },
  {
    assembly_name: 'IWGSC',
    common_name: null,
    genome_id: 'a73357ab-93e7-11ec-a39d-005056b38ce3',
    scientific_name: 'Triticum aestivum'
  },
  {
    assembly_name: 'GRCh37.p13',
    common_name: 'Human',
    genome_id: '3704ceb1-948d-11ec-a39d-005056b38ce3',
    scientific_name: 'Homo sapiens'
  }
];

jest.mock(
  'src/content/app/species-selector/state/speciesSelectorSelectors',
  () => ({
    getPopularSpecies: () => speciesList
  })
);

const renderComponent = (
  {
    state
  }: {
    state?: Partial<BlastFormState>;
  } = { state: {} }
) => {
  const blastFormState = Object.assign({}, initialBlastFormState, state);
  const rootReducer = combineReducers({
    blast: combineReducers({
      blastForm: blastFormReducer
    })
  });
  const initialState = {
    blast: { blastForm: blastFormState }
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });

  const renderResult = render(
    <Provider store={store}>
      <BlastSpeciesSelector />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('SpeciesSelector', () => {
  it('updates the selectedSpecies state', async () => {
    const { container, store, debug } = renderComponent();

    const speciesCheckbox = container.querySelector(
      'tbody tr [data-test-id="checkbox"]'
    ) as HTMLElement;

    debug(container);
    await userEvent.click(speciesCheckbox);

    const updatedState = store.getState();

    expect(updatedState.blast.blastForm.selectedSpecies.length).toBe(1);
    expect(updatedState.blast.blastForm.selectedSpecies[0]).toEqual(
      speciesList[0]
    );
  });
});
