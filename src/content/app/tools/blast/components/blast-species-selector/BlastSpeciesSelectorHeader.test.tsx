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
import { render, getNodeText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import SpeciesSelectorHeader, {
  type Props as SpeciesSelectorHeaderProps
} from './BlastSpeciesSelectorHeader';

const defaultProps: SpeciesSelectorHeaderProps = {
  compact: false
};

const renderComponent = (
  {
    props,
    state
  }: {
    state?: Partial<BlastFormState>;
    props?: SpeciesSelectorHeaderProps;
  } = { state: {} }
) => {
  props = Object.assign({}, defaultProps, props);
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
      <SpeciesSelectorHeader {...props} />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

const selectedHuman = {
  genome_id: 'human-genome-id',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  assembly_name: 'GRCh38'
};

const selectedMouse = {
  genome_id: 'mouse-genome-id',
  common_name: 'Mouse',
  scientific_name: 'Mus musculus',
  assembly_name: 'GRCm39'
};

describe('SpeciesSelectorHeader', () => {
  describe('species counter', () => {
    it('starts with 0', () => {
      const { container } = renderComponent();
      const speciesCounter = container.querySelector('.header .speciesCounter');
      expect(getNodeText(speciesCounter as HTMLElement)).toBe('0');
    });

    it('displays the number of added species', () => {
      const selectedSpecies = [selectedHuman, selectedMouse];
      const { container } = renderComponent({ state: { selectedSpecies } });
      const speciesCounter = container.querySelector('.header .speciesCounter');
      expect(getNodeText(speciesCounter as HTMLElement)).toBe(
        `${selectedSpecies.length}`
      );
    });
  });

  describe('clear all control', () => {
    it('clears all selected species', () => {
      const selectedSpecies = [selectedHuman, selectedMouse];
      const { container, store } = renderComponent({
        state: { selectedSpecies }
      });
      const clearAll = container.querySelector('.clearAll');

      userEvent.click(clearAll as HTMLElement);

      const updatedState = store.getState();

      expect(updatedState.blast.blastForm.selectedSpecies.length).toBe(0);

      const speciesCounter = container.querySelector('.header .speciesCounter');
      expect(getNodeText(speciesCounter as HTMLElement)).toBe('0');
    });
  });
});
