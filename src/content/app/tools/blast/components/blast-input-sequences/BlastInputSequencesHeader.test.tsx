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
import random from 'lodash/random';
import times from 'lodash/times';

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
  describe('sequence counter', () => {
    it('starts with 0', () => {
      const { container } = renderComponent();
      const sequenceCounter = container.querySelector(
        '.header .sequenceCounter'
      );
      expect(getNodeText(sequenceCounter as HTMLElement)).toBe('0');
    });

    it('displays the number of added sequences', () => {
      const numberOfSequences = random(1, 30);
      const sequences = times(numberOfSequences, () => ({ value: 'ACTG' }));
      const { container } = renderComponent({ state: { sequences } });
      const sequenceCounter = container.querySelector(
        '.header .sequenceCounter'
      );
      expect(getNodeText(sequenceCounter as HTMLElement)).toBe(
        `${numberOfSequences}`
      );
    });
  });

  describe('button for adding sequences', () => {
    it('is disabled if a flag for appending an empty input box is set', () => {
      const { container } = renderComponent(); // initial state has shouldAppendEmptyInput set to true
      const addSequenceButton = container.querySelector(
        '.addSequence .plusButton'
      ) as HTMLButtonElement;

      expect(addSequenceButton.hasAttribute('disabled')).toBe(true);
    });

    it('toggles a flag for displaying an empty input box', () => {
      const { container, store } = renderComponent({
        state: { shouldAppendEmptyInput: false }
      });
      const addSequenceButton = container.querySelector(
        '.addSequence .plusButton'
      );

      userEvent.click(addSequenceButton as HTMLButtonElement);

      const updatedState = store.getState();

      expect(updatedState.blast.blastForm.shouldAppendEmptyInput).toBe(true);
    });
  });

  describe('clear all control', () => {
    it('clears all sequences', () => {
      const sequences = times(10, () => ({ value: 'ACTG' }));
      const { container, store } = renderComponent({ state: { sequences } });
      const clearAll = container.querySelector('.clearAll');

      userEvent.click(clearAll as HTMLElement);

      const updatedState = store.getState();

      expect(updatedState.blast.blastForm.sequences).toEqual([]);
    });
  });
});
