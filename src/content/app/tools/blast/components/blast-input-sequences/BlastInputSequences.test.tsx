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

import mockBlastSettingsConfig from 'tests/fixtures/blast/blastSettingsConfig.json';

import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import BlastInputSequences from './BlastInputSequences';

jest.mock('src/content/app/tools/blast/state/blast-api/blastApiSlice', () => {
  return {
    useBlastConfigQuery: () => ({ data: mockBlastSettingsConfig })
  };
});

const renderComponent = (
  { state }: { state?: Partial<BlastFormState> } = { state: {} }
) => {
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
      <BlastInputSequences />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('<BlastInputSequences />', () => {
  describe('initial state', () => {
    it('shows a single empty input', () => {
      const { container } = renderComponent();
      const inputBoxes = container.querySelectorAll('.inputSequenceBox');
      expect(inputBoxes.length).toBe(1);
    });
  });

  describe('adding sequences', () => {
    // The tests in this section check how BlastInputSequences will update the redux state
    // when new sequences are added

    it('adds a single sequence', () => {
      const { container, store } = renderComponent();
      const textarea = container.querySelector(
        '.inputSequenceBox textarea'
      ) as HTMLTextAreaElement;
      const inputText = [
        '>my test sequence',
        'ACTG',
        'GATC' // adding a piece of sequence on another line to make sure that it will be joined to the previous line
      ].join('{enter}');

      userEvent.type(textarea, inputText);
      textarea.blur();

      const reduxState = store.getState();

      expect(reduxState.blast.blastForm.sequences).toEqual([
        {
          header: 'my test sequence',
          value: 'ACTGGATC'
        }
      ]);
    });

    it('adds multiple sequences', () => {
      const { container, store } = renderComponent();
      const textarea = container.querySelector(
        '.inputSequenceBox textarea'
      ) as HTMLTextAreaElement;
      const inputText = [
        '>first test sequence',
        'ACTG',
        '>second test sequence',
        'GATC'
      ].join('{enter}');

      userEvent.type(textarea, inputText);
      textarea.blur();

      const reduxState = store.getState();

      const expectedSequences = [
        {
          header: 'first test sequence',
          value: 'ACTG'
        },
        {
          header: 'second test sequence',
          value: 'GATC'
        }
      ];

      expect(reduxState.blast.blastForm.sequences).toEqual(expectedSequences);
    });
  });

  describe('with added sequences', () => {
    const sequence1 = { value: 'ACTG' };
    const sequence2 = { value: 'GATC' };
    const sequence3 = { value: 'TCAG' };
    const sequences = [sequence1, sequence2, sequence3];

    describe('with an empty input', () => {
      it('renders filled input boxes and an empty input', () => {
        const { container } = renderComponent({
          state: {
            sequences,
            shouldAppendEmptyInput: true
          }
        });
        const [...inputBoxes] = container.querySelectorAll('.inputSequenceBox');
        expect(inputBoxes.length).toBe(sequences.length + 1);

        sequences.forEach((sequence, index) => {
          const inputBox = inputBoxes[index];
          const textarea = inputBox.querySelector(
            'textarea'
          ) as HTMLTextAreaElement;
          expect(textarea.value).toBe(sequence.value);
        });

        const lastInput = inputBoxes[inputBoxes.length - 1].querySelector(
          'textarea'
        ) as HTMLTextAreaElement;
        expect(lastInput.value).toBe('');
      });
    });

    describe('without an empty input', () => {
      it('renders filled input boxes', () => {
        const { container } = renderComponent({
          state: {
            sequences,
            shouldAppendEmptyInput: false
          }
        });
        const [...inputBoxes] = container.querySelectorAll('.inputSequenceBox');
        expect(inputBoxes.length).toBe(sequences.length);

        sequences.forEach((sequence, index) => {
          const inputBox = inputBoxes[index];
          const textarea = inputBox.querySelector(
            'textarea'
          ) as HTMLTextAreaElement;
          expect(textarea.value).toBe(sequence.value);
        });
      });
    });
  });
});
