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
  TableCell,
  TableRowSelectorCell
} from 'src/shared/components/table';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import styles from './Table.stories.scss';

export const TableStory = () => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const sortedFakeData = [...fakeData].sort((a, b) => {
    if (sortDirection === 'asc') {
      return b.second - a.second;
    } else if (sortDirection === 'desc') {
      return a.second - b.second;
    } else {
      return 0;
    }
  });

  const onSelectedRowChanged = (index: number) => {
    if (selectedRows.has(index)) {
      setSelectedRows(
        new Set([...selectedRows].filter((item) => item !== index))
      );
    } else {
      setSelectedRows(new Set([...selectedRows, index]));
    }
  };

  const onExpandRow = (index: number) => {
    const nextExpandedIndex = expandedRowIndex === index ? null : index;
    setExpandedRowIndex(nextExpandedIndex);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>
            {fakeData.length} / {fakeData.length}
          </TableHeadCell>
          <TableHeadCell>Words</TableHeadCell>
          <TableHeadCell
            sortDirection={sortDirection ?? 'desc'}
            onSortDirectionChange={setSortDirection}
            isSortingActive={!!sortDirection}
          >
            Numerical
          </TableHeadCell>
          <TableHeadCell>Empty</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedFakeData.map((rowData, index) => (
          <>
            <TableRow key={index}>
              <TableRowSelectorCell
                isSelected={selectedRows.has(index)}
                onChange={() => onSelectedRowChanged(index)}
                mode="default"
              />
              <TableCell>
                <div className={styles.widthLimitedContainer}>
                  {rowData.first}
                </div>
              </TableCell>
              <TableCell>{rowData.second}</TableCell>
              <TableCell>
                <ExpandCell
                  isExpanded={index === expandedRowIndex}
                  onChange={() => onExpandRow(index)}
                />
              </TableCell>
            </TableRow>
            {index === expandedRowIndex && (
              <TableRow key={`${index}-expanded`}>
                <TableCell colSpan={4}>More content for row {index}</TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
};

const ExpandCell = (props: { isExpanded: boolean; onChange: () => void }) => {
  const { isExpanded, onChange } = props;

  return <ShowHide label="more" isExpanded={isExpanded} onClick={onChange} />;
};

TableStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/Table'
};
