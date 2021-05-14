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

import { filterTranscriptsBySOTerm } from '../transcripts-filter';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

/* Creating filters with different filter set to true/false */
const proteinCodingFilters = {
  protein_coding: true,
  retained_intron: false,
  processed_transcript: false,
  nonsense_mediated_decay: false
};

/* Creating dummy transcripts with different different so_term  to test so_term filtering */
/* note that the so_term can be any string matching the filters object above */
const createProteinCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'protein_coding';
  return transcript;
};

const createProcessedTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'processed_transcript';
  return transcript;
};

const createRetainedIntronTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'retained_intron';
  return transcript;
};

const createNonsenseMediatedDecayTranscript = () => {
  const transcript = createTranscript();
  transcript.so_term = 'nonsense_mediated_decay';
  return transcript;
};

const ProteinCodingTranscript = createProteinCodingTranscript();
const ProcessedTranscript = createProcessedTranscript();
const RetainedIntronTranscript = createRetainedIntronTranscript();
const NonsenseMediatedDecayTranscript = createNonsenseMediatedDecayTranscript();

describe('filterTranscriptsBySOTerm', () => {
  it('filters transcripts by so_term correctly', () => {
    const Transcripts = [
      ProteinCodingTranscript,
      ProcessedTranscript,
      RetainedIntronTranscript,
      NonsenseMediatedDecayTranscript
    ];

    const expectedTranscripts = [ProteinCodingTranscript];

    const filteredTranscripts = filterTranscriptsBySOTerm(
      Transcripts,
      proteinCodingFilters
    );

    expect(filteredTranscripts).toEqual(expectedTranscripts);
  });
});
