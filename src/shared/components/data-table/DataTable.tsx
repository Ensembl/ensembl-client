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
import React, { type ReactNode, useEffect, useReducer, useRef } from 'react';
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
  type DataTableColumns,
  type TableRows
} from './dataTableTypes';

import styles from './DataTable.module.css';

export type TableContextType = DataTableState & {
  dispatch: React.Dispatch<AllTableActions>;
  columns: DataTableColumns;
  theme?: TableTheme;
  selectableColumnIndex?: number;
  expandedContent?: { [rowId: string]: ReactNode };
  disabledActions?: TableAction[];
  downloadFileName?: string;
  downloadHandler?: () => Promise<void>;
  rows: TableRows;
};

export const TableContext = React.createContext(
  null as TableContextType | null
);

export type TableProps = {
  state?: Partial<DataTableState>;
  columns: DataTableColumns;
  theme?: TableTheme;
  selectableColumnIndex?: number;
  className?: string;
  expandedContent?: { [rowId: string]: ReactNode };
  disabledActions?: TableAction[];
  downloadFileName?: string;
  downloadHandler?: () => Promise<void>;
  onStateChange?: (newState: DataTableState) => void;
};
const DataTable = (props: TableProps) => {
  const initialState = {
    ...defaultDataTableState,
    ...(props.state || {})
  };

  const firstRenderRef = useRef(true);
  const shouldResetStateRef = useRef(true);

  const [tableState, dispatch] = useReducer(tableReducer, initialState);

  /*
    The useReducer used above does not update the tableState when the parent component updates the state.
    To fix this, we need to check if state property has changed by the parent and reset it if necessary.
  */
  useEffect(() => {
    if (shouldResetStateRef.current && !firstRenderRef.current) {
      dispatch({
        type: 'restore_defaults',
        payload: initialState
      });
    }

    /* 
      Here we reset shouldResetStateRef to the initial value (true), so that the 
      dispatch above gets executed when the state from the parent changes
    */
    shouldResetStateRef.current = true;
  }, [props.state]);

  useEffect(() => {
    if (!firstRenderRef.current) {
      props.onStateChange?.(tableState);

      /*
        The onStateChange call above will update a state in the parent component which will trigger a rerender.
        At this point, we do not want to reset the tableState in the useEffect above
        So to prevent it, we set shouldResetStateRef to false
      */
      shouldResetStateRef.current = false;
    }
    firstRenderRef.current = false;
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
        rows: tableState.data.map((row, index) => ({
          rowId: index,
          cells: row
        })),
        theme: props.theme,
        selectableColumnIndex: props.selectableColumnIndex ?? 0,
        expandedContent: props.expandedContent ?? {},
        disabledActions: props.disabledActions,
        downloadFileName: props.downloadFileName,
        downloadHandler: props.downloadHandler
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

export default DataTable;
