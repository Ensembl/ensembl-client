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
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import userEvent from '@testing-library/user-event';
import set from 'lodash/fp/set';
import merge from 'lodash/fp/merge';

import { BrowserSidebarToolstrip } from './BrowserSidebarToolstrip';

import * as drawerActions from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import * as browserSidebarModalActions from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';
import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

jest.mock(
  'src/shared/components/image-button/ImageButton',
  () => (props: { description: string; onClick: () => void }) =>
    <button onClick={props.onClick}>{props.description}</button>
);

const fakeGenomeId = 'human';

const mockState = {
  browser: {
    drawer: {
      [fakeGenomeId]: {
        isDrawerOpened: false,
        drawerView: { name: 'bookmarks' }
      }
    },
    browserGeneral: {
      activeGenomeId: fakeGenomeId
    },
    trackPanel: {
      isTrackPanelOpened: true
    },
    browserSidebarModal: {
      [fakeGenomeId]: {
        isBrowserSidebarModalOpened: true,
        browserSidebarModalView: BrowserSidebarModalView.BOOKMARKS
      }
    }
  }
};

const mockStore = configureMockStore([thunk]);
let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserSidebarToolstrip />
    </Provider>
  );
};

describe('<BrowserSidebarToolstrip />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('displays correct number of buttons', () => {
      const { container } = renderComponent();
      expect(container.querySelectorAll('button').length).toBe(6);
    });

    it('passes correct data to callbacks when buttons are clicked', () => {
      const { container } = renderComponent(
        set(
          `browser.browserSidebarModal.${fakeGenomeId}.browserSidebarModalView`,
          null,
          mockState
        )
      );
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === BrowserSidebarModalView.BOOKMARKS
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);

      const toggleBrowserSidebarModalAction = store
        .getActions()
        .find(
          (action) =>
            action.type ===
            browserSidebarModalActions.updateBrowserSidebarModalForGenome.type
        );

      const expectedPayload = {
        activeGenomeId: fakeGenomeId,
        data: {
          ...mockState.browser.browserSidebarModal[fakeGenomeId],
          browserSidebarModalView: BrowserSidebarModalView.BOOKMARKS,
          isBrowserSidebarModalOpened: true
        }
      };

      expect(toggleBrowserSidebarModalAction.payload).toEqual(expectedPayload);
    });

    it('opens the track panel if it is closed when a button is clicked', () => {
      const newMockState = merge(mockState, {
        browser: {
          browserSidebarModal: {
            [fakeGenomeId]: {
              isBrowserSidebarModalOpened: false,
              browserSidebarModalView: null
            }
          }
        }
      });

      const { container } = renderComponent(newMockState);
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === BrowserSidebarModalView.BOOKMARKS
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);

      const toggleBrowserSidebarModalAction = store
        .getActions()
        .find(
          (action) =>
            action.type ===
            browserSidebarModalActions.updateBrowserSidebarModalForGenome.type
        );

      const expectedPayload = {
        activeGenomeId: fakeGenomeId,
        data: {
          ...mockState.browser.browserSidebarModal[fakeGenomeId],
          isBrowserSidebarModalOpened: true
        }
      };

      expect(toggleBrowserSidebarModalAction.payload).toEqual(expectedPayload);
    });

    it('causes browser sidebar modal to close if a pressed button is clicked again', () => {
      const { container } = renderComponent();
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === BrowserSidebarModalView.BOOKMARKS
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);

      const toggleBrowserSidebarModalAction = store
        .getActions()
        .find(
          (action) =>
            action.type ===
            browserSidebarModalActions.updateBrowserSidebarModalForGenome.type
        );

      const expectedPayload = {
        activeGenomeId: fakeGenomeId,
        data: {
          ...mockState.browser.browserSidebarModal[fakeGenomeId],
          isBrowserSidebarModalOpened: false,
          browserSidebarModalView: null
        }
      };

      expect(toggleBrowserSidebarModalAction.payload).toEqual(expectedPayload);
    });

    it('closes drawer view when the modal view changes', () => {
      jest.spyOn(drawerActions, 'closeDrawer');
      const { container } = renderComponent(
        set(`browser.drawer.${fakeGenomeId}.isDrawerOpened`, true, mockState)
      );
      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Previously viewed'
      ) as HTMLButtonElement;

      userEvent.click(bookmarksButton);

      expect(drawerActions.closeDrawer).toHaveBeenCalled();
    });
  });
});
