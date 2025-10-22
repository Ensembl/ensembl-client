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

import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render, getNodeText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import random from 'lodash/random';
import times from 'lodash/times';

import mockBlastSettingsConfig from 'tests/fixtures/blast/blastSettingsConfig.json';

import blastFormReducer, {
  initialState as initialBlastFormState,
  type BlastFormState
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import BlastInputSequencesHeader, {
  type Props as BlastInputSequencesHeaderProps
} from './BlastInputSequencesHeader';

import { MAX_BLAST_SEQUENCE_COUNT } from 'src/content/app/tools/blast/utils/blastFormValidator';

vi.mock('src/content/app/tools/blast/state/blast-api/blastApiSlice', () => {
  return {
    useBlastConfigQuery: () => ({ data: mockBlastSettingsConfig })
  };
});

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

    it('adds 1 to the number of committed sequences if the user is typing in a new one', () => {
      const numberOfSequences = random(1, 30);
      const sequences = times(numberOfSequences, () => ({ value: 'ACTG' }));
      const { container } = renderComponent({
        state: {
          sequences,
          hasUncommittedSequence: true // flag that gets set when the user is typing a sequence but has not yet committed it
        }
      });
      const sequenceCounter = container.querySelector(
        '.header .sequenceCounter'
      );
      expect(getNodeText(sequenceCounter as HTMLElement)).toBe(
        `${numberOfSequences + 1}`
      );
    });
  });

  describe('button for adding sequences', () => {
    it('is disabled if the list of sequence input boxes ends in an empty one', () => {
      const { container } = renderComponent(); // initial state has shouldAppendEmptyInput set to true
      const addSequenceButton = container.querySelector(
        '.addSequence .plusButton'
      ) as HTMLButtonElement;

      expect(addSequenceButton.hasAttribute('disabled')).toBe(true);
    });

    it('is enabled if there are no empty sequence input boxes in the list', () => {
      const { container } = renderComponent({
        state: { shouldAppendEmptyInput: false }
      });
      const addSequenceButton = container.querySelector(
        '.addSequence .plusButton'
      ) as HTMLButtonElement;

      expect(addSequenceButton.hasAttribute('disabled')).toBe(false);
    });

    it('is enabled when the user starts typing in an empty sequence box', () => {
      const { container } = renderComponent({
        state: {
          shouldAppendEmptyInput: false,
          hasUncommittedSequence: true // flag that gets set when the user is typing a sequence but has not yet committed it
        }
      });
      const addSequenceButton = container.querySelector(
        '.addSequence .plusButton'
      ) as HTMLButtonElement;

      expect(addSequenceButton.hasAttribute('disabled')).toBe(false);
    });

    it('is disabled if the number of added sequences has reached the allowed maximum', () => {
      const sequences = times(MAX_BLAST_SEQUENCE_COUNT, () => ({
        value: 'ACTG'
      }));
      const { container } = renderComponent({
        state: {
          shouldAppendEmptyInput: false, // means that the button would be enabled if not for the sequence count
          sequences
        }
      });
      const addSequenceButton = container.querySelector(
        '.addSequence .plusButton'
      ) as HTMLButtonElement;

      expect(addSequenceButton.hasAttribute('disabled')).toBe(true);
    });

    it('toggles the flag for displaying an empty input box', async () => {
      const { container, store } = renderComponent({
        state: { shouldAppendEmptyInput: false }
      });
      const addSequenceButton = container.querySelector(
        '.addSequence .plusButton'
      );

      await userEvent.click(addSequenceButton as HTMLButtonElement);

      const updatedState = store.getState();

      expect(updatedState.blast.blastForm.shouldAppendEmptyInput).toBe(true);
    });
  });

  describe('clear all control', () => {
    it('clears all sequences', async () => {
      const sequences = times(10, () => ({ value: 'ACTG' }));
      const { container, store } = renderComponent({ state: { sequences } });
      const clearAll = container.querySelector('.clearAll');

      await userEvent.click(clearAll as HTMLElement);

      const updatedState = store.getState();

      expect(updatedState.blast.blastForm.sequences).toEqual([]);
    });
  });
});
