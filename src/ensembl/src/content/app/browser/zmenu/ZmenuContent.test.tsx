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
import faker from 'faker';
import configureMockStore from 'redux-mock-store';

import {
  createMockBrowserState,
  createZmenuContent
} from 'tests/fixtures/browser';

import {
  ZmenuContent,
  ZmenuContentProps,
  ZmenuContentItem,
  ZmenuContentItemProps
} from './ZmenuContent';

jest.mock('./ZmenuAppLinks', () => () => <div>ZmenuAppLinks</div>);

const mockChangeFocusObject = jest.fn();
jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  changeFocusObject: mockChangeFocusObject
}));

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
  content: createZmenuContent(),
  destroyZmenu: jest.fn()
};

const renderZmenuContent = (store = mockStore) =>
  render(
    <Provider store={store}>
      <ZmenuContent {...defaultZmenuContentProps} />
    </Provider>
  );

const defaultZmenuContentItemProps: ZmenuContentItemProps = {
  id: faker.lorem.words(),
  markup: [Markup.FOCUS],
  text: faker.lorem.words()
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
      const zmenuContent = defaultZmenuContentProps.content;

      const renderedContentFeatures = container.querySelectorAll(
        '.zmenuContentFeature'
      );

      expect(renderedContentFeatures.length).toBe(zmenuContent.length);

      const renderedContentBlocks =
        container.querySelectorAll('.zmenuContentBlock');

      const expectedData: { blockText: string[]; totalBlocks: number } = {
        blockText: [],
        totalBlocks: 0
      };

      defaultZmenuContentProps.content.forEach((feature) => {
        expectedData.totalBlocks += feature.data.filter(
          (line) => line.type === 'block'
        ).length;
      });

      // check that the number of blocks of text is correct
      expect(renderedContentBlocks.length).toBe(expectedData.totalBlocks);

      zmenuContent.forEach((feature) => {
        feature.data.forEach((block) => {
          if (block.type === 'block') {
            const blockText = block.items.reduce(
              (acc, { text }) => acc + text,
              ''
            );

            const blockIndex = expectedData.blockText.push(blockText) - 1;
            expect(renderedContentBlocks[blockIndex].textContent).toBe(
              blockText
            );

            block.items.forEach((item, index) => {
              const renderedElement =
                renderedContentBlocks[blockIndex].querySelectorAll('span')[
                  index
                ];
              if (item.markup.includes(Markup.LIGHT)) {
                expect(
                  renderedElement.classList.contains('markupLight')
                ).toBeTruthy();
              }
              if (item.markup.includes(Markup.STRONG)) {
                expect(
                  renderedElement.classList.contains('markupStrong')
                ).toBeTruthy();
              }
            });
          }
        });
      });
    });
  });

  describe('<ZmenuContentItem />', () => {
    it('calls function to change focus feature when feature link is clicked', () => {
      const { container } = renderZmenuContentItem();

      userEvent.click(container.firstChild as HTMLDivElement);

      expect(mockChangeFocusObject).toHaveBeenCalledTimes(1);
    });
  });
});
