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
import Select from 'src/shared/components/select/Select';
import { TableContext } from 'src/shared/components/table/Table';

import styles from './RowsPerPageSelector.scss';
/*
    - XD: https://xd.adobe.com/view/78773ed6-d738-4ea6-be84-fcc73487eac4-2d24/screen/65cb206c-02a5-45de-865f-a7ddea257853?fullscreen
    - Displays the dropdown to change the number of rows displayed in a page
*/

const rowsPerPageOptions = [
  {
    value: 10,
    label: '10',
    isSelected: false
  },
  {
    value: 20,
    label: '20',
    isSelected: false
  },
  {
    value: 50,
    label: '50',
    isSelected: false
  },
  {
    value: 100,
    label: '100',
    isSelected: false
  },
  {
    value: 0,
    label: 'All',
    isSelected: false
  }
];

const Pagination = () => {
  const { dispatch, rowsPerPage } = useContext(TableContext) || {};

  const selectOptions = rowsPerPageOptions.map((option) => {
    if (rowsPerPage === option.value) {
      return {
        ...option,
        isSelected: true
      };
    }

    return option;
  });

  if (!dispatch) {
    return null;
  }

  const onSelect = (value: number) => {
    dispatch({
      type: 'set_rows_per_page',
      payload: value
    });
  };

  return (
    <div className={styles.rowsPerPageSelector}>
      <Select options={selectOptions} onSelect={onSelect} /> per page
    </div>
  );
};

export default Pagination;
