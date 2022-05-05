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
import faker from '@faker-js/faker';
import times from 'lodash/times';

import CheckboxWithRadios, {
  CheckboxWithRadiosProps
} from './CheckboxWithRadios';

const onChange = jest.fn();

const createOption = () => ({
  value: faker.datatype.uuid(),
  label: faker.random.words(5)
});

describe('<CheckboxWithRadios />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    onChange: onChange,
    label: 'foo',
    selectedOption: '',
    options: times(5, () => createOption())
  };

  const renderCheckboxWithRadios = (props?: Partial<CheckboxWithRadiosProps>) =>
    render(<CheckboxWithRadios {...defaultProps} {...props} />);

  it('renders without error', () => {
    expect(() => {
      renderCheckboxWithRadios();
    }).not.toThrow();
  });

  it('does not check the checkbox when there are no options selected', () => {
    const { container } = renderCheckboxWithRadios();

    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked
    ).toBeFalsy();
  });

  it('does not display any radios when the checkbox is unchecked', () => {
    const { container } = renderCheckboxWithRadios();

    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked
    ).toBeFalsy();

    expect(container.querySelector('.radio')).toBeFalsy();
  });

  it('displays all the radios when the checkbox is checked', () => {
    const { container } = renderCheckboxWithRadios();

    const checkboxElement = container.querySelector('.checkboxDefault');

    userEvent.click(checkboxElement as HTMLElement);

    expect(container.querySelectorAll('.radio').length).toBe(
      defaultProps.options.length
    );
  });

  it('calls the onChange when the radio is changed with the selected option', () => {
    const { container } = renderCheckboxWithRadios();

    const checkboxElement = container.querySelector('.checkboxDefault');

    userEvent.click(checkboxElement as HTMLInputElement);

    const firstRadioInput = container.querySelector('.radio');

    userEvent.click(firstRadioInput as HTMLInputElement);

    expect(onChange).toHaveBeenCalledWith(defaultProps.options[0].value);
  });
});
