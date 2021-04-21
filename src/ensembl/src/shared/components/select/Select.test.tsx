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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Select from './Select';

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
  describe('basic functionality', () => {
    const defaultProps = {
      optionGroups: [createOptionGroup()],
      onSelect
    };

    it('is closed by default', () => {
      const { container } = render(<Select {...defaultProps} />);
      expect(container.querySelector('.selectControl')).toBeTruthy();
      expect(container.querySelector('.optionsPanel')).toBeFalsy();
    });

    it('opens options panel on click', async () => {
      const { container } = render(<Select {...defaultProps} />);

      // open the select dropdown
      const selectControl = container.querySelector('.selectControl');
      userEvent.click(selectControl as HTMLElement);

      // the element visible during closed state is still there
      expect(container.querySelector('.selectControlInvisible')).toBeTruthy();
      // also, the option panel opens
      expect(container.querySelector('.optionsPanel')).toBeTruthy();
    });
  });

  describe('when passed a list of options', () => {
    const defaultProps = {
      options: times(5, () => createOption()),
      onSelect
    };

    it('shows the list of options', () => {
      const { container } = render(<Select {...defaultProps} />);

      // open the select dropdown
      const selectControl = container.querySelector('.selectControl');
      userEvent.click(selectControl as HTMLElement);

      const optionGroups = container.querySelectorAll('ul');
      const options = container.querySelectorAll('li');

      expect(optionGroups.length).toBe(1);
      expect(options.length).toBe(defaultProps.options.length);
    });
  });

  describe('when passed a list of option groups', () => {
    const defaultProps = {
      optionGroups: times(3, () => createOptionGroup()),
      onSelect
    };

    it('shows the list of groups of options', () => {
      const { container } = render(<Select {...defaultProps} />);

      // open the select dropdown
      const selectControl = container.querySelector('.selectControl');
      userEvent.click(selectControl as HTMLElement);

      const optionGroups = container.querySelectorAll('ul');
      const options = container.querySelectorAll('li');

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

    it('calls onSelect and passes it the option value', () => {
      const { container } = render(<Select {...defaultProps} />);

      // open the select dropdown
      const selectControl = container.querySelector('.selectControl');
      userEvent.click(selectControl as HTMLElement);

      // choose a random option
      const options = container.querySelectorAll('li');
      const optionIndex = random(options.length - 1);
      const option = options[optionIndex];
      const optionText = option.textContent;

      userEvent.click(option);

      const expectedValue = get(
        find(defaultProps.options, ({ label }) => label === optionText),
        'value'
      );

      expect(onSelect).toHaveBeenCalledWith(expectedValue);
    });
  });
});
