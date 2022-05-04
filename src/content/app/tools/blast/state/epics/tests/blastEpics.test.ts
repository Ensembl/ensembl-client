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

import { configureStore } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createEpicMiddleware } from 'redux-observable';

import createRootReducer from 'src/root/rootReducer';
import * as blastEpics from 'src/content/app/tools/blast/state/epics/blastEpics';

import * as blastStorageService from 'src/content/app/tools/blast/services/blastStorageService';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { getBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';
import { submitBlast } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import { restoreBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import { createCancellableTestEpic } from 'tests/reduxObservableHelpers';

import {
  createBlastSubmission,
  createBlastSubmissionResponse,
  createSuccessfulBlastJobInSubmissionResponse,
  createRunningJobStatusResponse,
  createFinishedJobStatusResponse,
  createFailedJobStatusResponse,
  createStoredBlastSubmission,
  createStoredBlastJobResult
} from './fixtures/blastSubmissionFixtures';

jest.mock('src/content/app/tools/blast/services/blastStorageService', () => ({
  saveBlastSubmission: jest.fn().mockImplementation(() => Promise.resolve()),
  updateSavedBlastJob: jest.fn().mockImplementation(() => Promise.resolve()),
  getAllBlastSubmissions: jest.fn()
}));
jest.mock('config', () => ({
  toolsApiBaseUrl: 'http://tools-api-url' // need to provide absolute urls to the fetch running in Node
}));
jest.mock('../blastEpicConstants', () => ({
  POLLING_INTERVAL: 0
}));

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
  rest.post('http://tools-api-url/blast/job', (_, res, ctx) => {
    return res(ctx.json(successfulSubmission));
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
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url.href}`;
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
    jest.clearAllMocks();
  });

  describe('blastFormSubmissionEpic', () => {
    it('immediately saves submission to indexedDB', async () => {
      server.use(
        rest.get(
          'http://tools-api-url/blast/jobs/status/:jobId',
          (_, res, ctx) => {
            return res(ctx.json(createFinishedJobStatusResponse()));
          }
        )
      );

      await store.dispatch(submitBlast.initiate(createBlastSubmission()));
      expect(blastStorageService.saveBlastSubmission).toHaveBeenCalled();
    });

    it('polls job status endpoint until the job either finishes or fails', async () => {
      const firstJobMaxPollCount = 3;
      const secondJobMaxPollCount = 2;
      let firstJobPollCount = 0;
      let secondJobPollCount = 0;

      // finish first job after 3 requests and fail the second job after 2 requests
      server.use(
        rest.get(
          'http://tools-api-url/blast/jobs/status/:jobId',
          (req, res, ctx) => {
            const { jobId } = req.params;
            if (jobId === firstJobInResponse.job_id) {
              firstJobPollCount++;
              return firstJobPollCount >= firstJobMaxPollCount
                ? res(ctx.json(createFinishedJobStatusResponse()))
                : res(ctx.json(createRunningJobStatusResponse()));
            } else {
              secondJobPollCount++;
              return secondJobPollCount >= secondJobMaxPollCount
                ? res(ctx.json(createFailedJobStatusResponse()))
                : res(ctx.json(createRunningJobStatusResponse()));
            }
          }
        )
      );

      await store.dispatch(submitBlast.initiate(createBlastSubmission()));

      // wait until job statuses in redux have been updated
      await waitFor(() => {
        const submissions = getBlastSubmissions(store.getState());
        const [, submission] = Object.entries(submissions)[0];
        expect(
          submission.results.every((job) =>
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
        rest.get(
          'http://tools-api-url/blast/jobs/status/:jobId',
          (req, res, ctx) => {
            const jobId = req.params.jobId as string;
            if (!jobMap[jobId]) {
              jobMap[jobId] = true;
              if (jobId === firstJobInResponse.job_id) {
                return res(ctx.status(404));
              } else {
                return res.networkError('Failed to connect');
              }
            } else {
              return res(ctx.json(createFinishedJobStatusResponse()));
            }
          }
        )
      );

      store.dispatch(submitBlast.initiate(createBlastSubmission()));

      // If job statuses in redux have been updated, the test has passed successfully
      await waitFor(() => {
        const submissions = getBlastSubmissions(store.getState());
        const [, submission] = Object.entries(submissions)[0];
        expect(
          submission.results.every((job) =>
            ['FINISHED', 'FAILURE'].includes(job.status)
          )
        ).toBe(true);
      });
    });
  });

  describe('blastSubmissionsRestoreEpic', () => {
    const unfinishedJob = createStoredBlastJobResult();
    const finishedJob = createStoredBlastJobResult({ status: 'FINISHED' });
    const storedBlastSubmission = createStoredBlastSubmission({
      results: [unfinishedJob, finishedJob]
    });

    jest
      .spyOn(blastStorageService, 'getAllBlastSubmissions')
      .mockImplementation(async () => ({
        [successfulSubmission.submission_id]: storedBlastSubmission
      }));

    it('polls status of unfinished jobs', async () => {
      const maxJobPollCount = 3;
      let jobPollCount = 0;

      server.use(
        rest.get(
          'http://tools-api-url/blast/jobs/status/:jobId',
          (_, res, ctx) => {
            jobPollCount++;
            return jobPollCount === maxJobPollCount
              ? res(ctx.json(createFinishedJobStatusResponse()))
              : res(ctx.json(createRunningJobStatusResponse()));
          }
        )
      );

      store.dispatch(restoreBlastSubmissions());

      // wait until job statuses in redux have been updated
      await waitFor(() => {
        const submissions = getBlastSubmissions(store.getState());
        const [, submission] = Object.entries(submissions)[0];
        expect(
          submission.results.every((job) =>
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
});
