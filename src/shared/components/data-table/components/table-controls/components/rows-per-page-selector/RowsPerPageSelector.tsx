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

import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import { TableContext } from 'src/shared/components/data-table/DataTable';

import type { RowsPerPage } from 'src/shared/components/data-table/dataTableTypes';

import styles from './RowsPerPageSelector.scss';
/*
    - Displays the dropdown to change the number of rows displayed in a page
*/

const rowsPerPageOptions = [
  {
    value: '10',
    label: '10'
  },
  {
    value: '20',
    label: '20'
  },
  {
    value: '50',
    label: '50'
  },
  {
    value: '100',
    label: '100'
  },
  {
    value: 'Infinity',
    label: 'All'
  }
];

const Pagination = () => {
  const { dispatch, rowsPerPage } = useContext(TableContext) || {};

  if (!dispatch) {
    return null;
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'set_rows_per_page',
      payload: Number(event.target.value) as RowsPerPage
    });
  };

  return (
    <div className={styles.rowsPerPageSelector}>
      <SimpleSelect
        options={rowsPerPageOptions}
        onInput={onChange}
        value={rowsPerPage}
      />
      <span className={styles.perPage}>per page</span>
    </div>
  );
};

export default Pagination;
