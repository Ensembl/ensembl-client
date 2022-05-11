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
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { renderHook, act } from '@testing-library/react';

import mockBlastSettingsConfig from 'tests/fixtures/blast/blastSettingsConfig.json';
import useBlastSettings from './useBlastSettings';
import useBlastInputSequences from '../blast-input-sequences/useBlastInputSequences';

import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { BlastSettingsConfig } from '../../types/blastSettings';
import { BlastConfigContext } from '../../views/blast-form/BlastForm';
import {
  getBlastSearchParameters,
  getSelectedBlastProgram
} from '../../state/blast-form/blastFormSelectors';

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

const nucleotideSequence =
  'CGGACCAGACGGACACAGGGAGAAGCTAGTTTCTTTCATGTGATTGANATNATGACTCTACTCCTAAAAG';
const proteinSequence =
  'MENLNMDLLYMAAAVMMGLAAIGAAIGIGILGGKFLEGAARQPDLIPLLRTQFFIVMGLVDAIPMIAVGL';

describe('useBlastSettings', () => {
  it('sets the relevant program when the database is manually changed', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(() => useBlastSettings(), { wrapper });

    const { onDatabaseChange } = result.current;

    act(() => {
      onDatabaseChange('pep');
    });

    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastx');
  });

  it('changes the relevant program and database when the sequence type is changed', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(() => useBlastSettings(), { wrapper });

    const { onDatabaseChange, updateSequenceType } = result.current;

    act(() => {
      onDatabaseChange('cdna');
    });
    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastn');

    act(() => {
      updateSequenceType('protein');
    });

    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastp');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'pep'
    );
  });

  it('does not override manually selected database and program on protein sequence input', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(
      () => ({ ...useBlastSettings(), ...useBlastInputSequences() }),
      { wrapper }
    );

    const { onDatabaseChange, onBlastProgramChange, updateSequences } =
      result.current;

    act(() => {
      onDatabaseChange('cdna');
      // Manually change the program
      onBlastProgramChange('blastx');
    });
    act(() => {
      updateSequences([{ value: proteinSequence }]);
    });

    // Program and database should remain the same after inputting a protein sequence
    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastx');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'cdna'
    );
  });

  it('does not override manually selected database and program on nucleotide sequence input', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(
      () => ({ ...useBlastSettings(), ...useBlastInputSequences() }),
      { wrapper }
    );

    const { onDatabaseChange, updateSequenceType, updateSequences } =
      result.current;

    act(() => {
      onDatabaseChange('cdna');
      updateSequenceType('protein');
    });

    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastp');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'pep'
    );

    act(() => {
      updateSequences([{ value: nucleotideSequence }]);
    });

    // Program and database should remain the same after inputting a nucleotide sequence
    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastp');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'pep'
    );
  });

  it('overrides guessed nucleotide database and program when sequence type is changed manually', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(
      () => ({ ...useBlastSettings(), ...useBlastInputSequences() }),
      { wrapper }
    );

    const { updateSequenceType, updateSequences } = result.current;

    act(() => {
      // Input nucleotide sequence
      updateSequences([{ value: nucleotideSequence }]);

      // Manually select protein sequence type
      updateSequenceType('protein');
    });

    // Program and database should change according to the sequence type selected
    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastp');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'pep'
    );
  });

  it('overrides guessed protein database and program when sequence type is changed manually', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(
      () => ({ ...useBlastSettings(), ...useBlastInputSequences() }),
      { wrapper }
    );

    const { updateSequenceType, updateSequences, onDatabaseChange } =
      result.current;

    act(() => {
      // Input protein sequence
      updateSequences([{ value: proteinSequence }]);
    });

    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastp');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'pep'
    );

    act(() => {
      onDatabaseChange('cdna');
    });

    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('tblastn');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'cdna'
    );

    act(() => {
      // Manually select protein sequence type
      updateSequenceType('dna');
    });

    // Program and database should change according to the sequence type selected
    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastn');
    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'dna'
    );
  });
});
