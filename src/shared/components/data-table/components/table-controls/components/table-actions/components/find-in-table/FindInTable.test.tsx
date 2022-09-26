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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { defaultDataTableState } from 'src/shared/components/data-table/dataTableReducer';

import {
  TableContext,
  type TableContextType
} from 'src/shared/components/data-table/DataTable';
import { TableAction } from 'src/shared/components/data-table/dataTableTypes';

const defaultProps = {
  ...defaultDataTableState,
  dispatch: jest.fn(),
  columns: [],
  rows: defaultDataTableState.data.map((row, index) => ({
    rowId: index,
    cells: row
  }))
};

import FindInTable from './FindInTable';

describe('<FindInTable />', () => {
  const renderFindInTable = (props: Partial<TableContextType> = {}) =>
    render(
      <TableContext.Provider value={{ ...defaultProps, ...props }}>
        <FindInTable />
      </TableContext.Provider>
    );

  let container: HTMLElement;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    container = renderFindInTable().container;
    expect(() => container).not.toThrow();
  });

  it('dispatches the correct search text', async () => {
    container = renderFindInTable().container;

    const textInput = container.querySelector('input') as Element;

    await userEvent.type(textInput, '123');

    expect(defaultProps.dispatch).toHaveBeenNthCalledWith(1, {
      type: 'set_search_text',
      payload: '1'
    });

    expect(defaultProps.dispatch).toHaveBeenNthCalledWith(3, {
      type: 'set_search_text',
      payload: '3'
    });
  });

  it('click on cancel link dispatched the correct action', async () => {
    container = renderFindInTable().container;

    const cancelLink = container.querySelector('.cancel') as Element;

    await userEvent.click(cancelLink);

    expect(defaultProps.dispatch).toHaveBeenNthCalledWith(1, {
      type: 'set_selected_action',
      payload: TableAction.DEFAULT
    });
  });
});
