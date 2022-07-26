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
import { TableContext } from 'src/shared/components/table/Table';
import TableHeaderCell from './components/table-header-cell/TableHeaderCell';

import TableCell from '../table-cell/TableCell';
import { TableData } from 'src/shared/components/table/state/tableReducer';

import styles from './TableHeader.scss';
/*
    - Should receive an array of header items along with it's configurations like tooltip, isSortable, isHighlighted
    - First column in the header should display the total rows available
    - Subsequent columns will display individual header items wrapped in `TableCell`
    - Should header be fixed always? If not, make it optional.
*/

const TableHeader = () => {
  const { columns, isSelectable, rowsPerPage, data, hiddenColumnIds } =
    useContext(TableContext) || { columns: null, data: null };

  if (!columns || !data) {
    return null;
  }

  return (
    <thead className={styles.header}>
      <tr>
        {isSelectable && <HeaderStats data={data} rowsPerPage={rowsPerPage} />}
        {columns.map((column, index) => {
          const currentColumn = columns[index];
          if (hiddenColumnIds && hiddenColumnIds[currentColumn.columnId]) {
            return null;
          }

          return <TableHeaderCell {...column} key={index} />;
        })}
      </tr>
    </thead>
  );
};

const HeaderStats = (props: { data: TableData; rowsPerPage: number }) => {
  const { data, rowsPerPage } = props;

  const totalRecords = data.length;

  /*
    The width of the row selector column has to match the width of the header stats (first header column)
    To calculate the width, we calculate the total number of character that are possible in the stats
    and multiply it be 10px for each character to get the width.
  */
  const width = (String(totalRecords).length * 2 + 1) * 10;

  let displayedRows = totalRecords;

  // Note: rowsPerPage will be 0 when we need to show all records
  if (rowsPerPage > 0) {
    displayedRows = rowsPerPage > totalRecords ? totalRecords : rowsPerPage;
  }

  return (
    <TableCell style={{ width }}>
      {displayedRows}/{totalRecords}
    </TableCell>
  );
};

export default TableHeader;
