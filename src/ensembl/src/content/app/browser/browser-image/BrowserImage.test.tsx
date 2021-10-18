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

import { BrowserImage } from './BrowserImage';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

const mockGenomeBrowser = jest.fn();

jest.mock('src/content/app/browser/hooks/useGenomeBrowser', () => () => ({
  genomeBrowser: mockGenomeBrowser(),
  activateGenomeBrowser: jest.fn()
}));

jest.mock('../browser-cog/BrowserCogList', () => () => (
  <div id="browserCogList" />
));

jest.mock('src/content/app/browser/zmenu', () => ({
  ZmenuController: () => <div id="zmenuController" />
}));

jest.mock('src/shared/components/loader', () => ({
  CircleLoader: () => <div id="circleLoader" />
}));

jest.mock('src/shared/components/overlay/Overlay', () => () => (
  <div id="overlay" />
));

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
  return render(
    <Provider store={store}>
      <BrowserImage />
    </Provider>
  );
};

describe('<BrowserImage />', () => {
  afterEach(() => {
    mockGenomeBrowser.mockReturnValue(new MockGenomeBrowser());
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('renders loader if browser is not activated', () => {
      mockGenomeBrowser.mockReturnValueOnce(undefined);
      const { container } = renderComponent();
      expect(container.querySelector('#circleLoader')).toBeTruthy();
    });

    it('renders browser cog list', () => {
      const { container } = renderComponent();
      expect(container.querySelector('#browserCogList')).toBeTruthy();
    });

    it('renders zmenu controller', () => {
      const { container } = renderComponent();
      expect(container.querySelector('#zmenuController')).toBeTruthy();
    });

    it('has an overlay on top when disabled', () => {
      const { container } = renderComponent(
        set('browser.browserLocation.regionEditorActive', true, mockState)
      );
      expect(container.querySelector('#overlay')).toBeTruthy();
    });
  });
});
