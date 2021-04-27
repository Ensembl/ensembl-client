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

import CheckboxGrid, {
  CheckboxGridOption,
  CheckboxGridProps
} from './CheckboxGrid';

const createCheckboxData = (options: CheckboxGridOption[]) => {
  const id = faker.lorem.word();
  const label = faker.lorem.word();
  const isChecked = faker.datatype.boolean();

  options.push({
    id,
    label,
    isChecked
  });
};

const createOptions = (): CheckboxGridOption[] => {
  const options: CheckboxGridOption[] = [];
  times(10, () => createCheckboxData(options));
  return options;
};

const defaultOptions: CheckboxGridOption[] = createOptions();

const onChange = jest.fn();

describe('<CheckboxGrid />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps = {
    options: defaultOptions,
    onChange,
    label: faker.lorem.word()
  };
  const renderCheckboxGrid = (props?: Partial<CheckboxGridProps>) =>
    render(<CheckboxGrid {...defaultProps} {...props} />);

  it('renders without error', () => {
    expect(() => {
      renderCheckboxGrid();
    }).not.toThrow();
  });

  it('renders N number of checkboxes based on the options', () => {
    const { container } = renderCheckboxGrid();

    expect(container.querySelectorAll('.defaultCheckbox')?.length).toEqual(
      defaultOptions.length
    );
  });

  it('sorts the checkboxes based on the options array', () => {
    const { container } = renderCheckboxGrid();

    const firstGridContainer = container.querySelector(
      '.checkboxGridContainer'
    );
    const labels: string[] = [];
    Object.values(defaultOptions).forEach((element) => {
      labels.push(element.label);
    });

    const firstLabel = labels.shift();
    const lastLabel = labels.pop();
    const allCheckboxes = (firstGridContainer as HTMLElement).querySelectorAll(
      '.defaultCheckbox'
    );
    const firstCheckbox = allCheckboxes[0];
    expect(firstCheckbox.nextSibling?.textContent).toEqual(firstLabel);

    const lastCheckbox = allCheckboxes[allCheckboxes.length - 1];
    expect(lastCheckbox.nextSibling?.textContent).toEqual(lastLabel);
  });

  it('calls the checkboxOnChange when a checkbox is checked/unchecked', async () => {
    const { container } = renderCheckboxGrid();
    const firstCheckbox = container.querySelector(
      '.defaultCheckbox'
    ) as HTMLElement;

    userEvent.click(firstCheckbox);

    const checkedStatus = defaultOptions[0].isChecked;

    const firstCheckboxID = defaultOptions[0].id;
    expect(onChange).toBeCalledWith(!checkedStatus, firstCheckboxID);
  });

  it('hides the unchecked checkboxes when hideUnchecked is true', () => {
    const { container } = renderCheckboxGrid({ hideUnchecked: true });

    let totalCheckedCheckboxes = 0;

    Object.values(defaultOptions).forEach((section) => {
      if (section.isChecked) {
        totalCheckedCheckboxes++;
      }
    });

    expect(container.querySelectorAll('.defaultCheckbox').length).toBe(
      totalCheckedCheckboxes
    );
  });

  it('hides the grid label when hideLabel is true', () => {
    const { container } = renderCheckboxGrid({ hideLabel: true });

    expect(container.querySelector('.checkboxGridTitle')).toBeFalsy();
  });

  it('draws 3 columns by default', () => {
    const { container } = renderCheckboxGrid();
    const firstGridContainer = container.querySelector(
      '.checkboxGridContainer'
    ) as HTMLElement;
    expect(firstGridContainer.children.length).toBe(3);
  });

  it('draws N number of columns based on the `column` parameter', () => {
    const columns = 4;

    const { container } = renderCheckboxGrid({ columns });

    const firstGridContainer = container.querySelector(
      '.checkboxGridContainer'
    ) as HTMLElement;
    expect(firstGridContainer.children.length).toBe(columns);
  });
});
