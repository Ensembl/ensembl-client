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
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import createRootReducer from 'src/root/rootReducer';
import { createMockBrowserState } from 'tests/fixtures/browser';

import { BrowserBar } from './BrowserBar';

jest.mock(
  'src/content/app/genome-browser/components/browser-reset/BrowserReset',
  () => () => <div id="browserReset">BrowserReset</div>
);
jest.mock(
  'src/content/app/genome-browser/components/browser-location-indicator/BrowserLocationIndicator',
  () => () => (
    <div id="browserLocationIndicator">Browser Location Indicator</div>
  )
);
jest.mock(
  'src/shared/components/feature-summary-strip/FeatureSummaryStrip',
  () => () => <div id="featureSummaryStrip">Feature Summary Strip</div>
);

const mockState = createMockBrowserState();

const renderComponent = (state: any = mockState) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state
  });

  return render(
    <Provider store={store}>
      <BrowserBar />
    </Provider>
  );
};

describe('<BrowserBar />', () => {
  describe('rendering', () => {
    it('contains BrowserReset button', () => {
      const { container } = renderComponent();
      expect(container.querySelector('#browserReset')).toBeTruthy();
    });

    it('contains BrowserLocationIndicator', () => {
      const { container } = renderComponent();
      expect(container.querySelector('#browserLocationIndicator')).toBeTruthy();
    });

    it('contains FeatureSummaryStrip when focusObject is not null', () => {
      const { container } = renderComponent();
      expect(container.querySelector('#featureSummaryStrip')).toBeTruthy();
    });

    it('does not contain FeatureSummaryStrip when focusObject is null', () => {
      const updatedState = createMockBrowserState();
      updatedState.browser.focusObjects = {} as any;

      const { container } = renderComponent(updatedState);
      expect(container.querySelector('#featureSummaryStrip')).toBeFalsy();
    });
  });
});
