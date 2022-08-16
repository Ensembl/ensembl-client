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

import React, { useContext } from 'react';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import { TableContext } from 'src/shared/components/data-table/DataTable';
import PopupPanel from '../popup-panel/PopupPanel';

import styles from './ShowHideColumns.scss';

const ShowHideColumns = () => {
  const { hiddenColumnIds, dispatch, columns } = useContext(TableContext) || {};

  if (!(hiddenColumnIds && dispatch && columns)) {
    return null;
  }

  const onChange = (columnId: string, checked: boolean) => {
    dispatch({
      type: 'set_hidden_column_ids',
      payload: { ...hiddenColumnIds, [columnId]: !checked }
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
              checked={hiddenColumnIds[column.columnId] !== true}
              onChange={(checked) => onChange(column.columnId, checked)}
              className={styles.checkbox}
            />
          );
        })}
    </PopupPanel>
  );
};

export default ShowHideColumns;
