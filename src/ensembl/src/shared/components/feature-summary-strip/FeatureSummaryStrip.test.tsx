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

import {
  FeatureSummaryStrip,
  FeatureSummaryStripProps
} from './FeatureSummaryStrip';

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
    // the tests below are just checking that the FeatureSummaryStrip component
    // will select an appropriate component for rendering
    // based on the type of the object that it receives

    it('contains GeneSummaryStrip if focus object is gene', () => {
      const { container } = render(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('gene') })
      );

      expect(container.textContent).toBe('Gene Summary Strip'); // text from the mocked module
    });

    it('contains RegionSummaryStrip if focus object is region', () => {
      const { container } = render(
        renderFeatureSummaryStrip({ ensObject: createEnsObject('region') })
      );
      expect(container.textContent).toBe('Region Summary Strip'); // text from the mocked module
    });
  });
});
