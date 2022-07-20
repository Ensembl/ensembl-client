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
import { defaultTableState } from 'src/shared/components/table/state/tableReducer';
import { TableContext } from 'src/shared/components/table/Table';
import TableRow from '../table-row/TableRow';

/*
    - takes in an array of TableRows and displays them
*/

const TableBody = () => {
  const { data, currentPageNumber, rowsPerPage } =
    useContext(TableContext) || defaultTableState;

  if (!data) {
    return null;
  }
  const totalRows = data.length;
  const rowIdLowerBound = (currentPageNumber - 1) * rowsPerPage;
  const rowIdUpperBound = (currentPageNumber - 1) * rowsPerPage + rowsPerPage;
  return (
    <tbody>
      {data.map((rowData, rowId) => {
        if (rowsPerPage !== 0 && totalRows > rowsPerPage) {
          if (rowId < rowIdLowerBound || rowIdUpperBound - 1 < rowId) {
            return null;
          }
        }
        return <TableRow key={rowId} rowData={rowData} rowId={rowId} />;
      })}
    </tbody>
  );
};

export default TableBody;
