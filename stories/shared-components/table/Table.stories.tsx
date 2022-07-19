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

import { cloneDeep } from 'lodash/fp';
import React, { useState } from 'react';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import {
  Columns,
  TableData
} from 'src/shared/components/table/state/tableReducer';

import Table from 'src/shared/components/table/Table';

const columns: Columns = [
  {
    columnId: '1',
    title: 'Column 1'
  },
  {
    columnId: '2',
    title: 'Column 2',
    isSearchable: false
  },
  {
    columnId: '3',
    title: 'Column 3'
  }
];

const sampleTableData: TableData = [
  { cells: ['Cell 1,1', 'Cell 1,2', 'Cell 1,3'] },
  { cells: ['Cell 2,1', 'Cell 2,2', 'Cell 2,3'] },
  { cells: ['Cell 3,1', 'Cell 3,2', 'Cell 3,3'] }
];

export const TableStory = () => {
  const [tableState, setTableState] = useState({
    columns,
    data: cloneDeep(sampleTableData)
  });

  return <Table {...tableState} onStateChange={setTableState} />;
};

TableStory.storyName = 'default';

const sampleTableDataForExpand = cloneDeep(sampleTableData);

export const TableWithExpandStory = () => {
  const onExpanded = (isExpanded: boolean, rowId: number) => {
    const tableData = tableState.data;

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

  sampleTableDataForExpand.map((rowData, rowId) => {
    rowData.cells[1] = (
      <ShowHideColumn
        onExpanded={onExpanded}
        rowId={rowId}
        isExpanded={!!rowData.expandedContent}
      />
    );
  });

  const [tableState, setTableState] = useState({
    columns,
    data: sampleTableDataForExpand
  });

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
    ></ShowHide>
  );
};

TableWithExpandStory.storyName = 'with expanded content';

export default {
  title: 'Components/Shared Components/Table'
};
