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

import { nanoid } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import config from 'config';
import type { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import type { BlastSettingsConfig } from 'src/content/app/tools/blast/types/blastSettings';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type {
  SuccessfulBlastSubmission,
  FailedBlastSubmission
} from '../blast-results/blastResultsSlice';
import type { BlastJobResultResponse } from 'src/content/app/tools/blast/types/blastJob';
import type { SubmittedSequence } from 'src/content/app/tools/blast/types/blastSequence';

import mockConfig from 'tests/fixtures/blast/blastSettingsConfig.json';

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

export type BlastSubmissionErrorResponse = {
  submission_id?: string; // if the request has reached the backend, and if the backend hasn't errored while running code, there will be a submission id, even if the submission is rejected as invalid
  error: string;
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
      queryFn: () => {
        return Promise.resolve({
          data: mockConfig as unknown as BlastSettingsConfig
        });
      },
      // query: () => ({
      //   url: `${config.toolsApiBaseUrl}/blast/config`
      // }),
      keepUnusedDataFor: 60 * 60 // one hour
    }),
    submitBlast: builder.mutation<
      { submissionId: string; submission: SuccessfulBlastSubmission },
      BlastSubmissionPayload
    >({
      async queryFn(payload, queryApi, _, baseQuery) {
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

        try {
          const { data: responseData, error: responseError } = await baseQuery({
            url: `${config.toolsApiBaseUrl}/blast/job`,
            method: 'POST',
            body
          });
          if (!responseData) {
            throw responseError ?? { error: 'Blast submission failed' };
          } else if (
            onlyContainsRejectedJobs(responseData as BlastSubmissionResponse)
          ) {
            return {
              error: {
                status: 422,
                data: prepareFailedSubmissionPayload(
                  payload,
                  responseData as BlastSubmissionResponse
                )
              }
            };
          } else {
            return {
              data: prepareSuccessfulSubmissionPayload(
                payload,
                responseData as BlastSubmissionResponse
              )
            };
          }
        } catch (error: unknown) {
          // if tools api rejects the submission with a validation error, the json payload of that error will be part of error.data
          const errorData = (error as FetchBaseQueryError)?.data ?? {};
          const failedSubmission = prepareFailedSubmissionPayload(
            payload,
            errorData as BlastSubmissionErrorResponse
          );
          return { error: { status: 422, data: failedSubmission } };
        }
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

const onlyContainsRejectedJobs = (response: BlastSubmissionResponse) => {
  return response.jobs.every((job) => 'error' in job);
};

const prepareSuccessfulSubmissionPayload = (
  payload: BlastSubmissionPayload,
  responseData: BlastSubmissionResponse
) => {
  const { submission_id: submissionId, jobs } = responseData;
  const results = jobs.map((job) => {
    return {
      jobId: 'job_id' in job ? job.job_id : nanoid(),
      genomeId: job.genome_id,
      sequenceId: job.sequence_id,
      status: 'error' in job ? 'FAILURE' : 'RUNNING',
      data: null
    };
  });

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
    } as SuccessfulBlastSubmission
  };
};

const prepareFailedSubmissionPayload = (
  payload: BlastSubmissionPayload,
  responseData: BlastSubmissionResponse | BlastSubmissionErrorResponse
) => {
  let submissionId: string;
  let hasServerGeneratedId = false;
  let errorMessage = 'Blast submission failed';

  if ('submission_id' in responseData && responseData.submission_id) {
    submissionId = responseData.submission_id;
    hasServerGeneratedId = true;
  } else {
    submissionId = nanoid();
  }

  if ('error' in responseData) {
    errorMessage = responseData.error;
  }

  return {
    submissionId,
    submission: {
      id: submissionId,
      hasServerGeneratedId,
      submittedData: {
        species: payload.species,
        sequences: payload.sequences,
        preset: payload.preset,
        submissionName: payload.submissionName,
        parameters: payload.parameters
      },
      submittedAt: Date.now(),
      error: errorMessage
    } as FailedBlastSubmission
  };
};

export const {
  useBlastConfigQuery,
  useSubmitBlastMutation,
  useFetchAllBlastJobsQuery
} = blastApiSlice;
export const { submitBlast, fetchAllBlastJobs, fetchAllBlastRawResults } =
  blastApiSlice.endpoints;
