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

import sortBy from 'lodash/sortBy';
import { useContext } from 'react';

import { TableContext } from 'src/shared/components/data-table/DataTable';
import { SortingDirection } from '../dataTableTypes';

const useDataTable = () => {
  const dataTableContext = useContext(TableContext);

  if (!dataTableContext) {
    throw new Error('useDataTable must be used with DataTableContext Provider');
  }

  const {
    rows,
    currentPageNumber,
    rowsPerPage,
    columns,
    hiddenRowIds,
    sortedColumn,
    dispatch
  } = dataTableContext;

  const getAllVisibleRows = () => {
    return hiddenRowIds
      ? rows.filter((row) => {
          const { rowId } = row;

          return !hiddenRowIds[rowId];
        })
      : rows;
  };

  const getSortedCurrentPageRows = () => {
    const visibleRows = getAllVisibleRows();
    const totalRows = rows.length;
    const rowIndexLowerBound = (currentPageNumber - 1) * rowsPerPage;
    const rowIndexUpperBound = rowIndexLowerBound + rowsPerPage;

    let sortedRows = visibleRows;

    if (
      sortedColumn &&
      sortedColumn.sortedDirection !== SortingDirection.NONE
    ) {
      const sortedColumnIndex = columns.findIndex(
        (column) => column.columnId === sortedColumn.columnId
      );

      sortedRows =
        sortedColumn.sortedDirection === SortingDirection.ASC
          ? sortBy(sortedRows, (row) => row.cells[sortedColumnIndex])
          : sortBy(sortedRows, (row) => row.cells[sortedColumnIndex]).reverse();
    }

    return totalRows > rowsPerPage
      ? sortedRows.filter(
          (_, rowIndex) =>
            !(
              rowIndex < rowIndexLowerBound || rowIndexUpperBound - 1 < rowIndex
            )
        )
      : sortedRows;
  };

  const setPageNumber = (value: number) => {
    dispatch({
      type: 'set_current_page_number',
      payload: value
    });
  };

  return {
    getAllVisibleRows,
    getSortedCurrentPageRows,
    setPageNumber,
    ...dataTableContext
  };
};

export default useDataTable;
