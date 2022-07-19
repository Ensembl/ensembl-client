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
import { TableContext } from 'src/shared/components/table/Table';

import styles from 'src/shared/components/table/Table.scss';
/*
    - Display the checkbox to select a row
    - It will be used by TableRow.tsx 
*/

export type RowSelectorProps = {
  rowId: number;
  onChange: (params: { checked: boolean; rowId: number }) => void;
};

const RowSelector = (props: RowSelectorProps) => {
  const { selectedRowIds } = useContext(TableContext) || {
    selectedRowIds: null
  };

  const isCurrentRowSelected = selectedRowIds?.[props.rowId] ?? false;

  return (
    <div className={styles.rowSelector}>
      <Checkbox
        onChange={(checked: boolean) =>
          props.onChange({ checked, rowId: props.rowId })
        }
        checked={isCurrentRowSelected}
      />
    </div>
  );
};

export default RowSelector;
