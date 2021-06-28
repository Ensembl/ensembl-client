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
import faker from 'faker';
import configureMockStore from 'redux-mock-store';

import {
  ZmenuContent,
  ZmenuContentProps,
  ZmenuContentItem,
  ZmenuContentItemProps
} from './ZmenuContent';

import { createZmenuContent } from 'tests/fixtures/browser';

import { Markup } from './zmenu-types';

jest.mock('./ZmenuAppLinks', () => () => <div>ZmenuAppLinks</div>);

const mockChangeFocusObject = jest.fn();
jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  changeFocusObject: mockChangeFocusObject
}));

jest.mock('ensembl-genome-browser', () => {
  return;
});

const mockReduxState = {};
const mockStoreCreator = configureMockStore();
const mockStore = mockStoreCreator(() => mockReduxState);

const defaultProps: ZmenuContentProps = {
  content: createZmenuContent()
};

const renderZmenuContent = (
  props: Partial<ZmenuContentProps> = {},
  store = mockStore
) =>
  render(
    <Provider store={store}>
      <ZmenuContent {...defaultProps} {...props} />
    </Provider>
  );

describe('<ZmenuContent />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders the correct zmenu content information', () => {
      const { container } = renderZmenuContent();
      const zmenuContentLine = defaultProps.content[0].lines[0];

      const renderedContentBlocks =
        container.querySelectorAll('.zmenuContentBlock');

      // check that the number of blocks of text is correct
      expect(renderedContentBlocks.length).toBe(zmenuContentLine.length);

      // check that the text from each block of text has been rendered
      zmenuContentLine.forEach((block, index) => {
        const blockText = block.reduce((acc, { text }) => acc + text, '');
        expect(renderedContentBlocks[index].textContent).toBe(blockText);
      });

      zmenuContentLine.forEach((block, blockIndex) => {
        block.forEach((blockItem, blockItemIndex) => {
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
    it('calls function to change focus feature when feature link is clicked', () => {
      const props: ZmenuContentItemProps = {
        id: faker.lorem.words(),
        markup: [Markup.FOCUS],
        text: faker.lorem.words()
      };
      const { container } = render(<ZmenuContentItem {...props} />);

      userEvent.click(container.firstChild as HTMLDivElement);

      expect(mockChangeFocusObject).toHaveBeenCalledTimes(1);
    });
  });
});
