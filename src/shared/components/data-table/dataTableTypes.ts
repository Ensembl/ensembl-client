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
  NONE = 'none'
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

export type TableCellStructuredData = { data: unknown };

export type TableCellData = ReactNode | TableCellStructuredData;

export type TableRowData = TableCellData[];

export type TableRows = {
  cells: TableCellData[];
  rowId: string | number;
}[];

export type TableData = TableRowData[];

export type TableCellRendererParams = {
  rowId: string | number;
  rowData: TableRowData;
  cellData: TableCellData;
};

export type TableRowsSortingFunction = (
  rows: TableRows,
  columnIndex: number,
  direction?: SortingDirection
) => TableRows;

export type IndividualColumn = {
  columnId: string;
  title?: string;
  isSortable?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  isHideable?: boolean;
  isExportable?: boolean;
  headerCellClassName?: string;
  bodyCellClassName?: string;
  helpText?: ReactNode;
  width?: string;
  sortFn?: TableRowsSortingFunction;
  renderer?: (params: TableCellRendererParams) => ReactNode;
  downloadRenderer?: (params: TableCellRendererParams) => string | number;
};

export type DataTableColumns = IndividualColumn[];

export type TableSelectedRowIds = Set<string | number>;

export type TableTheme = 'light' | 'dark';
export type RowsPerPage = 10 | 20 | 50 | 100 | typeof Infinity;

export type DataTableState = {
  data: TableData;
  rowsPerPage: RowsPerPage;
  currentPageNumber: number;
  searchText: string;
  isSelectable: boolean;
  selectedAction: TableAction;
  sortedColumn: SortedColumn | null;
  fixedHeader: boolean;
  selectedRowIds: TableSelectedRowIds;
  hiddenRowIds: TableSelectedRowIds;
  hiddenRowIdsInDraft: TableSelectedRowIds;
  hiddenColumnIds: TableSelectedRowIds;
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
  payload: TableSelectedRowIds;
};
type SetHiddenRowIdsInDraftAction = {
  type: 'set_hidden_row_ids_in_draft';
  payload: TableSelectedRowIds;
};

type ClearHiddenRowIdsInDraftAction = {
  type: 'clear_hidden_row_ids_in_draft';
};

type SetHiddenColumnIdsAction = {
  type: 'set_hidden_column_ids';
  payload: TableSelectedRowIds;
};

type SetSelectedRowIdsAction = {
  type: 'set_selected_row_ids';
  payload: TableSelectedRowIds;
};

type RestoreDefaultsAction = {
  type: 'restore_defaults';
  payload: Partial<DataTableState>;
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
