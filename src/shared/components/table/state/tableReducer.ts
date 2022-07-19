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
import type { ReactNode } from 'react';

enum SortingDirection {
  ASC = 'ascending',
  DESC = 'descending',
  DEFAULT = 'default' // Do we need this?
}

export type SortedColumn = {
  columnId: string;
  sortedDirection: SortingDirection;
};

export enum TableAction {
  DEFAULT = 'default',
  FIND_IN_TABLE = 'find_in_table',
  FILTERS = 'filters',
  SHOW_HIDE_COLUMNS = 'show_hide_columns',
  SHOW_HIDE_ROWS = 'show_hide_rows',
  DOWNLOAD_SHOWN_DATA = 'download_shown_data',
  DOWNLOAD_ALL_DATA = 'download_all_data',
  RESTORE_DEFAULTS = 'restore_defaults'
}

export type TableCellData = ReactNode;

export type TableRowData = {
  cells: TableCellData[];
  expandedContent?: ReactNode;
};

export type TableData = TableRowData[];

export type IndividualColumn = {
  columnId: string;
  isSortable?: boolean;
  isSearchable?: boolean;
  title: string;
  className?: string;
};

export type Columns = IndividualColumn[];

export type TableRowIds = { [key: string]: boolean };

export type TableState = {
  columns: Columns;
  data: TableData;
  rowsPerPage: number;
  currentPageNumber: number;
  searchText: string;
  isSelectable: boolean;
  selectedAction: TableAction;
  sortedColumn: SortedColumn | null;
  fixedHeader: boolean;
  selectedRowIds: TableRowIds;
  hiddenRowIds: TableRowIds;
  hiddenColumnIds: TableRowIds;
  expandedRowIds: TableRowIds;
};

export const defaultTableState: TableState = {
  columns: [],
  data: [],
  rowsPerPage: 100,
  currentPageNumber: 1,
  searchText: '',
  isSelectable: true,
  selectedAction: TableAction.DEFAULT,
  sortedColumn: null,
  fixedHeader: false,
  selectedRowIds: {},
  expandedRowIds: {},
  hiddenRowIds: {},
  hiddenColumnIds: {}
};

type SetRowsPerPageAction = {
  type: 'set_rows_per_page';
  payload: number;
};
type SetSearchTextAction = {
  type: 'set_search_text';
  payload: string;
};
type SetCurrentPageNumberAction = {
  type: 'set_current_page_number';
  payload: number;
};
type SetSelectedActionAction = {
  type: 'set_selected_action';
  payload: TableAction;
};
type SetSortedColumnAction = {
  type: 'set_sorted_column';
  payload: SortedColumn;
};
type SetHiddenRowIdsAction = {
  type: 'set_hidden_row_ids';
  payload: { [key: number]: boolean };
};
type SetHiddenColumnIdsAction = {
  type: 'set_hidden_column_ids';
  payload: { [key: number]: boolean };
};
type SetSelectedRowIdsAction = {
  type: 'set_selected_row_ids';
  payload: { [key: number]: boolean };
};
type SetExpandedRowsAction = {
  type: 'set_expanded_rows';
  payload: { [key: number]: boolean };
};

export type AllTableActions =
  | SetRowsPerPageAction
  | SetSearchTextAction
  | SetCurrentPageNumberAction
  | SetHiddenRowIdsAction
  | SetHiddenColumnIdsAction
  | SetSelectedRowIdsAction
  | SetSelectedActionAction
  | SetSortedColumnAction
  | SetExpandedRowsAction;

export const tableReducer = (
  state: TableState,
  action: AllTableActions
): TableState => {
  switch (action.type) {
    case 'set_rows_per_page':
      return { ...state, rowsPerPage: action.payload };
    case 'set_search_text':
      return { ...state, searchText: action.payload };
    case 'set_current_page_number':
      return { ...state, currentPageNumber: action.payload };
    case 'set_hidden_row_ids':
      return {
        ...state,
        hiddenRowIds: { ...state.hiddenRowIds, ...action.payload }
      };
    case 'set_hidden_column_ids':
      return {
        ...state,
        hiddenColumnIds: { ...state.hiddenColumnIds, ...action.payload }
      };
    case 'set_selected_row_ids':
      return {
        ...state,
        selectedRowIds: { ...state.selectedRowIds, ...action.payload }
      };
    case 'set_selected_action':
      return { ...state, selectedAction: action.payload };
    case 'set_sorted_column':
      return { ...state, sortedColumn: action.payload };
    case 'set_expanded_rows':
      return {
        ...state,
        expandedRowIds: { ...state.expandedRowIds, ...action.payload }
      };
    default:
      return state;
  }
};
