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

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioGroup from './RadioGroup';

import { faker } from '@faker-js/faker';
import times from 'lodash/times';

const onChange = vi.fn();

const createOption = () => ({
  value: faker.string.uuid(),
  label: faker.lorem.words(5)
});

describe('<RadioGroup />', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const defaultProps = {
    selectedOption: '',
    onChange: onChange,
    options: times(5, () => createOption())
  };

  it('renders as many radio buttons as the number of passed options', () => {
    const { container } = render(<RadioGroup {...defaultProps} />);

    expect(container.querySelectorAll('.radio').length).toBe(
      defaultProps.options.length
    );
  });

  it('does not call onChange when clicking on already selected option', async () => {
    // pre-select the first option, then click on the first radio button
    const selectedOption = defaultProps.options[0].value;
    const { container } = render(
      <RadioGroup {...defaultProps} selectedOption={selectedOption} />
    );
    const firstRadioButton = container.querySelector('.radio');

    await userEvent.click(firstRadioButton as HTMLElement);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls the onChange function when option is changed', async () => {
    // pre-select the second option, then click on the first radio button
    const selectedOption = defaultProps.options[1].value;
    const { container } = render(
      <RadioGroup {...defaultProps} selectedOption={selectedOption} />
    );
    const firstRadioButton = container.querySelector('.radio');

    await userEvent.click(firstRadioButton as HTMLElement);

    expect(onChange).toHaveBeenCalledWith(defaultProps.options[0].value);
  });
});
