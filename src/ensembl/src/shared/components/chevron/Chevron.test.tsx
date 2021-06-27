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
import userEvent from '@testing-library/user-event';

import Chevron from './Chevron';

describe('<Chevron />', () => {
  describe('default', () => {
    it('renders correctly', () => {
      const { container, rerender } = render(<Chevron direction="down" />);
      const chevron = container.firstChild as HTMLElement;

      expect(chevron.tagName.toLowerCase()).toBe('svg');
      expect(chevron.classList.contains('chevron')).toBe(true);

      rerender(<Chevron direction="up" />);
      expect(chevron.classList.contains('chevron_up')).toBe(true);

      rerender(<Chevron direction="left" />);
      expect(chevron.classList.contains('chevron_left')).toBe(true);

      rerender(<Chevron direction="right" />);
      expect(chevron.classList.contains('chevron_right')).toBe(true);

      rerender(<Chevron direction="down" animateDirectionChange={true} />);
      expect(chevron.classList.contains('chevron_animated')).toBe(true);
    });
  });

  describe('with wrapper', () => {
    it('renders correctly', () => {
      const wrapperClass = 'this_is_wrapper_class';
      const iconClass = 'this_is_icon_class';
      const { container } = render(
        <Chevron
          direction="down"
          classNames={{ wrapper: wrapperClass, svg: iconClass }}
        />
      );
      const chevronWrapper = container.firstChild as HTMLElement;
      const chevron = chevronWrapper.firstChild as HTMLElement;

      expect(chevronWrapper.tagName.toLowerCase()).toBe('span');
      expect(chevron.tagName.toLowerCase()).toBe('svg');

      expect(chevronWrapper.classList.contains(wrapperClass)).toBe(true);
      expect(chevron.classList.contains(iconClass)).toBe(true);
    });
  });

  describe('as a button', () => {
    it('renders correctly', () => {
      const wrapperClass = 'this_is_wrapper_class';
      const iconClass = 'this_is_icon_class';
      const { container } = render(
        <Chevron
          direction="down"
          onClick={jest.fn()}
          classNames={{ wrapper: wrapperClass, svg: iconClass }}
        />
      );

      const chevronButton = container.firstChild as HTMLElement;
      const chevron = chevronButton.firstChild as HTMLElement;

      expect(chevronButton.tagName.toLowerCase()).toBe('button');
      expect(chevron.tagName.toLowerCase()).toBe('svg');

      expect(chevronButton.classList.contains(wrapperClass)).toBe(true);
      expect(chevron.classList.contains(iconClass)).toBe(true);
    });

    it('registers clicks', () => {
      const clickHandler = jest.fn();
      const { container } = render(
        <Chevron direction="down" onClick={clickHandler} />
      );

      const chevronButton = container.firstChild as HTMLElement;
      userEvent.click(chevronButton);

      expect(clickHandler).toHaveBeenCalledTimes(1);
    });
  });
});
