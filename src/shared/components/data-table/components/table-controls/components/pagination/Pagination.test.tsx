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

import {
  TableContext,
  type TableContextType
} from 'src/shared/components/data-table/DataTable';

import Pagination from './Pagination';
import { defaultDataTableState } from 'src/shared/components/data-table/dataTableReducer';
import { createDataTableSampleData } from 'src/shared/components/data-table/DataTable.test';

const defaultProps = {
  ...defaultDataTableState,
  dispatch: jest.fn(),
  ...createDataTableSampleData(21, 2)
};

describe('<Pagination />', () => {
  const renderPagination = (props: Partial<TableContextType> = {}) =>
    render(
      <TableContext.Provider value={{ ...defaultProps, ...props }}>
        <Pagination />
      </TableContext.Provider>
    );

  let container: HTMLElement;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders without error', () => {
    container = renderPagination().container;
    expect(() => container).not.toThrow();
  });

  test('left chevron button is disabled on first page', () => {
    container = renderPagination({
      currentPageNumber: 1
    }).container;
    const [leftChevronButton] = container.querySelectorAll('button');

    expect(leftChevronButton.hasAttribute('disabled')).toBe(true);
  });

  test('left chevron button is enabled when currentPageNumber > 1 ', () => {
    container = renderPagination({
      currentPageNumber: 2
    }).container;
    const [leftChevronButton] = container.querySelectorAll('button');

    expect(leftChevronButton.hasAttribute('disabled')).toBe(false);
  });

  test('right chevron button is enabled when there are more records to display ', () => {
    container = renderPagination({
      currentPageNumber: 1,
      rowsPerPage: 10
    }).container;
    const [, rightChevronButton] = container.querySelectorAll('button');

    expect(rightChevronButton.hasAttribute('disabled')).toBe(false);
  });

  test('right chevron button is disabled when there are no more records to display ', () => {
    container = renderPagination({
      currentPageNumber: 1,
      rowsPerPage: 100
    }).container;
    const [, rightChevronButton] = container.querySelectorAll('button');

    expect(rightChevronButton.hasAttribute('disabled')).toBe(true);
  });

  test('calculates the correct total pages count', () => {
    container = renderPagination().container;
    const paginationElement = container.querySelector('.pagination') as Element;

    const defaultTotalPages = Math.ceil(
      defaultProps.data.length / defaultProps.rowsPerPage
    );

    expect(paginationElement.textContent).toBe(`of ${defaultTotalPages}`);
  });

  test('total pages count is 1 when All rows are displayed in a page', () => {
    container = renderPagination({
      rowsPerPage: Infinity
    }).container;
    const paginationElement = container.querySelector('.pagination') as Element;

    expect(paginationElement.textContent).toBe(`of 1`);
  });

  // TODO: can be enabled after #826 is merged in
  test.skip('respects hidden rows when calculating total pages count', () => {
    const hiddenRowIds = {
      '1': true,
      '2': true
    };

    container = renderPagination({
      rowsPerPage: Infinity,
      hiddenRowIds
    }).container;
    const paginationElement = container.querySelector('.pagination') as Element;

    const totalRowsWithoutHiddenRows =
      defaultProps.data.length - Object.keys(hiddenRowIds).length;

    const totalPages = Math.ceil(
      totalRowsWithoutHiddenRows / defaultProps.rowsPerPage
    );

    expect(paginationElement.textContent).toBe(`of ${totalPages}`);
  });

  test('prevents invalid user inputs', async () => {
    container = renderPagination().container;
    const inputElement = container.querySelector('input') as Element;

    // Typing non-numeric characters
    await userEvent.type(inputElement, 'a');
    expect(defaultProps.dispatch).toBeCalledWith({
      type: 'set_current_page_number',
      payload: defaultProps.currentPageNumber
    });

    // Entering a number less than 1
    await userEvent.type(inputElement, '0');
    expect(defaultProps.dispatch).toBeCalledWith({
      type: 'set_current_page_number',
      payload: defaultProps.currentPageNumber
    });

    // Entering a number greater than total pages count
    const totalPagesCount = Math.ceil(
      defaultProps.data.length / defaultProps.rowsPerPage
    );
    await userEvent.type(inputElement, String(totalPagesCount + 1));
    expect(defaultProps.dispatch).toBeCalledWith({
      type: 'set_current_page_number',
      payload: defaultProps.currentPageNumber
    });

    // Pasting a number greater than total pages count
    await userEvent.click(inputElement);
    await userEvent.paste(String(totalPagesCount + 1));
    expect(defaultProps.dispatch).toBeCalledWith({
      type: 'set_current_page_number',
      payload: defaultProps.currentPageNumber
    });
  });
});
