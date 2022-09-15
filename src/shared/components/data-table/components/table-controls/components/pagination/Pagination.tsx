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

import ChevronButton from 'src/shared/components/chevron-button/ChevronButton';
import Input from 'src/shared/components/input/Input';
import { TableContext } from 'src/shared/components/data-table/DataTable';

import styles from './Pagination.scss';

const Pagination = () => {
  const { dispatch, currentPageNumber, data, rowsPerPage, hiddenRowIds } =
    useContext(TableContext) || {
      currentPageNumber: 1,
      rowsPerPage: 100,
      hiddenRowIds: {}
    };

  if (!dispatch || !data) {
    return null;
  }

  const hiddenRowsCount = Object.keys(hiddenRowIds).length;
  const visibleRowsCount = data.length - hiddenRowsCount;

  const lastPageNumber = Math.ceil(visibleRowsCount / rowsPerPage);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let pageNumberFromInput = Number(event.target.value);

    if (isNaN(pageNumberFromInput) || pageNumberFromInput > lastPageNumber) {
      pageNumberFromInput = currentPageNumber;
    }

    if (pageNumberFromInput > data?.length) {
      pageNumberFromInput = data?.length;
    }

    dispatch({
      type: 'set_current_page_number',
      payload: pageNumberFromInput
    });
  };

  const onChevronClick = (value: number) => {
    dispatch({
      type: 'set_current_page_number',
      payload: value
    });
  };

  return (
    <div className={styles.pagination}>
      <ChevronButton
        direction="left"
        className={styles.showHide}
        disabled={currentPageNumber === 1}
        onClick={() => onChevronClick(currentPageNumber - 1)}
      />
      <div className={styles.inputWrapper}>
        <Input
          value={currentPageNumber}
          onChange={onChange}
          className={styles.inputBox}
          disabled={data?.length < rowsPerPage}
        />
      </div>
      of {rowsPerPage === Infinity ? 1 : lastPageNumber}
      <ChevronButton
        direction="right"
        className={styles.showHide}
        disabled={
          rowsPerPage === Infinity || currentPageNumber === lastPageNumber
        }
        onClick={() => onChevronClick(currentPageNumber + 1)}
      />
    </div>
  );
};

export default Pagination;