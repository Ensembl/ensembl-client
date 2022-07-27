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
import times from 'lodash/times';

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import {
  Columns,
  TableCellRendererParams,
  TableData,
  TableTheme
} from 'src/shared/components/table/state/tableReducer';
import Table from 'src/shared/components/table/Table';
import RadioGroup from 'src/shared/components/radio-group/RadioGroup';

import styles from './Table.stories.scss';

const createTableData = (
  rows: number,
  columns: number
): { data: TableData; columns: Columns } => {
  return {
    data: times(rows, (row) => ({
      cells: times(columns, (column) => `Cell ${row},${column}`)
    })),
    columns: times(columns, (column) => ({
      columnId: `${column}`,
      title: `Column ${column}`,
      helpText: `Column ${column} help text`,
      isSortable: true,
      width: '150px'
    }))
  };
};

const tableThemeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
];

export const TableStory = () => {
  const tableData = createTableData(150, 10);

  const [tableState, setTableState] = useState(tableData);
  const [tableTheme, setTableTheme] = useState<TableTheme>('light');

  return (
    <>
      <RadioGroup
        options={tableThemeOptions}
        onChange={(theme) => setTableTheme(theme as TableTheme)}
        selectedOption={tableTheme}
        direction="row"
      />
      <Table
        {...tableState}
        theme={tableTheme}
        uniqueColumnId={'0'}
        onStateChange={setTableState}
        classNames={{ wrapper: styles.wrapper }}
      />
    </>
  );
};

TableStory.storyName = 'default';

const sampleTableDataForExpand = createTableData(5, 5);

export const TableWithExpandStory = () => {
  const uniqueColumnId = '0';

  const onExpanded = (isExpanded: boolean, rowId: string) => {
    const tableData = tableState.data;

    const idColumnIndex = sampleTableDataForExpand.columns.findIndex(
      (column) => column.columnId === uniqueColumnId
    );

    const currentRowIndex = tableData.findIndex(
      (row) => row.cells[idColumnIndex] === rowId
    );

    if (!tableData) {
      return;
    }
    if (isExpanded) {
      tableData[currentRowIndex].expandedContent = (
        <div>Column {rowId} expanded content</div>
      );
    } else {
      tableData[currentRowIndex].expandedContent = null;
    }

    setTableState({
      ...tableState,
      data: tableData
    });
  };

  sampleTableDataForExpand.columns[1].renderer = (
    params: TableCellRendererParams
  ) => {
    return (
      <ShowHideColumn
        onExpanded={onExpanded}
        rowId={params.rowId}
        isExpanded={!!params.rowData.expandedContent}
      />
    );
  };
  const [tableState, setTableState] = useState(sampleTableDataForExpand);

  return (
    <Table
      {...tableState}
      uniqueColumnId={uniqueColumnId}
      onStateChange={setTableState}
      classNames={{ wrapper: styles.wrapper }}
    />
  );
};

const ShowHideColumn = (props: {
  isExpanded: boolean;
  onExpanded: (isExpanded: boolean, rowId: string) => void;
  rowId: string;
}) => {
  const onExpanded = () => {
    props.onExpanded(!props.isExpanded, props.rowId);
  };

  return (
    <ShowHide
      label={'show hide'}
      isExpanded={props.isExpanded}
      onClick={onExpanded}
    />
  );
};

TableWithExpandStory.storyName = 'with expanded content';

export default {
  title: 'Components/Shared Components/Table'
};
