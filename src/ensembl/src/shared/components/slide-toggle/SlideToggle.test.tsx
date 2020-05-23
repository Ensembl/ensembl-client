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
import { mount, render } from 'enzyme';
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
      const renderedComponent = render(<SlideToggle {...defaultProps} />);
      expect(renderedComponent.hasClass('slideToggleOff')).toBe(true);
    });

    it('has proper class when on', () => {
      const props = {
        ...defaultProps,
        isOn: true
      };
      const renderedComponent = render(<SlideToggle {...props} />);
      expect(renderedComponent.hasClass('slideToggleOn')).toBe(true);
    });

    it('adds class received from parent', () => {
      const externalClassName = faker.random.word();
      const props = {
        ...defaultProps,
        className: externalClassName
      };
      const renderedComponent = render(<SlideToggle {...props} />);
      expect(renderedComponent.hasClass(externalClassName)).toBe(true);
    });
  });

  describe('behaviour', () => {
    test('correctly calls callback when switched on', () => {
      const wrapper = mount(<SlideToggle {...defaultProps} />);
      wrapper.simulate('click');

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onChange).toHaveBeenCalledWith(true);
    });

    test('correctly calls callback when switched off', () => {
      const props = {
        ...defaultProps,
        isOn: true
      };
      const wrapper = mount(<SlideToggle {...props} />);
      wrapper.simulate('click');

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onChange).toHaveBeenCalledWith(false);
    });
  });
});
