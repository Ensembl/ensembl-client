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

import SpeciesSelector, {
  type Props as SpeciesSelectorProps
} from './SpeciesSelector';

const speciesListMock = [
  {
    assembly_name: 'IWGSC',
    common_name: 'Wheat',
    genome_id: 'triticum_aestivum_GCA_900519105_1',
    scientific_name: 'Triticum aestivum'
  },
  {
    assembly_name: 'GRCh38.p13',
    common_name: 'Human',
    genome_id: 'homo_sapiens_GCA_000001405_28',
    reference_genome_id: null,
    scientific_name: 'Homo sapiens'
  },
  {
    assembly_name: 'R64-1-1',
    common_name: null,
    genome_id: 'saccharomyces_cerevisiae_GCA_000146045_2',
    reference_genome_id: 'saccharomyces_cerevisiae',
    scientific_name: 'Saccharomyces cerevisiae'
  },
  {
    assembly_name: 'WBcel235',
    common_name: null,
    genome_id: 'caenorhabditis_elegans_GCA_000002985_3',
    reference_genome_id: 'caenorhabditis_elegans',
    scientific_name: 'Caenorhabditis elegans'
  }
];

const defaultProps: SpeciesSelectorProps = {
  speciesList: speciesListMock
};

const renderComponent = (
  {
    props,
    state
  }: {
    state?: Partial<BlastFormState>;
    props?: SpeciesSelectorProps;
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
      <SpeciesSelector {...props} />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('SpeciesSelector', () => {
  describe('species order', () => {
    it('sorts the species correctly', () => {
      const { container } = renderComponent();
      const speciesScientificNameOrder = [
        ...container.querySelectorAll('.scientificNameCol')
      ].map((item) => item.innerHTML);
      const expectedSpeciesScientificNameOrder = [
        'Homo sapiens',
        'Triticum aestivum',
        'Caenorhabditis elegans',
        'Saccharomyces cerevisiae'
      ];

      expect(speciesScientificNameOrder).toEqual(
        expectedSpeciesScientificNameOrder
      );
    });
  });
  describe('species selection', () => {
    it('updates the selectedSpecies state', () => {
      const { container, store } = renderComponent();

      const speciesCheckbox = container.querySelector(
        'tbody tr .defaultCheckbox'
      ) as HTMLElement;

      userEvent.click(speciesCheckbox);

      const updatedState = store.getState();

      expect(
        Object.keys(updatedState.blast.blastForm.selectedSpecies).length
      ).toBe(1);
      expect(
        updatedState.blast.blastForm.selectedSpecies
          .homo_sapiens_GCA_000001405_28
      ).toBe(true);
    });
  });
});
