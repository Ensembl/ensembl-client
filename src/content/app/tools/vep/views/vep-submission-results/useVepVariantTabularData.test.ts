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

import { getTabularData, getRowKeys } from './useVepVariantTabularData';

import type {
  VepResultsResponse,
  PredictedMolecularConsequence,
  PredictedTranscriptConsequence,
  PredictedRegulatoryConsequence,
  PredictedIntergenicConsequence
} from 'src/content/app/tools/vep/types/vepResultsResponse';

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

const transcript = (
  stable_id: string,
  gene_stable_id: string
): PredictedTranscriptConsequence => ({
  feature_type: 'transcript',
  stable_id,
  gene_stable_id,
  gene_symbol: null,
  is_canonical: true,
  biotype: 'protein_coding',
  strand: 'forward',
  consequences: ['intron_variant']
});

const regulatory = (
  stable_id: string,
  biotype: string | null
): PredictedRegulatoryConsequence => ({
  feature_type: 'regulatory',
  stable_id,
  biotype,
  consequences: [
    biotype ? 'regulatory_region_variant' : 'TF_binding_site_variant'
  ]
});

const intergenic: PredictedIntergenicConsequence = {
  feature_type: null,
  consequences: ['intergenic_variant']
};

// A variant whose alt alleles carry the given consequences, in the given order.
const variantWith = (
  alleles: Record<string, PredictedMolecularConsequence[]>
): Variant => ({
  name: 'rs1',
  allele_type: 'SNV',
  location: { region_name: '1', start: 905160, end: 905160 },
  reference_allele: { allele_sequence: 'C' },
  alternative_alleles: Object.entries(alleles).map(
    ([allele_sequence, predicted_molecular_consequences]) => ({
      allele_sequence,
      allele_type: 'SNV',
      predicted_molecular_consequences
    })
  )
});

const rowKinds = (rows: ReturnType<typeof getTabularData>) =>
  rows.map((row) => row.consequence.feature_type);

describe('getTabularData — regulatory consequences', () => {
  it('gives a regulatory feature its own row, above the intergenic row', () => {
    // chr1:905160 C>T has an intergenic entry and an enhancer. Intergenic is the
    // least interesting row, so the enhancer comes first even though the
    // intergenic entry is listed first here.
    const rows = getTabularData({
      variant: variantWith({
        T: [intergenic, regulatory('ENSR1_D37Q', 'enhancer')]
      }),
      expandedTranscriptPaths: []
    });

    expect(rowKinds(rows)).toEqual(['regulatory', null]);
    // The allele and variant cells sit on the first row and span both rows.
    expect(rows[0].alternativeAllele?.rowspan).toBe(2);
    expect(rows[0].variant?.rowspan).toBe(2);
    expect(rows[1].alternativeAllele).toBeNull();
    expect(rows[1].variant).toBeNull();
    // With no allele cell of its own, the bottom row carries the allele itself.
    expect(rows.map((row) => row.consequence.altAlleleSequence)).toEqual([
      'T',
      'T'
    ]);
  });

  it('puts regulatory rows after transcript rows and counts them in the rowspans', () => {
    // An allele in two genes that also hits an enhancer and a motif, listed
    // in mixed order.
    const rows = getTabularData({
      variant: variantWith({
        G: [
          regulatory('ENSR1_94XXBC', 'enhancer'),
          transcript('ENST1', 'ENSG1'),
          regulatory('ENSM00000071889', null),
          transcript('ENST2', 'ENSG2')
        ]
      }),
      expandedTranscriptPaths: []
    });

    expect(rowKinds(rows)).toEqual([
      'transcript',
      'transcript',
      'regulatory',
      'regulatory'
    ]);
    expect(rows[0].alternativeAllele?.rowspan).toBe(4);
    expect(rows[0].variant?.rowspan).toBe(4);
    expect(rows.map((row) => row.gene?.stableId ?? null)).toEqual([
      'ENSG1',
      'ENSG2',
      null,
      null
    ]);
  });

  it("puts each allele's cell on its own first row when that row is regulatory", () => {
    // Allele T starts with an enhancer row, and allele A is intergenic only. The
    // variant cell still appears once, spanning all three rows.
    const rows = getTabularData({
      variant: variantWith({
        T: [intergenic, regulatory('ENSR1_D37Q', 'enhancer')],
        A: [intergenic]
      }),
      expandedTranscriptPaths: []
    });

    expect(rowKinds(rows)).toEqual(['regulatory', null, null]);
    expect(
      rows.map((row) => row.alternativeAllele?.allele_sequence ?? null)
    ).toEqual(['T', null, 'A']);
    expect(rows.filter((row) => row.variant !== null)).toHaveLength(1);
    expect(rows[0].variant?.rowspan).toBe(3);
  });
});

describe('getRowKeys', () => {
  it("keeps a row's key when expanding a gene's transcripts moves the row down", () => {
    // Allele G has three transcripts in one gene, plus an enhancer. Collapsed,
    // the gene shows one transcript and the enhancer is row 1. Expanded, the
    // enhancer is row 3. An open detail panel follows the key, so the key must
    // not change, or the panel jumps to whichever row now sits at index 1.
    const variant = variantWith({
      G: [
        transcript('ENST1', 'ENSG1'),
        transcript('ENST2', 'ENSG1'),
        transcript('ENST3', 'ENSG1'),
        regulatory('ENSR1_94XXBC', 'enhancer')
      ]
    });
    const collapsed = getTabularData({ variant, expandedTranscriptPaths: [] });
    const expanded = getTabularData({
      variant,
      expandedTranscriptPaths: [{ altAllele: 'G', geneId: 'ENSG1' }]
    });
    const enhancerKey = (rows: ReturnType<typeof getTabularData>) =>
      getRowKeys(rows)[
        rows.findIndex((row) => row.consequence.feature_type === 'regulatory')
      ];

    expect(rowKinds(collapsed)).toEqual(['transcript', 'regulatory']);
    expect(rowKinds(expanded)).toEqual([
      'transcript',
      'transcript',
      'transcript',
      'regulatory'
    ]);
    expect(enhancerKey(expanded)).toBe(enhancerKey(collapsed));
    expect(new Set(getRowKeys(expanded)).size).toBe(4);
  });

  it('keeps the key of a transcript that is listed under two genes', () => {
    // ENST_SHARED sits under GENE_A, where it is hidden while GENE_A is
    // collapsed, and under GENE_B, where it is shown. Expanding GENE_A reveals
    // the GENE_A copy above the GENE_B row. The GENE_B row must keep its key,
    // or its open panel jumps to the GENE_A copy.
    const variant = variantWith({
      G: [
        transcript('ENST_A1', 'GENE_A'),
        transcript('ENST_SHARED', 'GENE_A'),
        transcript('ENST_SHARED', 'GENE_B')
      ]
    });
    const collapsed = getTabularData({ variant, expandedTranscriptPaths: [] });
    const expanded = getTabularData({
      variant,
      expandedTranscriptPaths: [{ altAllele: 'G', geneId: 'GENE_A' }]
    });
    const geneBKey = (rows: ReturnType<typeof getTabularData>) =>
      getRowKeys(rows)[
        rows.findIndex(
          (row) =>
            row.consequence.feature_type === 'transcript' &&
            row.consequence.gene_stable_id === 'GENE_B'
        )
      ];

    expect(collapsed).toHaveLength(2);
    expect(expanded).toHaveLength(3);
    expect(geneBKey(expanded)).toBe(geneBKey(collapsed));
  });

  it('gives every row its own key, even a feature listed twice', () => {
    // Toggling one row's panel must not toggle another, so no two rows of a
    // variant may share a key. That includes two alleles with an intergenic row
    // each, and a regulatory feature that appears twice for one allele.
    const rows = getTabularData({
      variant: variantWith({
        T: [
          regulatory('ENSR1_D37Q', 'enhancer'),
          regulatory('ENSR1_D37Q', 'enhancer'),
          intergenic
        ],
        A: [intergenic]
      }),
      expandedTranscriptPaths: []
    });

    expect(rows).toHaveLength(4);
    expect(new Set(getRowKeys(rows)).size).toBe(4);
  });
});
