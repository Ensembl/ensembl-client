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
import { mount } from 'enzyme';
import { BrowserBar, BrowserBarProps } from './BrowserBar';

import BrowserReset from 'src/content/app/browser/browser-reset/BrowserReset';
import BrowserLocationIndicator from 'src/content/app/browser/browser-location-indicator/BrowserLocationIndicator';
import FeatureSummaryStrip from 'src/shared/components/feature-summary-strip/FeatureSummaryStrip';

import { ChrLocation } from '../browserState';

import { createEnsObject } from 'tests/fixtures/ens-object';

jest.mock('src/content/app/browser/browser-reset/BrowserReset', () => () => (
  <div>BrowserReset</div>
));
jest.mock(
  'src/content/app/browser/browser-location-indicator/BrowserLocationIndicator',
  () => () => <div>Browser Location Indicator</div>
);
jest.mock(
  'src/shared/components/feature-summary-strip/FeatureSummaryStrip',
  () => () => <div>Feature Summary Strip</div>
);

describe('<BrowserBar />', () => {
  const defaultProps = {
    chrLocation: ['13', 32275301, 32433493] as ChrLocation,
    defaultChrLocation: ['13', 32271473, 32437359] as ChrLocation,
    ensObject: createEnsObject(),
    isDrawerOpened: false
  };

  const renderBrowserBar = (props?: Partial<BrowserBarProps>) => (
    <BrowserBar {...defaultProps} {...props} />
  );

  describe('general', () => {
    let renderedBrowserBar: any;

    beforeEach(() => {
      renderedBrowserBar = mount(renderBrowserBar());
    });

    test('contains BrowserReset button', () => {
      expect(renderedBrowserBar.find(BrowserReset).length).toBe(1);
    });

    test('contains BrowserLocationIndicator', () => {
      expect(renderedBrowserBar.find(BrowserLocationIndicator).length).toBe(1);
    });

    test('contains FeatureSummaryStrip', () => {
      expect(renderedBrowserBar.find(FeatureSummaryStrip).length).toBe(1);
    });
  });

  describe('behaviour', () => {
    let renderedBrowserBar: any;

    test('shows FeatureSummaryStrip when ensObject is not null', () => {
      renderedBrowserBar = mount(renderBrowserBar());
      expect(renderedBrowserBar.find(FeatureSummaryStrip).length).toBe(1);

      renderedBrowserBar = mount(renderBrowserBar({ ensObject: null }));
      expect(renderedBrowserBar.find(FeatureSummaryStrip).length).toBe(0);
    });
  });
});
