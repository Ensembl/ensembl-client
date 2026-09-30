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

import VepResultsProteinCodingFeatures from './VepResultsProteinCodingFeatures';

import type { ProteinCodingFeatures } from 'src/content/app/tools/vep/types/vepResultsResponse';

const none: ProteinCodingFeatures = {
  exon: null,
  intron: null,
  cdna_position: null,
  cds_position: null,
  protein_position: null,
  amino_acids: null,
  codons: null
};

const lines = () =>
  screen
    .getAllByRole('term')
    .map(
      (term) => `${term.textContent} ${term.nextElementSibling?.textContent}`
    );

afterEach(cleanup);

describe('VepResultsProteinCodingFeatures', () => {
  it('shows each position, the amino acid change and the codons', () => {
    render(
      <VepResultsProteinCodingFeatures
        features={{
          exon: '4/13',
          intron: null,
          cdna_position: '847-848',
          cds_position: '340-341',
          protein_position: '114',
          amino_acids: 'K/Q',
          codons: 'AAa/CAa'
        }}
      />
    );

    expect(lines()).toEqual([
      'Exon 4/13',
      'cDNA position 847-848',
      'CDS position 340-341',
      'Codons AAa/CAa',
      'Protein position 114',
      'Amino acids K/Q'
    ]);
  });

  it('shows a synonymous change as its one amino acid', () => {
    render(
      <VepResultsProteinCodingFeatures
        features={{ ...none, protein_position: '335', amino_acids: 'P' }}
      />
    );

    expect(lines()).toEqual(['Protein position 335', 'Amino acids P']);
  });

  it('shows only the features a transcript has', () => {
    render(
      <VepResultsProteinCodingFeatures
        features={{ ...none, cdna_position: '412' }}
      />
    );

    expect(lines()).toEqual(['cDNA position 412']);
  });

  it('shows the intron of an intronic variant', () => {
    render(
      <VepResultsProteinCodingFeatures features={{ ...none, intron: '7/14' }} />
    );

    expect(lines()).toEqual(['Intron 7/14']);
  });

  it('shows both when the variant crosses an exon boundary', () => {
    render(
      <VepResultsProteinCodingFeatures
        features={{ ...none, exon: '4-5/13', intron: '4/12' }}
      />
    );

    expect(lines()).toEqual(['Exon 4-5/13', 'Intron 4/12']);
  });

  it('renders nothing when a transcript has none of them', () => {
    const { container } = render(
      <VepResultsProteinCodingFeatures features={none} />
    );

    expect(container.innerHTML).toBe('');
  });
});
