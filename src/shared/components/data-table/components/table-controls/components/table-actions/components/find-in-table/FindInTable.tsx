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
import { useContext } from 'react';

import * as React from 'react';

import Input from 'src/shared/components/input/Input';
import { TableAction } from 'src/shared/components/data-table/dataTableTypes';
import { TableContext } from 'src/shared/components/data-table/DataTable';

import styles from './FindInTable.module.css';

const FindInTable = () => {
  const { dispatch, searchText } = useContext(TableContext) || {};

  if (!dispatch) {
    return null;
  }

  const onClick = () => {
    dispatch({
      type: 'set_selected_action',
      payload: TableAction.DEFAULT
    });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'set_search_text',
      payload: event.target.value
    });
  };

  return (
    <>
      <Input className={styles.input} onChange={onChange} value={searchText} />
      <span className={styles.cancel} onClick={onClick}>
        cancel
      </span>
    </>
  );
};

export default FindInTable;
