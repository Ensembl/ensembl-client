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
import { configureStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import set from 'lodash/fp/set';

import createRootReducer from 'src/root/rootReducer';

import { createMockBrowserState } from 'tests/fixtures/browser';
import * as browserSidebarModalActions from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

import {
  BrowserSidebarModal,
  browserSidebarModalTitles
} from './BrowserSidebarModal';

import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

jest.mock('./modal-views/SearchModal', () => () => (
  <div className="searchModal" />
));

jest.mock('./modal-views/DownloadModal', () => () => (
  <div className="downloadModal" />
));

jest.mock(
  'src/shared/components/close-button/CloseButton',
  () => (props: { onClick: () => void }) => (
    <button className="closeButton" onClick={props.onClick}></button>
  )
);

const mockState = createMockBrowserState();

const renderComponent = (state: typeof mockState = mockState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  return render(
    <Provider store={store}>
      <BrowserSidebarModal />
    </Provider>
  );
};

describe('<TrackPanelModal />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('displays sidebar modal view for search', async () => {
      const { activeGenomeId } = mockState.browser.browserGeneral;
      const { container } = renderComponent(
        set(
          `browser.browserSidebarModal.${activeGenomeId}.browserSidebarModalView`,
          BrowserSidebarModalView.SEARCH,
          mockState
        )
      );

      await waitFor(() => {
        expect(container.querySelector('.title')?.innerHTML).toBe(
          browserSidebarModalTitles[BrowserSidebarModalView.SEARCH]
        );
      });
    });

    it('displays track panel modal view for download', async () => {
      const { activeGenomeId } = mockState.browser.browserGeneral;
      const { container } = renderComponent(
        set(
          `browser.browserSidebarModal.${activeGenomeId}.browserSidebarModalView`,
          BrowserSidebarModalView.DOWNLOAD,
          mockState
        )
      );

      await waitFor(() => {
        expect(container.querySelector('.title')?.innerHTML).toBe(
          browserSidebarModalTitles[BrowserSidebarModalView.DOWNLOAD]
        );
      });
    });
  });

  describe('behaviour', () => {
    it('closes the modal when the close button is clicked', async () => {
      const { activeGenomeId } = mockState.browser.browserGeneral;
      const { container } = renderComponent(
        set(
          `browser.browserSidebarModal.${activeGenomeId}.browserSidebarModalView`,
          BrowserSidebarModalView.SEARCH,
          mockState
        )
      );

      await waitFor(() => {
        expect(container.querySelector('.searchModal')).toBeTruthy();
      });

      const closeButton = container.querySelector('button.closeButton');

      jest.spyOn(browserSidebarModalActions, 'closeBrowserSidebarModal');

      await userEvent.click(closeButton as HTMLElement);
      expect(
        browserSidebarModalActions.closeBrowserSidebarModal
      ).toHaveBeenCalledTimes(1);
    });
  });
});
