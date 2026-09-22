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

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import VepResultsFlatTable, { ROWS_PER_PAGE } from './VepResultsFlatTable';

import type { DisplaySpec } from 'src/content/app/tools/vep/types/vepDisplaySpec';
import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';
import type { VepResultsResponse } from 'src/content/app/tools/vep/types/vepResultsResponse';

const tableDisplay: DisplaySpec = {
  options: [
    {
      option_id: 'phenotypes',
      blocks: [
        {
          kind: 'table',
          from: 'phenotype_gene.phenotypes',
          columns: [
            { from: 'phenotype', label: 'Phenotype' },
            { from: 'source', label: 'Source' }
          ],
          truncate: { visible_count: 1 }
        }
      ]
    }
  ],
  plugin_scopes: { phenotype_gene: 'transcript' }
};

const listDisplay: DisplaySpec = {
  options: [
    {
      option_id: 'phenotypes',
      blocks: [
        {
          kind: 'list',
          from: 'phenotype_gene.phenotypes',
          item: { cells: [{ from: 'phenotype' }] },
          truncate: { visible_count: 1 }
        }
      ]
    }
  ],
  plugin_scopes: { phenotype_gene: 'transcript' }
};

const panels: FormPanel[] = [
  {
    id: 'phenotype_and_disease_associations',
    label: 'Phenotype & disease associations',
    options: [
      { id: 'phenotypes', label: 'Phenotypes', type: 'boolean', default: true }
    ]
  }
];

const variants = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    name: `${prefix}${index}`,
    alternative_alleles: [
      {
        allele_sequence: 'A',
        annotations: [],
        predicted_molecular_consequences: [
          {
            feature_type: 'transcript',
            stable_id: `ENST${index}`,
            gene_symbol: `GENE${index}`,
            consequences: ['missense_variant'],
            annotations: [
              {
                plugin: 'phenotype_gene',
                scope: 'transcript',
                data: {
                  phenotypes: [
                    { phenotype: `${prefix}${index} first`, source: 'OMIM' },
                    { phenotype: `${prefix}${index} second`, source: 'OMIM' }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  })) as unknown as VepResultsResponse['variants'];

const renderTable = (
  rows: VepResultsResponse['variants'],
  display: DisplaySpec = tableDisplay
) => (
  <VepResultsFlatTable
    genomeId="homo_sapiens_GCA_000001405_29"
    variants={rows}
    parameters={{}}
    panels={panels}
    display={display}
    afSources={[]}
  />
);

const openFirstRow = () => {
  fireEvent.click(screen.getAllByRole('button', { name: '+ 1 more' })[0]);
};

describe('VepResultsFlatTable', () => {
  afterEach(cleanup);

  it('opens both columns of a split table together', () => {
    render(renderTable(variants('rs', 2)));
    openFirstRow();

    expect(screen.getAllByRole('button', { name: 'Show fewer' })).toHaveLength(
      2
    );
  });

  it('shows the next row page with every table closed', () => {
    render(renderTable(variants('rs', ROWS_PER_PAGE + 1)));
    openFirstRow();
    fireEvent.click(screen.getByRole('button', { name: 'Next ›' }));

    expect(screen.getByText(`rs${ROWS_PER_PAGE}`)).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Show fewer' })).toBeNull();
  });

  it('shows the next row page with every list closed', () => {
    render(renderTable(variants('rs', ROWS_PER_PAGE + 1), listDisplay));
    openFirstRow();
    fireEvent.click(screen.getByRole('button', { name: 'Next ›' }));

    expect(screen.getByText(`rs${ROWS_PER_PAGE}`)).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Show fewer' })).toBeNull();
  });

  it('shows new results with every table closed', () => {
    const { rerender } = render(renderTable(variants('rs', 2)));
    openFirstRow();
    rerender(renderTable(variants('other', 2)));

    expect(screen.getByText('other0')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Show fewer' })).toBeNull();
  });
});
