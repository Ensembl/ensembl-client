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

import { describe, expect, it } from 'vitest';

import {
  cellLabel,
  compactTemplate,
  flatColumnsForOption
} from './VepResultsFlatTable';
import { displaySpecFixture } from '../vep-results-annotation-detail/displaySpec.fixture';

import type { DisplayOptionSpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';

const option = (id: string): DisplayOptionSpec =>
  displaySpecFixture.options.find(
    (candidate) => candidate.option_id === id
  ) as DisplayOptionSpec;

const header = (column: {
  optionLabel: string;
  headingPath: string[];
  columnLabel?: string;
}) =>
  [column.optionLabel, ...column.headingPath, column.columnLabel]
    .filter(Boolean)
    .join(' / ');

describe('flatColumnsForOption', () => {
  it('marks a fixed-mode table as one the cell keeps whole', () => {
    const columns = flatColumnsForOption(option('spliceai'), 'SpliceAI');

    expect(columns).toHaveLength(1);
    expect(columns[0].wholeTable).toBe(true);
  });

  it('does not mark a table it splits into columns', () => {
    const columns = flatColumnsForOption(option('phenotypes'), 'Phenotypes');

    expect(columns.some((column) => column.tableKey)).toBe(true);
    expect(columns.every((column) => !column.wholeTable)).toBe(true);
  });

  it('takes a column name the spec states over one it would derive', () => {
    const named = JSON.parse(
      JSON.stringify(option('phenotypes'))
    ) as DisplayOptionSpec;
    const stacked = named.blocks
      .flatMap((block) => (block.kind === 'group' ? block.blocks : [block]))
      .flatMap((block) => (block.kind === 'rows' ? block.rows : []))
      .find((row) => (row.item?.cells ?? []).length > 1);

    stacked!.column_label = 'Germline classification';
    stacked!.item!.cells![0].column_label = 'Type';
    const headers = flatColumnsForOption(named, 'Phenotypes').map(header);

    expect(headers).toContain(
      'Phenotypes / ClinVar / Germline classification / Type'
    );
    // The somatic row was left unnamed, so it still derives its header.
    expect(headers).toContain(
      'Phenotypes / ClinVar / Somatic / Classification summary / Type'
    );
  });

  it('splits a map_rows block into a column per population', () => {
    const columns = flatColumnsForOption(
      option('gnomad_exomes'),
      'gnomAD Exomes',
      {
        af_populations: [
          { scope: 'gnomad_exomes', code: '', label: 'Overall' },
          { scope: 'gnomad_exomes', code: 'afr', label: 'African' },
          { scope: 'gnomad_genomes', code: 'afr', label: 'African' }
        ]
      }
    );

    expect(columns.map(header)).toEqual([
      'gnomAD Exomes / Overall',
      'gnomAD Exomes / African'
    ]);
    expect(columns[1].vocabularyEntry).toEqual({
      name: 'af_populations',
      entry: { scope: 'gnomad_exomes', code: 'afr', label: 'African' }
    });
  });

  it('gives a map_rows option one whole column when the job ran no populations', () => {
    const columns = flatColumnsForOption(
      option('gnomad_exomes'),
      'gnomAD Exomes'
    );

    expect(columns).toHaveLength(1);
    expect(columns[0].vocabularyEntry).toBeUndefined();
  });

  it('splits a stacked row into a column per cell', () => {
    const headers = flatColumnsForOption(
      option('phenotypes'),
      'Phenotypes'
    ).map(header);

    const germline = 'Phenotypes / ClinVar / Germline / Classification summary';
    expect(headers).toContain(`${germline} / Type`);
    expect(headers).toContain(`${germline} / Classification`);
    expect(headers).toContain(`${germline} / Review status`);
    expect(headers).toContain(`${germline} / Supporting`);

    expect(headers).toContain(
      'Phenotypes / ClinVar / Somatic / Classification summary / Type'
    );
  });

  it('leaves a plain row as one column', () => {
    const headers = flatColumnsForOption(
      option('phenotypes'),
      'Phenotypes'
    ).map(header);
    expect(headers).toContain('Phenotypes / ClinVar / ClinVar variant ID');
  });

  it('gives every column a header no sibling shares', () => {
    for (const specOption of displaySpecFixture.options) {
      const headers = flatColumnsForOption(
        specOption,
        specOption.option_id
      ).map(header);
      expect(
        new Set(headers).size,
        `duplicate column header in ${specOption.option_id}: ${headers
          .filter((name, index) => headers.indexOf(name) !== index)
          .join(', ')}`
      ).toBe(headers.length);
    }
  });

  it('still splits a table into a column per table column', () => {
    const headers = flatColumnsForOption(
      option('phenotypes'),
      'Phenotypes'
    ).map(header);
    expect(headers).toContain('Phenotypes / Gene associated / Phenotype');
    expect(headers).toContain('Phenotypes / Gene associated / Source');
  });

  it('drops the prose from a split cell, keeping the value', () => {
    const columns = flatColumnsForOption(option('phenotypes'), 'Phenotypes');
    const supporting = columns.find(
      (column) =>
        header(column) ===
        'Phenotypes / ClinVar / Germline / Classification summary / Supporting'
    );
    const block = supporting?.renderSpec.blocks[0];
    const row = block?.kind === 'rows' ? block.rows?.[0] : undefined;
    expect(row?.item?.cells?.[0].template).toBe('{supporting}/{submissions}');
  });

  it('leaves the shared spec alone', () => {
    const before = JSON.stringify(option('phenotypes'));
    flatColumnsForOption(option('phenotypes'), 'Phenotypes');
    expect(JSON.stringify(option('phenotypes'))).toBe(before);
    expect(before).toContain('contribute to aggregate classification');
  });

  it('prunes each split column to its own cell', () => {
    const columns = flatColumnsForOption(option('phenotypes'), 'Phenotypes');
    const typeColumn = columns.find(
      (column) =>
        header(column) ===
        'Phenotypes / ClinVar / Germline / Classification summary / Type'
    );
    const block = typeColumn?.renderSpec.blocks[0];
    const row = block?.kind === 'rows' ? block.rows?.[0] : undefined;

    expect(row?.item?.cells).toHaveLength(1);
    expect(row?.item?.cells?.[0].from).toBe('type');
    expect(row?.label).toBeNull();
    // Without the `where`, the germline column would draw the somatic row too.
    expect(row?.where).toEqual({ field: 'type', equals: 'Germline' });
  });
});

describe('cellLabel', () => {
  it('reads a snake_case field as a heading', () => {
    expect(cellLabel({ from: 'review_status' })).toBe('Review status');
  });

  it('prefers a label the cell already carries', () => {
    expect(cellLabel({ from: 'l2g_score', label: 'L2G' })).toBe('L2G');
  });

  it('has nothing to say about a cell that reads no field', () => {
    expect(cellLabel({})).toBeUndefined();
  });
});

describe('compactTemplate', () => {
  it('keeps the span between the first and last placeholder', () => {
    expect(
      compactTemplate(
        '{supporting}/{submissions} submission(s) contribute to aggregate classification'
      )
    ).toBe('{supporting}/{submissions}');
  });

  it('keeps what sits between placeholders', () => {
    expect(compactTemplate('{a} of {b} things')).toBe('{a} of {b}');
  });

  it('collapses a single placeholder to itself', () => {
    expect(compactTemplate('Filed as {wording}')).toBe('{wording}');
  });

  it('leaves a template with no placeholder alone', () => {
    expect(compactTemplate('no fields here')).toBe('no fields here');
  });
});
