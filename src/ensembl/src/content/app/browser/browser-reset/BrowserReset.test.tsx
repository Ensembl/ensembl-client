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
import faker from 'faker';

import { BrowserReset, BrowserResetProps } from './BrowserReset';

const mockChangeFocusObject = jest.fn();
jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  changeFocusObject: mockChangeFocusObject
}));

describe('<BrowserReset />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: BrowserResetProps = {
    focusObjectId: `${faker.lorem.word()}:gene:${faker.lorem.word()}`,
    isActive: true
  };

  describe('rendering', () => {
    it('renders image button when focus feature exists', () => {
      const { container } = render(<BrowserReset {...defaultProps} />);
      expect(container.querySelector('button')).toBeTruthy();
    });

    it('renders nothing when focus feature does not exist', () => {
      const { container } = render(
        <BrowserReset {...defaultProps} focusObjectId={null} />
      );
      expect(container.firstChild).toBeFalsy();
    });
  });

  describe('behaviour', () => {
    it('changes focus object when clicked', () => {
      const { container } = render(<BrowserReset {...defaultProps} />);
      const button = container.querySelector('button') as HTMLButtonElement;

      userEvent.click(button);

      expect(mockChangeFocusObject).toHaveBeenCalledWith(
        defaultProps.focusObjectId
      );
    });
  });
});
