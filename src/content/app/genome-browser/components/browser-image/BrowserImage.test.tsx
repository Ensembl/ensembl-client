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
import { MemoryRouter } from 'react-router';
import set from 'lodash/fp/set';

import createRootReducer from 'src/root/rootReducer';

import { createMockBrowserState } from 'tests/fixtures/browser';

import { BrowserImage } from './BrowserImage';

import MockGenomeBrowser from 'tests/mocks/mockGenomeBrowser';

const mockGenomeBrowser = jest.fn(() => new MockGenomeBrowser() as any);
const mockClearGenomeBrowser = jest.fn();

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowser(),
    activateGenomeBrowser: jest.fn(),
    clearGenomeBrowser: mockClearGenomeBrowser
  })
);

jest.mock('../browser-cog/BrowserCogList', () => () => (
  <div id="browserCogList" />
));

jest.mock('src/content/app/genome-browser/components/zmenu', () => ({
  ZmenuController: () => <div id="zmenuController" />
}));

jest.mock('src/shared/components/loader', () => ({
  CircleLoader: () => <div id="circleLoader" />
}));

jest.mock('src/shared/components/overlay/Overlay', () => () => (
  <div id="overlay" />
));

jest.mock('src/content/app/genome-browser/hooks/useGenomeBrowserPosition', () =>
  jest.fn()
);

const mockState = createMockBrowserState();

const renderComponent = (state: typeof mockState = mockState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  return render(
    <MemoryRouter>
      <Provider store={store}>
        <BrowserImage />
      </Provider>
    </MemoryRouter>
  );
};

describe('<BrowserImage />', () => {
  beforeEach(() => {
    // running this in before each, because it looks that
    // afterEach completes before cleanup functions called at component's unmounting get executed
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
        set('browser.browserGeneral.regionEditorActive', true, mockState)
      );
      expect(container.querySelector('#overlay')).toBeTruthy();
    });
  });

  describe('unmounting', () => {
    it('runs cleanup code to unregister the unmounted DOM node with genome browser', () => {
      expect(mockClearGenomeBrowser).not.toHaveBeenCalled();
      const { unmount } = renderComponent();
      unmount();
      expect(mockClearGenomeBrowser).toHaveBeenCalled();
    });
  });
});
