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
import TableHeaderCell from './components/table-header-cell/TableHeaderCell';

import type { TableData } from 'src/shared/components/data-table/dataTableTypes';

import styles from './TableHeader.scss';

const TableHeader = () => {
  const {
    columns,
    isSelectable,
    rowsPerPage,
    data,
    hiddenColumnIds,
    selectableColumnIndex,
    currentPageNumber
  } = useContext(TableContext) || {
    columns: null,
    data: null,
    selectableColumnIndex: 0
  };

  if (!columns || !data) {
    return null;
  }

  return (
    <thead className={styles.header}>
      <tr>
        {columns.map((column, index) => {
          const currentColumn = columns[index];
          if (hiddenColumnIds && hiddenColumnIds[currentColumn.columnId]) {
            return null;
          }

          const Contents = () => (
            <>
              {isSelectable && selectableColumnIndex === index ? (
                <HeaderStats
                  data={data}
                  rowsPerPage={rowsPerPage}
                  currentPageNumber={currentPageNumber}
                  key="selectable"
                />
              ) : (
                <TableHeaderCell {...column} key={column.columnId} />
              )}
            </>
          );

          return <Contents key={index} />;
        })}
      </tr>
    </thead>
  );
};

const HeaderStats = (props: {
  data: TableData;
  rowsPerPage: number;
  currentPageNumber: number;
}) => {
  const { data, rowsPerPage, currentPageNumber } = props;

  const totalRecords = data.length;

  /*
    To calculate the width in `ch`, we calculate the total number of characters that are possible in the stats
    and multiply it by 3 and add 5 for the extra ` to ` & `/`
  */
  const totalCharacters = String(totalRecords).length * 3 + 5;

  let start = 0,
    end = 0;

  if (rowsPerPage === Infinity || totalRecords < rowsPerPage) {
    start = 1;
    end = totalRecords;
  } else {
    let displayedRows = currentPageNumber * rowsPerPage;

    if (displayedRows > totalRecords) {
      displayedRows = totalRecords;
    }

    start = displayedRows - rowsPerPage + 1;
    end = displayedRows;
  }

  return (
    <th style={{ width: `${totalCharacters}ch`, minWidth: '75px' }}>
      {start} to {end}/{totalRecords}
    </th>
  );
};

export default TableHeader;
