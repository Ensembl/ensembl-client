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
import faker from 'faker';

import SlideToggle from './SlideToggle';

const defaultProps = {
  isOn: false,
  onChange: jest.fn()
};

describe('SlideToggle', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('has proper class when off', () => {
      const { container } = render(<SlideToggle {...defaultProps} />);
      const element = container.firstChild as HTMLElement;
      expect(element.getAttribute('class')).toMatch('slideToggleOff');
    });

    it('has proper class when on', () => {
      const props = {
        ...defaultProps,
        isOn: true
      };
      const { container } = render(<SlideToggle {...props} />);
      const element = container.firstChild as HTMLElement;
      expect(element.getAttribute('class')).toMatch('slideToggleOn');
    });

    it('adds class received from parent', () => {
      const externalClassName = faker.lorem.word();
      const props = {
        ...defaultProps,
        className: externalClassName
      };
      const { container } = render(<SlideToggle {...props} />);
      const element = container.firstChild as HTMLElement;
      expect(element.getAttribute('class')).toMatch(externalClassName);
    });
  });

  describe('behaviour', () => {
    it('correctly calls callback when switched on', () => {
      const { container } = render(<SlideToggle {...defaultProps} />);
      const element = container.firstChild as HTMLElement;

      userEvent.click(element);

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);
    });

    it('correctly calls callback when switched off', () => {
      const props = {
        ...defaultProps,
        isOn: true
      };
      const { container } = render(<SlideToggle {...props} />);
      const element = container.firstChild as HTMLElement;

      userEvent.click(element);

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });
  });
});
