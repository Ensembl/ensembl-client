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

import {
  FeatureSummaryStrip,
  FeatureSummaryStripProps
} from './FeatureSummaryStrip';

import { GeneSummaryStrip, RegionSummaryStrip } from '../feature-summary-strip';

import { createEnsObject } from 'tests/fixtures/ens-object';

jest.mock('../feature-summary-strip', () => ({
  GeneSummaryStrip: () => <div>Gene Summary Strip</div>,
  RegionSummaryStrip: () => <div>Region Summary Strip</div>
}));

describe('<FeatureSummaryStrip />', () => {
  const defaultProps = {
    ensObject: createEnsObject(),
    isGhosted: false
  };

  const renderFeatureSummaryStrip = (
    props?: Partial<FeatureSummaryStripProps>
  ) => <FeatureSummaryStrip {...defaultProps} {...props} />;

  describe('general', () => {
    test('contains GeneSummaryStrip if focus object is gene', () => {
      const renderedFeatureSummaryStrip = mount(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('gene') })
      );
      expect(renderedFeatureSummaryStrip.find(GeneSummaryStrip).length).toBe(1);
    });

    test('contains RegionSummaryStrip if focus object is region', () => {
      const renderedFeatureSummaryStrip = mount(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('region') })
      );
      expect(renderedFeatureSummaryStrip.find(RegionSummaryStrip).length).toBe(
        1
      );
    });

    test('does not contain anything if focus object is not defined', () => {
      const renderedFeatureSummaryStrip = mount(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('xyz') })
      );
      expect(renderedFeatureSummaryStrip.html()).toBe(null);
    });
  });
});
