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

import React from 'react';
import { render } from '@testing-library/react';

import {
  createProteinCodingTranscript,
  createNonCodingTranscript
} from 'tests/fixtures/entity-viewer/transcript';

import TranscriptSequenceView from './TranscriptSequenceView';

describe('<TranscriptSequenceView />', () => {
  const proteinCodingTranscript = createProteinCodingTranscript();
  it('displays correct list of sequence options for a protein-coding transcript', () => {
    const { container } = render(
      <TranscriptSequenceView transcript={proteinCodingTranscript} />
    );

    const renderedLabels = [
      ...container.querySelectorAll('.radioGroup .label')
    ].map((el) => el.innerHTML);
    expect(renderedLabels).toStrictEqual([
      'Genomic sequence',
      'cDNA',
      'CDS',
      'Protein sequence'
    ]);
  });

  it('displays correct list of sequence options for a non-coding transcript', () => {
    const nonCodingTranscript = createNonCodingTranscript();
    const { container } = render(
      <TranscriptSequenceView transcript={nonCodingTranscript} />
    );

    const renderedLabels = [
      ...container.querySelectorAll('.radioGroup .label')
    ].map((el) => el.innerHTML);
    expect(renderedLabels).toStrictEqual(['Genomic sequence', 'cDNA']);
  });
});
