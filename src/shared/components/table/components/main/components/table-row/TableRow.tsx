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

import classNames from 'classnames';

import styles from 'src/shared/components/table/Table.scss';

/*
    - It should take in array of cells to be displayed.
    - Appends the actionable column (checkbox, eye icon) at the beginning of each row
    - Includes the option to append a dummy row that spans upto the width of the table on demand 
    - Each row must have an id column. It could be autogenrated.
*/

const TableRow = (props: { rowData: TableRowData; rowId: string }) => {
  const {
    isSelectable,
    searchText,
    dispatch,
    columns,
    hiddenColumnIds,
    hiddenRowIds,
    data
  } = useContext(TableContext) || {
    isSelectable: true
  };

  if (!(data && props.rowData && dispatch && columns && hiddenRowIds)) {
    return null;
  }

  if (hiddenRowIds[props.rowId]) {
    return null;
  }

  const { cells, expandedContent } = props.rowData;

  if (searchText) {
    const shouldIncludeRow = cells.some((cell, index) => {
      const currentColumn = columns[index];
      if (currentColumn.isSearchable) {
        return false;
      }
      return cell?.toString().includes(searchText);
    });

    if (!shouldIncludeRow) {
      return null;
    }
  }

  const handleSelector = (params: { rowId: string; checked: boolean }) => {
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

  const totalRecords = data.length;

  /*
    The width of the row selector column has to match the width of the header stats (first header column)
    To calculate the width, we calculate the total number of character that are possible in the stats
    and multiply it be 10px for each character to get the width.
  */
  const rowSelectorWidth = (String(totalRecords).length * 2 + 1) * 10;
  return (
    <>
      <tr className={rowClassNames}>
        {isSelectable && (
          <TableCell style={{ width: rowSelectorWidth }}>
            <RowSelector rowId={props.rowId} onChange={handleSelector} />
          </TableCell>
        )}
        {cells?.map((cellData, index) => {
          const currentColumn = columns[index];
          if (hiddenColumnIds && hiddenColumnIds[currentColumn.columnId]) {
            return null;
          }

          const { width } = currentColumn;
          return (
            <TableCell key={index} style={{ width }}>
              {cellData}
            </TableCell>
          );
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
