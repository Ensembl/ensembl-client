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
import times from 'lodash/times';

import CheckboxWithSelects, {
  CheckboxWithSelectsProps
} from './CheckboxWithSelects';

const createOption = (isSelected = false) => ({
  value: faker.datatype.uuid(),
  label: faker.random.words(5),
  isSelected
});

const onChange = jest.fn();

const defaultProps = {
  onChange: onChange,
  label: 'foo',
  selectedOptions: [],
  options: times(5, () => createOption())
};

describe('<CheckboxWithSelects />', () => {
  const renderCheckboxWithSelects = (
    props?: Partial<CheckboxWithSelectsProps>
  ) => render(<CheckboxWithSelects {...defaultProps} {...props} />);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without error', () => {
    expect(() => {
      renderCheckboxWithSelects();
    }).not.toThrow();
  });

  it('does not check the checkbox when there are no options selected', () => {
    const { container } = renderCheckboxWithSelects();

    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked
    ).toBeFalsy();
  });

  it('displays one Select when the checkbox is unchecked', () => {
    const { container } = renderCheckboxWithSelects();

    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked
    ).toBeFalsy();

    expect(container.querySelectorAll('.select').length).toBe(1);
  });

  it('displays one Select when the checkbox is checked', () => {
    const { container } = renderCheckboxWithSelects();

    const checkboxElement = container.querySelector('.checkboxDefault');

    userEvent.click(checkboxElement as HTMLElement);

    expect(container.querySelectorAll('.select').length).toBe(1);
  });

  it('automatically checks the checkbox if at least one option is selected', () => {
    const { container } = renderCheckboxWithSelects({
      selectedOptions: [defaultProps.options[0].value]
    });

    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked
    ).toBeTruthy();
  });

  it('does not display the remove button next to the Select if no option is selected ', () => {
    const { container } = renderCheckboxWithSelects();

    const checkboxElement = container.querySelector('.checkboxDefault');

    userEvent.click(checkboxElement as HTMLElement);

    expect(container.querySelectorAll('.select').length).toBe(1);

    expect(container.querySelector('.removeIconHolder')).toBeFalsy();
  });

  it('displays the remove button next to the Select if an option is selected', () => {
    const { container } = renderCheckboxWithSelects({
      selectedOptions: [defaultProps.options[0].value]
    });

    expect(container.querySelectorAll('.removeIconHolder').length).toBe(1);
  });

  it('displays the Plus button when one option is selected', () => {
    const { container } = renderCheckboxWithSelects({
      selectedOptions: [defaultProps.options[0].value]
    });

    expect(container.querySelectorAll('.addIconHolder').length).toBe(1);
  });

  it('displays another select when the plus button is clicked', () => {
    const { container } = renderCheckboxWithSelects({
      selectedOptions: [defaultProps.options[0].value]
    });

    expect(container.querySelectorAll('.select').length).toBe(1);

    const addIcon = container.querySelector('.addIconHolder .imageButton');

    userEvent.click(addIcon as HTMLElement);

    expect(container.querySelectorAll('.select').length).toBe(2);
  });

  it('displays all the options when no options are selected', () => {
    const { container } = renderCheckboxWithSelects();

    const selectElement = container.querySelector(
      '.select'
    ) as HTMLInputElement;

    const selectControl = selectElement.querySelector('.selectControl');

    userEvent.click(selectControl as HTMLElement);

    expect(selectElement.querySelectorAll('.option')).toHaveLength(
      defaultProps.options.length
    );
  });

  it('hides the options that are already selected within the new Select', () => {
    const { container } = renderCheckboxWithSelects({
      selectedOptions: [defaultProps.options[0].value]
    });

    const addIcon = container.querySelector('.addIconHolder .imageButton');

    userEvent.click(addIcon as HTMLElement);

    const allSelects = container.querySelectorAll('.select');
    const lastSelect = allSelects[allSelects.length - 1];
    const lastSelectControl = lastSelect.querySelector('.selectControl');

    userEvent.click(lastSelectControl as HTMLElement);

    expect(lastSelect.querySelectorAll('.option')).toHaveLength(
      defaultProps.options.length - 1
    );
  });

  it('does not display the Plus button when all the options are selected', () => {
    const optionValues: any = [];
    defaultProps.options.forEach((option) => {
      optionValues.push(option.value);
    });

    const { container } = renderCheckboxWithSelects({
      selectedOptions: optionValues
    });
    expect(container.querySelector('.addIconHolder')).toBeFalsy();
  });

  it('calls the onChange function when an option is selected', () => {
    const { container } = renderCheckboxWithSelects({
      selectedOptions: [defaultProps.options[0].value]
    });

    const addIcon = container.querySelector('.addIconHolder .imageButton');

    userEvent.click(addIcon as HTMLElement);

    const allSelects = container.querySelectorAll('.select');
    const lastSelect = allSelects[allSelects.length - 1];
    const lastSelectControl = lastSelect.querySelector('.selectControl');

    userEvent.click(lastSelectControl as HTMLElement);

    const lastSelectOptionsPanel = lastSelect.querySelector('.optionsPanel');

    const targetOption = lastSelectOptionsPanel?.querySelector('li');
    userEvent.click(targetOption as HTMLElement);

    expect(onChange).toHaveBeenCalledWith([
      defaultProps.options[0].value,
      defaultProps.options[1].value
    ]);
  });

  it('calls the onChange function when an option is removed', () => {
    const selectedOptions = [
      defaultProps.options[0].value,
      defaultProps.options[1].value
    ];

    const { container } = renderCheckboxWithSelects({ selectedOptions });
    const allRemoveIcons = container.querySelectorAll('.removeIconHolder');
    const lastRemoveIcon = allRemoveIcons[allRemoveIcons.length - 1];

    const lastRemoveIconButton = lastRemoveIcon.querySelector('.imageButton');

    userEvent.click(lastRemoveIconButton as HTMLElement);

    expect(onChange).toHaveBeenCalledWith([defaultProps.options[0].value]);
  });
});
