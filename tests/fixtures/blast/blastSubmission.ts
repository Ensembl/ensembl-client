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

import sample from 'lodash/sample';
import times from 'lodash/times';
import { faker } from '@faker-js/faker';

import { certainAminoAcids } from 'src/content/app/tools/blast/utils/sequenceAlphabets';
import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import type {
  BlastSubmission,
  BlastResult,
  JobStatus
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

export const createBlastSubmission = (params?: {
  fragment?: Partial<BlastSubmission>;
  options?: {
    sequencesCount?: number;
    speciesCount?: number;
  };
}): BlastSubmission => {
  const fragment = params?.fragment;
  const { sequencesCount = 2, speciesCount = 1 } = params?.options ?? {};
  const species = times(speciesCount, () => createSelectedSpecies());
  const sequences = createSubmittedSequences(sequencesCount);

  return {
    id: faker.datatype.uuid(),
    submittedData: {
      species,
      sequences,
      parameters: defaultBlastParameters
    },
    results: createBlastJobs({ species, sequences }),
    submittedAt: Date.now(),
    seen: false,
    ...fragment
  };
};

export const createSubmittedSequences = (number: number) => {
  return times(number, (index) => createSubmittedSequence({ id: index }));
};

export const createSubmittedSequence = (
  fragment: Partial<{ id: number; value: string }>
) => ({
  id: 0,
  value: createDNASequence(20),
  ...fragment
});

export const createBlastJobs = ({
  species: speciesList,
  sequences
}: {
  species: BlastSubmission['submittedData']['species'];
  sequences: BlastSubmission['submittedData']['sequences'];
}): BlastSubmission['results'] => {
  const jobs = [];

  for (const species of speciesList) {
    for (const sequence of sequences) {
      const job = createBlastJob({
        sequenceId: sequence.id,
        genomeId: species.genome_id
      });
      jobs.push(job);
    }
  }

  return jobs;
};

export const createBlastJob = (
  fragment: Partial<BlastResult> = {}
): BlastResult => {
  return {
    jobId: faker.datatype.uuid(),
    sequenceId: parseInt(faker.random.numeric()),
    genomeId: faker.datatype.uuid(),
    status: 'RUNNING',
    data: null,
    ...fragment
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

export const createDNASequence = (length: number): string => {
  const alphabet = ['A', 'G', 'C', 'T'];
  return times(length, () => sample(alphabet)).join('');
};

export const createProteinSequence = (length: number): string => {
  const alphabet = certainAminoAcids.split('');
  return times(length, () => sample(alphabet)).join('');
};

const defaultBlastParameters = {
  title: '',
  database: 'dna',
  stype: 'dna',
  program: 'blastn',
  alignments: '100',
  scores: '50',
  hsps: '10',
  dropoff: '4',
  gapalign: 'true',
  filter: 'true',
  compstats: 'F',
  exp: '1e-10',
  match_scores: '1,-4',
  wordsize: '8',
  gapopen: '1',
  gapext: '2'
} as const;
