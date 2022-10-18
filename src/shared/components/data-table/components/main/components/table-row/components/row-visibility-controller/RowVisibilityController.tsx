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
import classNames from 'classnames';

import { PrimaryButton } from 'src/shared/components/button/Button';

import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';

import {
  TableAction,
  type TableSelectedRowIds
} from 'src/shared/components/data-table/dataTableTypes';

import styles from './RowVisibilityController.scss';

const RowVisibilityController = () => {
  const {
    getSortedCurrentPageRows,
    hiddenRowIdsInDraft,
    hiddenRowIds,
    dispatch
  } = useDataTable();

  const currentPageRows = getSortedCurrentPageRows();

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
    dispatch({
      type: 'set_hidden_row_ids_in_draft',
      payload: new Set()
    });
  };

  const deselectAll = () => {
    const newRowIdsInDraft: TableSelectedRowIds = new Set();
    currentPageRows.forEach((row) => {
      const { rowId } = row;
      newRowIdsInDraft.add(String(rowId));
    });

    dispatch({
      type: 'set_hidden_row_ids_in_draft',
      payload: newRowIdsInDraft
    });
  };

  const showAll = () => {
    dispatch({
      type: 'set_hidden_row_ids',
      payload: new Set()
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

  const hasSomeRowsHidden = hiddenRowIds.size > 0;

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
