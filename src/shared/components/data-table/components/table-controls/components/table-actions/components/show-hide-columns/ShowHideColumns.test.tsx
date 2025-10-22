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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  TableContext,
  type TableContextType
} from 'src/shared/components/data-table/DataTable';

import ShowHideColumns from './ShowHideColumns';
import { defaultDataTableState } from 'src/shared/components/data-table/dataTableReducer';
import { createDataTableSampleData } from 'src/shared/components/data-table/DataTable.test';

import type { DataTableColumns } from 'src/shared/components/data-table/dataTableTypes';

const columns: DataTableColumns = createDataTableSampleData(1, 10).columns;

const defaultProps = {
  ...defaultDataTableState,
  dispatch: vi.fn(),
  columns,
  rows: defaultDataTableState.data.map((row, index) => ({
    rowId: index,
    cells: row
  }))
};

describe('<ShowHideColumns />', () => {
  const renderShowHideColumns = (props: Partial<TableContextType> = {}) =>
    render(
      <TableContext.Provider value={{ ...defaultProps, ...props }}>
        <ShowHideColumns />
      </TableContext.Provider>
    );

  let container: HTMLElement;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders without error', () => {
    container = renderShowHideColumns().container;
    expect(() => container).not.toThrow();
  });

  it('displays the correct set of options', () => {
    container = renderShowHideColumns().container;
    const totalOptions = container.querySelectorAll(
      'input[type="checkbox"]'
    ).length;

    expect(totalOptions).toBe(columns.length);
  });

  it('skips a column if it is not hideable', () => {
    // Make the first and the last column not hideable
    const newColumns = createDataTableSampleData(1, 10).columns;

    newColumns[0].isHideable = false;
    newColumns[columns.length - 1].isHideable = false;

    const expectedHiddenColumnTitles = [
      newColumns[0].title,
      newColumns[columns.length - 1].title
    ];

    container = renderShowHideColumns({
      columns: newColumns
    }).container;
    const checkboxLabels: string[] = [];

    container.querySelectorAll('label').forEach((element) => {
      checkboxLabels.push(element.textContent as string);
    });

    // expect two options to be removed
    expect(checkboxLabels.length).toBe(columns.length - 2);

    expect(
      checkboxLabels.every(
        (label) => !expectedHiddenColumnTitles.includes(label)
      )
    ).toBe(true);
  });

  it('calls the dispatch with the correct type and columnID', async () => {
    container = renderShowHideColumns().container;

    const allOptions = container.querySelectorAll('input[type="checkbox"]');

    await userEvent.click(allOptions[0]);

    const expectedHiddenColumnIds = new Set().add(columns[0].columnId);

    expect(defaultProps.dispatch).toHaveBeenCalledWith({
      type: 'set_hidden_column_ids',
      payload: expectedHiddenColumnIds
    });
  });
});
