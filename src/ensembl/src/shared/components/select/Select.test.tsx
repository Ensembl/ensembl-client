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
import times from 'lodash/times';
import random from 'lodash/random';
import find from 'lodash/find';
import get from 'lodash/get';
import { mount } from 'enzyme';

import Select from './Select';
import SelectOptionsPanel from './SelectOptionsPanel';

const createOption = (isSelected = false) => ({
  value: faker.random.uuid(),
  label: faker.random.words(5),
  isSelected
});

const createOptionGroup = (number = 5) => {
  const options = times(number, () => createOption());
  return {
    options
  };
};

const onSelect = jest.fn();

describe('<Select />', () => {
  let wrapper: any;

  describe('basic functionality', () => {
    const defaultProps = {
      optionGroups: [createOptionGroup()],
      onSelect
    };

    beforeEach(() => {
      wrapper = mount(<Select {...defaultProps} />);
    });

    test('is closed by default', () => {
      expect(wrapper.find('.selectControl').length).toBe(1);
      expect(wrapper.find(SelectOptionsPanel).length).toBe(0);
    });

    test('opens options panel on click', async () => {
      const selectControl = wrapper.find('.selectControl');
      selectControl.simulate('click');

      wrapper.update();

      // the element visible during closed state is still there
      expect(wrapper.find('.selectControlInvisible').length).toBe(1);
      expect(wrapper.find(SelectOptionsPanel).length).toBe(1);
    });
  });

  describe('when passed a list of options', () => {
    const defaultProps = {
      options: times(5, () => createOption()),
      onSelect
    };

    test('shows the list of options', () => {
      wrapper = mount(<Select {...defaultProps} />);

      // open the select
      const selectControl = wrapper.find('.selectControl');
      selectControl.simulate('click');
      wrapper.update();

      const optionGroups = wrapper.find('ul');
      const options = wrapper.find('li');

      expect(optionGroups.length).toBe(1);
      expect(options.length).toBe(defaultProps.options.length);
    });
  });

  describe('when passed a list of option groups', () => {
    const defaultProps = {
      optionGroups: times(3, () => createOptionGroup()),
      onSelect
    };

    test('shows the list of groups of options', () => {
      wrapper = mount(<Select {...defaultProps} />);

      // open the select
      const selectControl = wrapper.find('.selectControl');
      selectControl.simulate('click');
      wrapper.update();

      const optionGroups = wrapper.find('ul');
      const options = wrapper.find('li');

      const expectedOptionsNumber = defaultProps.optionGroups.reduce(
        (sum, group) => {
          return sum + group.options.length;
        },
        0
      );

      expect(optionGroups.length).toBe(defaultProps.optionGroups.length);
      expect(options.length).toBe(expectedOptionsNumber);
    });
  });

  describe('clicking on an option', () => {
    const defaultProps = {
      options: times(5, () => createOption()),
      onSelect
    };

    test('calls onSelect and passes it the option value', () => {
      wrapper = mount(<Select {...defaultProps} />);

      // open the select
      const selectControl = wrapper.find('.selectControl');

      selectControl.simulate('click');
      wrapper.update();

      // choose a random option
      const options = wrapper.find('li');
      const optionIndex = random(options.length - 1);
      const option = options.at(optionIndex);
      const optionText = option.text();

      const mockedClickEvent = {
        stopPropagation: jest.fn(),
        nativeEvent: {
          stopImmediatePropagation: jest.fn()
        }
      };

      option.simulate('click', mockedClickEvent);

      const expectedValue = get(
        find(defaultProps.options, ({ label }) => label === optionText),
        'value'
      );

      expect(onSelect).toHaveBeenCalledWith(expectedValue);
    });
  });
});
