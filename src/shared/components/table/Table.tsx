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
import React, { type ReactNode, useEffect, useReducer, useRef } from 'react';
import TableBody from './components/main/components/table-body/TableBody';
import TableHeader from './components/main/components/table-header/TableHeader';
import TableControls from './components/table-controls/TableControls';
import {
  AllTableActions,
  defaultTableState,
  TableAction,
  tableReducer,
  TableState,
  TableTheme
} from './state/tableReducer';

import styles from './Table.scss';

type TableContextType = TableState & {
  dispatch: React.Dispatch<AllTableActions>;
  theme: TableTheme;
  uniqueColumnId?: string;
  selectableColumnIndex: number;
  expandedContent: { [rowId: string]: ReactNode };
  disabledActions?: TableAction[];
};

export const TableContext = React.createContext(
  null as TableContextType | null
);

export type TableProps = Partial<TableState> & {
  onStateChange?: (newState: TableState) => void;
  theme: TableTheme;
  uniqueColumnId?: string; // Values in this column will be used to identify individual rows
  selectableColumnIndex: number;
  className?: string;
  expandedContent: { [rowId: string]: ReactNode };
  disabledActions?: TableAction[];
};
const Table = (props: TableProps) => {
  const initialTableState = { ...defaultTableState, ...props };

  const [tableState, dispatch] = useReducer(tableReducer, initialTableState);
  const tableStateRef = useRef(tableState);

  useEffect(() => {
    return () => {
      // Update the state stored in the parent once before unload
      props.onStateChange && props.onStateChange(tableStateRef.current);
    };
  }, []);

  const tableClasses = classNames(
    styles.wrapper,
    {
      [styles.wrapperThemeDark]: props.theme === 'dark'
    },
    props.className
  );

  return (
    <TableContext.Provider
      value={{
        ...tableState,
        dispatch,
        theme: props.theme,
        uniqueColumnId: props.uniqueColumnId,
        selectableColumnIndex: props.selectableColumnIndex,
        expandedContent: props.expandedContent,
        disabledActions: props.disabledActions
      }}
    >
      <TableControls />
      <div className={tableClasses}>
        <table className={styles.table}>
          <TableHeader />
          <TableBody />
        </table>
      </div>
    </TableContext.Provider>
  );
};

Table.defaultProps = {
  theme: 'light',
  selectableColumnIndex: 0,
  expandedContent: {}
};

export default Table;
