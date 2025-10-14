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

import { setTimeout } from 'timers/promises';
import { configureStore } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { createEpicMiddleware } from 'redux-observable';

import createRootReducer from 'src/root/rootReducer';
import * as blastEpics from 'src/content/app/tools/blast/state/epics/blastEpics';

import * as blastStorageService from 'src/content/app/tools/blast/services/blastStorageService';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { getBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import { submitBlast } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import {
  restoreBlastSubmissions,
  deleteBlastSubmission,
  type SuccessfulBlastSubmission,
  type FailedBlastSubmission
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import { createCancellableTestEpic } from 'tests/reduxObservableHelpers';

import {
  createBlastSubmission,
  createBlastJob
} from 'tests/fixtures/blast/blastSubmission';
import {
  createBlastSubmissionPayload,
  createBlastSubmissionResponse,
  createSuccessfulBlastJobInSubmissionResponse,
  createRunningJobStatusResponse,
  createFinishedJobStatusResponse,
  createFailedJobStatusResponse
} from './fixtures/blastSubmissionFixtures';

vi.mock('src/content/app/tools/blast/services/blastStorageService', () => ({
  saveBlastSubmission: vi.fn().mockImplementation(() => Promise.resolve()),
  updateSavedBlastJob: vi.fn().mockImplementation(() => Promise.resolve()),
  getAllBlastSubmissions: vi.fn(),
  deleteExpiredBlastSubmissions: vi.fn(),
  deleteBlastSubmission: vi.fn()
}));
vi.mock('config', () => ({
  default: {
    toolsApiBaseUrl: 'http://tools-api-url' // need to provide absolute urls to the fetch running in Node
  }
}));
vi.mock('../blastEpicConstants', () => ({
  POLLING_INTERVAL: 0
}));

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => ({
    default: () => vi.fn()
  })
);

const buildReduxStore = () => {
  const { epic, shutdownEpic } = createCancellableTestEpic(
    Object.values(blastEpics)
  );
  const epicMiddleware = createEpicMiddleware();
  const middleware = [epicMiddleware, restApiSlice.middleware];

  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(middleware)
  });

  epicMiddleware.run(epic as any);

  return {
    store,
    shutdownEpic
  };
};

const server = setupServer(
  // create a blast submission
  http.post('http://tools-api-url/blast/job', () => {
    return HttpResponse.json(successfulSubmission);
  })
);

const firstJobInResponse = createSuccessfulBlastJobInSubmissionResponse();
const secondJobInResponse = createSuccessfulBlastJobInSubmissionResponse();

const successfulSubmission = createBlastSubmissionResponse({
  jobs: [firstJobInResponse, secondJobInResponse]
});

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('blast epics', () => {
  let store: ReturnType<typeof buildReduxStore>['store'];
  let shutdownEpic: ReturnType<typeof buildReduxStore>['shutdownEpic'];

  beforeEach(() => {
    ({ store, shutdownEpic } = buildReduxStore());
  });

  afterEach(() => {
    shutdownEpic();
    vi.clearAllMocks();
  });

  describe('blastFormSubmissionEpic', () => {
    it('immediately saves submission to indexedDB', async () => {
      server.use(
        http.get('http://tools-api-url/blast/jobs/status/:jobId', () => {
          return HttpResponse.json(createFinishedJobStatusResponse());
        })
      );

      await store.dispatch(
        submitBlast.initiate(createBlastSubmissionPayload())
      );
      expect(blastStorageService.saveBlastSubmission).toHaveBeenCalled();
    });

    it('polls job status endpoint until the job either finishes or fails', async () => {
      const firstJobMaxPollCount = 3;
      const secondJobMaxPollCount = 2;
      let firstJobPollCount = 0;
      let secondJobPollCount = 0;

      // finish first job after 3 requests and fail the second job after 2 requests
      server.use(
        http.get(
          'http://tools-api-url/blast/jobs/status/:jobId',
          ({ params }) => {
            const { jobId } = params;
            if (jobId === firstJobInResponse.job_id) {
              firstJobPollCount++;
              return firstJobPollCount >= firstJobMaxPollCount
                ? HttpResponse.json(createFinishedJobStatusResponse())
                : HttpResponse.json(createRunningJobStatusResponse());
            } else {
              secondJobPollCount++;
              return secondJobPollCount >= secondJobMaxPollCount
                ? HttpResponse.json(createFailedJobStatusResponse())
                : HttpResponse.json(createRunningJobStatusResponse());
            }
          }
        )
      );

      await store.dispatch(
        submitBlast.initiate(createBlastSubmissionPayload())
      );

      // wait until job statuses in redux have been updated
      await waitFor(() => {
        const submissions = getBlastSubmissions(store.getState());
        const [, submission] = Object.entries(submissions)[0];
        expect(
          (submission as SuccessfulBlastSubmission).results.every((job) =>
            ['FINISHED', 'FAILURE'].includes(job.status)
          )
        ).toBe(true);
      });

      // check how many times endpoints were polled
      expect(firstJobPollCount).toBe(firstJobMaxPollCount);
      expect(secondJobPollCount).toBe(secondJobMaxPollCount);

      // check that the job status gets updated in indexedDB
      expect(blastStorageService.updateSavedBlastJob).toHaveBeenCalledWith({
        submissionId: successfulSubmission.submission_id,
        jobId: firstJobInResponse.job_id,
        fragment: { status: 'FINISHED' }
      });

      expect(blastStorageService.updateSavedBlastJob).toHaveBeenCalledWith({
        submissionId: successfulSubmission.submission_id,
        jobId: secondJobInResponse.job_id,
        fragment: { status: 'FAILURE' }
      });
    });

    it('is resistant to network errors', async () => {
      const jobMap: Record<string, boolean> = {};

      // respond with a 404 error or a network error the first time the request is received
      server.use(
        http.get(
          'http://tools-api-url/blast/jobs/status/:jobId',
          ({ params }) => {
            const jobId = params.jobId as string;
            if (!jobMap[jobId]) {
              jobMap[jobId] = true;
              if (jobId === firstJobInResponse.job_id) {
                return new HttpResponse(null, { status: 404 });
              } else {
                return HttpResponse.error();
              }
            } else {
              return HttpResponse.json(createFinishedJobStatusResponse());
            }
          }
        )
      );

      store.dispatch(submitBlast.initiate(createBlastSubmissionPayload()));

      // If job statuses in redux have been updated, the test has passed successfully
      await waitFor(() => {
        const submissions = getBlastSubmissions(store.getState());
        const [, submission] = Object.entries(submissions)[0];
        expect(
          (submission as SuccessfulBlastSubmission).results.every((job) =>
            ['FINISHED', 'FAILURE'].includes(job.status)
          )
        ).toBe(true);
      });
    });

    it('stops polling if a submission gets deleted', async () => {
      let pollCount = 0;

      // always respond with a running job status
      server.use(
        http.get('http://tools-api-url/blast/jobs/status/:jobId', () => {
          pollCount += 1;
          return HttpResponse.json(createRunningJobStatusResponse());
        })
      );

      store.dispatch(submitBlast.initiate(createBlastSubmissionPayload()));

      await waitFor(() => {
        expect(pollCount).toBeGreaterThan(3);
      });

      await store.dispatch(
        deleteBlastSubmission(successfulSubmission.submission_id)
      );
      const currentPollCount = pollCount; // we don't expect any more requests to be made

      await setTimeout(5); // even this tiny period is plentyof time for a couple of more requests to be made if polling hasn't stopped

      expect(currentPollCount).toBe(pollCount);
    });
  });

  describe('blastSubmissionsRestoreEpic', () => {
    const unfinishedJob = createBlastJob();
    const finishedJob = createBlastJob({ status: 'FINISHED' });
    const storedBlastSubmission = createBlastSubmission({
      fragment: {
        results: [unfinishedJob, finishedJob]
      }
    });

    vi.spyOn(blastStorageService, 'getAllBlastSubmissions').mockImplementation(
      async () => ({
        [successfulSubmission.submission_id]: storedBlastSubmission
      })
    );

    it('polls status of unfinished jobs', async () => {
      const maxJobPollCount = 3;
      let jobPollCount = 0;

      server.use(
        http.get('http://tools-api-url/blast/jobs/status/:jobId', () => {
          jobPollCount++;
          return jobPollCount === maxJobPollCount
            ? HttpResponse.json(createFinishedJobStatusResponse())
            : HttpResponse.json(createRunningJobStatusResponse());
        })
      );

      store.dispatch(restoreBlastSubmissions());

      // wait until job statuses in redux have been updated
      await waitFor(() => {
        const submissions = getBlastSubmissions(store.getState());
        const [, submission] = Object.entries(submissions)[0];
        expect(
          (submission as SuccessfulBlastSubmission).results.every((job) =>
            ['FINISHED', 'FAILURE'].includes(job.status)
          )
        ).toBe(true);
      });

      // check how many times endpoints were polled (notice: we expect that only one job was polled)
      expect(jobPollCount).toBe(maxJobPollCount);

      // check that the job status gets updated in indexedDB
      expect(blastStorageService.updateSavedBlastJob).toHaveBeenCalledWith({
        submissionId: successfulSubmission.submission_id,
        jobId: unfinishedJob.jobId,
        fragment: { status: 'FINISHED' }
      });
    });
  });

  describe('blastFailedSubmissionsEpic', () => {
    it('saves the failed submission to indexed db', async () => {
      // respond with a 404 error or a network error the first time the request is received
      server.use(
        http.post(
          'http://tools-api-url/blast/job',
          () => {
            // one-time override, to respond with an error to a BLAST submission
            return HttpResponse.json({ error: 'oops' }, { status: 422 });
          },
          { once: true }
        )
      );

      store.dispatch(submitBlast.initiate(createBlastSubmissionPayload()));

      await waitFor(() => {
        const submissions = getBlastSubmissions(store.getState());
        const [, submission] = Object.entries(submissions)[0];

        expect((submission as FailedBlastSubmission).error).toBeTruthy();

        expect(blastStorageService.saveBlastSubmission).toHaveBeenCalledWith(
          submission.id,
          submission
        );
      });
    });
  });
});
