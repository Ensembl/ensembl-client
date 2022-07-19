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
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import { TableAction } from 'src/shared/components/table/state/tableReducer';
import { TableContext } from 'src/shared/components/table/Table';
import VisibilityIcon from 'src/shared/components/visibility-icon/VisibilityIcon';

import { Status } from 'src/shared/types/status';

import styles from './RowSelector.scss';
/*
    - Display the checkbox to select a row
    - It will be used by TableRow.tsx 
*/

export type RowSelectorProps = {
  rowId: number;
  onChange: (params: { checked: boolean; rowId: number }) => void;
};

const RowSelector = (props: RowSelectorProps) => {
  const {
    hiddenRowIds,
    hiddenRowIdsInDraft,
    selectedRowIds,
    selectedAction,
    dispatch
  } = useContext(TableContext) || {
    hiddenRowIds: null,
    hiddenRowIdsInDraft: null
  };

  if (!dispatch) {
    return null;
  }

  const mergedHiddenRowIds = { ...hiddenRowIds, ...hiddenRowIdsInDraft };

  const isCurrentRowSelected = selectedRowIds?.[props.rowId] === true;
  const isCurrentRowVisible = mergedHiddenRowIds?.[props.rowId] !== true;

  const onVisibilityChange = (params: { status: boolean; rowId: number }) => {
    dispatch({
      type: 'set_hidden_row_ids_in_draft',
      payload: {
        [params.rowId]: !params.status
      }
    });
  };

  return (
    <div className={styles.rowSelector}>
      {selectedAction === TableAction.DEFAULT && (
        <Checkbox
          onChange={(checked: boolean) =>
            props.onChange({ checked, rowId: props.rowId })
          }
          checked={isCurrentRowSelected}
        />
      )}

      {selectedAction === TableAction.SHOW_HIDE_ROWS && (
        <VisibilityIcon
          onClick={() =>
            onVisibilityChange({
              status: !isCurrentRowVisible,
              rowId: props.rowId
            })
          }
          status={isCurrentRowVisible ? Status.SELECTED : Status.UNSELECTED}
        />
      )}
    </div>
  );
};

export default RowSelector;
