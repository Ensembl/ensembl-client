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

import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import merge from 'lodash/fp/merge';

import createRootReducer from 'src/root/rootReducer';
import {
  getIsBrowserSidebarModalOpened,
  getBrowserSidebarModalView
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSelectors';

import BrowserSidebarToolstrip from './BrowserSidebarToolstrip';

import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

vi.mock(
  'src/shared/components/image-button/ImageButton',
  () => (props: { description: string; onClick: () => void }) => (
    <button onClick={props.onClick}>{props.description}</button>
  )
);

vi.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => ({
    trackSidebarModalViewToggle: vi.fn()
  })
);

const fakeGenomeId = 'human';

const mockState = {
  browser: {
    drawer: {
      general: {
        [fakeGenomeId]: {
          isDrawerOpened: false,
          drawerView: { name: 'bookmarks' }
        }
      }
    },
    browserGeneral: {
      activeGenomeId: fakeGenomeId
    },
    trackPanel: {
      [fakeGenomeId]: {
        isTrackPanelOpened: true
      }
    }
  }
};

const renderComponent = (state: typeof mockState = mockState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  const renderResult = render(
    <Provider store={store}>
      <BrowserSidebarToolstrip />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

describe('<BrowserSidebarToolstrip />', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('rendering', () => {
    it('displays correct number of buttons', () => {
      const { container } = renderComponent();
      expect(container.querySelectorAll('button').length).toBe(5);
    });

    it('toggles sidebar modal', async () => {
      const { container, store } = renderComponent();

      const searchButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === 'Search'
      ) as HTMLButtonElement;

      // sidebar is not showing a modal initially
      expect(getBrowserSidebarModalView(store.getState())).toBe(null);

      await userEvent.click(searchButton);

      expect(getBrowserSidebarModalView(store.getState())).toBe(
        BrowserSidebarModalView.SEARCH
      );

      await userEvent.click(searchButton);

      // the modal gets closed
      expect(getBrowserSidebarModalView(store.getState())).toBe(null);
    });

    it('opens the track panel if it is closed when a button is clicked', async () => {
      const newMockState = merge(mockState, {
        browser: {
          trackPanel: {
            [fakeGenomeId]: {
              isTrackPanelOpened: false
            }
          }
        }
      });

      const { container, store } = renderComponent(newMockState);

      const bookmarksButton = [...container.querySelectorAll('button')].find(
        (button) => button.innerHTML === BrowserSidebarModalView.BOOKMARKS
      ) as HTMLButtonElement;

      expect(getIsBrowserSidebarModalOpened(store.getState())).toBe(false);

      await userEvent.click(bookmarksButton);

      expect(getIsBrowserSidebarModalOpened(store.getState())).toBe(true);
    });
  });
});
