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
import type { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { BlastSubmission } from '../blast-results/blastResultsSlice';
import type { BlastJobResultResponse } from 'src/content/app/tools/blast/types/blastJob';
import type { SubmittedSequence } from 'src/content/app/tools/blast/types/blastSequence';

export type BlastSubmissionPayload = {
  species: Species[];
  sequences: SubmittedSequence[];
  preset: string;
  submissionName: string;
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
        // backend tools API accepts sequences as FASTA strings
        const querySequences = payload.sequences.map((item) => ({
          id: item.id,
          value: toFasta({ header: item.header, value: item.value })
        }));

        const body = {
          genome_ids: payload.species.map(({ genome_id }) => genome_id),
          query_sequences: querySequences,
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
              preset: payload.preset,
              submissionName: payload.submissionName,
              parameters: payload.parameters
            },
            results,
            submittedAt: Date.now(),
            seen: false
          } as BlastSubmission
        };
      }
    }),
    fetchAllBlastJobs: builder.query<BlastJobResultResponse[], string[]>({
      queryFn: async (jobIds, _queryApi, _extraOptions, baseQuery) => {
        try {
          const format = 'json';
          const results = await commonFetchAllBlastJobs(
            jobIds,
            format,
            baseQuery
          );
          return {
            data: results.map((result) => result.data as BlastJobResultResponse)
          };
        } catch {
          return {
            error: 'Some BLAST jobs failed to load' as any // RTK is happy with the FetchBaseQueryError type that has the following shape: { status: number, statusMessage: string, data: string }
          };
        }
      }
    }),
    fetchAllBlastRawResults: builder.query<{ result: string }[], string[]>({
      queryFn: async (jobIds, _queryApi, _extraOptions, baseQuery) => {
        try {
          const format = 'raw';
          const results = await commonFetchAllBlastJobs(
            jobIds,
            format,
            baseQuery
          );
          return {
            data: results.map((result) => result.data as { result: string })
          };
        } catch {
          return {
            error: 'Some BLAST jobs failed to load' as any // RTK is happy with the FetchBaseQueryError type that has the following shape: { status: number, statusMessage: string, data: string }
          };
        }
      }
    })
  })
});

const buildBlastJobResultUrl = (jobId: string, format: string) => {
  if (format === 'raw') {
    format = 'out'; // "out" is the actual url parameter used by EBI BLAST; while "raw" describes more precisely what this format represents
  }

  return `${config.toolsApiBaseUrl}/blast/jobs/result/${jobId}/${format}`;
};

// type of baseQuery copied from redux-toolkit type definitions
const commonFetchAllBlastJobs = <BaseQuery extends BaseQueryFn>(
  jobIds: string[],
  format: string,
  baseQuery: (arg: Parameters<BaseQuery>[0]) => ReturnType<BaseQuery>
) => {
  // there can be a lot of ids here; let's hope the BLAST api isn't rate-limiting
  const requestPromises = jobIds
    .map((jobId) => buildBlastJobResultUrl(jobId, format))
    .map((url) =>
      Promise.resolve(baseQuery(url)).then((result) => {
        if (result.error) {
          throw result.error;
        } else {
          return result;
        }
      })
    );

  return Promise.all(requestPromises);
};

export const {
  useBlastConfigQuery,
  useSubmitBlastMutation,
  useFetchAllBlastJobsQuery
} = blastApiSlice;
export const { submitBlast, fetchAllBlastJobs, fetchAllBlastRawResults } =
  blastApiSlice.endpoints;
