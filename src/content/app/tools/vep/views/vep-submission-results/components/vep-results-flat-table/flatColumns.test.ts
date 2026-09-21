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

    // The somatic row carries no label of its own, so it is named the same way.
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
    // A duplicate header is silent, because the grid still renders and only
    // the columns become impossible to tell apart. Every option is checked, so
    // the next duplicate is caught here.
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
    // The same option object draws the detail panel, where the sentence is the
    // point.
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
    // The header carries the row's name now, so the cell must not draw it too.
    expect(row?.label).toBeNull();
    // The `where` survives, or the germline column would draw both.
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
