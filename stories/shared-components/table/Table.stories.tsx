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

import Table, { TableProps } from 'src/shared/components/table/Table';

const createTableData = (rows: number, columns: number): TableProps => {
  return {
    data: times(rows, (row) => ({
      cells: times(columns, (column) => `Cell ${row},${column}`)
    })),
    columns: times(columns, (column) => ({
      columnId: `${column}`,
      title: `Column ${column}`
    }))
  };
};

export const TableStory = () => {
  const [tableState, setTableState] = useState(createTableData(15, 15));

  return <Table {...tableState} onStateChange={setTableState} />;
};

TableStory.storyName = 'default';

const sampleTableDataForExpand = createTableData(5, 5);

export const TableWithExpandStory = () => {
  const onExpanded = (isExpanded: boolean, rowId: number) => {
    const tableData = tableState.data;

    if (!tableData) {
      return;
    }
    if (isExpanded) {
      tableData[rowId].expandedContent = (
        <div>Column {rowId} expanded content</div>
      );
    } else {
      tableData[rowId].expandedContent = null;
    }

    setTableState({
      ...tableState,
      data: tableData
    });
  };

  sampleTableDataForExpand.data?.map((rowData, rowId) => {
    rowData.cells[1] = (
      <ShowHideColumn
        onExpanded={onExpanded}
        rowId={rowId}
        isExpanded={!!rowData.expandedContent}
      />
    );
  });

  const [tableState, setTableState] = useState(sampleTableDataForExpand);

  return <Table {...tableState} onStateChange={setTableState} />;
};

const ShowHideColumn = (props: {
  isExpanded: boolean;
  onExpanded: (isExpanded: boolean, rowId: number) => void;
  rowId: number;
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
