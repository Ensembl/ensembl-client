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
import useBlastInputSequences from './useBlastInputSequences';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook, act } from '@testing-library/react';

import mockBlastSettingsConfig from 'tests/fixtures/blast/blastSettingsConfig.json';
import useBlastSettings from '../blast-settings/useBlastSettings';

import {
  getSequences,
  getSelectedSequenceType,
  getSequenceSelectionMode
} from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import { BlastSettingsConfig } from '../../types/blastSettings';
import { BlastConfigContext } from '../../views/blast-form/BlastForm';

jest.mock('src/content/app/tools/blast/state/blast-api/blastApiSlice', () => {
  return {
    useBlastConfigQuery: () => ({ data: mockBlastSettingsConfig })
  };
});

const rootReducer = combineReducers({
  blast: combineReducers({
    blastForm: blastFormReducer
  })
});

const testBlastConfigContext = {
  config: mockBlastSettingsConfig as unknown as BlastSettingsConfig
};

const WrapInContext = ({ children }: { children: ReactNode }) => {
  return (
    <BlastConfigContext.Provider value={testBlastConfigContext}>
      {children}
    </BlastConfigContext.Provider>
  );
};

const getWrapper = (
  { state }: { state?: Partial<BlastFormState> } = { state: {} }
) => {
  const blastFormState = Object.assign({}, initialBlastFormState, state);
  const initialState = {
    blast: { blastForm: blastFormState }
  };
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <WrapInContext>{children}</WrapInContext>
    </Provider>
  );

  return {
    wrapper,
    store
  };
};

describe('useBlastInputSequences', () => {
  it('returns sequences from redux slice', () => {
    const sequences = [{ header: 'foo', value: 'AAA' }];
    const { wrapper } = getWrapper({
      state: {
        sequences
      }
    });
    const { result } = renderHook(() => useBlastInputSequences(), { wrapper });
    expect(result.current.sequences).toEqual(sequences);
  });

  it('returns sequence type from redux slice', () => {
    const { wrapper } = getWrapper();
    const { result } = renderHook(() => useBlastInputSequences(), { wrapper });
    expect(result.current.sequenceType).toEqual('dna');
  });

  describe('updateSequences', () => {
    it('replaces sequences in the redux store', () => {
      const sequences = [{ header: 'foo', value: 'AAA' }];
      const { wrapper, store } = getWrapper({
        state: {
          sequences
        }
      });
      const { result } = renderHook(() => useBlastInputSequences(), {
        wrapper
      });
      const { updateSequences } = result.current;

      const newSequences = [
        { header: 'bar', value: 'ACTG' },
        { header: 'baz', value: 'GUAC' }
      ];

      act(() => {
        updateSequences(newSequences);
      });

      expect(getSequences(store.getState() as any)).toEqual(newSequences);
    });

    it('updates sequence type while updating the sequences', () => {
      const proteinSequence =
        'MENLNMDLLYMAAAVMMGLAAIGAAIGIGILGGKFLEGAARQPDLIPLLRTQFFIVMGLVDAIPMIAVGL';
      const nucleotideSequence =
        'CGGACCAGACGGACACAGGGAGAAGCTAGTTTCTTTCATGTGATTGANATNATGACTCTACTCCTAAAAG';
      const { wrapper, store } = getWrapper();
      const { result } = renderHook(() => useBlastInputSequences(), {
        wrapper
      });
      const { updateSequences } = result.current;

      let newSequences = [
        { value: proteinSequence },
        { value: nucleotideSequence }
      ];

      act(() => {
        updateSequences(newSequences);
      });

      expect(getSelectedSequenceType(store.getState() as any)).toEqual(
        'protein'
      );

      newSequences = [
        { value: nucleotideSequence },
        { value: proteinSequence }
      ];
      act(() => {
        updateSequences(newSequences);
      });

      expect(getSelectedSequenceType(store.getState() as any)).toEqual('dna');
    });

    it('resets sequence type to dna if sequences are deleted', () => {
      const proteinSequence =
        'MENLNMDLLYMAAAVMMGLAAIGAAIGIGILGGKFLEGAARQPDLIPLLRTQFFIVMGLVDAIPMIAVGL';
      // PART 1. With automatically guessed sequence type
      const { wrapper: wrapper1, store: store1 } = getWrapper();
      const { result: result1 } = renderHook(() => useBlastInputSequences(), {
        wrapper: wrapper1
      });
      let updateSequences = result1.current.updateSequences;

      act(() => {
        updateSequences([{ value: proteinSequence }]);
      });

      expect(getSelectedSequenceType(store1.getState() as any)).toEqual(
        'protein'
      );

      act(() => {
        updateSequences([]);
      });

      expect(getSelectedSequenceType(store1.getState() as any)).toEqual('dna');

      // PART 2. With manually set sequence type
      const { wrapper: wrapper2, store: store2 } = getWrapper({
        state: {
          sequences: [{ header: 'foo', value: 'MENLNMDL' }],
          settings: {
            ...initialBlastFormState.settings,
            sequenceSelectionMode: 'manual',
            sequenceType: 'protein'
          }
        }
      });
      const { result: result2 } = renderHook(() => useBlastInputSequences(), {
        wrapper: wrapper2
      });
      updateSequences = result2.current.updateSequences;

      act(() => {
        updateSequences([]);
      });

      expect(getSelectedSequenceType(store2.getState() as any)).toEqual('dna'); // sequence type reset to initial
    });

    it('does not change sequence type if user has changed sequence type manually', () => {
      const proteinSequence =
        'MENLNMDLLYMAAAVMMGLAAIGAAIGIGILGGKFLEGAARQPDLIPLLRTQFFIVMGLVDAIPMIAVGL';
      const { wrapper, store } = getWrapper({
        state: {
          settings: {
            ...initialBlastFormState.settings,
            sequenceSelectionMode: 'manual'
          }
        }
      });
      const { result } = renderHook(() => useBlastInputSequences(), {
        wrapper
      });
      const { updateSequences } = result.current;
      expect(getSelectedSequenceType(store.getState() as any)).toEqual('dna'); // initial value

      act(() => {
        updateSequences([{ value: proteinSequence }]);
      });

      expect(getSelectedSequenceType(store.getState() as any)).toEqual('dna'); // sequence type should not have changed
    });
  });

  describe('updateSequenceType', () => {
    it('changes sequence type and sets the change type to manual', () => {
      const { wrapper, store } = getWrapper();
      const { result } = renderHook(() => useBlastSettings(), {
        wrapper
      });

      // initial values
      expect(getSelectedSequenceType(store.getState() as any)).toEqual('dna');
      expect(getSequenceSelectionMode(store.getState() as any)).toEqual(
        'automatic'
      );

      const { updateSequenceType } = result.current;
      act(() => {
        updateSequenceType('protein');
      });

      expect(getSelectedSequenceType(store.getState() as any)).toEqual(
        'protein'
      );
      expect(getSequenceSelectionMode(store.getState() as any)).toEqual(
        'manual'
      );
    });
  });

  describe('clearAllSequences', () => {
    it('clears sequences and sets the change type to automatic', () => {
      const { wrapper, store } = getWrapper({
        state: {
          sequences: [{ header: 'foo', value: 'MENLNMDL' }],
          settings: {
            ...initialBlastFormState.settings,
            sequenceSelectionMode: 'manual',
            sequenceType: 'protein'
          }
        }
      });
      const { result } = renderHook(() => useBlastInputSequences(), {
        wrapper
      });

      const { clearAllSequences } = result.current;
      act(() => {
        clearAllSequences();
      });

      expect(getSequences(store.getState() as any)).toEqual([]);
      expect(getSelectedSequenceType(store.getState() as any)).toEqual('dna');
      expect(getSequenceSelectionMode(store.getState() as any)).toEqual(
        'automatic'
      );
    });
  });
});
