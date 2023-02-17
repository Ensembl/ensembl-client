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
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import DataTable from './DataTable';
import { getStructuredContentFromCellInRow } from './dataTableHelpers';
import { defaultDataTableState } from 'src/shared/components/data-table/dataTableReducer';

import type { TableProps } from 'src/shared/components/data-table/DataTable';
import {
  type TableData,
  type TableCellStructuredData,
  type DataTableColumns,
  SortingOrder
} from './dataTableTypes';

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
    container = renderDataTable().container;

    expect(container.querySelectorAll('tbody tr').length).toBe(
      defaultDataTableState.rowsPerPage
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
        currentPageNumber: 2
      }
    }).container;

    expect(container.querySelectorAll('tbody tr').length).toBe(5);
  });

  it('calls onStateChange with the updated state when the state changes', async () => {
    const onStateChange = jest.fn();
    container = renderDataTable({
      onStateChange
    }).container;

    expect(onStateChange).not.toBeCalled();

    const rightPaginationArrow = container.querySelectorAll('.showHide')[1];
    await userEvent.click(rightPaginationArrow);

    expect(onStateChange).toBeCalledWith({
      ...defaultProps.state,
      currentPageNumber: 2
    });
  });

  it('updates tableState when the state from the parent changes', async () => {
    const onStateChange = jest.fn();
    const { container, rerender } = renderDataTable({
      onStateChange
    });

    const paginationInput = container.querySelector('.pagination input');

    expect(paginationInput?.getAttribute('value')).toBe('1');

    rerender(
      <DataTable
        {...defaultProps}
        {...{
          state: {
            ...defaultProps.state,
            currentPageNumber: 2
          }
        }}
      />
    );

    expect(paginationInput?.getAttribute('value')).toBe('2');
  });

  it('supports a custom renderer for structured cell content', () => {
    const columns: DataTableColumns = [
      {
        columnId: '1',
        title: 'Foo',
        renderer: (params) => {
          const cellData = params.cellData as TableCellStructuredData;
          const data = cellData.data as { part1: string; part2: string };
          return (
            <>
              <span className="part1">{data.part1}</span>
              <span className="part2">{data.part2}</span>
            </>
          );
        }
      }
    ];
    const contentForPart1 = faker.lorem.sentence();
    const contentForPart2 = faker.lorem.sentence();
    const tableData: TableData = [
      [{ data: { part1: contentForPart1, part2: contentForPart2 } }]
    ];

    const tableState = { ...defaultDataTableState, data: tableData };

    const { container } = render(
      <DataTable columns={columns} state={tableState} />
    );

    const renderedCell = container.querySelector('tbody tr td:nth-child(2)'); // our data is in the second column, because the first column contains checkboxes
    const renderedFirstPart = renderedCell?.querySelector('.part1');
    const renderedSecondPart = renderedCell?.querySelector('.part2');

    expect(renderedFirstPart?.textContent).toBe(contentForPart1);
    expect(renderedSecondPart?.textContent).toBe(contentForPart2);
  });

  it('supports a custom sorting function for a column', async () => {
    // in this test, we are going to sort rows by the value of an arbitrary field on the data passed into table cells
    // (we are calling this field "rank" here; but it could be anything)
    const columns: DataTableColumns = [
      {
        columnId: '1',
        title: 'Foo',
        isSortable: true,
        renderer: (params) => {
          const cellData = params.cellData as TableCellStructuredData;
          const data = cellData.data as { text: string };
          return <span className="part1">{data.text}</span>;
        },
        sortFn: (rows, columnIndex, order) => {
          return [...rows].sort((rowA, rowB) => {
            const { rank: rank1 } = getStructuredContentFromCellInRow<{
              rank: number;
            }>(rowA, columnIndex);
            const { rank: rank2 } = getStructuredContentFromCellInRow<{
              rank: number;
            }>(rowB, columnIndex);
            return order === SortingOrder.ASC ? rank1 - rank2 : rank2 - rank1;
          });
        }
      }
    ];

    const tableData: TableData = [
      [{ data: { rank: 2, text: 'second item' } }],
      [{ data: { rank: 1, text: 'first item' } }],
      [{ data: { rank: 4, text: 'fourth item' } }],
      [{ data: { rank: 3, text: 'third item' } }]
    ];

    const tableState = { ...defaultDataTableState, data: tableData };

    const { container } = render(
      <DataTable columns={columns} state={tableState} />
    );

    const changeSort = async () => {
      const sortButton = container.querySelector('.sortArrow') as HTMLElement;
      await userEvent.click(sortButton);
    };

    const getFirstCellContent = () => {
      const renderedColumnRows = [
        ...container.querySelectorAll('tbody tr td:last-of-type')
      ];
      return renderedColumnRows[0].textContent;
    };

    // before sorting
    expect(getFirstCellContent()).toBe('second item');

    await changeSort();

    // first click sorts the rows in descending order; don't know why we decided that
    expect(getFirstCellContent()).toBe('fourth item');

    await changeSort();

    // next click sorts the rows in the opposite (ascending) order
    expect(getFirstCellContent()).toBe('first item');
  });
});
