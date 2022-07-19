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
import { type TableRowData } from 'src/shared/components/table/state/tableReducer';

import { TableContext } from 'src/shared/components/table/Table';

import TableCell from '../table-cell/TableCell';
import RowSelector from './components/row-selector/RowSelector';

import styles from 'src/shared/components/table/Table.scss';
import classNames from 'classnames';

/*
    - It should take in array of cells to be displayed.
    - Appends the actionable column (checkbox, eye icon) at the beginning of each row
    - Includes the option to append a dummy row that spans upto the width of the table on demand 
    - Each row must have an id column. It could be autogenrated.
*/

const TableRow = (props: { rowData: TableRowData; rowId: number }) => {
  const { isSelectable, dispatch } = useContext(TableContext) || {
    isSelectable: true
  };

  if (!props.rowData || !dispatch) {
    return null;
  }

  const { cells, expandedContent } = props.rowData;

  const handleSelector = (params: { rowId: number; checked: boolean }) => {
    dispatch({
      type: 'set_selected_row_ids',
      payload: {
        [params.rowId]: params.checked
      }
    });
  };

  const rowClassNames = classNames(styles.row, {
    [styles.rowWithExpendedContent]: !!expandedContent
  });

  return (
    <>
      <tr className={rowClassNames}>
        {isSelectable && (
          <TableCell>
            <RowSelector rowId={props.rowId} onChange={handleSelector} />
          </TableCell>
        )}
        {cells?.map((cellData, cellId) => {
          return <TableCell key={cellId}>{cellData}</TableCell>;
        })}
      </tr>
      {expandedContent && (
        <tr className={classNames(styles.row, styles.rowExpanded)}>
          <TableCell colSpan={cells.length}>{expandedContent}</TableCell>
        </tr>
      )}
    </>
  );
};

export default TableRow;
