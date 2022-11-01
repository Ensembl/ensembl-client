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

import React, { useContext, useEffect, useState } from 'react';

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import { TableContext } from 'src/shared/components/data-table/DataTable';
import RowVisibilityController from 'src/shared/components/data-table/components/main/components/table-row/components/row-visibility-controller/RowVisibilityController';
import FindInTable from './components/find-in-table/FindInTable';
import ShowHideColumns from './components/show-hide-columns/ShowHideColumns';
import DownloadData from './components/download-data/DownloadData';

import {
  type DataTableState,
  TableAction
} from 'src/shared/components/data-table/dataTableTypes';

const actionOptions = [
  {
    value: TableAction.DEFAULT,
    label: 'Actions'
  },
  {
    value: TableAction.FIND_IN_TABLE,
    label: 'Find in table'
  },
  {
    value: TableAction.FILTERS,
    label: 'Filters'
  },
  {
    value: TableAction.SHOW_HIDE_COLUMNS,
    label: 'Show/hide columns'
  },
  {
    value: TableAction.SHOW_HIDE_ROWS,
    label: 'Show/hide rows'
  },
  {
    value: TableAction.DOWNLOAD_SHOWN_DATA,
    label: 'Download data shown'
  },
  {
    value: TableAction.DOWNLOAD_ALL_DATA,
    label: 'Download this table'
  },
  {
    value: TableAction.RESTORE_DEFAULTS,
    label: 'Restore defaults'
  }
];

const TableActions = () => {
  const {
    dispatch,
    selectedAction,
    disabledActions,
    rowsPerPage,
    currentPageNumber,
    sortedColumn,
    searchText,
    selectedRowIds,
    hiddenRowIds,
    hiddenRowIdsInDraft,
    hiddenColumnIds
  } = useContext(TableContext) || {
    selectedAction: TableAction.DEFAULT
  };

  const [restorableTableState, setRestorableTableState] = useState<
    Partial<DataTableState>
  >({});

  useEffect(() => {
    setRestorableTableState({
      currentPageNumber,
      rowsPerPage,
      sortedColumn,
      searchText,
      selectedRowIds,
      hiddenRowIds,
      hiddenRowIdsInDraft,
      hiddenColumnIds
    });
  }, []);

  if (!dispatch) {
    return null;
  }

  const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === TableAction.RESTORE_DEFAULTS) {
      dispatch({
        type: 'restore_defaults',
        payload: restorableTableState
      });
      return;
    }

    dispatch({
      type: 'set_selected_action',
      payload: event.target.value as TableAction
    });
  };

  return (
    <>
      <SimpleSelect
        options={actionOptions.filter(
          (option) => !disabledActions?.includes(option.value)
        )}
        disabled={[TableAction.SHOW_HIDE_COLUMNS, TableAction.FILTERS].includes(
          selectedAction
        )}
        onInput={onSelect}
        placeholder="Actions"
        value={selectedAction}
      />

      {selectedAction && getActionComponent(selectedAction)}
    </>
  );
};

const getActionComponent = (selectedAction: TableAction) => {
  switch (selectedAction) {
    case TableAction.FIND_IN_TABLE:
      return <FindInTable />;
    case TableAction.SHOW_HIDE_COLUMNS:
      return <ShowHideColumns />;
    case TableAction.SHOW_HIDE_ROWS:
      return <RowVisibilityController />;
    case TableAction.DOWNLOAD_ALL_DATA:
      return <DownloadData />;
    case TableAction.DOWNLOAD_SHOWN_DATA:
      return <DownloadData />;
    default:
      return null;
  }
};

export default TableActions;
