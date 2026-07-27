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

import { getTabularData } from './useVepVariantTabularData';

import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

type Variant = VepResultsResponse['variants'][number];

// A variant whose alt alleles are each purely intergenic (no transcript
// consequences) — the shape that exposed the duplicate-variant-cell bug.
const intergenicVariant = (alleleSequences: string[]): Variant => ({
  name: 'rs943807311',
  allele_type: 'SNV',
  location: { region_name: '1', start: 79107, end: 79107 },
  reference_allele: { allele_sequence: 'T' },
  alternative_alleles: alleleSequences.map((allele_sequence) => ({
    allele_sequence,
    allele_type: 'SNV',
    predicted_molecular_consequences: [
      { feature_type: null, consequences: ['intergenic_variant'] }
    ]
  }))
});

describe('getTabularData — multi-allele intergenic variants', () => {
  it('emits the variant cell once, spanning every allele row', () => {
    const rows = getTabularData({
      variant: intergenicVariant(['C', 'A', 'G']),
      expandedTranscriptPaths: []
    });

    expect(rows).toHaveLength(3);

    // The variant cell (name/ref/location) must appear on the first row only —
    // repeating it on later allele rows collides with its rowspan and creates
    // phantom columns.
    const rowsWithVariantCell = rows.filter((row) => row.variant !== null);
    expect(rowsWithVariantCell).toHaveLength(1);
    expect(rows[0].variant).not.toBeNull();
    expect(rows[0].variant?.rowspan).toBe(3);

    // Each allele still gets its own alt-allele cell.
    expect(rows.map((row) => row.alternativeAllele?.allele_sequence)).toEqual([
      'C',
      'A',
      'G'
    ]);
  });

  it('still emits the variant cell for a single-allele intergenic variant', () => {
    const rows = getTabularData({
      variant: intergenicVariant(['C']),
      expandedTranscriptPaths: []
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].variant?.rowspan).toBe(1);
    expect(rows[0].alternativeAllele?.allele_sequence).toBe('C');
  });
});
