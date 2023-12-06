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

import React, { type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import blastFormReducer, {
  initialState as initialBlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import speciesSelectorReducer from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';
import blastGeneralReducer from 'src/content/app/tools/blast/state/general/blastGeneralSlice';

import BlastAppBar from './BlastAppBar';

jest.mock(
  'src/shared/components/communication-framework/ConversationIcon',
  () => () => <div>ConversationIcon</div>
);

jest.mock(
  'src/shared/hooks/useMediaQuery',
  () => () => false // no match
);

jest.mock(
  'src/shared/components/species-tabs-slider/SpeciesTabsSlider',
  () => (props: { children: ReactNode }) => <div>{props.children}</div>
);

const mockCommittedItems = [
  {
    genome_id: 'homo_sapiens_GCA_000001405_14',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    assembly: {
      name: 'GRCh37.p13'
    },
    genome_tag: null,
    isEnabled: true
  }
];

const initialState = {
  blast: { blastForm: initialBlastFormState },
  speciesSelector: {
    general: {
      committedItems: mockCommittedItems
    }
  }
};

const rootReducer = combineReducers({
  blast: combineReducers({
    blastForm: blastFormReducer,
    blastGeneral: blastGeneralReducer
  }),
  speciesSelector: speciesSelectorReducer
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState as any
});

const renderComponent = () => {
  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter>
        <BlastAppBar />
      </MemoryRouter>
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('BlastAppBar', () => {
  describe('Species Lozenge click', () => {
    it('updates the selectedSpecies state', async () => {
      const { container, store } = renderComponent();

      const speciesLozenge = getByText(container as HTMLElement, 'Human');

      await userEvent.click(speciesLozenge);

      const updatedState = store.getState();

      expect(updatedState.blast.blastForm.selectedSpecies.length).toBe(1);
    });
  });
});
