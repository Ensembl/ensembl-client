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
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import thunk from 'redux-thunk';
import faker from '@faker-js/faker';
import configureMockStore from 'redux-mock-store';

import {
  createMockBrowserState,
  createZmenuContentPayload
} from 'tests/fixtures/browser';

import {
  ZmenuContent,
  ZmenuContentProps,
  ZmenuContentItem,
  ZmenuContentItemProps
} from './ZmenuContent';

jest.mock('./ZmenuAppLinks', () => () => <div>ZmenuAppLinks</div>);

const mockChangeFocusObjectFromZmenu = jest.fn();
jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    changeFocusObjectFromZmenu: mockChangeFocusObjectFromZmenu
  })
);

enum Markup {
  STRONG = 'strong',
  EMPHASIS = 'emphasis',
  FOCUS = 'focus',
  LIGHT = 'light'
}

const mockState = createMockBrowserState();
const mockStoreCreator = configureMockStore([thunk]);
const mockStore = mockStoreCreator(() => mockState);

const defaultZmenuContentProps: ZmenuContentProps = {
  ...createZmenuContentPayload(),
  destroyZmenu: jest.fn()
};

const renderZmenuContent = (store = mockStore) =>
  render(
    <Provider store={store}>
      <ZmenuContent {...defaultZmenuContentProps} />
    </Provider>
  );

const defaultZmenuContentItemProps: ZmenuContentItemProps = {
  featureId: faker.lorem.words(),
  markup: [Markup.FOCUS],
  text: faker.lorem.words(),
  destroyZmenu: jest.fn()
};

const renderZmenuContentItem = (store = mockStore) =>
  render(
    <Provider store={store}>
      <ZmenuContentItem {...defaultZmenuContentItemProps} />
    </Provider>
  );

describe('<ZmenuContent />', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the correct zmenu content information', () => {
      const { container } = renderZmenuContent();
      const zmenuContentLine = defaultZmenuContentProps.features[0].data[0];

      const renderedContentBlocks = container
        .querySelectorAll('.zmenuContentLine')[0]
        .querySelectorAll('.zmenuContentBlock');

      // check that the number of blocks of text is correct
      expect(renderedContentBlocks.length).toBe(zmenuContentLine.length);

      // check that the text from each block of text has been rendered
      zmenuContentLine.forEach((block, index) => {
        const blockText = block.items.reduce((acc, { text }) => acc + text, '');
        expect(renderedContentBlocks[index].textContent).toBe(blockText);
      });

      zmenuContentLine.forEach((block, blockIndex) => {
        block.items.forEach((blockItem, blockItemIndex) => {
          const renderedElement =
            renderedContentBlocks[blockIndex].querySelectorAll('span')[
              blockItemIndex
            ];
          if (blockItem.markup.includes(Markup.LIGHT)) {
            expect(
              renderedElement.classList.contains('markupLight')
            ).toBeTruthy();
          }
          if (blockItem.markup.includes(Markup.STRONG)) {
            expect(
              renderedElement.classList.contains('markupStrong')
            ).toBeTruthy();
          }
        });
      });
    });
  });

  describe('<ZmenuContentItem />', () => {
    it('calls function to change focus feature when feature link is clicked', async () => {
      const { container } = renderZmenuContentItem();

      await userEvent.click(container.firstChild as HTMLDivElement);

      expect(mockChangeFocusObjectFromZmenu).toHaveBeenCalledWith(
        defaultZmenuContentItemProps.featureId
      );
    });
  });
});
