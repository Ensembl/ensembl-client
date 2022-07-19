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

import React, { useContext } from 'react';
import Select from 'src/shared/components/select/Select';
import { TableAction } from 'src/shared/components/table/state/tableReducer';
import { TableContext } from 'src/shared/components/table/Table';

/*
    - XD: https://xd.adobe.com/view/78773ed6-d738-4ea6-be84-fcc73487eac4-2d24/screen/b16f1465-f2f5-48d4-8572-07ddc5226a43?fullscreen
    - Displays the action dropdown
    - It acts as a container to display the popup (used by filters & show/hide columns).
    - It acts as a container for other actions elements like search & data downloads

*/

const actionOptions = [
  {
    value: TableAction.FIND_IN_TABLE,
    label: 'Find in table',
    isSelected: false
  },
  {
    value: TableAction.FILTERS,
    label: 'Filters',
    isSelected: false
  },
  {
    value: TableAction.SHOW_HIDE_COLUMNS,
    label: 'Show/hide columns',
    isSelected: false
  },
  {
    value: TableAction.SHOW_HIDE_ROWS,
    label: 'Show/hide rows',
    isSelected: false
  },
  {
    value: TableAction.DOWNLOAD_SHOWN_DATA,
    label: 'Download data shown',
    isSelected: false
  },
  {
    value: TableAction.DOWNLOAD_ALL_DATA,
    label: 'Download all data',
    isSelected: false
  },
  {
    value: TableAction.RESTORE_DEFAULTS,
    label: 'Restore defaults',
    isSelected: false
  }
];

const TableActions = () => {
  const { dispatch, selectedAction } = useContext(TableContext) || {};

  const selectOptions = actionOptions.map((option) => {
    if (selectedAction === option.value) {
      return {
        ...option,
        isSelected: true
      };
    }

    return option;
  });

  if (!dispatch) {
    return null;
  }

  const onSelect = (value: TableAction) => {
    dispatch({
      type: 'set_selected_action',
      payload: value
    });
  };

  return (
    <>
      <Select
        options={selectOptions}
        onSelect={onSelect}
        placeholder={'Actions'}
      />
    </>
  );
};

export default TableActions;
