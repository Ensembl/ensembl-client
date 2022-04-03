import faker from 'faker';
import times from 'lodash/times';

import type { BlastSubmissionResponse } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import type { JobStatus } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

export const createBlastSubmissionResponse = (fragment: Partial<BlastSubmissionResponse> = {}): BlastSubmissionResponse => {
  const submission = {
    submissionId: faker.datatype.uuid(),
    jobs: times(3, createSuccessfulBlastJobInSubmissionResponse)
  };

  return {
    ...submission,
    ...fragment
  };
};

export const createSuccessfulBlastJobInSubmissionResponse = () => {
  return ({
    jobId: faker.datatype.uuid()
  });
};

export const createRunningJobStatusResponse = (): { status: JobStatus } => ({
  status: 'RUNNING'
});

export const createFinishedJobStatusResponse = (): { status: JobStatus } => ({
  status: 'FINISHED'
});

export const createFailedJobStatusResponse = (): { status: JobStatus } => ({
  status: 'FAILURE'
});
