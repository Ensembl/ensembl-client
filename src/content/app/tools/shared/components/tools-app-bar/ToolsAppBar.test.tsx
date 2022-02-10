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

import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import ToolsAppBar from './ToolsAppBar';

const renderComponent = (
  { state }: { state?: Partial<BlastFormState> } = { state: {} }
) => {
  const blastFormState = Object.assign({}, initialBlastFormState, state);

  const rootReducer = combineReducers({
    blast: combineReducers({
      blastForm: blastFormReducer
    })
  });

  const mockCommittedItems = [
    {
      genome_id: 'homo_sapiens_GCA_000001405_14',
      reference_genome_id: null,
      common_name: 'Human',
      scientific_name: 'Homo sapiens',
      assembly_name: 'GRCh37.p13',
      isEnabled: true
    }
  ];

  const initialState = {
    blast: { blastForm: blastFormState },
    speciesSelector: { committedItems: mockCommittedItems }
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });

  const renderResult = render(
    <Provider store={store}>
      <ToolsAppBar />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('ToolsAppBar', () => {
  describe('Species Lozenge click', () => {
    it('updates the selectedSpecies state', () => {
      const { container } = renderComponent();

      container.querySelector('.selectedSpecies');
    });
  });
});
