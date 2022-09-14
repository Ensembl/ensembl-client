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

import { useContext } from 'react';

import { TableContext } from 'src/shared/components/data-table/DataTable';
import { SortingDirection } from '../dataTableTypes';

const useDataTable = () => {
  const dataTableContext = useContext(TableContext);

  if (!dataTableContext) {
    throw new Error('useDataTable must be used with DataTableContext Provider');
  }

  const {
    data,
    currentPageNumber,
    rowsPerPage,
    columns,
    uniqueColumnId,
    hiddenRowIds,
    sortedColumn
  } = dataTableContext;

  const getCurrentPageRows = () => {
    const uniqueColumnIndex = columns?.findIndex(
      (column) => column.columnId === uniqueColumnId
    );

    const totalRows = data.length;
    const rowIndexLowerBound = (currentPageNumber - 1) * rowsPerPage;
    const rowIndexUpperBound = rowIndexLowerBound + rowsPerPage;

    const visibleRows = hiddenRowIds
      ? data.filter((rowData) => {
          const rowId = String(rowData[uniqueColumnIndex]);

          return !hiddenRowIds[rowId];
        })
      : data;

    // Filter the rows that needs to be displayed in the current page
    return visibleRows.filter((_, rowIndex) => {
      if (totalRows > rowsPerPage) {
        if (
          rowIndex < rowIndexLowerBound ||
          rowIndexUpperBound - 1 < rowIndex
        ) {
          return false;
        }
      }
      return true;
    });
  };

  const getSortedCurrentPageRows = () => {
    const rowsThisPage = getCurrentPageRows();

    if (!sortedColumn) {
      return rowsThisPage;
    }

    const sortedColumnIndex = columns.findIndex(
      (column) => column.columnId === sortedColumn.columnId
    );
    return rowsThisPage.sort((currentRow, nextRow) => {
      const currentValue = currentRow[sortedColumnIndex]?.toString() || '';
      const nextValue = nextRow[sortedColumnIndex]?.toString() || '';

      const currentValueAsNumber = Number(currentValue);
      const nextValueAsNumber = Number(nextValue);
      if (!isNaN(currentValueAsNumber) && !isNaN(nextValueAsNumber)) {
        if (currentValueAsNumber < nextValueAsNumber) {
          return sortedColumn.sortedDirection === SortingDirection.ASC ? -1 : 1;
        } else if (currentValueAsNumber > nextValueAsNumber) {
          return sortedColumn.sortedDirection === SortingDirection.ASC ? 1 : -1;
        }
      } else {
        if (currentValue < nextValue) {
          return sortedColumn.sortedDirection === SortingDirection.ASC ? -1 : 1;
        } else if (currentValue > nextValue) {
          return sortedColumn.sortedDirection === SortingDirection.ASC ? 1 : -1;
        }
      }

      return 0;
    });
  };

  return {
    getCurrentPageRows,
    getSortedCurrentPageRows,
    ...dataTableContext
  };
};

export default useDataTable;
