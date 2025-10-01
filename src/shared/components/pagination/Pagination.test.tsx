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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pagination, { PaginationProps } from './Pagination';

const defaultProps: PaginationProps = {
  currentPageNumber: 1,
  lastPageNumber: 10,
  onChange: vi.fn()
};

describe('<Pagination />', () => {
  const renderPagination = (props: Partial<PaginationProps> = {}) =>
    render(<Pagination {...defaultProps} {...props} />);

  let container: HTMLElement;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders without error', () => {
    container = renderPagination().container;
    expect(() => container).not.toThrow();
  });

  it('left chevron button is disabled on first page', () => {
    container = renderPagination({
      currentPageNumber: 1
    }).container;
    const [leftChevronButton] = container.querySelectorAll('button');

    expect(leftChevronButton.hasAttribute('disabled')).toBe(true);
  });

  it('left chevron button is enabled when currentPageNumber > 1 ', () => {
    container = renderPagination({
      currentPageNumber: 2
    }).container;
    const [leftChevronButton] = container.querySelectorAll('button');

    expect(leftChevronButton.hasAttribute('disabled')).toBe(false);
  });

  it('right chevron button is enabled when currentPageNumber is less lastPageNumber', () => {
    container = renderPagination({
      currentPageNumber: 9,
      lastPageNumber: 10
    }).container;
    const [, rightChevronButton] = container.querySelectorAll('button');

    expect(rightChevronButton.hasAttribute('disabled')).toBe(false);
  });

  it('right chevron button is disabled when currentPageNumber is equal to lastPageNumber', () => {
    container = renderPagination({
      currentPageNumber: 10,
      lastPageNumber: 10
    }).container;
    const [, rightChevronButton] = container.querySelectorAll('button');

    expect(rightChevronButton.hasAttribute('disabled')).toBe(true);
  });

  it('prevents invalid user inputs', async () => {
    container = renderPagination().container;
    const inputElement = container.querySelector('input') as Element;

    // Typing non-numeric characters
    await userEvent.type(inputElement, 'a');
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    // clearing the input
    await userEvent.clear(inputElement);
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    // Entering a number greater than total pages count
    await userEvent.type(inputElement, String(defaultProps.lastPageNumber + 1));
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    // Pasting a number greater than total pages count
    await userEvent.click(inputElement);
    await userEvent.paste(String(defaultProps.lastPageNumber + 1));
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
});
