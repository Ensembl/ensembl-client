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

import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import BlastInputSequencesHeader, {
  type Props as BlastInputSequencesHeaderProps
} from './BlastInputSequencesHeader';

const defaultProps: BlastInputSequencesHeaderProps = {
  compact: false
};

const renderComponent = (
  {
    props,
    state
  }: {
    state?: Partial<BlastFormState>;
    props?: BlastInputSequencesHeaderProps;
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
      <BlastInputSequencesHeader {...props} />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('BlastInputSequencesHeader', () => {
  it('shows sequence counter, starting with 0', () => {
    const { container } = renderComponent();
    const sequenceCounter = container.querySelector('.header .sequenceCounter');
    expect(getNodeText(sequenceCounter as HTMLElement)).toBe('0');
  });

  it('has a control to clear all sequences', () => {
    const { container } = renderComponent();
    const clearAll = container.querySelector('.header .clearAll');
    expect(clearAll).toBeTruthy();
  });
});
