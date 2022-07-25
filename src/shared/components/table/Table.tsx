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
import React, { useEffect, useReducer, useRef } from 'react';
import TableBody from './components/main/components/table-body/TableBody';
import TableHeader from './components/main/components/table-header/TableHeader';
import TableControls from './components/table-controls/TableControls';
import {
  AllTableActions,
  defaultTableState,
  tableReducer,
  TableState,
  TableTheme
} from './state/tableReducer';

import styles from './Table.scss';

/*
    -- State management -- 
    - How can we restore the previous state everytime we come back?
        We need to store the state independently for all the tables. It can be optional.
        To identify a table, the parent component should be able to provide an UUID for each table so that 
        it can be used to restore the state.

    - Should there be an option to hide the first action column by default?
*/

type TableContextType = TableState & {
  dispatch: React.Dispatch<AllTableActions>;
  theme: TableTheme;
};
export const TableContext = React.createContext(
  null as TableContextType | null
);

export type TableProps = Partial<TableState> & {
  onStateChange?: (newState: TableState) => void;
  theme: TableTheme;
  classNames?: {
    table?: string;
    wrapper?: string;
  };
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

  const wrapperClasses = classNames(
    styles.wrapper,
    {
      [styles.themeDark]: props.theme === 'dark'
    },
    props.classNames?.wrapper
  );

  return (
    <TableContext.Provider
      value={{ ...tableState, dispatch, theme: props.theme }}
    >
      <div className={wrapperClasses}>
        <TableControls />
        <table className={styles.table}>
          <TableHeader />
          <TableBody />
        </table>
      </div>
    </TableContext.Provider>
  );
};

Table.defaultProps = {
  theme: 'light'
};

export default Table;
