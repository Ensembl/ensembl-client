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

import InstantDownloadTranscriptVisualisation, {
  Props
} from './InstantDownloadTranscriptVisualisation';

describe('InstantDownloadTranscriptVisualisation', () => {
  const renderComponent = (props: Partial<Props> = {}) => {
    return render(<InstantDownloadTranscriptVisualisation {...props} />);
  };

  it('renders an svg element', () => {
    const { container } = renderComponent();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('contains 5 exons', () => {
    const { container } = renderComponent();
    expect(container.querySelectorAll('.outerExon, .innerExon').length).toBe(5);
  });

  it('highlights only exons within coding sequence if CDS is enabled', () => {
    const { container } = renderComponent({ isCDSEnabled: true });
    expect(
      container.querySelectorAll('.highlighted.innerExon').length
    ).toBeTruthy();
    expect(
      container.querySelectorAll('.highlighted.halfOuterExon').length
    ).toBeTruthy();
    expect(container.querySelectorAll('.highlighted.outerExon').length).toBe(0);
    expect(container.querySelectorAll('.highlighted.backbone').length).toBe(0);
  });

  it('correctly highlights cDNA segments', () => {
    const { container } = renderComponent({ isCDNAEnabled: true });
    expect(
      container.querySelectorAll('.highlighted.innerExon').length
    ).toBeTruthy();
    expect(
      container.querySelectorAll('.highlighted.halfOuterExon').length
    ).toBeTruthy();
    expect(
      container.querySelectorAll('.highlighted.outerExon').length
    ).toBeTruthy();
    expect(container.querySelectorAll('.highlighted.backbone').length).toBe(0);
  });

  it('correctly highlights complete genomic sequence', () => {
    const { container } = renderComponent({ isGenomicSequenceEnabled: true });
    expect(
      container.querySelectorAll('.highlighted.innerExon').length
    ).toBeTruthy();
    expect(
      container.querySelectorAll('.highlighted.halfOuterExon').length
    ).toBeTruthy();
    expect(
      container.querySelectorAll('.highlighted.outerExon').length
    ).toBeTruthy();
    expect(
      container.querySelectorAll('.highlighted.intron').length
    ).toBeTruthy();
  });

  it('shows protein segments if protein sequence option is enabled', () => {
    let { container } = renderComponent();
    expect(container.querySelectorAll('.protein').length).toBe(0);

    container = renderComponent({ isProteinSequenceEnabled: true }).container;
    expect(container.querySelectorAll('.protein').length).toBeGreaterThan(0);
  });
});
