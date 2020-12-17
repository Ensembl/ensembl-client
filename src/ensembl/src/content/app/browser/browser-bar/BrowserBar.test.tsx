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
import { render } from '@testing-library/react';
import { BrowserBar, BrowserBarProps } from './BrowserBar';

import { ChrLocation } from '../browserState';

import { createEnsObject } from 'tests/fixtures/ens-object';

jest.mock('src/content/app/browser/browser-reset/BrowserReset', () => () => (
  <div id="browserReset">BrowserReset</div>
));
jest.mock(
  'src/content/app/browser/browser-location-indicator/BrowserLocationIndicator',
  () => () => (
    <div id="browserLocationIndicator">Browser Location Indicator</div>
  )
);
jest.mock(
  'src/shared/components/feature-summary-strip/FeatureSummaryStrip',
  () => () => <div id="featureSummaryStrip">Feature Summary Strip</div>
);

describe('<BrowserBar />', () => {
  const defaultProps = {
    chrLocation: ['13', 32275301, 32433493] as ChrLocation,
    defaultChrLocation: ['13', 32271473, 32437359] as ChrLocation,
    ensObject: createEnsObject(),
    isDrawerOpened: false
  };

  const renderBrowserBar = (props?: Partial<BrowserBarProps>) =>
    render(<BrowserBar {...defaultProps} {...props} />);

  describe('rendering', () => {
    it('contains BrowserReset button', () => {
      const { container } = renderBrowserBar();
      expect(container.querySelector('#browserReset')).toBeTruthy();
    });

    it('contains BrowserLocationIndicator', () => {
      const { container } = renderBrowserBar();
      expect(container.querySelector('#browserLocationIndicator')).toBeTruthy();
    });

    it('contains FeatureSummaryStrip when ensObject is not null', () => {
      const { container } = renderBrowserBar();
      expect(container.querySelector('#featureSummaryStrip')).toBeTruthy();
    });

    it('does not contain FeatureSummaryStrip when ensObject is null', () => {
      const { container } = renderBrowserBar({ ensObject: null });
      expect(container.querySelector('#featureSummaryStrip')).toBeFalsy();
    });
  });
});
