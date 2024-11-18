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

import { useAppDispatch, useAppSelector } from 'src/store';
import {
  columnSelectionData,
  selectSelectedColumnsCount
} from 'src/content/app/tools/biomart/state/biomartSelectors';
import { setColumnSelectionData } from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from '../BiomartForm.module.css';

const BiomartColumnsHeader = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(columnSelectionData);
  const count = useAppSelector(selectSelectedColumnsCount);

  const onReset = () => {
    if (!data) {
      return;
    }
    const newData = data.map((item) => {
      return {
        ...item,
        options: item.options.map((option) => {
          return {
            ...option,
            checked: false
          };
        })
      };
    });

    dispatch(setColumnSelectionData(newData));
  };

  return (
    <div className={styles.columnsHeader}>
      <div className={styles.headerTitle}>
        <span>Data to download</span>
        <span className={styles.counterClass}>{count}</span>
      </div>
      <div className={styles.headerSettings}>
        <span className={styles.reset} onClick={onReset}>
          Reset
        </span>
      </div>
    </div>
  );
};

export default BiomartColumnsHeader;
