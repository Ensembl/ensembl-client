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

import classNames from 'classnames';
import React, { useContext } from 'react';

import type { TableRowData } from 'src/shared/components/table/state/tableReducer';
import { TableContext } from 'src/shared/components/table/Table';

import TableCell from '../table-cell/TableCell';
import RowSelector from './components/row-selector/RowSelector';

import styles from 'src/shared/components/table/Table.scss';

const TableRow = (props: { rowData: TableRowData; rowId: string }) => {
  const {
    isSelectable,
    searchText,
    dispatch,
    columns,
    hiddenColumnIds,
    hiddenRowIds,
    data,
    selectableColumnIndex,
    expandedContent
  } = useContext(TableContext) || {
    isSelectable: true,
    selectableColumnIndex: 0
  };

  if (!(data && props.rowData && dispatch && columns)) {
    return null;
  }

  if (hiddenRowIds && hiddenRowIds[props.rowId]) {
    return null;
  }

  const cells = props.rowData;

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
    [styles.rowWithExpendedContent]: !!(
      expandedContent && expandedContent[props.rowId]
    )
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
        {cells?.map((cellData, index) => {
          const currentColumn = columns[index];
          if (hiddenColumnIds && hiddenColumnIds[currentColumn.columnId]) {
            return null;
          }

          const { width, renderer } = currentColumn;

          const Contents = () => (
            <>
              {isSelectable && index === selectableColumnIndex ? (
                <TableCell style={{ minWidth: 74, width: rowSelectorWidth }}>
                  <RowSelector rowId={props.rowId} onChange={handleSelector} />
                </TableCell>
              ) : (
                <TableCell key={index} style={{ minWidth: width }}>
                  {renderer
                    ? renderer({
                        rowData: props.rowData,
                        rowId: props.rowId,
                        cellData
                      })
                    : cellData}
                </TableCell>
              )}
            </>
          );

          return <Contents key={index} />;
        })}
      </tr>
      {expandedContent && !!expandedContent[props.rowId] && (
        <tr className={classNames(styles.row, styles.rowExpanded)}>
          <TableCell colSpan={cells.length}>
            {expandedContent[props.rowId]}
          </TableCell>
        </tr>
      )}
    </>
  );
};

export default TableRow;
