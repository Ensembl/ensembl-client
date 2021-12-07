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
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import set from 'lodash/fp/set';

import { createMockBrowserState } from 'tests/fixtures/browser';

import { BrowserNavBarControls } from './BrowserNavBarControls';

import { BrowserNavAction } from 'src/content/app/genome-browser/state/browser-nav/browserNavSlice';
import { BrowserNavItem } from 'src/content/app/genome-browser/components/browser-nav/browserNavConfig';

jest.mock(
  './BrowserNavIcon',
  () => (props: { enabled: boolean; browserNavItem: BrowserNavItem }) => {
    const className = props.enabled
      ? 'browserNavIcon enabled'
      : 'browserNavIcon';
    return (
      <div className={className} data-test-id={props.browserNavItem.name} />
    );
  }
);

jest.mock('src/shared/components/overlay/Overlay', () => () => (
  <div className="overlay" />
));

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserNavBarControls />
    </Provider>
  );
};

describe('BrowserNavBarControls', () => {
  it('has an overlay on top when browser nav bar controls are disabled', () => {
    const { container } = renderComponent(
      set('browser.browserLocation.regionEditorActive', true, mockState)
    );
    expect(container.querySelector('.overlay')).toBeTruthy();
  });

  it('disables buttons if corresponding actions are not possible', () => {
    renderComponent();

    const { browserNavIconStates } = mockState.browser.browserNav;
    Object.keys(browserNavIconStates).forEach((icon) => {
      const navIcon = screen.getByTestId(icon);
      expect(navIcon.classList.contains('enabled')).toBe(
        browserNavIconStates[icon as BrowserNavAction]
      );
    });
  });
});
