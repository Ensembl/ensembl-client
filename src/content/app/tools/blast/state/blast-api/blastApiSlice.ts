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

import config from 'config';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { BlastSubmission } from '../blast-results/blastResultsSlice';
import { BlastApiResponse } from '../../types/blastApiResponse';

export type BlastSubmissionPayload = {
  species: Species[];
  sequences: { id: number; value: string }[];
  parameters: Record<string, string>;
};

export type BlastSubmissionResponse = {
  submission_id: string;
  jobs: Array<SubmittedJob | RejectedJob>;
};

export type SubmittedJob = {
  job_id: string;
  sequence_id: number;
  genome_id: string;
};

export type RejectedJob = {
  sequence_id: number;
  genome_id: string;
  error: string;
};

const blastApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    blastConfig: builder.query<BlastSettingsConfig, void>({
      query: () => ({
        url: `${config.toolsApiBaseUrl}/blast/config`
      }),
      keepUnusedDataFor: 60 * 60 // one hour
    }),
    submitBlast: builder.mutation<
      { submissionId: string; submission: BlastSubmission },
      BlastSubmissionPayload
    >({
      query(payload) {
        const body = {
          genome_ids: payload.species.map(({ genome_id }) => genome_id),
          query_sequences: payload.sequences,
          parameters: payload.parameters
        };
        return {
          url: `${config.toolsApiBaseUrl}/blast/job`,
          method: 'POST',
          body
        };
      },
      transformResponse(response: BlastSubmissionResponse, _, payload) {
        const { submission_id: submissionId, jobs } = response;
        // TODO: decide what to do when a submission returns error jobs
        const results = jobs
          .filter((job): job is SubmittedJob => 'job_id' in job)
          .map((job) => ({
            jobId: job.job_id,
            genomeId: job.genome_id,
            sequenceId: job.sequence_id,
            status: 'RUNNING',
            data: null
          }));

        return {
          submissionId,
          submission: {
            id: submissionId,
            submittedData: {
              species: payload.species,
              sequences: payload.sequences,
              parameters: payload.parameters
            },
            results,
            submittedAt: Date.now(),
            seen: false
          } as BlastSubmission
        };
      }
    }),
    fetchBlastSubmission: builder.query<BlastApiResponse, string>({
      query: (jobId) => ({
        url: `${config.toolsApiBaseUrl}/blast/jobs/result/${jobId}/json`
      })
    })
  })
});

export const {
  useBlastConfigQuery,
  useSubmitBlastMutation,
  useFetchBlastSubmissionQuery
} = blastApiSlice;
export const { submitBlast } = blastApiSlice.endpoints;
