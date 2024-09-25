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
import { MemoryRouter } from 'react-router';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as blastStorageService from 'src/content/app/tools/blast/services/blastStorageService';
import { BLAST_RESULTS_AVAILABILITY_DURATION } from 'src/content/app/tools/blast/services/blastStorageServiceConstants';
import { UNAVAILABLE_RESULTS_WARNING } from 'src/content/app/tools/shared/constants/displayedMessages';

import ListedBlastSubmission, {
  type Props as ListedBlastSubmissionProps
} from 'src/content/app/tools/blast/components/listed-blast-submission/ListedBlastSubmission';

import blastFormReducer from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import blastGeneralReducer from 'src/content/app/tools/blast/state/general/blastGeneralSlice';
import blastResultsReducer, {
  initialBlastResultsState,
  type BlastResultsState
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import { createBlastSubmission } from 'tests/fixtures/blast/blastSubmission';
import { getFormattedDateTime } from 'src/shared/helpers/formatters/dateFormatter';

jest.mock('src/content/app/tools/blast/services/blastStorageService');

const defaultProps = {
  submission: createBlastSubmission()
};

const renderComponent = ({
  props,
  state
}: {
  props?: Partial<ListedBlastSubmissionProps>;
  state?: Partial<BlastResultsState>;
}) => {
  const initialState = {
    blast: {
      blastResults: {
        ...initialBlastResultsState,
        ...state
      }
    }
  };

  const mergedProps = {
    ...defaultProps,
    ...props
  };
  const rootReducer = combineReducers({
    blast: combineReducers({
      blastForm: blastFormReducer,
      blastGeneral: blastGeneralReducer,
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
      expect(container.querySelectorAll('.showHide').length).toBe(0);
    });

    it('shows multiple sequence boxes if the submission contained multiple sequences', async () => {
      const submission = createBlastSubmission({
        options: { sequencesCount: 5 }
      });

      const { container } = renderComponent({
        props: { submission }
      });

      expect(container.querySelectorAll('.sequenceBox').length).toBe(5);
    });

    it('shows submission date', () => {
      const submission = createBlastSubmission();

      const { container } = renderComponent({
        props: { submission }
      });

      const dateTimeElement = container.querySelector(
        '.timeStamp'
      ) as HTMLElement;
      const timeStampText =
        dateTimeElement?.querySelectorAll('span')[0].textContent;

      const expectedTimeStamp = getFormattedDateTime(
        new Date(submission.submittedAt)
      );

      expect(timeStampText).toContain(expectedTimeStamp);
    });

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

      it('disables control buttons, except for the delete button', () => {
        const { container } = renderComponent({
          props: { submission }
        });
        const deleteButton = container.querySelector(
          '.deleteButton'
        ) as HTMLElement;
        const downloadButton = container.querySelector(
          '.downloadButton'
        ) as HTMLElement;

        expect(deleteButton.hasAttribute('disabled')).toBe(false);
        expect(downloadButton.hasAttribute('disabled')).toBe(true);
      });

      it('has a disabled link to submission results page', () => {
        const { container } = renderComponent({
          props: { submission }
        });

        const buttonLink = container.querySelector(
          '.buttonLink'
        ) as HTMLElement;
        expect(buttonLink).toBeTruthy();
        expect(buttonLink.classList.contains('buttonLinkDisabled')).toBe(true);
        expect(buttonLink.tagName.toLowerCase()).toBe('span');
      });
    });

    describe('when all jobs are finished', () => {
      const submission = createBlastSubmission({
        options: { sequencesCount: 5 }
      });

      submission.results.forEach((job) => {
        job.status = 'FINISHED';
      });

      it('activates link to submission results', () => {
        const { container } = renderComponent({
          props: { submission }
        });

        const buttonLink = container.querySelector(
          '.buttonLink'
        ) as HTMLElement;
        expect(buttonLink).toBeTruthy();
        expect(buttonLink.tagName.toLowerCase()).toBe('a');
        expect(buttonLink.getAttribute('href')).toBe(
          `/blast/submissions/${submission.id}`
        );
      });
    });

    describe('when the submission is expected to no longer have accessible results', () => {
      const submission = createBlastSubmission();
      submission.submittedAt =
        Date.now() - BLAST_RESULTS_AVAILABILITY_DURATION - 1000;

      it('shows a warning text', () => {
        const { container, getByText } = renderComponent({
          props: { submission }
        });
        const deleteButton = container.querySelector('.deleteButton');
        const downloadButton = container.querySelector('.downloadButton');
        const buttonLink = container.querySelector('.buttonLink');

        expect(buttonLink).toBeFalsy();
        expect(downloadButton).toBeFalsy();
        expect(deleteButton).toBeTruthy();

        expect(getByText(UNAVAILABLE_RESULTS_WARNING)).toBeTruthy();
      });
    });
  });

  describe('behaviour', () => {
    // define this behaviour better
    it('expands jobs of a submission by default', () => {
      const submission = createBlastSubmission({
        options: { sequencesCount: 5 }
      });

      const { container } = renderComponent({
        props: { submission }
      });

      expect(container.querySelectorAll('.sequenceBox').length).toBe(5);
    });

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
        state: { submissions: submissionInRedux }
      });

      expect(
        store.getState().blast.blastResults.submissions[submissionId]
      ).toBeTruthy();

      const deleteButton = container.querySelector(
        '.deleteButton'
      ) as HTMLButtonElement;

      await userEvent.click(deleteButton);

      const confirmDeletionButton = container.querySelector(
        '.deleteMessageContainer .primaryButton'
      ) as HTMLButtonElement;
      await userEvent.click(confirmDeletionButton);

      expect(blastStorageService.deleteBlastSubmission).toHaveBeenCalledWith(
        submissionId
      );
      expect(
        store.getState().blast.blastResults.submissions[submissionId]
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
  });
});
