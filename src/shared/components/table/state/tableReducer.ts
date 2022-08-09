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

export enum SortingDirection {
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

export type TableRowData = TableCellData[];

export type TableData = TableRowData[];

export type TableCellRendererParams = {
  rowId: string;
  rowData: TableRowData;
  cellData: TableCellData;
};

export type IndividualColumn = {
  columnId: string;
  title: string;
  isSortable?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  className?: string;
  helpText?: ReactNode;
  width: string;
  renderer?: (params: TableCellRendererParams) => ReactNode;
};

export type TableColumns = IndividualColumn[];

export type TableSelectedRowId = { [key: string]: boolean };

export type TableTheme = 'light' | 'dark';
export type RowsPerPage = 10 | 20 | 50 | 100 | 0;

export type TableState = {
  columns: TableColumns;
  data: TableData;
  rowsPerPage: RowsPerPage;
  currentPageNumber: number;
  searchText: string;
  isSelectable: boolean;
  selectedAction: TableAction;
  sortedColumn: SortedColumn | null;
  fixedHeader: boolean;
  selectedRowIds: TableSelectedRowId;
  hiddenRowIds: TableSelectedRowId;
  hiddenRowIdsInDraft: TableSelectedRowId;
  hiddenColumnIds: TableSelectedRowId;
  expandedRowIds: TableSelectedRowId;
};

export const defaultTableState: TableState = {
  columns: [],
  data: [],
  rowsPerPage: 10,
  currentPageNumber: 1,
  searchText: '',
  isSelectable: true,
  selectedAction: TableAction.DEFAULT,
  sortedColumn: null,
  fixedHeader: false,
  selectedRowIds: {},
  expandedRowIds: {},
  hiddenRowIds: {},
  hiddenRowIdsInDraft: {},
  hiddenColumnIds: {}
};

type SetRowsPerPageAction = {
  type: 'set_rows_per_page';
  payload: RowsPerPage;
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

type ClearSortedColumnAction = {
  type: 'clear_sorted_column';
};

type SetHiddenRowIdsAction = {
  type: 'set_hidden_row_ids';
  payload: TableSelectedRowId;
};
type SetHiddenRowIdsInDraftAction = {
  type: 'set_hidden_row_ids_in_draft';
  payload: TableSelectedRowId;
};

type ClearHiddenRowIdsInDraftAction = {
  type: 'clear_hidden_row_ids_in_draft';
};

type SetHiddenColumnIdsAction = {
  type: 'set_hidden_column_ids';
  payload: TableSelectedRowId;
};

type SetSelectedRowIdsAction = {
  type: 'set_selected_row_ids';
  payload: TableSelectedRowId;
};

type RestoreDefaultsAction = {
  type: 'restore_defaults';
};

export type AllTableActions =
  | SetRowsPerPageAction
  | SetSearchTextAction
  | SetCurrentPageNumberAction
  | SetHiddenRowIdsAction
  | SetHiddenRowIdsInDraftAction
  | ClearHiddenRowIdsInDraftAction
  | SetHiddenColumnIdsAction
  | SetSelectedRowIdsAction
  | SetSelectedActionAction
  | SetSortedColumnAction
  | ClearSortedColumnAction
  | RestoreDefaultsAction;

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
        hiddenRowIds: action.payload
      };
    case 'set_hidden_row_ids_in_draft':
      return {
        ...state,
        hiddenRowIdsInDraft: { ...state.hiddenRowIdsInDraft, ...action.payload }
      };
    case 'clear_hidden_row_ids_in_draft':
      return {
        ...state,
        hiddenRowIdsInDraft: {}
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
    case 'clear_sorted_column':
      return { ...state, sortedColumn: null };
    case 'restore_defaults':
      return { ...defaultTableState, data: state.data, columns: state.columns };
    default:
      return state;
  }
};
