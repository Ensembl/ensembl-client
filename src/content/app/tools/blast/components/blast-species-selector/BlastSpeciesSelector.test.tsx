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

import SpeciesSelector from './BlastSpeciesSelector';

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
      <SpeciesSelector />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('SpeciesSelector', () => {
  describe('species selection', () => {
    it('updates the selectedSpecies state', () => {
      const { container, store } = renderComponent();

      const speciesCheckbox = container.querySelector(
        'tbody tr [data-test-id="checkbox"]'
      ) as HTMLElement;

      userEvent.click(speciesCheckbox);

      const updatedState = store.getState();

      expect(updatedState.blast.blastForm.selectedSpecies.length).toBe(1);
      expect(updatedState.blast.blastForm.selectedSpecies[0]).toEqual(
        'homo_sapiens_GCA_000001405_14'
      );
    });
  });
});
