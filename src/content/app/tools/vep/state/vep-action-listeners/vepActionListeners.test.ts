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
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { waitFor } from '@testing-library/react';

import createRootReducer from 'src/root/rootReducer';
import listenerMiddleware, { startAppListening } from 'src/listenerMiddleware';
import { startVepListeners } from 'src/content/app/tools/vep/state/vep-action-listeners/vepActionListeners';

import restApiSlice from 'src/shared/state/api-slices/restSlice';
import { vepFormSubmit } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import * as vepSubmissionsSlice from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import { createVepSubmissionPayload } from 'tests/fixtures/vep/vepSubmission';

jest.mock('config', () => ({
  toolsApiBaseUrl: 'http://tools-api-url' // need to provide absolute urls to the fetch running in Node
}));

jest.mock(
  'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice',
  () => ({
    changeSubmissionId: jest.fn().mockImplementation(() => ({ type: 'foo' })),
    updateSubmission: jest.fn().mockImplementation(() => ({ type: 'foo' }))
  })
);

const buildReduxStore = () => {
  const middleware = [restApiSlice.middleware];

  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(middleware)
  });

  startVepListeners(startAppListening);

  return {
    store,
    listenerMiddleware
  };
};

const serverSideSubmissionId = 'my-submission';

/**
 * NOTE:
 * Sending a POST request with formData to the mock server produces the following warning from Jest:
 * "A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them."
 */
const server = setupServer(
  // create a VEP submission
  http.post('http://tools-api-url/vep/submissions', async () => {
    return HttpResponse.json({ submission_id: serverSideSubmissionId });
  })
);

beforeAll(() => {
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('VEP action listeners', () => {
  let store: ReturnType<typeof buildReduxStore>['store'];
  let listenerMiddleware: any;

  beforeEach(() => {
    ({ store, listenerMiddleware } = buildReduxStore());
  });

  afterEach(() => {
    jest.clearAllMocks();
    listenerMiddleware.clearListeners();
  });

  describe('vepFormSuccessfulSubmissionListener', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('polls for submission status, and updates the submission', async () => {
      const maxStatusPollCount = 3;
      let actualStatusPollCount = 0;

      /**
       * NOTE:
       * Mocking fetch during VEP form submission, because sending a POST request with formData to the msw server
       * produces the following warning from Jest:
       * "A worker process has failed to exit gracefully and has been force exited.
       *  This is likely caused by tests leaking due to improper teardown.
       *  Try running with --detectOpenHandles to find leaks.
       *  Active timers can also cause this, ensure that .unref() was called on them."
       */
      const mockFetch = jest.spyOn(global, 'fetch').mockImplementation(() => {
        const content = JSON.stringify({
          submission_id: serverSideSubmissionId
        });
        const response = new Response(content, { status: 200 });
        return Promise.resolve(response);
      });

      // report submission as successful after 3 attempts
      server.use(
        http.get(
          'http://tools-api-url/vep/submissions/:submissionId/status',
          () => {
            actualStatusPollCount++;

            if (actualStatusPollCount < maxStatusPollCount) {
              return HttpResponse.json({ status: 'RUNNING' });
            } else {
              return HttpResponse.json({ status: 'SUCCEEDED' });
            }
          }
        )
      );

      const mockSubmission = createVepSubmissionPayload();

      await store.dispatch(
        vepFormSubmit.initiate(mockSubmission, { track: false })
      );
      mockFetch.mockRestore();

      // check that submission id is updated
      await waitFor(() => {
        const changeSubmissionIdArgs = (
          vepSubmissionsSlice.changeSubmissionId as any
        ).mock.calls[0][0];

        expect(vepSubmissionsSlice.changeSubmissionId).toHaveBeenCalled();
        expect(changeSubmissionIdArgs.oldId).toBe(mockSubmission.submission_id);
        expect(changeSubmissionIdArgs.newId).toBe(serverSideSubmissionId);
      });

      await jest.advanceTimersByTimeAsync(45_000);

      await waitFor(() => {
        expect(actualStatusPollCount).toBe(maxStatusPollCount);
      });

      await waitFor(() => {
        const updateSubmissionArgs = (
          vepSubmissionsSlice.updateSubmission as any
        ).mock.calls.at(-1)[0];

        expect(vepSubmissionsSlice.updateSubmission).toHaveBeenCalled();
        expect(updateSubmissionArgs.submissionId).toBe(serverSideSubmissionId);
        expect(updateSubmissionArgs.fragment.status).toBe('SUCCEEDED');
      });
    });
  });
});
