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

import {
  getTabularData,
  getRowKeys,
  type ExpandedRegulatoryGroupPath
} from './useVepVariantTabularData';

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
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
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
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
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
    const rows = getTabularData({
      variant: variantWith({
        T: [intergenic, regulatory('ENSR1_D37Q', 'enhancer')]
      }),
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
    });

    expect(rowKinds(rows)).toEqual(['regulatory', null]);
    expect(rows[0].alternativeAllele?.rowspan).toBe(2);
    expect(rows[0].variant?.rowspan).toBe(2);
    expect(rows[1].alternativeAllele).toBeNull();
    expect(rows[1].variant).toBeNull();
    expect(rows.map((row) => row.consequence.altAlleleSequence)).toEqual([
      'T',
      'T'
    ]);
  });

  it('puts regulatory rows after transcript rows and counts them in the rowspans', () => {
    const rows = getTabularData({
      variant: variantWith({
        G: [
          regulatory('ENSR1_94XXBC', 'enhancer'),
          transcript('ENST1', 'ENSG1'),
          regulatory('ENSM00000071889', null),
          transcript('ENST2', 'ENSG2')
        ]
      }),
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
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
    const rows = getTabularData({
      variant: variantWith({
        T: [intergenic, regulatory('ENSR1_D37Q', 'enhancer')],
        A: [intergenic]
      }),
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
    });

    expect(rowKinds(rows)).toEqual(['regulatory', null, null]);
    expect(
      rows.map((row) => row.alternativeAllele?.allele_sequence ?? null)
    ).toEqual(['T', null, 'A']);
    expect(rows.filter((row) => row.variant !== null)).toHaveLength(1);
    expect(rows[0].variant?.rowspan).toBe(3);
  });
});

const ABLATION = ['regulatory_region_ablation', 'regulatory_region_variant'];
const TFBS = ['TFBS_ablation', 'TF_binding_site_variant'];
const ABLATION_KEY = ABLATION.join('&');

const regulatoryWith = (
  stable_id: string,
  consequences: string[]
): PredictedRegulatoryConsequence => ({
  feature_type: 'regulatory',
  stable_id,
  biotype: null,
  consequences
});

// The fixture interleaves five ablation features with two TFBS features.
const structuralAllele = (): PredictedMolecularConsequence[] => [
  transcript('ENST1', 'ENSG1'),
  regulatoryWith('ENSR1', ABLATION),
  regulatoryWith('ENSM1', TFBS),
  regulatoryWith('ENSR2', ABLATION),
  intergenic,
  regulatoryWith('ENSM2', TFBS),
  regulatoryWith('ENSR3', ABLATION),
  regulatoryWith('ENSR4', ABLATION),
  regulatoryWith('ENSR5', ABLATION)
];

const tabulate = (
  variant: Variant,
  expandedRegulatoryGroupPaths: ExpandedRegulatoryGroupPath[] = []
) =>
  getTabularData({
    variant,
    expandedTranscriptPaths: [],
    expandedRegulatoryGroupPaths
  });

const featureIds = (rows: ReturnType<typeof getTabularData>) =>
  rows.map((row) =>
    row.consequence.feature_type === null
      ? 'intergenic'
      : row.consequence.stable_id
  );

const regulatoryFlags = (rows: ReturnType<typeof getTabularData>) =>
  rows.flatMap(({ consequence }) =>
    consequence.feature_type === 'regulatory'
      ? [
          [
            consequence.stable_id,
            consequence.groupSize,
            consequence.isLastShownInGroup
          ]
        ]
      : []
  );

describe('getTabularData — regulatory groups', () => {
  it('shows the first three features of a collapsed group of more than three', () => {
    const rows = tabulate(variantWith({ G: structuralAllele() }));

    expect(featureIds(rows)).toEqual([
      'ENST1',
      'ENSR1',
      'ENSR2',
      'ENSR3',
      'ENSM1',
      'ENSM2',
      'intergenic'
    ]);
    expect(regulatoryFlags(rows)).toEqual([
      ['ENSR1', 5, false],
      ['ENSR2', 5, false],
      ['ENSR3', 5, true],
      ['ENSM1', 2, false],
      ['ENSM2', 2, true]
    ]);
    expect(rows[0].alternativeAllele?.rowspan).toBe(7);
    expect(rows[0].variant?.rowspan).toBe(7);
  });

  it('shows every feature of an expanded group', () => {
    const rows = tabulate(variantWith({ G: structuralAllele() }), [
      { altAllele: 'G', groupKey: ABLATION_KEY }
    ]);

    expect(featureIds(rows)).toEqual([
      'ENST1',
      'ENSR1',
      'ENSR2',
      'ENSR3',
      'ENSR4',
      'ENSR5',
      'ENSM1',
      'ENSM2',
      'intergenic'
    ]);
    expect(regulatoryFlags(rows).slice(0, 5)).toEqual([
      ['ENSR1', 5, false],
      ['ENSR2', 5, false],
      ['ENSR3', 5, false],
      ['ENSR4', 5, false],
      ['ENSR5', 5, true]
    ]);
    expect(rows[0].alternativeAllele?.rowspan).toBe(9);
    expect(rows[0].variant?.rowspan).toBe(9);
  });

  it("expands one allele's group without expanding the other allele's", () => {
    const rows = tabulate(
      variantWith({ G: structuralAllele(), T: structuralAllele() }),
      [{ altAllele: 'T', groupKey: ABLATION_KEY }]
    );
    const alleleRowspans = rows.flatMap((row) =>
      row.alternativeAllele
        ? [
            [
              row.alternativeAllele.allele_sequence,
              row.alternativeAllele.rowspan
            ]
          ]
        : []
    );

    expect(rows).toHaveLength(16);
    expect(alleleRowspans).toEqual([
      ['G', 7],
      ['T', 9]
    ]);
    expect(rows[0].variant?.rowspan).toBe(16);
  });

  it('shows every feature of a group of three', () => {
    const rows = tabulate(
      variantWith({
        G: [
          regulatoryWith('ENSR1', ABLATION),
          regulatoryWith('ENSR2', ABLATION),
          regulatoryWith('ENSR3', ABLATION)
        ]
      })
    );

    expect(regulatoryFlags(rows)).toEqual([
      ['ENSR1', 3, false],
      ['ENSR2', 3, false],
      ['ENSR3', 3, true]
    ]);
    expect(rows[0].variant?.rowspan).toBe(3);
  });
});

describe('getRowKeys', () => {
  it("keeps a row's key when expanding a gene's transcripts moves the row down", () => {
    const variant = variantWith({
      G: [
        transcript('ENST1', 'ENSG1'),
        transcript('ENST2', 'ENSG1'),
        transcript('ENST3', 'ENSG1'),
        regulatory('ENSR1_94XXBC', 'enhancer')
      ]
    });
    const collapsed = getTabularData({
      variant,
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
    });
    const expanded = getTabularData({
      variant,
      expandedTranscriptPaths: [{ altAllele: 'G', geneId: 'ENSG1' }],
      expandedRegulatoryGroupPaths: []
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
    // Collapsed GENE_A hides its ENST_SHARED; GENE_B shows its own copy.
    const variant = variantWith({
      G: [
        transcript('ENST_A1', 'GENE_A'),
        transcript('ENST_SHARED', 'GENE_A'),
        transcript('ENST_SHARED', 'GENE_B')
      ]
    });
    const collapsed = getTabularData({
      variant,
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
    });
    const expanded = getTabularData({
      variant,
      expandedTranscriptPaths: [{ altAllele: 'G', geneId: 'GENE_A' }],
      expandedRegulatoryGroupPaths: []
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

  it("keeps each shown row's key when a regulatory group expands or collapses", () => {
    const variant = variantWith({ G: structuralAllele() });
    const collapsed = tabulate(variant);
    const expanded = tabulate(variant, [
      { altAllele: 'G', groupKey: ABLATION_KEY }
    ]);
    const keysById = (rows: ReturnType<typeof getTabularData>) => {
      const keys = getRowKeys(rows);
      return new Map(featureIds(rows).map((id, index) => [id, keys[index]]));
    };
    const collapsedKeys = keysById(collapsed);
    const expandedKeys = keysById(expanded);

    for (const [id, key] of collapsedKeys) {
      expect(expandedKeys.get(id)).toBe(key);
    }
    expect(new Set(getRowKeys(expanded)).size).toBe(expanded.length);
  });

  it('gives every row its own key, even a feature listed twice', () => {
    const rows = getTabularData({
      variant: variantWith({
        T: [
          regulatory('ENSR1_D37Q', 'enhancer'),
          regulatory('ENSR1_D37Q', 'enhancer'),
          intergenic
        ],
        A: [intergenic]
      }),
      expandedTranscriptPaths: [],
      expandedRegulatoryGroupPaths: []
    });

    expect(rows).toHaveLength(4);
    expect(new Set(getRowKeys(rows)).size).toBe(4);
  });
});
