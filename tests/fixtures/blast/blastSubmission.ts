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
import faker from '@faker-js/faker';

import { certainAminoAcids } from 'src/content/app/tools/blast/utils/sequenceAlphabets';
import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import type { BlastSubmission } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

export const createBlastSubmission = (
  fragment: Partial<BlastSubmission> = {}
): BlastSubmission => {
  const species = [createSelectedSpecies()];
  const sequences = createSubmittedSequences(2);

  return {
    submittedData: {
      species,
      sequences,
      parameters: defaultBlastParameters
    },
    results: createBlastJobs({ species, sequences }),
    submittedAt: Date.now(),
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
      const job = {
        jobId: faker.datatype.uuid(),
        sequenceId: sequence.id,
        genomeId: species.genome_id,
        status: 'RUNNING',
        seen: false,
        data: null
      } as const;
      jobs.push(job);
    }
  }

  return jobs;
};

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
};
