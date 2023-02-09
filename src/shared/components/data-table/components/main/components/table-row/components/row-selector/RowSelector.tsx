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
import React from 'react';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import VisibilityIcon from 'src/shared/components/visibility-icon/VisibilityIcon';

import { TableAction } from 'src/shared/components/data-table/dataTableTypes';

import { Status } from 'src/shared/types/status';

import styles from './RowSelector.scss';
import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';

export type RowSelectorProps = {
  rowId: string | number;
  onChange: (params: { checked: boolean; rowId: string | number }) => void;
};

const RowSelector = (props: RowSelectorProps) => {
  const {
    hiddenRowIds,
    hiddenRowIdsInDraft,
    selectedRowIds,
    selectedAction,
    dispatch
  } = useDataTable();

  const isCurrentRowSelected = selectedRowIds.has(props.rowId);
  const isCurrentRowVisible = !(
    hiddenRowIds.has(props.rowId) || hiddenRowIdsInDraft.has(props.rowId)
  );

  const onVisibilityChange = (params: {
    status: boolean;
    rowId: string | number;
  }) => {
    const updatedIds = new Set(hiddenRowIdsInDraft);
    if (params.status) {
      updatedIds.delete(params.rowId);
    } else {
      updatedIds.add(params.rowId);
    }

    dispatch({
      type: 'set_hidden_row_ids_in_draft',
      payload: updatedIds
    });
  };

  return (
    <div className={styles.rowSelector}>
      {selectedAction !== TableAction.SHOW_HIDE_ROWS && (
        <Checkbox
          onChange={(checked: boolean) =>
            props.onChange({ checked, rowId: props.rowId })
          }
          disabled={true}
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
