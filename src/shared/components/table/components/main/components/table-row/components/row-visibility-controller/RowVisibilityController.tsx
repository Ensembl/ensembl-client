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

/*
    - Makes use of the PopupPanel to display a list of available columns

*/

import classNames from 'classnames';
import React, { useContext } from 'react';
import { PrimaryButton } from 'src/shared/components/button/Button';
import {
  TableAction,
  TableRowIds
} from 'src/shared/components/table/state/tableReducer';
import { TableContext } from 'src/shared/components/table/Table';

import styles from './RowVisibilityController.scss';

const RowVisibilityController = () => {
  const { hiddenRowIdsInDraft, hiddenRowIds, data, dispatch } =
    useContext(TableContext) || {};

  // TODO: Create a useTable hook to get only the displayed rows
  if (!(hiddenRowIdsInDraft && dispatch && data && hiddenRowIds)) {
    return null;
  }

  const cancelChanges = () => {
    dispatch({
      type: 'clear_hidden_row_ids_in_draft'
    });

    dispatch({
      type: 'set_selected_action',
      payload: TableAction.DEFAULT
    });
  };

  const selectAll = () => {
    const totalRows = data.length;

    const newRowIdsInDraft: TableRowIds = {};

    // TODO: Select only rows that are currently visible
    for (let i = 0; i < totalRows; i++) {
      newRowIdsInDraft[i] = false;
    }
    dispatch({
      type: 'set_hidden_row_ids_in_draft',
      payload: newRowIdsInDraft
    });
  };

  const deselectAll = () => {
    const totalRows = data.length;

    const newRowIdsInDraft: TableRowIds = {};

    for (let i = 0; i < totalRows; i++) {
      newRowIdsInDraft[i] = true;
    }
    dispatch({
      type: 'set_hidden_row_ids_in_draft',
      payload: newRowIdsInDraft
    });
  };

  const showAll = () => {
    dispatch({
      type: 'set_hidden_row_ids',
      payload: {}
    });

    dispatch({
      type: 'clear_hidden_row_ids_in_draft'
    });
  };

  const applyChanges = () => {
    dispatch({
      type: 'set_hidden_row_ids',
      payload: hiddenRowIdsInDraft
    });
  };

  const hasSomeRowsHidden = Object.values(hiddenRowIds).some(Boolean);

  const showAllClassNames = classNames(styles.showAll, {
    [styles.showAllDisabled]: !hasSomeRowsHidden
  });

  return (
    <div className={styles.rowVisibilityControls}>
      <span className={showAllClassNames} onClick={showAll}>
        Show all
      </span>
      <span className={styles.selectAll} onClick={selectAll}>
        Select all
      </span>
      <span className={styles.deselectAll} onClick={deselectAll}>
        Deselect all
      </span>
      <span className={styles.apply}>
        <PrimaryButton onClick={applyChanges}>Apply</PrimaryButton>
      </span>
      <span className={styles.cancel} onClick={cancelChanges}>
        Cancel
      </span>
    </div>
  );
};

export default RowVisibilityController;
