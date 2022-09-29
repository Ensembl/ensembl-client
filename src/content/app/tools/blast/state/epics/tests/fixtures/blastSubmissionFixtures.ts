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

import { faker } from '@faker-js/faker';
import times from 'lodash/times';

import type {
  BlastSubmissionPayload,
  BlastSubmissionResponse,
  SubmittedJob
} from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';
import type { JobStatus } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

export const createBlastSubmissionPayload = (
  fragment: Partial<BlastSubmissionPayload> = {}
): BlastSubmissionPayload => {
  const human = {
    genome_id: 'human-genome-id',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    assembly_name: 'grch38'
  };

  const submission = {
    species: [human],
    sequences: [{ id: 1, value: 'ACGT' }],
    preset: 'normal',
    parameters: {}
  };

  return {
    ...submission,
    ...fragment
  };
};

export const createBlastSubmissionResponse = (
  fragment: Partial<BlastSubmissionResponse> = {}
): BlastSubmissionResponse => {
  const submission = {
    submission_id: faker.datatype.uuid(),
    jobs: times(3, createSuccessfulBlastJobInSubmissionResponse)
  };

  return {
    ...submission,
    ...fragment
  };
};

export const createSuccessfulBlastJobInSubmissionResponse =
  (): SubmittedJob => {
    return {
      genome_id: 'human-genome-id',
      sequence_id: 1,
      job_id: faker.datatype.uuid()
    };
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
