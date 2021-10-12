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
import { BrowserBar } from './BrowserBar';

jest.mock('src/content/app/browser/browser-reset/BrowserReset', () => () => (
  <div id="browserReset">BrowserReset</div>
));
jest.mock(
  'src/content/app/browser/browser-location-indicator/BrowserLocationIndicator',
  () => () =>
    <div id="browserLocationIndicator">Browser Location Indicator</div>
);
jest.mock(
  'src/shared/components/feature-summary-strip/FeatureSummaryStrip',
  () => () => <div id="featureSummaryStrip">Feature Summary Strip</div>
);

const mockState = createMockBrowserState();

const mockStore = configureMockStore([thunk]);

let store: ReturnType<typeof mockStore>;

const renderComponent = (state: typeof mockState = mockState) => {
  store = mockStore(state);
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

    it('contains FeatureSummaryStrip when ensObject is not null', () => {
      const { container } = renderComponent();
      expect(container.querySelector('#featureSummaryStrip')).toBeTruthy();
    });

    it('does not contain FeatureSummaryStrip when ensObject is null', () => {
      const { container } = renderComponent(set('ensObjects', null, mockState));
      expect(container.querySelector('#featureSummaryStrip')).toBeFalsy();
    });
  });
});
