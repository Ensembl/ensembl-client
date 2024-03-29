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

import { useContext, useEffect, useState } from 'react';

import { sortDataTableRows } from '../helpers/sortDataTableRows';

import { TableContext } from 'src/shared/components/data-table/DataTable';

import { SortingOrder } from '../dataTableTypes';

const useDataTable = () => {
  const dataTableContext = useContext(TableContext);

  if (!dataTableContext) {
    throw new Error('useDataTable must be used with DataTableContext Provider');
  }

  const {
    rows: allRows,
    currentPageNumber,
    rowsPerPage,
    columns,
    hiddenRowIds,
    sortingOptions,
    dispatch,
    searchText
  } = dataTableContext;

  const [filteredRows, setFilteredRows] = useState(allRows);

  useEffect(() => {
    const filteredRows = !searchText
      ? allRows
      : [...allRows].filter((row) => {
          return row.cells.some((cell, index) => {
            const currentColumn = columns[index];
            if (currentColumn.isSearchable) {
              return false;
            }
            return cell?.toString().toLowerCase().includes(searchText);
          });
        });

    setFilteredRows(filteredRows);
  }, [searchText]);

  const getAllVisibleRows = () => {
    return hiddenRowIds
      ? filteredRows.filter((row) => {
          const { rowId } = row;

          return !hiddenRowIds.has(rowId);
        })
      : filteredRows;
  };

  const getSortedCurrentPageRows = () => {
    let rows = [...filteredRows];
    const totalRows = filteredRows.length;
    const rowIndexLowerBound = (currentPageNumber - 1) * rowsPerPage;
    const rowIndexUpperBound = rowIndexLowerBound + rowsPerPage;

    if (sortingOptions && sortingOptions.sortingOrder !== SortingOrder.NONE) {
      rows = sortDataTableRows({
        rows,
        columns,
        sortingOptions
      });
    }

    return totalRows > rowsPerPage
      ? rows.filter(
          (_, rowIndex) =>
            !(
              rowIndex < rowIndexLowerBound || rowIndexUpperBound - 1 < rowIndex
            )
        )
      : rows;
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
    filteredRows,
    ...dataTableContext
  };
};

export default useDataTable;
