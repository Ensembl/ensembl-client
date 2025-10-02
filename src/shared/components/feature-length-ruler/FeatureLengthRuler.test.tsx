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

import FeatureLengthRuler from './FeatureLengthRuler';

const defaultProps = {
  length: 80792,
  width: 600
};

describe('<FeatureLengthRuler />', () => {
  describe('rendering', () => {
    it('renders an <svg> element if standalone', () => {
      const { container } = render(
        <FeatureLengthRuler {...defaultProps} standalone={true} />
      );
      expect((container.firstChild as Element).tagName).toBe('svg');
    });

    it('renders a <g> element (svg group) if not standalone', () => {
      const { getByTestId } = render(
        <svg data-test-id="test wrapper">
          <FeatureLengthRuler {...defaultProps} />
        </svg>
      );
      const wrapper = getByTestId('test wrapper');
      expect((wrapper.firstChild as Element).tagName).toBe('g');
    });
  });

  describe('behaviour', () => {
    const props = {
      ...defaultProps,
      standalone: true
    };

    it('passes calculated ticks to the callback', () => {
      const callback = vi.fn();
      render(<FeatureLengthRuler {...props} onTicksCalculated={callback} />);
      expect(callback).toHaveBeenCalledTimes(1);

      const payload = callback.mock.calls[0][0];
      expect(payload.ticks).toBeDefined();
      expect(payload.labelledTicks).toBeDefined();
    });
  });
});
