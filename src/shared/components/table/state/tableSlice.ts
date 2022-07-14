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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

enum SortingDirection {
  ASC = 'ascending',
  DESC = 'descending',
  DEFAULT = 'default' // Do we need this?
}

type SortedColumn = {
  columnId: number;
  sortedDirection: SortingDirection;
};

enum TableAction {
  DEFAULT = 'default',
  FIND_IN_TABLE = 'find_in_table',
  FILTERS = 'filters',
  SHOW_HIDE_COLUMNS = 'show_hide_columns',
  SHOW_HIDE_ROWS = 'show_hide_rows',
  DOWNLOAD_SHOWN_DATA = 'download_shown_data',
  DOWNLOAD_ALL_DATA = 'download_all_data',
  RESTORE_DEFAULTS = 'restore_defaults'
}

type TableState = {
  rowsPerPage: number;
  currentPageNumber: number;
  searchText: string;
  hiddenRowIds: number[];
  hiddenColumnIds: number[];
  selectedRowIds: number[];
  selectedAction: TableAction;
  sortedColumn: SortedColumn | null;
  expandedRows: number[]; // To handle rows with show / hide
};

export const initialTableState: TableState = {
  rowsPerPage: 100,
  currentPageNumber: 1,
  searchText: '',
  hiddenRowIds: [],
  hiddenColumnIds: [],
  selectedRowIds: [],
  selectedAction: TableAction.DEFAULT,
  sortedColumn: null,
  expandedRows: []
};

type AllTableState = {
  [tableId: string]: TableState;
};

const initialState: AllTableState = {};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRowsPerPage(
      state,
      action: PayloadAction<{
        tableId: string;
        rowsPerPage: number;
      }>
    ) {
      const { tableId, rowsPerPage } = action.payload;
      state[tableId].rowsPerPage = rowsPerPage;
    },
    setSearchText(
      state,
      action: PayloadAction<{
        tableId: string;
        searchText: string;
      }>
    ) {
      const { tableId, searchText } = action.payload;
      state[tableId].searchText = searchText;
    },
    setCurrentPageNumber(
      state,
      action: PayloadAction<{
        tableId: string;
        currentPageNumber: number;
      }>
    ) {
      const { tableId, currentPageNumber } = action.payload;
      state[tableId].currentPageNumber = currentPageNumber;
    },
    setHiddenRowIds(
      state,
      action: PayloadAction<{
        tableId: string;
        hiddenRowIds: number[];
      }>
    ) {
      const { tableId, hiddenRowIds } = action.payload;
      state[tableId].hiddenRowIds = hiddenRowIds;
    },
    setHiddenColumnIds(
      state,
      action: PayloadAction<{
        tableId: string;
        hiddenColumnIds: number[];
      }>
    ) {
      const { tableId, hiddenColumnIds } = action.payload;
      state[tableId].hiddenColumnIds = hiddenColumnIds;
    },
    setSelectedRowIds(
      state,
      action: PayloadAction<{
        tableId: string;
        selectedRowIds: number[];
      }>
    ) {
      const { tableId, selectedRowIds } = action.payload;
      state[tableId].selectedRowIds = selectedRowIds;
    },
    setSelectedAction(
      state,
      action: PayloadAction<{
        tableId: string;
        selectedAction: TableAction;
      }>
    ) {
      const { tableId, selectedAction } = action.payload;
      state[tableId].selectedAction = selectedAction;
    },
    setSortedColumn(
      state,
      action: PayloadAction<{
        tableId: string;
        sortedColumn: SortedColumn;
      }>
    ) {
      const { tableId, sortedColumn } = action.payload;
      state[tableId].sortedColumn = sortedColumn;
    },
    setExpandedRows(
      state,
      action: PayloadAction<{
        tableId: string;
        expandedRows: number[];
      }>
    ) {
      const { tableId, expandedRows } = action.payload;
      state[tableId].expandedRows = expandedRows;
    }
  }
});

export const {
  setRowsPerPage,
  setSearchText,
  setCurrentPageNumber,
  setHiddenRowIds,
  setHiddenColumnIds,
  setSelectedRowIds,
  setSelectedAction,
  setSortedColumn,
  setExpandedRows
} = tableSlice.actions;
export default tableSlice.reducer;
