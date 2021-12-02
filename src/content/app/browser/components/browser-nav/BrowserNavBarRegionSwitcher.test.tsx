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
import * as browserActions from 'src/content/app/browser/state/browserActions';

import { BrowserNavBarRegionSwitcher } from './BrowserNavBarRegionSwitcher';

import { BreakpointWidth } from 'src/global/globalConfig';

jest.mock(
  'src/content/app/browser/components/browser-region-editor/BrowserRegionEditor',
  () => () => <div className="browserRegionEditor" />
);
jest.mock(
  'src/content/app/browser/components/browser-region-field/BrowserRegionField',
  () => () => <div className="browserRegionField" />
);

let mockState = createMockBrowserState();
mockState = set('global.breakpointWidth', BreakpointWidth.TABLET, mockState);
const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserNavBarRegionSwitcher />
    </Provider>
  );
};

describe('BrowserNavBarRegionSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders only region field on smaller screens', () => {
      const { container } = renderComponent();

      expect(container.querySelector('.browserRegionField')).toBeTruthy();
      expect(container.querySelector('.browserRegionEditor')).toBeFalsy();
    });

    it('renders both region field and region editor on big desktop screens', () => {
      const { container } = renderComponent(
        set('global.breakpointWidth', BreakpointWidth.BIG_DESKTOP, mockState)
      );

      expect(container.querySelector('.browserRegionField')).toBeTruthy();
      expect(container.querySelector('.browserRegionEditor')).toBeTruthy();
    });
  });

  it('calls cleanup functions on unmount', () => {
    const { unmount } = renderComponent();

    jest.spyOn(browserActions, 'toggleRegionEditorActive');
    jest.spyOn(browserActions, 'toggleRegionFieldActive');

    expect(browserActions.toggleRegionEditorActive).not.toHaveBeenCalled();
    expect(browserActions.toggleRegionFieldActive).not.toHaveBeenCalled();

    unmount();

    expect(browserActions.toggleRegionEditorActive).toHaveBeenCalledWith(false);
    expect(browserActions.toggleRegionFieldActive).toHaveBeenCalledWith(false);
  });
});
