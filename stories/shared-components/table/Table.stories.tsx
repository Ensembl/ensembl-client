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

import React, { useState } from 'react';

import { fakeData } from './fakeData';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell
} from 'src/shared/components/table';

import styles from './Table.stories.scss';

export const TableStory = () => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const sortedFakeData = [...fakeData].sort((a, b) => {
    if (sortDirection === 'asc') {
      return b.second - a.second;
    } else if (sortDirection === 'desc') {
      return a.second - b.second;
    } else {
      return 0;
    }
  });

  // if (sortDirection === 'asc') {
  //   sortedFakeData.sort((a, b) => ) = sortBy(fakeData, ['second']);
  // } else if (sortDirection === 'desc') {

  // }
  // const sortedFakeData = sortDirection ?

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Words</TableHeadCell>
          <TableHeadCell
            sortDirection={sortDirection ?? 'desc'}
            onSortDirectionChange={setSortDirection}
            isSortingActive={!!sortDirection}
          >
            Numerical
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedFakeData.map((rowData, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className={styles.widthLimitedContainer}>
                {rowData.first}
              </div>
            </TableCell>
            <TableCell>{rowData.second}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

TableStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/Table'
};
