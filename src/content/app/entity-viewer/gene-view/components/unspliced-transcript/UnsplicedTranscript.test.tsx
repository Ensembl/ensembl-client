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

import { render } from '@testing-library/react';

import { createProteinCodingTranscript } from 'tests/fixtures/entity-viewer/transcript';

import UnsplicedTranscript from './UnsplicedTranscript';

const minimalProps = {
  transcript: createProteinCodingTranscript(),
  width: 600
};

describe('<UnsplicedTranscript />', () => {
  it('renders inside an <svg> element if standalone', () => {
    const { container } = render(
      <UnsplicedTranscript {...minimalProps} standalone={true} />
    );

    expect((container.firstChild as HTMLElement).tagName).toBe('svg');
  });

  it('renders inside a <g> element (svg group) if not standalone', () => {
    const { getByTestId } = render(
      <svg data-test-id="test wrapper">
        <UnsplicedTranscript {...minimalProps} />
      </svg>
    );

    const svgWrapper = getByTestId('test wrapper');
    expect((svgWrapper.firstChild as HTMLElement).tagName).toBe('g');
  });

  it('renders the correct number of exons', () => {
    const { container } = render(
      <UnsplicedTranscript {...minimalProps} standalone={true} />
    );
    expect(container.querySelectorAll('[data-test-id=exon]').length).toBe(
      minimalProps.transcript.spliced_exons.length
    );
  });
});
