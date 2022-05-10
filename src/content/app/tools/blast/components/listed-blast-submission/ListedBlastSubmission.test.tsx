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
import { MemoryRouter } from 'react-router';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as blastStorageService from 'src/content/app/tools/blast/services/blastStorageService';

import ListedBlastSubmission, {
  type Props
} from 'src/content/app/tools/blast/components/listed-blast-submission/ListedBlastSubmission';

import blastFormReducer from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import blastResultsReducer, {
  type BlastResultsState
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import { createBlastSubmission } from 'tests/fixtures/blast/blastSubmission';

jest.mock('src/content/app/tools/blast/services/blastStorageService');

const defaultProps = {
  submission: createBlastSubmission()
};

const renderComponent = ({
  props,
  state
}: {
  props?: Partial<Props>;
  state?: Partial<BlastResultsState>;
}) => {
  const initialState = {
    blast: { blastResults: state ?? {} }
  };

  const mergedProps = {
    ...defaultProps,
    ...props
  };
  const rootReducer = combineReducers({
    blast: combineReducers({
      blastForm: blastFormReducer,
      blastResults: blastResultsReducer
    })
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState
  });

  const renderResult = render(
    <MemoryRouter>
      <Provider store={store}>
        <ListedBlastSubmission {...mergedProps} />
      </Provider>
    </MemoryRouter>
  );

  return {
    ...renderResult,
    store
  };
};

describe('BlastSubmissionHeader', () => {
  describe('rendering', () => {
    it('shows one sequence box if the submission contained a single sequence', () => {
      const submission = createBlastSubmission({
        options: { sequencesCount: 1 }
      });

      const { container } = renderComponent({
        props: { submission }
      });

      expect(container.querySelectorAll('.sequenceBox').length).toBe(1);
    });

    it('shows multiple sequence boxes if the submission contained multiple sequences', () => {
      const submission = createBlastSubmission({
        options: { sequencesCount: 5 }
      });

      const { container } = renderComponent({
        props: { submission }
      });

      expect(container.querySelectorAll('.sequenceBox').length).toBe(5);
    });

    it.todo('shows BLAST program');

    it.todo('shows submission id');

    it.todo('shows submission date');

    describe('while at least one job is running', () => {
      const submission = createBlastSubmission({
        options: { sequencesCount: 5 }
      });

      // make sure there is only one one running job
      submission.results.forEach((job, index) => {
        if (index === 0) {
          job.status = 'RUNNING';
        } else {
          job.status = 'FINISHED';
        }
      });

      it('does not show control buttons', () => {
        const { container } = renderComponent({
          props: { submission }
        });

        expect(container.querySelector('.deleteButton')).toBeFalsy();
      });
    });
  });

  describe('behaviour', () => {
    // define this beehaviour better
    it.todo('can fold jobs of a submission into a single box');

    // TODO: make sure that deleting a sequence stops polling for this sequence
    it('can delete a submission', async () => {
      const submission = createBlastSubmission();
      submission.results.forEach((job) => (job.status = 'FINISHED'));

      const { id: submissionId } = submission;
      const submissionInRedux = {
        [submissionId]: submission
      };
      const { container, store } = renderComponent({
        props: { submission },
        state: submissionInRedux
      });

      expect(store.getState().blast.blastResults[submissionId]).toBeTruthy();

      const deleteButton = container.querySelector(
        '.deleteButton'
      ) as HTMLButtonElement;

      await userEvent.click(deleteButton);

      expect(blastStorageService.deleteBlastSubmission).toHaveBeenCalledWith(
        submissionId
      );
      expect(
        store.getState().blast.blastResults[submissionId]
      ).not.toBeTruthy();
    });

    it('can populate BLAST form with submitted data', async () => {
      const submission = createBlastSubmission();
      const { container, store } = renderComponent({
        props: { submission }
      });

      const editButton = container.querySelector(
        '.editSubmission'
      ) as HTMLSpanElement;

      await userEvent.click(editButton);

      const blastFormReduxState = store.getState().blast.blastForm;

      expect(blastFormReduxState.sequences.length).toBeTruthy();
      expect(blastFormReduxState.selectedSpecies).toEqual(
        submission.submittedData.species
      );
      expect(
        Object.keys(blastFormReduxState.settings.parameters).length
      ).toBeGreaterThan(0);
    });

    it.todo('opens a page with detailed submission results');
  });
});
