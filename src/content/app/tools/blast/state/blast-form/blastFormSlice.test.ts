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

import { configureStore, combineReducers } from '@reduxjs/toolkit';

import blastFormReducer, {
  setSequences,
  setSequenceType,
  setSequenceForGenome,
  setBlastDatabase,
  initialState,
  initialBlastFormSettings,
  type BlastFormState
} from './blastFormSlice';

import {
  createDNASequence,
  createProteinSequence
} from 'tests/fixtures/blast/blastSubmission';
import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import untypedMockBlastSettingsConfig from 'tests/fixtures/blast/blastSettingsConfig.json';

import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';

const mockBlastSettingsConfig =
  untypedMockBlastSettingsConfig as unknown as BlastSettingsConfig;

const createReduxStore = (stateFragment: Partial<BlastFormState> = {}) => {
  const blastReducer = combineReducers({
    blast: combineReducers({
      blastForm: blastFormReducer
    })
  });
  return configureStore({
    reducer: blastReducer,
    preloadedState: {
      blast: {
        blastForm: {
          ...initialState,
          ...stateFragment
        }
      }
    }
  });
};

describe('blastFormSlice', () => {
  describe('updating sequences', () => {
    describe('when user has not interacted with settings', () => {
      // this is basically a background check; not very useful because the expected values are the default
      it('guesses nucleotide sequence type and updates settings', () => {
        const store = createReduxStore({
          settings: {
            ...initialBlastFormSettings,
            sequenceType: 'protein'
          }
        });
        const dnaSequence = createDNASequence(50);
        store.dispatch(
          setSequences({
            sequences: [{ value: dnaSequence }],
            config: mockBlastSettingsConfig
          })
        );

        const blastFormState = store.getState().blast.blastForm;
        expect(blastFormState.settings.sequenceType).toBe('dna');
        expect(blastFormState.settings.parameters.database).toBe('dna_sm');
        expect(blastFormState.settings.program).toBe('blastn');
      });

      it('guesses protein sequence type and updates settings', () => {
        const store = createReduxStore();
        const proteinSequence = createProteinSequence(50);
        store.dispatch(
          setSequences({
            sequences: [{ value: proteinSequence }],
            config: mockBlastSettingsConfig
          })
        );

        const blastFormState = store.getState().blast.blastForm;
        expect(blastFormState.settings.sequenceType).toBe('protein');
        expect(blastFormState.settings.parameters.database).toBe('pep');
        expect(blastFormState.settings.program).toBe('blastp');
      });
    });

    describe('when user has set sequence type', () => {
      it('does not update settings', () => {
        const store = createReduxStore({
          settings: {
            ...initialBlastFormSettings,
            sequenceType: 'dna', // this is the default anyway
            sequenceSelectionMode: 'manual',
            parameters: { database: 'dna' }
          }
        });
        const proteinSequence = createProteinSequence(50);
        store.dispatch(
          setSequences({
            sequences: [{ value: proteinSequence }],
            config: mockBlastSettingsConfig
          })
        );

        const blastFormState = store.getState().blast.blastForm;
        expect(blastFormState.settings.sequenceType).toBe('dna');
        expect(blastFormState.settings.parameters.database).toBe('dna');
        expect(blastFormState.settings.program).toBe('blastn');
      });
    });

    describe('when user has set database type', () => {
      // e.g. set database to protein, but then paste a nucleotide sequence
      it('only updates sequence settings', () => {
        const store = createReduxStore({
          settings: {
            ...initialBlastFormSettings,
            sequenceType: 'dna',
            databaseSelectionMode: 'manual',
            parameters: { database: 'dna' }
          }
        });
        const proteinSequence = createProteinSequence(50);
        store.dispatch(
          setSequences({
            sequences: [{ value: proteinSequence }],
            config: mockBlastSettingsConfig
          })
        );

        const blastFormState = store.getState().blast.blastForm;
        expect(blastFormState.settings.sequenceType).toBe('protein');
        expect(blastFormState.settings.parameters.database).toBe('dna');
        expect(blastFormState.settings.program).toBe('tblastn');
      });
    });

    describe('when user has deleted all sequences', () => {
      it('resets to initial settings', () => {
        const store = createReduxStore({
          sequences: [{ value: createProteinSequence(50) }],
          settings: {
            ...initialBlastFormSettings,
            sequenceType: 'protein',
            sequenceSelectionMode: 'manual',
            databaseSelectionMode: 'manual',
            parameters: { database: 'pep' }
          }
        });
        store.dispatch(
          setSequences({
            sequences: [],
            config: mockBlastSettingsConfig
          })
        );

        const blastFormState = store.getState().blast.blastForm;
        expect(blastFormState.settings.sequenceType).toBe('dna');
        expect(blastFormState.settings.parameters.database).toBe('dna_sm');
        expect(blastFormState.settings.sequenceSelectionMode).toBe('automatic');
        expect(blastFormState.settings.databaseSelectionMode).toBe('automatic');
        expect(blastFormState.settings.program).toBe('blastn');
      });
    });
  });

  describe('updating sequence type', () => {
    describe('when user has not changed the database', () => {
      it('updates database setting to match sequence type', () => {
        const store = createReduxStore({
          sequences: [{ value: createDNASequence(50) }],
          settings: {
            ...initialBlastFormSettings,
            parameters: { database: 'dna' }
          }
        });
        store.dispatch(
          setSequenceType({
            sequenceType: 'protein',
            config: mockBlastSettingsConfig
          })
        );

        const blastFormState = store.getState().blast.blastForm;
        expect(blastFormState.settings.sequenceType).toBe('protein');
        expect(blastFormState.settings.parameters.database).toBe('pep');
        expect(blastFormState.settings.sequenceSelectionMode).toBe('manual');
        expect(blastFormState.settings.databaseSelectionMode).toBe('automatic');
        expect(blastFormState.settings.program).toBe('blastp');
      });
    });

    describe('when user has explicitly chosen the database', () => {
      it('does not change the database setting', () => {
        const store = createReduxStore({
          sequences: [{ value: createDNASequence(50) }],
          settings: {
            ...initialBlastFormSettings,
            databaseSelectionMode: 'manual',
            parameters: { database: 'dna' }
          }
        });
        store.dispatch(
          setSequenceType({
            sequenceType: 'protein',
            config: mockBlastSettingsConfig
          })
        );

        const blastFormState = store.getState().blast.blastForm;
        expect(blastFormState.settings.sequenceType).toBe('protein');
        expect(blastFormState.settings.parameters.database).toBe('dna'); // remains unchanged
        expect(blastFormState.settings.sequenceSelectionMode).toBe('manual');
        expect(blastFormState.settings.databaseSelectionMode).toBe('manual');
        expect(blastFormState.settings.program).toBe('tblastn');
      });
    });
  });

  describe('updating database setting', () => {
    it('prevents subsequent guessing of sequence type', () => {
      const store = createReduxStore({
        sequences: [{ value: createDNASequence(50) }],
        settings: {
          ...initialBlastFormSettings,
          parameters: { database: 'dna' }
        }
      });
      store.dispatch(
        setBlastDatabase({
          database: 'pep',
          config: mockBlastSettingsConfig
        })
      );

      const blastFormState = store.getState().blast.blastForm;
      expect(blastFormState.settings.sequenceType).toBe('dna'); // stays as it was
      expect(blastFormState.settings.parameters.database).toBe('pep');
      expect(blastFormState.settings.sequenceSelectionMode).toBe('manual'); // as per UX team requirement
      expect(blastFormState.settings.databaseSelectionMode).toBe('manual');
      expect(blastFormState.settings.program).toBe('blastx');
    });
  });

  describe('prefilling form with known sequence for known genome', () => {
    it('sets form data for nucleotide sequence', () => {
      const store = createReduxStore();

      const sequence = createDNASequence(50);
      const species = createSelectedSpecies();

      store.dispatch(
        setSequenceForGenome({
          sequence: { value: sequence },
          species,
          sequenceType: 'dna',
          config: mockBlastSettingsConfig
        })
      );

      const blastFormState = store.getState().blast.blastForm;
      expect(blastFormState.sequences).toEqual([{ value: sequence }]);
      expect(blastFormState.selectedSpecies).toEqual([species]);
      expect(blastFormState.settings.sequenceType).toBe('dna');
      expect(blastFormState.settings.parameters.database).toBe('dna_sm');
      expect(blastFormState.settings.sequenceSelectionMode).toBe('manual');
      expect(blastFormState.settings.databaseSelectionMode).toBe('automatic');
      expect(blastFormState.settings.program).toBe('blastn');
    });

    it('sets form data for protein sequence', () => {
      const store = createReduxStore();

      const sequence = createProteinSequence(50);
      const species = createSelectedSpecies();

      store.dispatch(
        setSequenceForGenome({
          sequence: { value: sequence },
          species,
          sequenceType: 'protein',
          config: mockBlastSettingsConfig
        })
      );

      const blastFormState = store.getState().blast.blastForm;
      expect(blastFormState.sequences).toEqual([{ value: sequence }]);
      expect(blastFormState.selectedSpecies).toEqual([species]);
      expect(blastFormState.settings.sequenceType).toBe('protein');
      expect(blastFormState.settings.parameters.database).toBe('pep');
      expect(blastFormState.settings.sequenceSelectionMode).toBe('manual');
      expect(blastFormState.settings.databaseSelectionMode).toBe('automatic');
      expect(blastFormState.settings.program).toBe('blastp');
    });
  });
});
