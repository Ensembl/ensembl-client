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
  detailBearingRowIndices
} from './VepSubmissionResults';
import type { VepResultsTableRowData } from './useVepVariantTabularData';

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
  it('spans a single-row group over its row, plus its detail panel when expanded', () => {
    const rows = singleGeneRows(1);

    const collapsed = planLeadingCells(rows, new Set());
    expect(collapsed[0].variant?.rowSpan).toBe(1);
    expect(collapsed[0].allele?.rowSpan).toBe(1);
    expect(collapsed[0].gene?.rowSpan).toBe(1);

    // The right-aligned panel sits to the right of the identity cells, so the
    // variant/allele cells span the extra detail row; the gene cell does not.
    const expanded = planLeadingCells(rows, new Set([0]));
    expect(expanded[0].variant?.rowSpan).toBe(2);
    expect(expanded[0].allele?.rowSpan).toBe(2);
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

  it('spans variant/allele straight through a panel without repeating them', () => {
    // Expanding gene-1 injects the panel between the two gene rows. The variant
    // and allele cells span across it (rowSpan 3: gene-1 + panel + gene-2) and
    // are NOT re-emitted on the gene-2 row.
    const plan = planLeadingCells(twoGeneRows(), new Set([0]));

    expect(plan[0].variant?.rowSpan).toBe(3);
    expect(plan[0].allele?.rowSpan).toBe(3);
    expect(plan[0].gene?.rowSpan).toBe(1);
    expect(plan[0].gene?.data.stableId).toBe('geneA');

    expect(plan[1].variant).toBeNull();
    expect(plan[1].allele).toBeNull();
    expect(plan[1].gene?.rowSpan).toBe(1);
    expect(plan[1].gene?.data.stableId).toBe('geneB');
  });

  it('spans the identity cells over a panel opened on the last row', () => {
    const plan = planLeadingCells(twoGeneRows(), new Set([1]));

    expect(plan[0].variant?.rowSpan).toBe(3);
    expect(plan[0].allele?.rowSpan).toBe(3);
    expect(plan[1].variant).toBeNull();
    expect(plan[1].allele).toBeNull();
    expect(plan[1].gene?.rowSpan).toBe(1);
  });

  it('restarts the gene cell around a panel opened on a middle transcript', () => {
    // Three transcripts of one gene; expand the middle one.
    const plan = planLeadingCells(singleGeneRows(3), new Set([1]));

    // variant/allele span the whole group including the injected panel (rowSpan
    // 4 = three transcripts + one detail), emitted once.
    expect(plan[0].variant?.rowSpan).toBe(4);
    expect(plan[0].allele?.rowSpan).toBe(4);
    expect(plan[1].variant).toBeNull();
    expect(plan[2].variant).toBeNull();

    // the gene cell cannot cover the panel, so it stops above it and restarts
    // below.
    expect(plan[0].gene?.rowSpan).toBe(2);
    expect(plan[1].gene).toBeNull();
    expect(plan[2].gene?.rowSpan).toBe(1);
  });

  it('counts every open panel in the identity span and splits the gene at each', () => {
    const plan = planLeadingCells(singleGeneRows(3), new Set([0, 1]));

    // three transcripts + two detail panels = rowSpan 5.
    expect(plan[0].variant?.rowSpan).toBe(5);
    expect(plan[0].allele?.rowSpan).toBe(5);

    expect(plan[0].gene?.rowSpan).toBe(1);
    expect(plan[1].gene?.rowSpan).toBe(1);
    expect(plan[2].gene?.rowSpan).toBe(1);
  });
});

// A transcript-consequence row for a given alt allele.
const transcriptRow = (
  altAlleleSequence: string
): VepResultsTableRowData => ({
  ...makeRow({}),
  consequence: {
    feature_type: 'transcript',
    altAlleleSequence
  } as VepResultsTableRowData['consequence']
});

// An intergenic row: its alt allele lives on the row's alternativeAllele marker
// (present only on the allele's first intergenic row, as getTabularData emits).
const intergenicRow = (
  altAlleleSequence?: string
): VepResultsTableRowData => ({
  ...makeRow(
    altAlleleSequence ? { alternativeAllele: alleleMarker(altAlleleSequence, 1) } : {}
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
