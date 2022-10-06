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

import type { TableRowData } from 'src/shared/components/data-table/dataTableTypes';

import { RowFooter } from 'src/shared/components/table';
import RowSelector from './components/row-selector/RowSelector';

import styles from 'src/shared/components/data-table/DataTable.scss';
import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';

const TableRow = (props: { rowData: TableRowData; rowId: string }) => {
  const {
    isSelectable,
    searchText,
    dispatch,
    columns,
    hiddenColumnIds,
    hiddenRowIds,
    selectableColumnIndex,
    expandedContent,
    selectedRowIds
  } = useDataTable();

  if (hiddenRowIds && hiddenRowIds.has(props.rowId)) {
    return null;
  }

  const cells = props.rowData;

  if (searchText) {
    const shouldIncludeRow = cells.some((cell, index) => {
      const currentColumn = columns[index];
      if (currentColumn.isSearchable) {
        return false;
      }
      return cell?.toString().toLowerCase().includes(searchText);
    });

    if (!shouldIncludeRow) {
      return null;
    }
  }

  const handleSelector = (params: { rowId: string; checked: boolean }) => {
    if (params.checked) {
      selectedRowIds.add(params.rowId);
    } else {
      selectedRowIds.delete(params.rowId);
    }

    dispatch({
      type: 'set_selected_row_ids',
      payload: selectedRowIds
    });
  };

  return (
    <>
      <tr className={styles.row}>
        {cells?.map((cellData, index) => {
          const currentColumn = columns[index];
          if (hiddenColumnIds && hiddenColumnIds.has(currentColumn.columnId)) {
            return null;
          }

          const { renderer, bodyCellClassName } = currentColumn;

          const Contents = () => (
            <>
              {isSelectable && index === selectableColumnIndex && (
                <td className={styles.selectColumn}>
                  <RowSelector rowId={props.rowId} onChange={handleSelector} />
                </td>
              )}
              <td key={index} className={bodyCellClassName}>
                {renderer
                  ? renderer({
                      rowData: props.rowData,
                      rowId: props.rowId,
                      cellData
                    })
                  : cellData}
              </td>
            </>
          );

          return <Contents key={index} />;
        })}
      </tr>
      {expandedContent && !!expandedContent[props.rowId] && (
        <RowFooter colSpan={cells.length}>
          {expandedContent[props.rowId]}
        </RowFooter>
      )}
    </>
  );
};

export default TableRow;
