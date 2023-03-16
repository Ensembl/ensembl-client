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

import React from 'react';
import { render } from '@testing-library/react';

import {
  TableContext,
  type TableContextType
} from 'src/shared/components/data-table/DataTable';

import TableActions from './TableActions';
import { defaultDataTableState } from 'src/shared/components/data-table/dataTableReducer';
import { createDataTableSampleData } from 'src/shared/components/data-table/DataTable.test';

import {
  DataTableColumns,
  TableAction
} from 'src/shared/components/data-table/dataTableTypes';

const columns: DataTableColumns = createDataTableSampleData(1, 10).columns;

const defaultProps = {
  ...defaultDataTableState,
  dispatch: jest.fn(),
  columns,
  rows: defaultDataTableState.data.map((row, index) => ({
    rowId: index,
    cells: row
  }))
};

describe('<TableActions />', () => {
  const renderTableActions = (props: Partial<TableContextType> = {}) =>
    render(
      <TableContext.Provider value={{ ...defaultProps, ...props }}>
        <TableActions />
      </TableContext.Provider>
    );

  let container: HTMLElement;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    container = renderTableActions().container;
    expect(() => container).not.toThrow();
  });

  it('respects the disabledActions list', () => {
    container = renderTableActions({
      disabledActions: [TableAction.FILTERS, TableAction.FIND_IN_TABLE]
    }).container;

    const filterOption = document.querySelector(
      `option[value="${TableAction.FILTERS}"`
    );
    const defaultOption = document.querySelector(
      `option[value="${TableAction.FIND_IN_TABLE}"`
    );
    const downloadOption = document.querySelector(
      `option[value="${TableAction.DOWNLOAD_ALL_DATA}"`
    );

    expect(filterOption).toBe(null);
    expect(defaultOption).toBe(null);

    expect(downloadOption).not.toBe(null);
  });
});
