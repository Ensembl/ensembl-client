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

import { render } from '@testing-library/react';

import {
  FeatureSummaryStrip,
  FeatureSummaryStripProps
} from './FeatureSummaryStrip';

import { createFocusObject } from 'tests/fixtures/focus-object';

vi.mock('./GeneSummaryStrip', () => () => <div>Gene Summary Strip</div>);
vi.mock('./LocationSummaryStrip', () => () => (
  <div>Location Summary Strip</div>
));

describe('<FeatureSummaryStrip />', () => {
  const defaultProps = {
    focusObject: createFocusObject(),
    isGhosted: false
  };

  const renderFeatureSummaryStrip = (
    props?: Partial<FeatureSummaryStripProps>
  ) => <FeatureSummaryStrip {...defaultProps} {...props} />;

  describe('general', () => {
    // the tests below are just checking that the FeatureSummaryStrip component
    // will select an appropriate component for rendering
    // based on the type of the object that it receives

    it('renders a GeneSummaryStrip if the focus object is a gene', () => {
      const { container } = render(
        renderFeatureSummaryStrip({ focusObject: createFocusObject('gene') })
      );

      expect(container.textContent).toBe('Gene Summary Strip'); // text from the mocked module
    });

    it('renders a LocationSummaryStrip if the focus object is a location', () => {
      const { container } = render(
        renderFeatureSummaryStrip({
          focusObject: createFocusObject('location')
        })
      );
      expect(container.textContent).toBe('Location Summary Strip'); // text from the mocked module
    });
  });
});
