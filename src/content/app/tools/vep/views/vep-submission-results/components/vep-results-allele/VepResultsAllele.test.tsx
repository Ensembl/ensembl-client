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

import { render, screen, cleanup } from '@testing-library/react';

import VepResultsAllele from './VepResultsAllele';

afterEach(cleanup);

describe('VepResultsAllele', () => {
  it('renders a short sequence verbatim', () => {
    render(<VepResultsAllele sequence="ACGT" />);
    expect(screen.getByText('ACGT')).toBeDefined();
  });

  it('truncates a long nucleotide sequence and shows its base count', () => {
    render(<VepResultsAllele sequence="ACGTACGTACGT" />);
    expect(screen.getByText('ACGTA…')).toBeDefined();
    expect(screen.getByText('12')).toBeDefined();
  });

  it('renders a symbolic SV allele verbatim (not truncated) with its span', () => {
    render(
      <VepResultsAllele
        sequence="<DEL:ME:ALU>"
        structuralVariantDetail="168 bp"
      />
    );
    // shown in full, no "…" truncation, no base-count treatment
    expect(screen.getByText('<DEL:ME:ALU>')).toBeDefined();
    expect(screen.getByText('168 bp')).toBeDefined();
    expect(screen.queryByText('12')).toBeNull();
  });

  it('renders a breakend as <BND> with its two loci', () => {
    render(
      <VepResultsAllele
        sequence="<BND>"
        structuralVariantDetail="2:321681 ↔ 17:198982"
      />
    );
    expect(screen.getByText('<BND>')).toBeDefined();
    expect(screen.getByText('2:321681 ↔ 17:198982')).toBeDefined();
  });

  it('omits the detail line for a symbolic allele when none is given', () => {
    render(<VepResultsAllele sequence="<INV>" />);
    expect(screen.getByText('<INV>')).toBeDefined();
    expect(screen.queryByText(/bp$/)).toBeNull();
  });
});
