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

import faker from 'faker';
import merge from 'lodash/merge';

import { initialState } from '../state/blast-form/blastFormSlice';
import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';
import { createBlastSubmissionData } from 'src/content/app/tools/blast/hooks/useBlastAPI';

const sequences = [
  {
    header: '>seq1',
    value: 'ATAGAGCAG'
  },
  {
    header: 'seq2',
    value: 'ATGCAGCGA'
  }
];

const selectedSpecies = ['human', 'wheat'];
const jobName = faker.lorem.words();
const database = faker.lorem.word();
const blastParameters = {
  alignments: '50',
  scores: '50',
  hsps: '100',
  dropoff: '0',
  gapalign: 'true',
  filter: 'T',
  compstats: 'F',
  exp: '10',
  gapopen: '5',
  gapext: '2',
  wordsize: '11',
  match_scores: '1,-3'
};

const mockState = merge({}, initialState, {
  sequences,
  selectedSpecies,
  settings: {
    jobName,
    sequenceType: 'dna',
    program: 'blastn',
    parameters: {
      database,
      ...blastParameters
    }
  }
});

const expectedPayload = {
  genomeIds: selectedSpecies,
  querySequences: sequences.map((seq) => toFasta(seq)),
  parameters: {
    title: jobName,
    database,
    program: 'blastn',
    stype: 'dna',
    ...blastParameters
  }
};

describe('createBlastSubmissionData', () => {
  it('transforms form data into blast payload', () => {
    const payload = createBlastSubmissionData(mockState);
    expect(payload).toEqual(expectedPayload);
  });
});
