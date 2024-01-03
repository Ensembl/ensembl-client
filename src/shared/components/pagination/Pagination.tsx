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

import ChevronButton from 'src/shared/components/chevron-button/ChevronButton';
import Input from 'src/shared/components/input/Input';

import styles from './Pagination.module.css';

export type PaginationProps = {
  currentPageNumber: number;
  lastPageNumber: number;
  onChange: (pageNumber: number) => void;
};

const Pagination = (props: PaginationProps) => {
  const { currentPageNumber, lastPageNumber } = props;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumberFromInput = Number(event.target.value);

    if (
      isNaN(pageNumberFromInput) ||
      pageNumberFromInput > lastPageNumber ||
      pageNumberFromInput < 1
    ) {
      event.preventDefault();
      return;
    }

    props.onChange(pageNumberFromInput);
  };

  return (
    <div className={styles.pagination}>
      <ChevronButton
        direction="left"
        className={styles.showHide}
        disabled={currentPageNumber === 1}
        onClick={() => props.onChange(currentPageNumber - 1)}
      />
      <Input
        value={currentPageNumber}
        onChange={onChange}
        className={styles.inputBox}
        disabled={lastPageNumber === 1}
      />
      of {lastPageNumber}
      <ChevronButton
        direction="right"
        className={styles.showHide}
        disabled={currentPageNumber === lastPageNumber}
        onClick={() => props.onChange(currentPageNumber + 1)}
      />
    </div>
  );
};

export default Pagination;
