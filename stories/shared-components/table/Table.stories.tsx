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

import { useState } from 'react';
import times from 'lodash/times';
import { faker } from '@faker-js/faker';
import upperFirst from 'lodash/upperFirst';

import { Table, RowFooter } from 'src/shared/components/table';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

const getTableData = () => {
  const columnsNumber = 10;
  const rowsNumber = 50;

  const columnHeadings: (string | null)[] = times(columnsNumber, () =>
    faker.word.noun()
  ).map(upperFirst);
  columnHeadings[2] = null;

  const tableCells = times(rowsNumber, () =>
    times(columnsNumber, () => faker.lorem.sentence())
  );

  return {
    columnHeadings,
    tableCells
  };
};

const tableData = getTableData();

export const TableStory = () => {
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);
  const { columnHeadings, tableCells } = tableData;

  const onExpandRow = (index: number) => {
    const nextExpandedIndex = expandedRowIndex === index ? null : index;
    setExpandedRowIndex(nextExpandedIndex);
  };

  const table = (
    <Table stickyHeader={true}>
      <thead>
        <tr>
          {columnHeadings.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableCells.map((rowContent, rowIndex) => (
          <>
            <tr key={rowIndex}>
              {rowContent.map((cellContent, index) => {
                if (index === 2) {
                  return (
                    <ExpandCell
                      key={index}
                      isExpanded={rowIndex === expandedRowIndex}
                      onChange={() => onExpandRow(rowIndex)}
                    />
                  );
                }

                return <td key={index}>{cellContent}</td>;
              })}
            </tr>
            {rowIndex === expandedRowIndex && (
              <RowFooter key={`${rowIndex}-expanded`}>
                {faker.lorem.paragraphs()}
              </RowFooter>
            )}
          </>
        ))}
      </tbody>
    </Table>
  );

  return table;
};

const ExpandCell = (props: { isExpanded: boolean; onChange: () => void }) => {
  const { isExpanded, onChange } = props;

  return (
    <td>
      <ShowHide label="more" isExpanded={isExpanded} onClick={onChange} />
    </td>
  );
};

TableStory.storyName = 'default';

export default {
  title: 'Components/Shared Components/Table'
};
