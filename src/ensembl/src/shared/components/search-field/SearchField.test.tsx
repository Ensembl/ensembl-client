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

import SearchField from './SearchField';

describe('<SearchField />', () => {
  const commonProps = {
    search: '',
    onChange: jest.fn(),
    onSubmit: jest.fn()
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders an Input element', () => {
      const { container } = render(<SearchField {...commonProps} />);
      expect(container.querySelector('input')).toBeTruthy();
    });
  });

  describe('behaviour', () => {
    it('calls onChange handler for every search change', () => {
      const search = 'fo';
      const { container } = render(
        <SearchField {...commonProps} search={search} />
      );
      const input = container.querySelector('input') as HTMLElement;

      // since the input is a controlled element,
      // changing its value by a single letter is the only meaningful change we can check
      userEvent.type(input, 'o');

      expect(commonProps.onChange).toHaveBeenCalled();
      expect(commonProps.onChange.mock.calls[0][0]).toBe('foo');
    });

    it('calls onSubmit passing it the search value if enter is pressed', () => {
      const search = 'foo';
      const { container } = render(
        <SearchField {...commonProps} search={search} />
      );
      const input = container.querySelector('input') as HTMLElement;

      userEvent.type(input, '{enter}');
      expect(commonProps.onSubmit).toHaveBeenCalled();
      expect(commonProps.onSubmit.mock.calls[0][0]).toBe(search);
    });
  });
});
