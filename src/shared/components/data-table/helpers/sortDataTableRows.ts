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

import orderBy from 'lodash/orderBy';
import {
  type TableRows,
  type DataTableColumns,
  type SortingOptions,
  type TableRowsSortingFunction,
  SortingOrder
} from 'src/shared/components/data-table/dataTableTypes';

export const sortDataTableRows = (params: {
  rows: TableRows;
  columns: DataTableColumns;
  sortingOptions: SortingOptions;
}) => {
  const { rows, columns, sortingOptions } = params;

  const columnIndex = columns.findIndex(
    (column) => column.columnId === sortingOptions.columnId
  );

  if (columnIndex === -1) {
    // shouldn't happen; but better safe than sorry
    return rows;
  }

  const sortFunction = columns[columnIndex].sortFn ?? plainSorter;

  return sortFunction(rows, columnIndex, sortingOptions.sortingOrder);
};

// useful for sorting strings and numbers in ascending or descending order
const plainSorter: TableRowsSortingFunction = (
  tableRows,
  columnIndex,
  sortingOrder
) => {
  const iteratee = (data: any) => data.cells[columnIndex] as string | number;
  // translate our magic words to Lodash's magic words
  const lodashSortingOrder =
    sortingOrder === SortingOrder.DESC ? 'desc' : 'asc';
  return orderBy(tableRows, [iteratee], [lodashSortingOrder]);
};
