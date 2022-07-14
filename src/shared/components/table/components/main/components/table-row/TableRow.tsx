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
import { type TableRowData } from 'src/shared/components/table/state/tableReducer';
import TableCell from '../table-cell/TableCell';

/*
    - It should take in array of cells to be displayed.
    - Appends the actionable column (checkbox, eye icon) at the beginning of each row
    - Includes the option to append a dummy row that spans upto the width of the table on demand 
    - Each row must have an id column. It could be autogenrated.
*/

const TableRow = (props: { rowData: TableRowData }) => {
  if (!props.rowData) {
    return null;
  }
  return (
    <tr>
      {props.rowData.map((cellData, cellId) => {
        return <TableCell key={cellId}>{cellData}</TableCell>;
      })}
    </tr>
  );
};

export default TableRow;
