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

import Chevron from './Chevron';

describe('<Chevron />', () => {
  describe('default', () => {
    it('renders correctly', () => {
      const { container, rerender } = render(
        <Chevron className="componentClass" direction="down" />
      );
      const chevronWrapper = container.firstChild as HTMLElement;
      const chevronIcon = container.querySelector('svg') as SVGSVGElement;

      expect(chevronWrapper.tagName.toLowerCase()).toBe('span');
      expect(chevronWrapper.classList.contains('componentClass')).toBe(true);
      expect(chevronIcon.classList.contains('chevron')).toBe(true);

      rerender(<Chevron direction="up" />);
      expect(chevronIcon.classList.contains('chevron_up')).toBe(true);

      rerender(<Chevron direction="left" />);
      expect(chevronIcon.classList.contains('chevron_left')).toBe(true);

      rerender(<Chevron direction="right" />);
      expect(chevronIcon.classList.contains('chevron_right')).toBe(true);

      rerender(<Chevron direction="down" animate={true} />);
      expect(chevronIcon.classList.contains('chevron_animated')).toBe(true);
    });
  });
});
