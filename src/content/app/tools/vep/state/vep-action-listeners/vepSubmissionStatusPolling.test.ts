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

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { updateSubmission } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import VepSubmissionStatusPolling, {
  POLLING_INTERVAL
} from 'src/content/app/tools/vep/state/vep-action-listeners/vepSubmissionStatusPolling';

jest.mock('config', () => ({
  toolsApiBaseUrl: 'http://tools-api-url' // need to provide absolute urls to the fetch running in Node
}));
jest.mock(
  'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice',
  () => ({
    updateSubmission: jest.fn()
  })
);

const server = setupServer();

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

describe('getSubmissionStatusFetcher', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    server.resetHandlers(); // clear request handlers added to mock service worker during the test
  });

  it('polls for status of a single submission', async () => {
    const submissionId = 'my-submission';
    const maxStatusPollCount = 3;
    let actualStatusPollCount = 0;

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

    const vepStatusPolling = new VepSubmissionStatusPolling();
    vepStatusPolling.enqueueSubmission({
      submission: { id: submissionId, status: 'SUBMITTED' },
      dispatch: jest.fn()
    });

    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL * 4);
    jest.useRealTimers();

    expect(actualStatusPollCount).toBe(maxStatusPollCount);
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId,
      fragment: { status: 'SUCCEEDED' }
    });
  });

  it('polls for statuses of multiple submissions', async () => {
    // Arrange
    const submission1 = {
      id: 'submission-1',
      requestsToCompletion: 3,
      requestsSent: 0
    };
    const submission2 = {
      id: 'submission-2',
      requestsToCompletion: 2,
      requestsSent: 0
    };
    server.use(
      http.get(
        'http://tools-api-url/vep/submissions/:submissionId/status',
        async ({ params }) => {
          const { submissionId } = params;
          const submission = [submission1, submission2].find(
            (submission) => submission.id === submissionId
          );
          if (!submission) {
            throw new Error('Received an unexpected submission id');
          }

          submission.requestsSent += 1;

          if (submission.requestsSent < submission.requestsToCompletion) {
            return HttpResponse.json({ status: 'RUNNING' });
          } else {
            return HttpResponse.json({ status: 'SUCCEEDED' });
          }
        }
      )
    );

    // Act
    const vepStatusPolling = new VepSubmissionStatusPolling();
    vepStatusPolling.enqueueSubmission({
      submission: { id: submission1.id, status: 'SUBMITTED' },
      dispatch: jest.fn()
    });
    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL / 2); // add an artificial delay before enqueueing a new submission
    vepStatusPolling.enqueueSubmission({
      submission: { id: submission2.id, status: 'SUBMITTED' },
      dispatch: jest.fn()
    });

    // Assert
    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL / 2); // to compensate for the delay above, this adds up to one polling interval
    expect(submission1.requestsSent).toBe(1);
    expect(submission2.requestsSent).toBe(0);

    // make sure that the second submission isn't being polled at its own rhythm
    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL / 2);
    expect(submission2.requestsSent).toBe(0);

    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL / 2); // to compensate for half a polling interval above
    expect(submission1.requestsSent).toBe(1);
    expect(submission2.requestsSent).toBe(1);

    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL);
    expect(submission1.requestsSent).toBe(2);
    expect(submission2.requestsSent).toBe(1);

    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL);
    expect(submission1.requestsSent).toBe(2);
    expect(submission2.requestsSent).toBe(2);

    await jest.runAllTimersAsync();
    expect(submission1.requestsSent).toBe(3);
    expect(submission2.requestsSent).toBe(2);
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId: submission2.id,
      fragment: { status: 'SUCCEEDED' }
    });
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId: submission1.id,
      fragment: { status: 'SUCCEEDED' }
    });
  });

  it('continues polling if server responds with a 500 error', async () => {
    // Arrange
    const submissionId = 'my-submission';
    let actualStatusPollCount = 0;

    server.use(
      http.get(
        'http://tools-api-url/vep/submissions/:submissionId/status',
        () => {
          actualStatusPollCount++;

          if (actualStatusPollCount === 1) {
            // return a 500 error
            return new HttpResponse(null, { status: 500 });
          } else {
            return HttpResponse.json({ status: 'SUCCEEDED' });
          }
        }
      )
    );

    // Act
    const vepStatusPolling = new VepSubmissionStatusPolling();
    vepStatusPolling.enqueueSubmission({
      submission: { id: submissionId, status: 'SUBMITTED' },
      dispatch: jest.fn()
    });

    // Assert
    await jest.runAllTimersAsync();

    expect(actualStatusPollCount).toBe(2);
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId,
      fragment: { status: 'SUCCEEDED' }
    });
  });

  it('fails submission if server responds with a 404 error', async () => {
    // Arrange
    const submissionId = 'my-submission';
    let actualStatusPollCount = 0;

    server.use(
      http.get(
        'http://tools-api-url/vep/submissions/:submissionId/status',
        () => {
          actualStatusPollCount++;

          if (actualStatusPollCount === 1) {
            // return a 404 error
            return new HttpResponse(null, { status: 404 });
          } else {
            // this should not be reached
            return HttpResponse.json({ status: 'SUCCEEDED' });
          }
        }
      )
    );

    // Act
    const vepStatusPolling = new VepSubmissionStatusPolling();
    vepStatusPolling.enqueueSubmission({
      submission: { id: submissionId, status: 'SUBMITTED' },
      dispatch: jest.fn()
    });

    // Assert
    await jest.runAllTimersAsync();

    expect(actualStatusPollCount).toBe(1);
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId,
      fragment: { status: 'FAILED' }
    });
  });

  it('checks statuses of all submissions without artificial delay when they are submitted as a batch', async () => {
    // Arrange
    const lateSubmissionId = 'late-submission-id';
    const maxStatusPollCount = 3;
    let actualStatusPollCount = 0;

    server.use(
      http.get(
        'http://tools-api-url/vep/submissions/:submissionId/status',
        async ({ params }) => {
          const { submissionId } = params;
          if (submissionId !== lateSubmissionId) {
            return HttpResponse.json({ status: 'SUCCEEDED' });
          }

          actualStatusPollCount++;

          if (actualStatusPollCount < maxStatusPollCount) {
            return HttpResponse.json({ status: 'RUNNING' });
          } else {
            return HttpResponse.json({ status: 'SUCCEEDED' });
          }
        }
      )
    );

    // Act
    const vepStatusPolling = new VepSubmissionStatusPolling();
    vepStatusPolling.processSubmissionsOnStartup({
      submissions: [
        { id: lateSubmissionId, status: 'SUBMITTED' },
        { id: 'foo', status: 'RUNNING' },
        { id: 'bar', status: 'RUNNING' }
      ],
      dispatch: jest.fn()
    });

    // Assert
    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL / 2); // precise time doesn't really matter; the initial requests were sent without delay
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId: 'foo',
      fragment: { status: 'SUCCEEDED' }
    });
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId: 'bar',
      fragment: { status: 'SUCCEEDED' }
    });
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId: lateSubmissionId,
      fragment: { status: 'RUNNING' }
    }); // the SUBMITTED status has changed to RUNNING

    await jest.runAllTimersAsync();
    expect(updateSubmission as any).toHaveBeenCalledWith({
      submissionId: lateSubmissionId,
      fragment: { status: 'SUCCEEDED' }
    });
  });

  it('stops polling when a submission is deleted', async () => {
    // Arrange
    const submission1 = {
      id: 'submission-1',
      requestsToCompletion: 3,
      requestsSent: 0
    };
    const submission2 = {
      id: 'submission-2',
      requestsToCompletion: 3,
      requestsSent: 0
    };
    server.use(
      http.get(
        'http://tools-api-url/vep/submissions/:submissionId/status',
        async ({ params }) => {
          const { submissionId } = params;
          const submission = [submission1, submission2].find(
            (submission) => submission.id === submissionId
          );
          if (!submission) {
            throw new Error('Received an unexpected submission id');
          }

          submission.requestsSent += 1;

          if (submission.requestsSent < submission.requestsToCompletion) {
            return HttpResponse.json({ status: 'RUNNING' });
          } else {
            return HttpResponse.json({ status: 'SUCCEEDED' });
          }
        }
      )
    );

    // Act
    const vepStatusPolling = new VepSubmissionStatusPolling();
    vepStatusPolling.enqueueSubmission({
      submission: { id: submission1.id, status: 'SUBMITTED' },
      dispatch: jest.fn()
    });
    vepStatusPolling.enqueueSubmission({
      submission: { id: submission2.id, status: 'SUBMITTED' },
      dispatch: jest.fn()
    });

    // Assert
    await jest.advanceTimersByTimeAsync(POLLING_INTERVAL * 2);
    expect(submission1.requestsSent).toBe(1);
    expect(submission2.requestsSent).toBe(1);

    vepStatusPolling.removeSubmission(submission1.id);

    await jest.runAllTimersAsync();
    expect(submission1.requestsSent).toBe(1); // The polling of the status of submission1 should have stopped
    expect(submission2.requestsSent).toBe(3);
  });
});
