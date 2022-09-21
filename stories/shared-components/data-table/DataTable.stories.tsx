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
import React, { ReactNode, useState } from 'react';
import times from 'lodash/times';

import ShowHide from 'src/shared/components/show-hide/ShowHide';
import type {
  DataTableColumns,
  TableCellRendererParams,
  TableData,
  TableTheme
} from 'src/shared/components/data-table/dataTableTypes';
import DataTable from 'src/shared/components/data-table/DataTable';
import RadioGroup from 'src/shared/components/radio-group/RadioGroup';

import styles from './DataTable.stories.scss';

const createTableData = (
  rows: number,
  columns: number
): { data: TableData; columns: DataTableColumns } => {
  return {
    data: times(rows, (row) =>
      times(columns, (column) => `Cell ${row},${column}`)
    ),
    columns: times(columns, (column) => ({
      columnId: `${column}`,
      title: `Column ${column}`,
      helpText: `Column ${column} help text`,
      isSortable: true
    }))
  };
};

const tableThemeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
];

export const DataTableStory = () => {
  const tableData = createTableData(150, 10);

  const [tableState, setTableState] = useState({ data: tableData.data });
  const [tableTheme, setTableTheme] = useState<TableTheme>('light');

  return (
    <>
      <RadioGroup
        options={tableThemeOptions}
        onChange={(theme) => setTableTheme(theme as TableTheme)}
        selectedOption={tableTheme}
        direction="row"
      />
      <DataTable
        state={tableState}
        columns={tableData.columns}
        theme={tableTheme}
        onStateChange={setTableState}
        className={styles.wrapper}
      />
    </>
  );
};

DataTableStory.storyName = 'default';

const sampleTableDataForExpand = createTableData(5, 5);

export const DataTableWithExpandStory = () => {
  const [expandedContent, setExpandedContent] = useState<{
    [rowId: string]: ReactNode;
  }>({});

  const onExpanded = (isExpanded: boolean, rowId: string) => {
    setExpandedContent({
      ...expandedContent,
      [rowId]: isExpanded ? (
        <div>Column {rowId} expanded content</div>
      ) : undefined
    });
  };

  sampleTableDataForExpand.columns[1].renderer = (
    params: TableCellRendererParams
  ) => {
    return (
      <ShowHideColumn
        onExpanded={onExpanded}
        rowId={params.rowId}
        isExpanded={!!expandedContent[params.rowId]}
      />
    );
  };
  const [tableState, setTableState] = useState({
    data: sampleTableDataForExpand.data
  });

  return (
    <DataTable
      state={tableState}
      columns={sampleTableDataForExpand.columns}
      onStateChange={setTableState}
      className={styles.wrapper}
      expandedContent={expandedContent}
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

DataTableWithExpandStory.storyName = 'with expanded content';

export default {
  title: 'Components/Shared Components/DataTable'
};
