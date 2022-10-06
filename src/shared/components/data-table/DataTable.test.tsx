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
import { times } from 'lodash';

import DataTable from './DataTable';
import { defaultDataTableState } from 'src/shared/components/data-table/dataTableReducer';

import { type TableProps } from 'src/shared/components/data-table/DataTable';

import { TableData, DataTableColumns } from './dataTableTypes';

export const createDataTableSampleData = (
  rows: number,
  columns: number
): { data: TableData; columns: DataTableColumns } => {
  return {
    data: times(rows, (row) =>
      times(columns, (column) => `Cell ${row},${column}`)
    ),
    columns: times(columns, (column) => ({
      columnId: `${column}`
    }))
  };
};

const { columns, data } = createDataTableSampleData(15, 10);

const defaultProps = {
  state: {
    ...defaultDataTableState,
    data
  },
  columns
};

describe('<DataTable />', () => {
  const renderDataTable = (props: Partial<TableProps> = {}) =>
    render(<DataTable {...defaultProps} {...props} />);

  let container: HTMLElement;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    container = renderDataTable().container;
    expect(() => container).not.toThrow();
  });

  it('displays correct number of rows per page', () => {
    container = renderDataTable({
      state: {
        ...defaultProps.state,
        rowsPerPage: 10
      }
    }).container;

    expect(container.querySelectorAll('tbody tr').length).toBe(10);

    container = renderDataTable({
      state: {
        ...defaultProps.state,
        rowsPerPage: 20
      }
    }).container;

    expect(container.querySelectorAll('tbody tr').length).toBe(
      defaultProps.state.data.length
    );

    container = renderDataTable({
      state: {
        ...defaultProps.state,
        rowsPerPage: Infinity
      }
    }).container;

    expect(container.querySelectorAll('tbody tr').length).toBe(
      defaultProps.state.data.length
    );

    container = renderDataTable({
      state: {
        ...defaultProps.state,
        rowsPerPage: 10,
        currentPageNumber: 2
      }
    }).container;

    expect(container.querySelectorAll('tbody tr').length).toBe(5);
  });

  it('respects onStateChange', async () => {
    const onStateChange = jest.fn();
    container = renderDataTable({
      onStateChange
    }).container;

    expect(onStateChange).toBeCalledWith(defaultProps.state);
  });
});
