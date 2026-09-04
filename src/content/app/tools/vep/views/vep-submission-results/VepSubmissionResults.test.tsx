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
  planLeadingCells,
  detailBearingRowIndices,
  hasAnySelectedOption
} from './VepSubmissionResults';
import type { VepResultsTableRowData } from './useVepVariantTabularData';
import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';

// planLeadingCells only reads the variant/allele/gene "markers"; the consequence
// is irrelevant to it, so build minimal rows carrying just those markers.
const makeRow = (
  markers: Partial<
    Pick<VepResultsTableRowData, 'variant' | 'alternativeAllele' | 'gene'>
  >
): VepResultsTableRowData => ({
  consequence: {} as VepResultsTableRowData['consequence'],
  variant: markers.variant ?? null,
  alternativeAllele: markers.alternativeAllele ?? null,
  gene: markers.gene ?? null
});

const variantMarker = (rowspan: number) => ({
  name: 'rs1',
  referenceAllele: 'G',
  allele_type: 'SNV',
  location: { region_name: '1', start: 1 },
  rowspan
});

const alleleMarker = (allele_sequence: string, rowspan: number) => ({
  allele_sequence,
  rowspan
});

const geneMarker = (stableId: string, rowspan: number) => ({
  stableId,
  symbol: null,
  strand: 'forward' as const,
  transcriptsCount: rowspan,
  rowspan
});

// A single-gene variant occupying `rowspan` rows, all under one allele.
const singleGeneRows = (rowspan: number): VepResultsTableRowData[] =>
  Array.from({ length: rowspan }, (_unused, i) =>
    makeRow(
      i === 0
        ? {
            variant: variantMarker(rowspan),
            alternativeAllele: alleleMarker('T', rowspan),
            gene: geneMarker('geneA', rowspan)
          }
        : {}
    )
  );

// A variant hitting two genes (one row each), under one allele.
const twoGeneRows = (): VepResultsTableRowData[] => [
  makeRow({
    variant: variantMarker(2),
    alternativeAllele: alleleMarker('T', 2),
    gene: geneMarker('geneA', 1)
  }),
  makeRow({ gene: geneMarker('geneB', 1) })
];

describe('planLeadingCells', () => {
  it('never spans a leading cell over a detail panel', () => {
    const rows = singleGeneRows(1);

    const collapsed = planLeadingCells(rows, new Set());
    expect(collapsed[0].variant?.rowSpan).toBe(1);
    expect(collapsed[0].allele?.rowSpan).toBe(1);
    expect(collapsed[0].gene?.rowSpan).toBe(1);

    // The panel spans the full row, so nothing can sit beside it: expanding
    // leaves every leading cell covering its own row only, rather than
    // stretching over the injected one.
    const expanded = planLeadingCells(rows, new Set([0]));
    expect(expanded[0].variant?.rowSpan).toBe(1);
    expect(expanded[0].allele?.rowSpan).toBe(1);
    expect(expanded[0].gene?.rowSpan).toBe(1);
  });

  it('spans variant/allele over the whole group and gene per row when nothing is expanded', () => {
    const plan = planLeadingCells(twoGeneRows(), new Set());

    expect(plan[0].variant?.rowSpan).toBe(2);
    expect(plan[0].allele?.rowSpan).toBe(2);
    expect(plan[0].gene?.rowSpan).toBe(1);
    expect(plan[0].gene?.data.stableId).toBe('geneA');

    // Second gene row is covered by the variant/allele spans above it.
    expect(plan[1].variant).toBeNull();
    expect(plan[1].allele).toBeNull();
    expect(plan[1].gene?.rowSpan).toBe(1);
    expect(plan[1].gene?.data.stableId).toBe('geneB');
  });

  it('restarts the identity cells below a panel that interrupts their group', () => {
    // Expanding gene-1 injects the panel between the two gene rows. Every
    // leading cell stops above it and is re-emitted on the gene-2 row — the
    // variant is stated twice, which is the price of the full-width panel.
    const plan = planLeadingCells(twoGeneRows(), new Set([0]));

    expect(plan[0].variant?.rowSpan).toBe(1);
    expect(plan[0].allele?.rowSpan).toBe(1);
    expect(plan[0].gene?.rowSpan).toBe(1);
    expect(plan[0].gene?.data.stableId).toBe('geneA');

    expect(plan[1].variant?.rowSpan).toBe(1);
    expect(plan[1].allele?.rowSpan).toBe(1);
    expect(plan[1].gene?.rowSpan).toBe(1);
    expect(plan[1].gene?.data.stableId).toBe('geneB');
  });

  it('keeps one identity cell when the panel opens on the group’s last row', () => {
    // Nothing is interrupted: the panel lands after the group, so the identity
    // still spans both rows and is emitted once.
    const plan = planLeadingCells(twoGeneRows(), new Set([1]));

    expect(plan[0].variant?.rowSpan).toBe(2);
    expect(plan[0].allele?.rowSpan).toBe(2);
    expect(plan[1].variant).toBeNull();
    expect(plan[1].allele).toBeNull();
    expect(plan[1].gene?.rowSpan).toBe(1);
  });

  it('splits every leading cell around a panel on a middle transcript', () => {
    // Three transcripts of one gene; expand the middle one.
    const plan = planLeadingCells(singleGeneRows(3), new Set([1]));

    // Each cell covers the rows above the panel, then restarts beneath it.
    // Variant, allele and gene all break at the same place now.
    expect(plan[0].variant?.rowSpan).toBe(2);
    expect(plan[0].allele?.rowSpan).toBe(2);
    expect(plan[0].gene?.rowSpan).toBe(2);

    expect(plan[1].variant).toBeNull();
    expect(plan[1].allele).toBeNull();
    expect(plan[1].gene).toBeNull();

    expect(plan[2].variant?.rowSpan).toBe(1);
    expect(plan[2].allele?.rowSpan).toBe(1);
    expect(plan[2].gene?.rowSpan).toBe(1);
  });

  it('splits at each of several open panels', () => {
    const plan = planLeadingCells(singleGeneRows(3), new Set([0, 1]));

    // A panel after each of the first two rows leaves every run one row long.
    for (const index of [0, 1, 2]) {
      expect(plan[index].variant?.rowSpan).toBe(1);
      expect(plan[index].allele?.rowSpan).toBe(1);
      expect(plan[index].gene?.rowSpan).toBe(1);
    }
  });
});

// A transcript-consequence row for a given alt allele.
const transcriptRow = (altAlleleSequence: string): VepResultsTableRowData => ({
  ...makeRow({}),
  consequence: {
    feature_type: 'transcript',
    altAlleleSequence
  } as VepResultsTableRowData['consequence']
});

// An intergenic row: its alt allele lives on the row's alternativeAllele marker
// (present only on the allele's first intergenic row, as getTabularData emits).
const intergenicRow = (altAlleleSequence?: string): VepResultsTableRowData => ({
  ...makeRow(
    altAlleleSequence
      ? { alternativeAllele: alleleMarker(altAlleleSequence, 1) }
      : {}
  ),
  consequence: {
    feature_type: null
  } as VepResultsTableRowData['consequence']
});

describe('detailBearingRowIndices', () => {
  it('includes a transcript row whose allele has annotations', () => {
    const rows = [transcriptRow('T'), transcriptRow('C')];
    const indices = detailBearingRowIndices(rows, (seq) =>
      ['T', 'C'].includes(seq)
    );
    expect(indices).toEqual([0, 1]);
  });

  it('includes an intergenic row via its own alt-allele marker', () => {
    const rows = [intergenicRow('T')];
    expect(detailBearingRowIndices(rows, () => true)).toEqual([0]);
  });

  it('skips a row whose allele is not among those carrying annotations', () => {
    const rows = [transcriptRow('T'), transcriptRow('X')];
    const indices = detailBearingRowIndices(rows, (seq) => seq === 'T');
    expect(indices).toEqual([0]);
  });

  it('skips an intergenic row with no alt-allele marker (a later same-allele row)', () => {
    // getTabularData sets the alt-allele marker only on the first intergenic row
    // of an allele; a follow-on row has none and offers no detail toggle.
    const rows = [intergenicRow('T'), intergenicRow()];
    expect(detailBearingRowIndices(rows, () => true)).toEqual([0]);
  });
});

describe('hasAnySelectedOption', () => {
  const panels = [
    {
      id: 'genes_and_transcripts',
      label: 'Genes & transcripts',
      options: [
        { id: 'tss_distance', label: 'Distance to TSS', type: 'boolean' },
        { id: 'gerp', label: 'GERP conservation score', type: 'boolean' }
      ]
    },
    {
      id: 'variant_impact_predictions',
      label: 'Variant impact predictions',
      options: [{ id: 'cadd', label: 'CADD', type: 'boolean' }]
    }
  ] as unknown as FormPanel[];

  it('is false when the job ran no annotation option', () => {
    // A submission with nothing ticked: every detail section is gated on an
    // option, so the panel would open empty -- no chevron is offered.
    expect(hasAnySelectedOption(panels, {})).toBe(false);
    expect(
      hasAnySelectedOption(panels, { tss_distance: false, cadd: false })
    ).toBe(false);
  });

  it('is true when any option in any panel ran', () => {
    expect(hasAnySelectedOption(panels, { cadd: true })).toBe(true);
    expect(hasAnySelectedOption(panels, { gerp: true })).toBe(true);
  });

  it('ignores parameters that are not options of a panel', () => {
    // `parameters` also carries settings that produce no annotation -- the
    // up/downstream distance value, and the sub-option values of an option that
    // is itself off. Neither should make the panel look worth opening.
    expect(
      hasAnySelectedOption(panels, {
        updownstream_distance_bp: 5000,
        clinvar_short: true,
        species: 'homo_sapiens'
      })
    ).toBe(false);
  });

  it('keeps the chevron for a job with no pinned panels', () => {
    // Submitted before panels were pinned: the options it ran cannot be
    // enumerated, so it behaves as it always did rather than losing its detail.
    expect(hasAnySelectedOption(undefined, {})).toBe(true);
  });
});
