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

describe('useBlastSettings', () => {
  it('changes the relevant program and database when the sequence type is changed', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(() => useBlastSettings(), { wrapper });

    const { updateSequenceType } = result.current;

    act(() => {
      updateSequenceType('protein');
    });

    expect(getBlastSearchParameters(store.getState() as any).database).toEqual(
      'pep'
    );
    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastp');
  });

  it('sets the relevant program when the database is manually changed', () => {
    const { wrapper, store } = getWrapper();
    const { result } = renderHook(() => useBlastSettings(), { wrapper });

    const { onDatabaseChange } = result.current;

    act(() => {
      onDatabaseChange('pep');
    });

    expect(getSelectedBlastProgram(store.getState() as any)).toEqual('blastx');
  });
});
