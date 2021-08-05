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
import { render } from '@testing-library/react';

import faker from 'faker';

import { BreakpointWidth } from 'src/global/globalConfig';

import { Browser, BrowserProps } from './Browser';

import { createChrLocationValues } from 'tests/fixtures/browser';

jest.mock('./hooks/useBrowserRouting', () => () => ({
  changeGenomeId: jest.fn()
}));
jest.mock('./browser-bar/BrowserBar', () => () => (
  <div className="browserBar">BrowserBar</div>
));
jest.mock('./browser-image/BrowserImage', () => () => (
  <div className="browserImage">BrowserImage</div>
));
jest.mock('./browser-nav/BrowserNavBar', () => () => (
  <div className="browserNavBar">BrowserNavBar</div>
));
jest.mock('./track-panel/TrackPanel', () => () => (
  <div className="trackPanel">TrackPanel</div>
));
jest.mock('./browser-app-bar/BrowserAppBar', () => () => (
  <div className="browserAppBar">BrowserAppBar</div>
));
jest.mock('./interstitial/BrowserInterstitial', () => () => (
  <div className="browserInterstitial">BrowserInterstitial</div>
));
jest.mock('./track-panel/track-panel-bar/TrackPanelBar', () => () => (
  <div className="trackPanelBar">TrackPanelBar</div>
));
jest.mock('./track-panel/track-panel-tabs/TrackPanelTabs', () => () => (
  <div className="trackPanelTabs">TrackPanelTabs</div>
));
jest.mock('./drawer/Drawer', () => () => <div className="drawer">Drawer</div>);

jest.mock('src/gql-client', () => ({ client: jest.fn() }));

const defaultProps: BrowserProps = {
  activeGenomeId: faker.lorem.words(),
  activeEnsObjectId: faker.lorem.words(),
  browserActivated: false,
  browserNavOpenState: false,
  browserQueryParams: {},
  chrLocation: createChrLocationValues().tupleValue,
  isDrawerOpened: false,
  isTrackPanelOpened: false,
  exampleEnsObjects: [],
  toggleTrackPanel: jest.fn(),
  toggleDrawer: jest.fn(),
  viewportWidth: BreakpointWidth.DESKTOP
};

describe('<Browser />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mountBrowserComponent = (props?: Partial<BrowserProps>) =>
    render(
      <MemoryRouter>
        <Browser {...defaultProps} {...props} />
      </MemoryRouter>
    );

  describe('rendering', () => {
    it('renders an interstitial if no species is selected', () => {
      const { container } = mountBrowserComponent({ activeGenomeId: null });
      expect(container.querySelector('.browserInterstitial')).toBeTruthy();
    });

    it('renders an interstitial if no feature has been selected', () => {
      const { container } = mountBrowserComponent();
      expect(container.querySelector('.browserInterstitial')).toBeTruthy();
    });

    it('renders the genome browser and track panel only when there is a selected focus feature', () => {
      const { container, rerender } = mountBrowserComponent();

      expect(container.querySelectorAll('.browserImage')).toHaveLength(0);
      expect(container.querySelectorAll('.trackPanel')).toHaveLength(0);

      rerender(
        <Browser
          {...defaultProps}
          browserQueryParams={{ focus: faker.lorem.words() }}
        />
      );

      expect(container.querySelectorAll('.browserImage')).toHaveLength(1);
      expect(container.querySelectorAll('.trackPanel')).toHaveLength(1);
    });

    describe('BrowserNavBar', () => {
      const props = {
        ...defaultProps,
        browserActivated: true,
        browserQueryParams: { focus: 'foo' }
      };

      it('is rendered when props.browserNavOpenState is true', () => {
        const { container, rerender } = mountBrowserComponent(props);
        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(0);

        rerender(<Browser {...props} browserNavOpenState={true} />);
        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(1);
      });

      it('is not rendered if drawer is opened', () => {
        const { container, rerender } = mountBrowserComponent({
          ...props,
          browserNavOpenState: true
        });

        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(1);

        rerender(<Browser {...defaultProps} isDrawerOpened={true} />);

        expect(container.querySelectorAll('.browserNavBar')).toHaveLength(0);
      });
    });
  });
});
