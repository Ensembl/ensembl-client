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

import { filterTranscripts } from '../transcripts-filter';

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

/* Creating filters with different filter set to true/false */
const proteinCodingFilters = {
  protein_coding: {
    label: 'Protein coding',
    type: 'biotype' as const,
    selected: true
  },
  tsl1: {
    label: 'TSL:1',
    type: 'tsl' as const,
    selected: true
  },
  processed_transcript: {
    label: 'Processed transcript',
    type: 'biotype' as const,
    selected: false
  },
  nonsense_mediated_decay: {
    label: 'Nonsense',
    type: 'biotype' as const,
    selected: false
  }
};

const createProteinCodingTranscript = () => {
  const transcript = createTranscript();
  transcript.metadata.biotype.value = 'protein_coding';
  return transcript;
};

const createProcessedTranscript = () => {
  const transcript = createTranscript();
  transcript.metadata.biotype.value = 'processed_transcript';
  return transcript;
};

const createTSLTranscript = () => {
  const transcript = createTranscript();
  transcript.metadata.tsl = {
    label: 'TSL1',
    value: 'tsl1',
    definition: 'Transcript support level 1'
  };
  return transcript;
};

const createNonsenseMediatedDecayTranscript = () => {
  const transcript = createTranscript();
  transcript.metadata.biotype.value = 'nonsense_mediated_decay';
  return transcript;
};

const ProteinCodingTranscript = createProteinCodingTranscript();
const ProcessedTranscript = createProcessedTranscript();
const TSLTranscript = createTSLTranscript();
const NonsenseMediatedDecayTranscript = createNonsenseMediatedDecayTranscript();

describe('filterTranscripts', () => {
  it('filters transcripts correctly', () => {
    const Transcripts = [
      ProteinCodingTranscript,
      ProcessedTranscript,
      TSLTranscript,
      NonsenseMediatedDecayTranscript
    ];

    const expectedTranscripts = [ProteinCodingTranscript, TSLTranscript];

    const filteredTranscripts = filterTranscripts(
      Transcripts,
      proteinCodingFilters
    );

    expect(filteredTranscripts).toEqual(expectedTranscripts);
  });
});
