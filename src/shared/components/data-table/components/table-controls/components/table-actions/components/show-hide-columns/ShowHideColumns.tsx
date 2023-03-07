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
import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';
import PopupPanel from '../popup-panel/PopupPanel';

import styles from './ShowHideColumns.scss';

const ShowHideColumns = () => {
  const { hiddenColumnIds, dispatch, columns } = useDataTable();
  const updatedHiddenColumnIds = new Set(hiddenColumnIds);

  const onChange = (columnId: string, checked: boolean) => {
    if (!checked) {
      updatedHiddenColumnIds.add(columnId);
    } else {
      updatedHiddenColumnIds.delete(columnId);
    }

    dispatch({
      type: 'set_hidden_column_ids',
      payload: updatedHiddenColumnIds
    });
  };

  return (
    <PopupPanel className={styles.popupPanel}>
      {columns
        ?.filter((column) => column.isHideable !== false)
        .map((column, key) => {
          return (
            <Checkbox
              key={key}
              label={column.title}
              checked={!updatedHiddenColumnIds.has(column.columnId)}
              onChange={(checked) => onChange(column.columnId, checked)}
              className={styles.checkbox}
            />
          );
        })}
    </PopupPanel>
  );
};

export default ShowHideColumns;
