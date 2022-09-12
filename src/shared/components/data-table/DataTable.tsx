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
import React, { type ReactNode, useEffect, useReducer } from 'react';
import classNames from 'classnames';

import Table from '../table/Table';
import TableBody from './components/main/components/table-body/TableBody';
import TableHeader from './components/main/components/table-header/TableHeader';
import TableControls from './components/table-controls/TableControls';
import { defaultDataTableState, tableReducer } from './dataTableReducer';

import {
  type AllTableActions,
  TableAction,
  type DataTableState,
  type TableTheme,
  type DataTableColumns
} from './dataTableTypes';

import styles from './DataTable.scss';

type TableContextType = DataTableState & {
  dispatch: React.Dispatch<AllTableActions>;
  columns: DataTableColumns;
  theme: TableTheme;
  uniqueColumnId?: string;
  selectableColumnIndex: number;
  expandedContent: { [rowId: string]: ReactNode };
  disabledActions?: TableAction[];
};

export const TableContext = React.createContext(
  null as TableContextType | null
);

export type TableProps = {
  onStateChange?: (newState: DataTableState) => void;
  columns: DataTableColumns;
  state?: Partial<DataTableState>;
  theme: TableTheme;
  uniqueColumnId?: string; // Values in this column will be used to identify individual rows
  selectableColumnIndex: number;
  className?: string;
  expandedContent: { [rowId: string]: ReactNode };
  disabledActions?: TableAction[];
};
const DataTable = (props: TableProps) => {
  const initialDataTableState = {
    ...defaultDataTableState,
    ...(props.state || {})
  };

  const [tableState, dispatch] = useReducer(
    tableReducer,
    initialDataTableState
  );

  useEffect(() => {
    props.onStateChange?.(tableState);
  }, [tableState]);

  const wrapperClasses = classNames(
    styles.wrapper,
    {
      [styles.wrapperThemeDark]: props.theme === 'dark'
    },
    props.className
  );

  const tableClasses = classNames(styles.table, {
    [styles.tableThemeDark]: props.theme === 'dark'
  });
  return (
    <TableContext.Provider
      value={{
        ...tableState,
        dispatch,
        columns: props.columns,
        theme: props.theme,
        uniqueColumnId: props.uniqueColumnId,
        selectableColumnIndex: props.selectableColumnIndex,
        expandedContent: props.expandedContent,
        disabledActions: props.disabledActions
      }}
    >
      <div className={wrapperClasses}>
        <TableControls />
        <div className={styles.tableContainer}>
          <Table className={tableClasses} stickyHeader={true}>
            <TableHeader />
            <TableBody />
          </Table>
        </div>
      </div>
    </TableContext.Provider>
  );
};

DataTable.defaultProps = {
  theme: 'light',
  selectableColumnIndex: 0,
  expandedContent: {}
};

export default DataTable;
