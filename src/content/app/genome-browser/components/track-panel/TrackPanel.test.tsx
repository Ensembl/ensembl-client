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
import set from 'lodash/fp/set';

import { createMockBrowserState } from 'tests/fixtures/browser';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

import { TrackPanel } from './TrackPanel';

const mockGenomeBrowser = new MockGenomeBrowser();
jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser,
    restoreBrowserTrackStates: jest.fn()
  })
);

jest.mock('src/shared/components/loader', () => ({
  SidebarLoader: () => <div className="sidebarLoader" />
}));

jest.mock('./components/track-panel-bar/TrackPanelBar', () => () => (
  <div className="trackPanel" />
));
jest.mock('./components/track-panel-list/TrackPanelList', () => () => (
  <div className="trackPanelList" />
));
jest.mock(
  'src/content/app/genome-browser/components/drawer/Drawer',
  () => () => <div className="drawer" />
);

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <TrackPanel />
    </Provider>
  );
};

describe('<TrackPanel />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('does not render anything when not all rendering requirements are satisfied', () => {
      // defaultProps are insufficient for rendering anything useful
      // TODO: in the future, it might be a good idea to at least render a spinner here
      const { container } = renderComponent(
        set('browser.browserGeneral.activeGenomeId', null, mockState)
      );
      expect(container.querySelector('.sidebarLoader')).toBeTruthy();
    });

    it('renders TrackPanelList when necessary requirements are satisfied', () => {
      const { container } = renderComponent();

      expect(container.querySelector('.trackPanelList')).toBeTruthy();
    });
  });
});
