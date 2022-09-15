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

import Pagination from 'src/shared/components/pagination/Pagination';
import RowsPerPageSelector from './components/rows-per-page-selector/RowsPerPageSelector';

import useDataTable from '../../hooks/useDataTable';

import TableActions from './components/table-actions/TableActions';

import styles from './TableControls.scss';

const TableControls = () => {
  const { setPageNumber, currentPageNumber, data, rowsPerPage, hiddenRowIds } =
    useDataTable();

  const hiddenRowsCount = Object.keys(hiddenRowIds).length;
  const visibleRowsCount = data.length - hiddenRowsCount;
  const lastPageNumber = Math.ceil(visibleRowsCount / rowsPerPage);

  return (
    <div className={styles.tableControls}>
      <TableActions />
      <RowsPerPageSelector />
      <Pagination
        onChange={setPageNumber}
        currentPageNumber={currentPageNumber}
        lastPageNumber={lastPageNumber}
      />
    </div>
  );
};

export default TableControls;
