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
import faker from 'faker';
import { render, mount } from 'enzyme';

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { BrowserLocationIndicator } from './BrowserLocationIndicator';

import { ChrLocation } from '../browserState';

const chrName = faker.lorem.word();
const startPosition = faker.random.number({ min: 1, max: 1000000 });
const endPosition =
  startPosition + faker.random.number({ min: 1000, max: 1000000 });

const props = {
  location: [chrName, startPosition, endPosition] as ChrLocation,
  onClick: jest.fn(),
  disabled: false
};

describe('BrowserLocationIndicator', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('displays chromosome name', () => {
      const wrapper = render(<BrowserLocationIndicator {...props} />);
      const renderedName = wrapper.find('.chrCode');
      expect(renderedName.text()).toBe(chrName);
    });

    it('displays location', () => {
      const wrapper = render(<BrowserLocationIndicator {...props} />);
      const renderedLocation = wrapper.find('.chrRegion');
      expect(renderedLocation.text()).toBe(
        `${getCommaSeparatedNumber(startPosition)}-${getCommaSeparatedNumber(
          endPosition
        )}`
      );
    });

    it('adds disabled class when component is disabled', () => {
      const wrapper = mount(<BrowserLocationIndicator {...props} />);
      expect(
        wrapper.childAt(0).hasClass('browserLocationIndicatorDisabled')
      ).not.toBe(true);

      wrapper.setProps({ disabled: true });
      expect(
        wrapper.childAt(0).hasClass('browserLocationIndicatorDisabled')
      ).toBe(true);
    });
  });

  describe('behaviour', () => {
    it('calls the onClick prop when clicked', () => {
      const wrapper = mount(<BrowserLocationIndicator {...props} />);
      wrapper.find('.chrLocationView').simulate('click');
      expect(props.onClick).toHaveBeenCalled();
    });

    it('does not call the onClick prop if disabled', () => {
      const wrapper = mount(<BrowserLocationIndicator {...props} />);
      wrapper.setProps({ disabled: true });
      wrapper.find('.chrLocationView').simulate('click');
      expect(props.onClick).not.toHaveBeenCalled();
    });
  });
});
