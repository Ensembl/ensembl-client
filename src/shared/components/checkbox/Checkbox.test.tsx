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
import Checkbox from './Checkbox';
import { faker } from '@faker-js/faker';

const onChange = jest.fn();

describe('<Checkbox />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does not display any label by default', () => {
    const { container } = render(
      <Checkbox checked={false} onChange={onChange} />
    );
    expect(container.querySelector('.label')).toBeFalsy();
  });

  it('displays the label if it is passed as a prop', () => {
    const label = faker.lorem.words();
    const { container } = render(
      <Checkbox checked={false} onChange={onChange} label={label} />
    );

    expect(container.querySelector('label')?.textContent).toBe(label);
  });

  it('applies default classes', () => {
    const label = faker.lorem.words();
    const { container } = render(
      <Checkbox checked={false} onChange={onChange} label={label} />
    );

    expect(container.querySelector('.checkboxDefault')).toBeTruthy();
    expect(container.querySelector('.label')).toBeTruthy();
  });

  it('correctly applies classes when checkbox is selected or disabled', () => {
    const { container, rerender } = render(
      <Checkbox checked={false} onChange={onChange} disabled={true} />
    );
    const renderedCheckbox = container.querySelector('.checkboxDefault');
    expect(renderedCheckbox?.classList.contains('checkboxUnchecked')).toBe(
      true
    );
    expect(renderedCheckbox?.classList.contains('checkboxDisabled')).toBe(true);

    rerender(<Checkbox checked={true} onChange={onChange} disabled={false} />);

    expect(renderedCheckbox?.classList.contains('checkboxChecked')).toBe(true);
    expect(renderedCheckbox?.classList.contains('checkboxUnchecked')).toBe(
      false
    );
    expect(renderedCheckbox?.classList.contains('checkboxDisabled')).toBe(
      false
    );
  });

  describe('behaviour on change', () => {
    it('calls the onChange prop when clicked', async () => {
      const { container } = render(
        <Checkbox checked={false} onChange={onChange} />
      );
      const checkbox = container.querySelector(
        '.checkboxDefault'
      ) as HTMLElement;

      await userEvent.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not call the onChange prop when disabled', async () => {
      const { container } = render(
        <Checkbox checked={false} onChange={onChange} disabled={true} />
      );
      const checkbox = container.querySelector(
        '.checkboxDefault'
      ) as HTMLElement;

      await userEvent.click(checkbox);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('calls the onChange function if the label is clicked', async () => {
      const label = faker.lorem.words();
      const { container } = render(
        <Checkbox checked={false} label={label} onChange={onChange} />
      );
      const renderedLabel = container.querySelector('.label') as HTMLElement;

      await userEvent.click(renderedLabel);

      expect(onChange).toHaveBeenCalled();
    });
  });
});
