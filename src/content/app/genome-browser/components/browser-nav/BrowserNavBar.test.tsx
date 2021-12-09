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

import { BrowserNavBar } from './BrowserNavBar';

jest.mock('./BrowserNavBarControls', () => () => (
  <div>BrowserNavBarControls</div>
));
jest.mock('./BrowserNavBarMain', () => () => <div>BrowserNavBarMain</div>);

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserNavBar />
    </Provider>
  );
};

describe('<BrowserNavBar />', () => {
  describe('rendering', () => {
    it('correctly interprets the "expanded" prop', () => {
      const activeGenomeId = mockState.browser.browserGeneral.activeGenomeId;
      let { container } = renderComponent(
        set(
          `browser.trackPanel.${activeGenomeId}.isTrackPanelOpened`,
          false,
          mockState
        )
      );
      let browserNavBar = container.firstChild as HTMLDivElement;
      expect(browserNavBar.classList.contains('browserNavBarExpanded')).toBe(
        true
      );

      container = renderComponent().container;
      browserNavBar = container.firstChild as HTMLDivElement;
      expect(browserNavBar.classList.contains('browserNavBarExpanded')).toBe(
        false
      );
    });
  });
});
