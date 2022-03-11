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

import React, { type ReactNode, createContext } from 'react';

import config from 'config';

import { useAppDispatch } from 'src/store';

import { submitBlast } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import { updateJob } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';
import {
  saveBlastSubmission,
  updateSavedBlastJob
} from 'src/content/app/tools/blast/services/blastStorageService';

import type { BlastSubmissionPayload } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import type { BlastSubmission } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

type Props = {
  children: ReactNode;
};

type ToolsContextType = {
  submitBlastForm: (
    payload: BlastSubmissionPayload
  ) => Promise<
    { submissionId: string; submission: BlastSubmission } | undefined
  >;
};

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

const ToolContextContainer = (props: Props) => {
  const dispatch = useAppDispatch();

  // is blast form submitting

  const submitBlastForm = async (payload: BlastSubmissionPayload) => {
    const dispatched = dispatch(submitBlast.initiate(payload));
    const response = await dispatched;
    dispatched.reset(); // prevent indefinite caching of subscription result

    if (!('data' in response)) {
      return;
    }

    const {
      data: { submissionId, submission }
    } = response;
    await saveBlastSubmission(submissionId, submission);

    onBlastSubmissionSuccess(response.data);

    return response.data;
  };

  const onBlastSubmissionSuccess = async ({
    submissionId,
    submission
  }: {
    submissionId: string;
    submission: BlastSubmission;
  }) => {
    const jobIds = submission.results.map(({ jobId }) => ({
      submissionId,
      jobId
    }));

    for await (const job of getFinishedJobs({ jobs: jobIds })) {
      const updatePayload = {
        submissionId,
        jobId: job.jobId,
        fragment: { status: job.status }
      };
      dispatch(updateJob(updatePayload));
      await updateSavedBlastJob(updatePayload);
    }
  };

  return (
    <ToolsContext.Provider value={{ submitBlastForm }}>
      {props.children}
    </ToolsContext.Provider>
  );
};

type CheckStatusesParams = {
  jobs: Array<{ submissionId: string; jobId: string }>;
};

async function* getFinishedJobs({ jobs }: CheckStatusesParams) {
  while (jobs.length) {
    for (const job of [...jobs]) {
      const { status } = await fetchJobStatus(job.jobId);

      if (['FINISHED', 'FAILURE'].includes(status)) {
        jobs = jobs.filter(({ jobId }) => jobId !== job.jobId);
        yield { ...job, status };
      }
    }

    await timer(5000);
  }
}

const timer = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const fetchJobStatus = async (jobId: string) => {
  const endpointURL = `${config.toolsApiBaseUrl}/blast/jobs/status/${jobId}`;

  const response = await fetch(endpointURL, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error();
  }
};

export { ToolsContext };
export default ToolContextContainer;
