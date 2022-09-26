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

import { DataTableState, TableAction, AllTableActions } from './dataTableTypes';

export const defaultDataTableState: DataTableState = {
  data: [],
  rowsPerPage: 10,
  currentPageNumber: 1,
  searchText: '',
  isSelectable: true,
  selectedAction: TableAction.DEFAULT,
  sortedColumn: null,
  fixedHeader: false,
  selectedRowIds: {},
  hiddenRowIds: {},
  hiddenRowIdsInDraft: {},
  hiddenColumnIds: {}
};

export const tableReducer = (
  state: DataTableState,
  action: AllTableActions
): DataTableState => {
  switch (action.type) {
    case 'set_rows_per_page':
      return { ...state, rowsPerPage: action.payload, currentPageNumber: 1 };
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
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
