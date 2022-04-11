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
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import { createMockBrowserState } from 'tests/fixtures/browser';
import * as browserSidebarModalActions from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

import {
  BrowserSidebarModal,
  browserSidebarModalTitles
} from './BrowserSidebarModal';

import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

jest.mock('./modal-views/TrackPanelSearch', () => () => (
  <div className="trackPanelSearch" />
));

jest.mock('./modal-views/TrackPanelDownloads', () => () => (
  <div className="trackPanelDownloads" />
));

jest.mock(
  'src/shared/components/close-button/CloseButton',
  () => (props: { onClick: () => void }) =>
    <button className="closeButton" onClick={props.onClick}></button>
);

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
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
    it('displays track pane modal view for search', () => {
      const { container } = renderComponent();
      expect(container.querySelector('.title')?.innerHTML).toBe(
        browserSidebarModalTitles[BrowserSidebarModalView.SEARCH]
      );
    });

    it('displays track panel modal view for downloads', () => {
      const { activeGenomeId } = mockState.browser.browserGeneral;

      const { container } = renderComponent(
        set(
          `browser.trackPanel.${activeGenomeId}.trackPanelModalView`,
          BrowserSidebarModalView.DOWNLOADS,
          mockState
        )
      );

      expect(container.querySelector('.title')?.innerHTML).toBe(
        browserSidebarModalTitles[BrowserSidebarModalView.DOWNLOADS]
      );
    });
  });

  describe('behaviour', () => {
    it('closes modal when close button is clicked', () => {
      const { container } = renderComponent();
      const closeButton = container.querySelector('button.closeButton');

      jest.spyOn(browserSidebarModalActions, 'closeBrowserSidebarModal');

      userEvent.click(closeButton as HTMLElement);
      expect(
        browserSidebarModalActions.closeBrowserSidebarModal
      ).toHaveBeenCalledTimes(1);
    });
  });
});
