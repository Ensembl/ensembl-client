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
import faker from 'faker';

import Zmenu, { ZmenuProps } from './Zmenu';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { createZmenuContent } from 'tests/fixtures/browser';

const mockGenomeBrowser = new MockGenomeBrowser();
jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  genomeBrowser: mockGenomeBrowser
}));

jest.mock('src/gql-client', () => ({ client: jest.fn() }));

jest.mock('./ZmenuContent', () => () => (
  <div data-test-id="zmenuContent">ZmenuContent</div>
));
jest.mock('./ZmenuInstantDownload', () => () => (
  <div>ZmenuInstantDownload</div>
));

describe('<Zmenu />', () => {
  const defaultProps: ZmenuProps = {
    anchor_coordinates: {
      x: 490,
      y: 80
    },
    browserRef: {
      current: document.createElement('div')
    },
    content: createZmenuContent(),
    id: faker.lorem.words(),
    onEnter: jest.fn(),
    onLeave: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    test('renders zmenu content', () => {
      const { queryByTestId } = render(<Zmenu {...defaultProps} />);
      expect(queryByTestId('zmenuContent')).toBeTruthy();
    });
  });
});
