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

import { createTranscript } from 'tests/fixtures/entity-viewer/transcript';

import TranscriptSequenceView from './TranscriptSequenceView';

const transcript = createTranscript();

const createNonProteinCodingTranscript = () => {
  transcript.product_generating_contexts[0].product = null;
  transcript.product_generating_contexts[0].cds = null;
  return transcript;
};

const NonProteinCodingTranscript = createNonProteinCodingTranscript();
describe('<TranscriptSequenceView />', () => {
  it('displays genomic sequence, cdna, cds and protein sequence radio', () => {
    const { container } = render(
      <TranscriptSequenceView transcript={transcript} />
    );

    expect(container.querySelectorAll('.radioGroup .label').length).toEqual(4);
    expect(
      container.querySelectorAll('.radioGroup .label')[0].innerHTML
    ).toEqual('Genomic sequence');
    expect(
      container.querySelectorAll('.radioGroup .label')[1].innerHTML
    ).toEqual('cDNA');
    expect(
      container.querySelectorAll('.radioGroup .label')[2].innerHTML
    ).toEqual('CDS');
    expect(
      container.querySelectorAll('.radioGroup .label')[3].innerHTML
    ).toEqual('Protein sequence');
  });

  it('displays genomic sequence and cdna radio', () => {
    const { container } = render(
      <TranscriptSequenceView transcript={NonProteinCodingTranscript} />
    );

    expect(container.querySelectorAll('.radioGroup .label').length).toEqual(4);
    expect(
      container.querySelectorAll('.radioGroup .label')[0].innerHTML
    ).toEqual('Genomic sequence');
    expect(
      container.querySelectorAll('.radioGroup .label')[1].innerHTML
    ).toEqual('cDNA');
  });
});
