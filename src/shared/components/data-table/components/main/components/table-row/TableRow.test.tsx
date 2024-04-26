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

import {
  TableContext,
  type TableContextType
} from 'src/shared/components/data-table/DataTable';

import TableRow from './TableRow';
import { defaultDataTableState } from 'src/shared/components/data-table/dataTableReducer';
import { createDataTableSampleData } from 'src/shared/components/data-table/DataTable.test';

const { columns, data } = createDataTableSampleData(1, 10);

const defaultProps = {
  ...defaultDataTableState,
  data,
  dispatch: jest.fn(),
  columns,
  rows: data.map((row, index) => ({
    rowId: index,
    cells: row
  }))
};

describe('<TableRow />', () => {
  const renderTableRow = (props: Partial<TableContextType> = {}) =>
    render(
      <TableContext.Provider value={{ ...defaultProps, ...props }}>
        <table>
          <tbody>
            <TableRow
              rowId={defaultProps.rows[0].rowId}
              rowData={defaultProps.rows[0].cells}
            />
          </tbody>
        </table>
      </TableContext.Provider>
    );

  let container: HTMLElement;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    container = renderTableRow().container;
    expect(() => container).not.toThrow();
  });

  it('respects hiddenRowIds and renders nothing', () => {
    const hiddenRowIds: Set<string | number> = new Set();
    hiddenRowIds.add(defaultProps.rows[0].rowId);

    container = renderTableRow({
      hiddenRowIds
    }).container;

    const tableRowElement = container.querySelector('tr');
    expect(tableRowElement).toBeFalsy();
  });

  it('respects hiddenColumnIds', () => {
    container = renderTableRow().container;

    const [firstCellContent, secondCellContent] = defaultProps.rows[0].cells;
    let firstCellElement = container.querySelector('td');
    expect(firstCellElement?.textContent).toBe(firstCellContent);

    const hiddenColumnIds: Set<string> = new Set();
    hiddenColumnIds.add(defaultProps.columns[0].columnId);
    container = renderTableRow({
      hiddenColumnIds
    }).container;

    firstCellElement = container.querySelector('td');
    expect(firstCellElement?.textContent).toBe(secondCellContent);
  });

  it('respects individual column renderer prop', () => {
    const columns = [...defaultProps.columns];
    const renderer = jest.fn();

    const indexOfColumnWithRenderer = 0;
    columns[indexOfColumnWithRenderer].renderer = renderer;

    container = renderTableRow({
      columns
    }).container;

    expect(renderer).toBeCalledWith({
      rowData: defaultProps.rows[0].cells,
      rowId: defaultProps.rows[0].rowId,
      cellData: defaultProps.rows[0].cells[indexOfColumnWithRenderer]
    });
  });

  it('respects expandedContent', () => {
    const firstRowId = defaultProps.rows[0].rowId;

    container = renderTableRow({
      expandedContent: {
        [firstRowId]: 'foo'
      }
    }).container;

    const expandedContent = container.querySelector('.rowFooter')?.textContent;

    expect(expandedContent).toBe('foo');
  });

  it('respects searchText', () => {
    container = renderTableRow({
      searchText: 'foo'
    }).container;

    expect(container.querySelector('tr')).toBeFalsy();

    container = renderTableRow({
      searchText: '1'
    }).container;

    expect(container.querySelector('tr')).toBeTruthy();
  });
});
