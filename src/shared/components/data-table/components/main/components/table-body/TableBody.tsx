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

import React, { useContext } from 'react';

import { TableContext } from 'src/shared/components/data-table/DataTable';
import TableRow from '../table-row/TableRow';

import { defaultTableState } from 'src/shared/components/data-table/dataTableReducer';

import { SortingDirection } from 'src/shared/components/data-table/dataTableTypes';

const TableBody = () => {
  const {
    data,
    currentPageNumber,
    rowsPerPage,
    columns,
    sortedColumn,
    uniqueColumnId
  } = useContext(TableContext) || {
    currentPageNumber: defaultTableState.currentPageNumber,
    rowsPerPage: defaultTableState.rowsPerPage
  };

  if (!(data && columns)) {
    return null;
  }
  const totalRows = data.length;
  const rowIndexLowerBound = (currentPageNumber - 1) * rowsPerPage;
  const rowIndexUpperBound = rowIndexLowerBound + rowsPerPage;

  // Filter the rows that needs to be displayed in the current page
  const rowsThisPage = data.filter((_, rowIndex) => {
    if (totalRows > rowsPerPage) {
      if (rowIndex < rowIndexLowerBound || rowIndexUpperBound - 1 < rowIndex) {
        return false;
      }
    }
    return true;
  });

  if (sortedColumn) {
    const sortedColumnIndex = columns.findIndex(
      (column) => column.columnId === sortedColumn.columnId
    );
    rowsThisPage.sort((currentRow, nextRow) => {
      const currentValue = currentRow[sortedColumnIndex]?.toString() || '';
      const nextValue = nextRow[sortedColumnIndex]?.toString() || '';

      if (currentValue < nextValue) {
        return sortedColumn.sortedDirection === SortingDirection.ASC ? -1 : 1;
      } else if (currentValue > nextValue) {
        return sortedColumn.sortedDirection === SortingDirection.ASC ? 1 : -1;
      }

      return 0;
    });
  }

  const uniqueColumnIndex = uniqueColumnId
    ? columns.findIndex((column) => column.columnId === uniqueColumnId)
    : undefined;

  return (
    <tbody>
      {rowsThisPage.map((rowData, index) => {
        const rowId =
          uniqueColumnIndex !== undefined
            ? String(rowData[uniqueColumnIndex])
            : index;

        return (
          <TableRow key={index} rowData={rowData} rowId={rowId as string} />
        );
      })}
    </tbody>
  );
};

export default TableBody;
