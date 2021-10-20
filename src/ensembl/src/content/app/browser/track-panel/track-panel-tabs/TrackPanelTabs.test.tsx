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
import * as trackPanelActions from 'src/content/app/browser/track-panel/trackPanelActions';
import * as drawerActions from 'src/content/app/browser/drawer/drawerActions';

import { TrackPanelTabs } from './TrackPanelTabs';

import { TrackSet } from '../trackPanelConfig';

const mockState = createMockBrowserState();
const activeGenomeId = mockState.browser.browserEntity.activeGenomeId;

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <TrackPanelTabs />
    </Provider>
  );
};

describe('<TrackPanelTabs />', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('contains all track panel tabs', () => {
      const { container } = renderComponent();
      const tabValues = Object.values(TrackSet);
      const tabs = [...container.querySelectorAll('.trackPanelTab')];

      tabValues.forEach((text) => {
        expect(tabs.some((tab) => tab.innerHTML === text)).toBeTruthy();
      });
    });
  });

  describe('behaviour', () => {
    describe('on track panel tab click', () => {
      it('selects track panel tab', () => {
        const { container } = renderComponent();
        const tab = container.querySelector('.trackPanelTab') as HTMLElement;

        jest.spyOn(trackPanelActions, 'selectTrackPanelTab');

        userEvent.click(tab);
        expect(trackPanelActions.selectTrackPanelTab).toHaveBeenCalledWith(
          Object.values(TrackSet)[0]
        );
      });

      it('opens track panel if it is closed', () => {
        let { container } = renderComponent();
        let tab = container.querySelector('.trackPanelTab') as HTMLElement;

        jest.spyOn(trackPanelActions, 'toggleTrackPanel');

        userEvent.click(tab);
        expect(trackPanelActions.toggleTrackPanel).not.toHaveBeenCalled();

        container = renderComponent(
          set(
            `browser.trackPanel.${activeGenomeId}.isTrackPanelOpened`,
            false,
            mockState
          )
        ).container;
        tab = container.querySelector('.trackPanelTab') as HTMLElement;

        userEvent.click(tab);
        expect(trackPanelActions.toggleTrackPanel).toHaveBeenCalledWith(true);
      });

      it('closes drawer if it is opened', () => {
        let { container } = renderComponent();

        let tab = container.querySelector('.trackPanelTab') as HTMLElement;

        jest.spyOn(drawerActions, 'closeDrawer');

        userEvent.click(tab);
        expect(drawerActions.closeDrawer).not.toHaveBeenCalled();

        container = renderComponent(
          set(`drawer.${activeGenomeId}.isDrawerOpened`, true, mockState)
        ).container;
        tab = container.querySelector('.trackPanelTab') as HTMLElement;

        userEvent.click(tab);
        expect(drawerActions.closeDrawer).toHaveBeenCalledTimes(1);
      });
    });
  });
});
