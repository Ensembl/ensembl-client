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
import { MemoryRouter } from 'react-router';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import Browser from './Browser';

import { createMockBrowserState } from 'tests/fixtures/browser';

jest.mock('./hooks/useBrowserRouting', () => () => ({
  changeGenomeId: jest.fn()
}));
jest.mock('./hooks/useGenomeBrowser', () => () => ({
  genomeBrowser: {}
}));
jest.mock('./components/browser-bar/BrowserBar', () => () => (
  <div className="browserBar">BrowserBar</div>
));
jest.mock('./components/browser-image/BrowserImage', () => () => (
  <div className="browserImage">BrowserImage</div>
));
jest.mock('./components/browser-nav/BrowserNavBar', () => () => (
  <div className="browserNavBar">BrowserNavBar</div>
));
jest.mock('./components/track-panel/TrackPanel', () => () => (
  <div className="trackPanel">TrackPanel</div>
));
jest.mock('./components/browser-app-bar/BrowserAppBar', () => () => (
  <div className="browserAppBar">BrowserAppBar</div>
));
jest.mock('./components/interstitial/BrowserInterstitial', () => () => (
  <div className="browserInterstitial">BrowserInterstitial</div>
));
jest.mock(
  './components/track-panel/components/track-panel-bar/TrackPanelBar',
  () => () => <div className="trackPanelBar">TrackPanelBar</div>
);
jest.mock(
  './components/track-panel/components/track-panel-tabs/TrackPanelTabs',
  () => () => <div className="trackPanelTabs">TrackPanelTabs</div>
);
jest.mock('./components/drawer/Drawer', () => () => (
  <div className="drawer">Drawer</div>
));

jest.mock('src/gql-client', () => ({ client: jest.fn() }));

const mockState = createMockBrowserState();
const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (
  params: { state: typeof mockState; url: string } = {
    state: mockState,
    url: '/'
  }
) => {
  store = mockStore(params.state);
  return render(
    <MemoryRouter initialEntries={[params.url]}>
      <Provider store={store}>
        <Browser />
      </Provider>
    </MemoryRouter>
  );
};

describe('<Browser />', () => {
  const activeGenomeId = mockState.browser.browserGeneral.activeGenomeId;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders an interstitial if no species is selected', () => {
      const { container } = renderComponent({
        state: set('browser.browserGeneral.activeGenomeId', null, mockState),
        url: '/'
      });
      expect(container.querySelector('.browserInterstitial')).toBeTruthy();
    });

    it('renders an interstitial if no feature has been selected', () => {
      const { container } = renderComponent();
      expect(container.querySelector('.browserInterstitial')).toBeTruthy();
    });

    it('renders the genome browser and track panel only when there is a selected focus feature', () => {
      let { container } = renderComponent();

      expect(container.querySelectorAll('.browserImage')).toHaveLength(0);
      expect(container.querySelectorAll('.trackPanel')).toHaveLength(0);

      container = renderComponent({
        state: mockState,
        url: '/genome-browser?focus=foo'
      }).container;

      expect(container.querySelectorAll('.browserImage')).toHaveLength(1);
      expect(container.querySelectorAll('.trackPanel')).toHaveLength(1);
    });

    describe('BrowserNavBar', () => {
      const stateWithBrowserNavOpen = set(
        `browser.browserNav.browserNavOpenState.${activeGenomeId}`,
        true,
        mockState
      );

      it('is rendered when the nav bar is open', () => {
        let { container } = renderComponent({
          state: mockState,
          url: '/genome-browser?focus=foo'
        });
        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(0);

        container = renderComponent({
          state: stateWithBrowserNavOpen,
          url: '/genome-browser?focus=foo'
        }).container;

        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(1);
      });

      it('is not rendered if drawer is opened', () => {
        let { container } = renderComponent({
          state: stateWithBrowserNavOpen,
          url: '/genome-browser?focus=foo'
        });

        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(1);

        const stateWithDrawerOpen = set(
          `drawer.isDrawerOpened.${activeGenomeId}`,
          true,
          stateWithBrowserNavOpen
        );

        container = renderComponent({
          state: stateWithDrawerOpen,
          url: '/'
        }).container;

        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(0);
      });
    });
  });
});
